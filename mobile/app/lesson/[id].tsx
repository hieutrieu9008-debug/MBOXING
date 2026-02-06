import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator, Animated } from 'react-native';
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

// Sample video URLs for demo
const SAMPLE_VIDEOS = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
];

const AUTOPLAY_COUNTDOWN = 5; // seconds

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

    // Autoplay state
    const [showAutoplay, setShowAutoplay] = useState(false);
    const [autoplayCountdown, setAutoplayCountdown] = useState(AUTOPLAY_COUNTDOWN);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);
    const progressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadLesson();
        // Reset autoplay when lesson changes
        setShowAutoplay(false);
        setAutoplayCountdown(AUTOPLAY_COUNTDOWN);
        progressAnim.setValue(1);
    }, [id, courseId]);

    // Cleanup countdown on unmount
    useEffect(() => {
        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        };
    }, []);

    // Autoplay countdown logic
    useEffect(() => {
        if (showAutoplay && autoplayCountdown > 0) {
            countdownRef.current = setInterval(() => {
                setAutoplayCountdown((prev) => {
                    if (prev <= 1) {
                        // Navigate to next lesson
                        handleNextLesson();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Animate progress bar
            Animated.timing(progressAnim, {
                toValue: 0,
                duration: AUTOPLAY_COUNTDOWN * 1000,
                useNativeDriver: false,
            }).start();
        }

        return () => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        };
    }, [showAutoplay]);

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
        // Show autoplay countdown if there's a next lesson
        if (nextLesson) {
            setShowAutoplay(true);
        }
    }, [nextLesson]);

    const handleToggleComplete = () => {
        setIsCompleted(!isCompleted);
        // TODO: Save completion status to database
    };

    const handleNextLesson = () => {
        if (nextLesson && courseId) {
            // Cancel any running countdown
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
            setShowAutoplay(false);
            router.replace(`/lesson/${nextLesson.id}?courseId=${courseId}` as any);
        }
    };

    const cancelAutoplay = () => {
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
        }
        setShowAutoplay(false);
        setAutoplayCountdown(AUTOPLAY_COUNTDOWN);
        progressAnim.setValue(1);
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
            {nextLesson && !showAutoplay && (
                <View style={styles.nextLessonContainer}>
                    <TouchableOpacity style={styles.nextLessonButton} onPress={handleNextLesson}>
                        <Text style={styles.nextLessonText}>NEXT LESSON</Text>
                        <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Autoplay Countdown Overlay */}
            {showAutoplay && nextLesson && (
                <View style={styles.autoplayContainer}>
                    <View style={styles.autoplayCard}>
                        <Text style={styles.autoplayTitle}>Up Next</Text>
                        <Text style={styles.autoplayLessonTitle}>{nextLesson.title}</Text>

                        <View style={styles.countdownContainer}>
                            <Text style={styles.countdownText}>{autoplayCountdown}</Text>
                        </View>

                        {/* Animated progress bar */}
                        <View style={styles.progressBarContainer}>
                            <Animated.View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%'],
                                        }),
                                    },
                                ]}
                            />
                        </View>

                        <View style={styles.autoplayButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={cancelAutoplay}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.playNowButton} onPress={handleNextLesson}>
                                <Text style={styles.playNowButtonText}>Play Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    // Autoplay styles
    autoplayContainer: {
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
    autoplayCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    autoplayTitle: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 8,
    },
    autoplayLessonTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    countdownContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    countdownText: {
        color: COLORS.background,
        fontSize: 28,
        fontWeight: 'bold',
    },
    progressBarContainer: {
        width: '100%',
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    autoplayButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: '600',
    },
    playNowButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    playNowButtonText: {
        color: COLORS.background,
        fontSize: 15,
        fontWeight: '600',
    },
});
