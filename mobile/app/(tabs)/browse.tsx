import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { getCourses, getCoursesByCategory, searchCourses, Course } from '../../lib/database';
import SearchBar from '../../components/SearchBar';
import CategoryChip from '../../components/CategoryChip';
import CourseCard from '../../components/CourseCard';

const CATEGORIES = ['All', 'Boxing', 'Footwork', 'Defense'];

export default function BrowseScreen() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadCourses = useCallback(async () => {
        try {
            let data: Course[];

            if (searchQuery.trim()) {
                data = await searchCourses(searchQuery);
            } else if (selectedCategory !== 'All') {
                data = await getCoursesByCategory(selectedCategory);
            } else {
                data = await getCourses();
            }

            setCourses(data);
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedCategory, searchQuery]);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadCourses();
    };

    const handleCategoryPress = (category: string) => {
        setSelectedCategory(category);
        setSearchQuery('');
    };

    const featuredCourse = courses[0];
    const otherCourses = courses.slice(1);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading courses...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* Search Bar */}
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search courses..."
                />

                {/* Category Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryContainer}
                    contentContainerStyle={styles.categoryContent}
                >
                    {CATEGORIES.map((category) => (
                        <CategoryChip
                            key={category}
                            label={category}
                            isSelected={selectedCategory === category}
                            onPress={() => handleCategoryPress(category)}
                        />
                    ))}
                </ScrollView>

                {/* Featured Course */}
                {featuredCourse && (
                    <>
                        <Text style={styles.sectionTitle}>Featured Course</Text>
                        <CourseCard course={featuredCourse} featured />
                    </>
                )}

                {/* All Courses */}
                <Text style={styles.sectionTitle}>
                    {selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}
                </Text>

                <View style={styles.courseList}>
                    {otherCourses.length > 0 ? (
                        otherCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : courses.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>🔍</Text>
                            <Text style={styles.emptyTitle}>No courses found</Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery
                                    ? 'Try a different search term'
                                    : 'Check back later for new content'}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
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
    loadingText: {
        marginTop: SIZES.md,
        fontSize: SIZES.fontMd,
        color: COLORS.textMuted,
    },
    categoryContainer: {
        marginBottom: SIZES.lg,
    },
    categoryContent: {
        paddingHorizontal: SIZES.lg,
    },
    sectionTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: 'bold',
        color: COLORS.text,
        marginHorizontal: SIZES.lg,
        marginBottom: SIZES.md,
    },
    courseList: {
        paddingHorizontal: SIZES.lg,
        paddingBottom: SIZES.xxl,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SIZES.xxl,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: SIZES.md,
    },
    emptyTitle: {
        fontSize: SIZES.fontLg,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SIZES.xs,
    },
    emptySubtitle: {
        fontSize: SIZES.fontMd,
        color: COLORS.textMuted,
    },
});
