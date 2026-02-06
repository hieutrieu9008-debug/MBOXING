import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { Lesson, formatDuration } from '../lib/database';

interface NextUpCourseProps {
    lessons: Lesson[];
    currentLessonId: string;
    courseId: string;
}

export default function NextUpCourse({ lessons, currentLessonId, courseId }: NextUpCourseProps) {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);

    useEffect(() => {
        // Scroll to current lesson on mount
        if (scrollViewRef.current && currentIndex > 0) {
            // Wait for layout then scroll
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ x: Math.max(0, currentIndex * 160 - 40), animated: true });
            }, 100);
        }
    }, [currentIndex]);

    const handleLessonPress = (lessonId: string) => {
        router.replace(`/lesson/${lessonId}?courseId=${courseId}` as any);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Next Up</Text>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {lessons.map((lesson, index) => {
                    const isCurrent = lesson.id === currentLessonId;
                    const isPast = index < currentIndex;
                    const isNext = index === currentIndex + 1;

                    return (
                        <TouchableOpacity
                            key={lesson.id}
                            style={[
                                styles.lessonCard,
                                isCurrent && styles.currentLesson,
                                isPast && styles.pastLesson,
                            ]}
                            onPress={() => handleLessonPress(lesson.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.lessonNumber}>
                                {isPast ? (
                                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                                ) : (
                                    <Text style={[styles.numberText, isCurrent && styles.currentNumberText]}>
                                        {index + 1}
                                    </Text>
                                )}
                            </View>
                            <Text
                                style={[styles.lessonTitle, isCurrent && styles.currentTitle]}
                                numberOfLines={2}
                            >
                                {lesson.title}
                            </Text>
                            <Text style={styles.lessonDuration}>
                                {formatDuration(lesson.duration_seconds)}
                            </Text>
                            {isCurrent && (
                                <View style={styles.nowPlayingBadge}>
                                    <Ionicons name="play" size={10} color={COLORS.background} />
                                    <Text style={styles.nowPlayingText}>NOW PLAYING</Text>
                                </View>
                            )}
                            {isNext && (
                                <View style={styles.upNextBadge}>
                                    <Text style={styles.upNextText}>UP NEXT</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    scrollContent: {
        paddingHorizontal: 12,
        gap: 12,
    },
    lessonCard: {
        width: 150,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    currentLesson: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
    },
    pastLesson: {
        opacity: 0.6,
    },
    lessonNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    numberText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textMuted,
    },
    currentNumberText: {
        color: COLORS.primary,
    },
    lessonTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
        height: 36,
    },
    currentTitle: {
        color: COLORS.primary,
    },
    lessonDuration: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    nowPlayingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
        gap: 3,
    },
    nowPlayingText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: COLORS.background,
    },
    upNextBadge: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    upNextText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: COLORS.textMuted,
    },
});
