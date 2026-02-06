import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, getDifficultyColor } from '../../constants/theme';
import { getCourseById, getLessonsByCourseId, formatDurationMinutes, Course, Lesson } from '../../lib/database';
import LessonRow from '../../components/LessonRow';

export default function CourseDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCourseData() {
            if (!id) return;

            try {
                const [courseData, lessonsData] = await Promise.all([
                    getCourseById(id),
                    getLessonsByCourseId(id),
                ]);

                setCourse(courseData);
                setLessons(lessonsData);
            } catch (error) {
                console.error('Error loading course:', error);
            } finally {
                setLoading(false);
            }
        }

        loadCourseData();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!course) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Course not found</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // For demo: first 2 lessons completed, 3rd in progress, rest locked
    const getIsCompleted = (index: number) => index < 2;
    const getIsLocked = (index: number, lesson: Lesson) => index >= 3 && !lesson.is_preview;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: course.thumbnail_url }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <View style={styles.heroOverlay}>
                        <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                        <View style={styles.heroContent}>
                            <View style={[styles.badge, { backgroundColor: getDifficultyColor(course.difficulty) }]}>
                                <Text style={styles.badgeText}>{course.difficulty.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.heroTitle}>{course.title}</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{course.lesson_count}</Text>
                        <Text style={styles.statLabel}>Lessons</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>{formatDurationMinutes(course.duration_minutes)}</Text>
                        <Text style={styles.statLabel}>Duration</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>4.9 ★</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.description}>{course.description}</Text>
                </View>

                {/* Lessons */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lessons</Text>
                    {lessons.map((lesson, index) => (
                        <LessonRow
                            key={lesson.id}
                            lesson={lesson}
                            index={index + 1}
                            isCompleted={getIsCompleted(index)}
                            isLocked={getIsLocked(index, lesson)}
                            onPress={() => {
                                router.push(`/lesson/${lesson.id}?courseId=${id}`);
                            }}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Continue Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.continueButton} activeOpacity={0.8}>
                    <Text style={styles.continueButtonText}>CONTINUE COURSE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: SIZES.fontLg,
        color: COLORS.text,
        marginBottom: SIZES.lg,
    },
    backButton: {
        padding: SIZES.md,
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: SIZES.fontMd,
    },

    // Hero
    heroContainer: {
        height: 280,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backArrow: {
        position: 'absolute',
        top: 50,
        left: SIZES.lg,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroContent: {
        position: 'absolute',
        bottom: SIZES.lg,
        left: SIZES.lg,
        right: SIZES.lg,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: SIZES.sm,
        paddingVertical: 4,
        borderRadius: SIZES.radiusSm,
        marginBottom: SIZES.sm,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.background,
    },
    heroTitle: {
        fontSize: SIZES.fontXxl,
        fontWeight: 'bold',
        color: COLORS.text,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: SIZES.lg,
        marginHorizontal: SIZES.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: SIZES.fontLg,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: COLORS.border,
    },

    // Section
    section: {
        padding: SIZES.lg,
    },
    sectionTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SIZES.md,
    },
    description: {
        fontSize: SIZES.fontMd,
        color: COLORS.textMuted,
        lineHeight: 24,
    },

    // Footer
    footer: {
        padding: SIZES.lg,
        paddingBottom: SIZES.xl,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SIZES.md,
        borderRadius: SIZES.radiusMd,
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: SIZES.fontMd,
        fontWeight: 'bold',
        color: COLORS.background,
    },
});
