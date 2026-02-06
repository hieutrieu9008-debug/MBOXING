import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { Lesson, formatDuration } from '../lib/database';

interface RelatedLessonsProps {
    lessons: Lesson[];
    currentLessonId: string;
    courseId: string;
}

export default function RelatedLessons({ lessons, currentLessonId, courseId }: RelatedLessonsProps) {
    const router = useRouter();

    // Filter out current lesson
    const otherLessons = lessons.filter(l => l.id !== currentLessonId);

    if (otherLessons.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Related Lessons</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {otherLessons.map((lesson) => (
                    <TouchableOpacity
                        key={lesson.id}
                        style={styles.lessonCard}
                        onPress={() => router.push(`/lesson/${lesson.id}?courseId=${courseId}`)}
                    >
                        <View style={styles.thumbnail}>
                            <View style={styles.playIconContainer}>
                                <Ionicons name="play" size={20} color={COLORS.text} />
                            </View>
                            <View style={styles.durationBadge}>
                                <Text style={styles.durationText}>
                                    {formatDuration(lesson.duration_seconds)}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.lessonTitle} numberOfLines={2}>
                            {lesson.title}
                        </Text>
                    </TouchableOpacity>
                ))}
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
        paddingHorizontal: 16,
        gap: 12,
    },
    lessonCard: {
        width: 140,
    },
    thumbnail: {
        width: 140,
        height: 90,
        backgroundColor: COLORS.surface,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        position: 'relative',
    },
    playIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    durationText: {
        color: COLORS.text,
        fontSize: 11,
        fontWeight: '600',
    },
    lessonTitle: {
        fontSize: 13,
        color: COLORS.text,
        lineHeight: 18,
    },
});
