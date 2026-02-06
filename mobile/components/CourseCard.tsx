import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES, getDifficultyColor } from '../constants/theme';
import { Course, formatDurationMinutes } from '../lib/database';

interface CourseCardProps {
    course: Course;
    featured?: boolean;
}

export default function CourseCard({ course, featured = false }: CourseCardProps) {
    const handlePress = () => {
        router.push(`/course/${course.id}`);
    };

    if (featured) {
        return (
            <TouchableOpacity style={styles.featuredCard} onPress={handlePress} activeOpacity={0.8}>
                <Image
                    source={{ uri: course.thumbnail_url }}
                    style={styles.featuredImage}
                    resizeMode="cover"
                />
                <View style={styles.featuredOverlay}>
                    <View style={styles.featuredContent}>
                        <View style={[styles.badge, { backgroundColor: getDifficultyColor(course.difficulty) }]}>
                            <Text style={styles.badgeText}>{course.difficulty.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.featuredTitle}>{course.title}</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <Ionicons name="play-circle" size={16} color={COLORS.primary} />
                                <Text style={styles.statText}>{course.lesson_count} lessons</Text>
                            </View>
                            <View style={styles.stat}>
                                <Ionicons name="time" size={16} color={COLORS.primary} />
                                <Text style={styles.statText}>{formatDurationMinutes(course.duration_minutes)}</Text>
                            </View>
                            {course.is_premium && (
                                <View style={styles.stat}>
                                    <Ionicons name="star" size={16} color={COLORS.primary} />
                                    <Text style={styles.statText}>Premium</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
            <Image
                source={{ uri: course.thumbnail_url }}
                style={styles.thumbnail}
                resizeMode="cover"
            />
            <View style={styles.cardContent}>
                <View style={[styles.badge, { backgroundColor: getDifficultyColor(course.difficulty) }]}>
                    <Text style={styles.badgeText}>{course.difficulty.toUpperCase()}</Text>
                </View>
                <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
                <View style={styles.statsRow}>
                    <Text style={styles.statText}>{course.lesson_count} lessons</Text>
                    <Text style={styles.statDot}>•</Text>
                    <Text style={styles.statText}>{formatDurationMinutes(course.duration_minutes)}</Text>
                </View>
                {course.is_premium && (
                    <View style={styles.premiumBadge}>
                        <Ionicons name="star" size={12} color={COLORS.primary} />
                        <Text style={styles.premiumText}>PREMIUM</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // Featured card styles
    featuredCard: {
        marginHorizontal: SIZES.lg,
        borderRadius: SIZES.radiusLg,
        overflow: 'hidden',
        height: 200,
        marginBottom: SIZES.lg,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    featuredContent: {
        padding: SIZES.lg,
    },
    featuredTitle: {
        fontSize: SIZES.fontXl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SIZES.sm,
    },

    // Regular card styles
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radiusMd,
        overflow: 'hidden',
        marginBottom: SIZES.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    thumbnail: {
        width: 100,
        height: 100,
    },
    cardContent: {
        flex: 1,
        padding: SIZES.md,
        justifyContent: 'center',
    },
    title: {
        fontSize: SIZES.fontMd,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SIZES.xs,
    },

    // Shared styles
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: SIZES.sm,
        paddingVertical: 2,
        borderRadius: SIZES.radiusSm,
        marginBottom: SIZES.xs,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.background,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SIZES.md,
    },
    statText: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
        marginLeft: 4,
    },
    statDot: {
        color: COLORS.textMuted,
        marginHorizontal: SIZES.xs,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.xs,
    },
    premiumText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginLeft: 4,
    },
});
