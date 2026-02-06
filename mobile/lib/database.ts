import { supabase } from './supabase';

// Types
export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    category: string;
    difficulty: string;
    lesson_count: number;
    duration_minutes: number;
    is_premium: boolean;
    created_at: string;
}

export interface Lesson {
    id: string;
    course_id: string;
    title: string;
    duration_seconds: number;
    order_index: number;
    video_url: string | null;
    is_preview: boolean;
    created_at: string;
}

// Fetch all courses
export async function getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching courses:', error);
        return [];
    }

    return data || [];
}

// Fetch courses by category
export async function getCoursesByCategory(category: string): Promise<Course[]> {
    if (category.toLowerCase() === 'all') {
        return getCourses();
    }

    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('category', category.toLowerCase())
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching courses by category:', error);
        return [];
    }

    return data || [];
}

// Search courses
export async function searchCourses(query: string): Promise<Course[]> {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .ilike('title', `%${query}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error searching courses:', error);
        return [];
    }

    return data || [];
}

// Fetch single course by ID
export async function getCourseById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching course:', error);
        return null;
    }

    return data;
}

// Fetch lessons for a course
export async function getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching lessons:', error);
        return [];
    }

    return data || [];
}

// Format duration from seconds to "MM:SS"
export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format duration from minutes to "Xh Ym"
export function formatDurationMinutes(minutes: number): string {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Fetch single lesson by ID
export async function getLessonById(id: string): Promise<Lesson | null> {
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching lesson:', error);
        return null;
    }

    return data;
}

// Get the next lesson in a course
export async function getNextLesson(courseId: string, currentOrderIndex: number): Promise<Lesson | null> {
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .gt('order_index', currentOrderIndex)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

    if (error) {
        // No next lesson found is not an error
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error('Error fetching next lesson:', error);
        return null;
    }

    return data;
}

