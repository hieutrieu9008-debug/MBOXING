import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import {
    getLessonById,
    getLessonsByCourseId,
    getNextLesson,
    getCourseById,
    Lesson,
    Course,
} from '../../lib/database';
import VideoPlayer from '../../components/VideoPlayer';
import LessonHeader from '../../components/LessonHeader';
import RelatedLessons from '../../components/RelatedLessons';

// Sample video URLs for demo (boxing-related content)
const SAMPLE_VIDEOS = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
];

export default function LessonScreen() {
    const { id, courseId } = useLocalSearchParams<{ id: string; courseId: string }>();
    const router = useRouter();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [allLessons, setAllLessons] = useState<Lesson[]>([]);
    const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [watchedSeconds, setWatchedSeconds] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        loadLesson();
    }, [id, courseId]);

    const loadLesson = async () => {
        if (!id) return;

        setIsLoading(true);

        // Load the lesson
        const lessonData = await getLessonById(id);
        setLesson(lessonData);

        if (lessonData && (courseId || lessonData.course_id)) {
            const actualCourseId = courseId || lessonData.course_id;

            // Load course info
            const courseData = await getCourseById(actualCourseId);
            setCourse(courseData);

            // Load all lessons for related section
            const lessons = await getLessonsByCourseId(actualCourseId);
            setAllLessons(lessons);

            // Get next lesson
            const next = await getNextLesson(actualCourseId, lessonData.order_index);
            setNextLesson(next);
        }

        setIsLoading(false);
    };

    const handleProgress = useCallback((positionMs: number, durationMs: number) => {
        setWatchedSeconds(Math.floor(positionMs / 1000));
    }, []);

    const handleVideoComplete = useCallback(() => {
        // Auto-mark as ready for completion
        console.log('Video finished playing');
    }, []);

    const handleMarkComplete = () => {
        setIsCompleted(true);
        // TODO: Save completion status to database
    };

    const handleNextLesson = () => {
        if (nextLesson && courseId) {
            router.replace(`/lesson/${nextLesson.id}?courseId=${courseId}`);
        }
    };

    // Get a sample video URL based on lesson order
    const getVideoUrl = (lessonData: Lesson): string => {
        if (lessonData.video_url) {
            return lessonData.video_url;
        }
        // Use a sample video based on order index
        const index = (lessonData.order_index - 1) % SAMPLE_VIDEOS.length;
        return SAMPLE_VIDEOS[index];
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!lesson) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color={COLORS.error} />
                <Text style={styles.errorText}>Lesson not found</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: false,
                    headerStyle: { backgroundColor: COLORS.background },
                    headerTintColor: COLORS.text,
                    headerTitle: '',
                    headerRight: () => (
                        <TouchableOpacity
                            style={[
                                styles.markCompleteButton,
                                isCompleted && styles.markCompleteButtonDone,
                            ]}
                            onPress={handleMarkComplete}
                            disabled={isCompleted}
                        >
                            <Ionicons
                                name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                                size={18}
                                color={isCompleted ? COLORS.success : COLORS.text}
                            />
                            <Text
                                style={[
                                    styles.markCompleteText,
                                    isCompleted && styles.markCompleteTextDone,
                                ]}
                            >
                                {isCompleted ? 'Completed' : 'Mark Complete'}
                            </Text>
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Video Player */}
                <VideoPlayer
                    videoUrl={getVideoUrl(lesson)}
                    onProgress={handleProgress}
                    onComplete={handleVideoComplete}
                />

                {/* Lesson Info */}
                <LessonHeader
                    title={lesson.title}
                    totalDuration={lesson.duration_seconds}
                    watchedDuration={watchedSeconds}
                />

                {/* Related Lessons */}
                {allLessons.length > 1 && (
                    <RelatedLessons
                        lessons={allLessons}
                        currentLessonId={lesson.id}
                        courseId={courseId || lesson.course_id}
                    />
                )}

                {/* Spacer for button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Next Lesson Button */}
            {nextLesson && (
                <View style={styles.nextLessonContainer}>
                    <TouchableOpacity style={styles.nextLessonButton} onPress={handleNextLesson}>
                        <Text style={styles.nextLessonText}>NEXT LESSON</Text>
                        <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: COLORS.text,
        fontSize: 18,
        marginTop: 12,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: COLORS.background,
        fontWeight: 'bold',
    },
    markCompleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    markCompleteButtonDone: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
    },
    markCompleteText: {
        color: COLORS.text,
        fontSize: 13,
        fontWeight: '600',
    },
    markCompleteTextDone: {
        color: COLORS.success,
    },
    nextLessonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 32,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    nextLessonButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    nextLessonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
