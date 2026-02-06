import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { Lesson, formatDuration } from '../lib/database';

interface LessonRowProps {
    lesson: Lesson;
    index: number;
    isCompleted?: boolean;
    isLocked?: boolean;
    onPress?: () => void;
}

export default function LessonRow({
    lesson,
    index,
    isCompleted = false,
    isLocked = false,
    onPress
}: LessonRowProps) {
    const getIcon = () => {
        if (isCompleted) return 'checkmark-circle';
        if (isLocked) return 'lock-closed';
        return 'play-circle';
    };

    const getIconColor = () => {
        if (isCompleted) return COLORS.primary;
        if (isLocked) return COLORS.textMuted;
        return COLORS.text;
    };

    return (
        <TouchableOpacity
            style={[styles.container, isLocked && styles.locked]}
            onPress={onPress}
            activeOpacity={isLocked ? 1 : 0.7}
            disabled={isLocked}
        >
            <Ionicons
                name={getIcon()}
                size={28}
                color={getIconColor()}
                style={styles.icon}
            />
            <View style={styles.content}>
                <Text style={[styles.title, isLocked && styles.lockedText]} numberOfLines={1}>
                    {index}. {lesson.title}
                </Text>
                <Text style={styles.duration}>
                    {formatDuration(lesson.duration_seconds)}
                    {lesson.is_preview && !isLocked && (
                        <Text style={styles.previewBadge}> • FREE PREVIEW</Text>
                    )}
                </Text>
            </View>
            {isCompleted && (
                <View style={styles.completedBadge}>
                    <Ionicons name="checkmark" size={16} color={COLORS.background} />
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        padding: SIZES.md,
        borderRadius: SIZES.radiusMd,
        marginBottom: SIZES.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    locked: {
        opacity: 0.5,
    },
    icon: {
        marginRight: SIZES.md,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: SIZES.fontMd,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    lockedText: {
        color: COLORS.textMuted,
    },
    duration: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
    },
    previewBadge: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    completedBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
