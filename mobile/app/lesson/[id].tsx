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
import NextUpCourse from '../../components/NextUpCourse';
import RelatedDrills from '../../components/RelatedDrills';
import RelatedLessons from '../../components/RelatedLessons';

// Sample video URLs for demo
const SAMPLE_VIDEOS = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
];

// Demo descriptions for lessons (will come from database later)
const LESSON_DESCRIPTIONS: Record<number, string> = {
    1: "Master the fundamentals of the boxing stance. Learn proper weight distribution, foot positioning, and how to stay balanced while moving. This is the foundation for all offensive and defensive techniques.",
    2: "Learn the mechanics of a perfect jab - the most important punch in boxing. We cover hand position, hip rotation, and how to snap the punch back for quick combinations.",
    3: "The cross is your power punch. In this lesson, we break down the weight transfer from back foot to front, shoulder rotation, and how to generate maximum force safely.",
    4: "Hooks require precise mechanics to land effectively. Learn the proper arc, elbow angle, and pivoting motion that makes the hook devastating at close range.",
    5: "Put it all together with basic two and three punch combinations. Practice the jab-cross, jab-jab-cross, and learn how to flow between punches smoothly.",
};

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

        const lessonData = await getLessonById(id);
        setLesson(lessonData);

        if (lessonData && (courseId || lessonData.course_id)) {
            const actualCourseId = courseId || lessonData.course_id;

            const courseData = await getCourseById(actualCourseId);
            setCourse(courseData);

            const lessons = await getLessonsByCourseId(actualCourseId);
            setAllLessons(lessons);

            const next = await getNextLesson(actualCourseId, lessonData.order_index);
            setNextLesson(next);
        }

        setIsLoading(false);
    };

    const handleProgress = useCallback((positionMs: number, durationMs: number) => {
        setWatchedSeconds(Math.floor(positionMs / 1000));
    }, []);

    const handleVideoComplete = useCallback(() => {
        console.log('Video finished playing');
    }, []);

    const handleToggleComplete = () => {
        setIsCompleted(!isCompleted);
        // TODO: Save completion status to database
    };

    const handleNextLesson = () => {
        if (nextLesson && courseId) {
            router.replace(`/lesson/${nextLesson.id}?courseId=${courseId}` as any);
        }
    };

    const getVideoUrl = (lessonData: Lesson): string => {
        if (lessonData.video_url) {
            return lessonData.video_url;
        }
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
                            onPress={handleToggleComplete}
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

                {/* Lesson Info with Description */}
                <LessonHeader
                    title={lesson.title}
                    description={LESSON_DESCRIPTIONS[lesson.order_index] || "Learn essential boxing techniques with step-by-step instruction from Coach Mustafa. Practice along with the video to build your skills."}
                    totalDuration={lesson.duration_seconds}
                    watchedDuration={watchedSeconds}
                />

                {/* Next Up - Course Lessons */}
                {allLessons.length > 1 && (
                    <NextUpCourse
                        lessons={allLessons}
                        currentLessonId={lesson.id}
                        courseId={courseId || lesson.course_id}
                    />
                )}

                {/* Related Drills */}
                <RelatedDrills />

                {/* Related Videos */}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 24,
    },
    errorText: {
        fontSize: 18,
        color: COLORS.text,
        marginTop: 16,
        marginBottom: 24,
    },
    backButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    markCompleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
    },
    markCompleteButtonDone: {
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
    },
    markCompleteText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
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
