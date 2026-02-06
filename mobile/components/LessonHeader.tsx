import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { formatDuration } from '../lib/database';

interface LessonHeaderProps {
    title: string;
    instructor?: string;
    totalDuration: number; // in seconds
    watchedDuration?: number; // in seconds
}

export default function LessonHeader({
    title,
    instructor = 'Coach Mustafa',
    totalDuration,
    watchedDuration = 0,
}: LessonHeaderProps) {
    const formatTimeDisplay = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.instructor}>Instructor: {instructor}</Text>
            <Text style={styles.duration}>
                {formatTimeDisplay(totalDuration)} total
                {watchedDuration > 0 && ` | ${formatTimeDisplay(watchedDuration)} watched`}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    instructor: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    duration: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
});
