import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// Demo drill data - will be replaced with actual data from database
interface Drill {
    id: string;
    title: string;
    duration: string; // e.g., "2 min"
    rounds?: number;
    icon: keyof typeof Ionicons.glyphMap;
}

interface RelatedDrillsProps {
    lessonTitle?: string;
}

// Demo drills based on lesson content
const DEMO_DRILLS: Drill[] = [
    { id: '1', title: 'Shadow Boxing', duration: '3 min', rounds: 3, icon: 'fitness' },
    { id: '2', title: 'Speed Bag', duration: '2 min', rounds: 2, icon: 'timer' },
    { id: '3', title: 'Heavy Bag Combos', duration: '5 min', rounds: 5, icon: 'barbell' },
    { id: '4', title: 'Footwork Ladder', duration: '3 min', icon: 'footsteps' },
];

export default function RelatedDrills({ lessonTitle }: RelatedDrillsProps) {
    const handleDrillPress = (drillId: string) => {
        // TODO: Navigate to drill timer or tracker
        console.log('Open drill:', drillId);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Related Drills</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {DEMO_DRILLS.map((drill) => (
                    <TouchableOpacity
                        key={drill.id}
                        style={styles.drillCard}
                        onPress={() => handleDrillPress(drill.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name={drill.icon} size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.drillTitle} numberOfLines={2}>
                            {drill.title}
                        </Text>
                        <View style={styles.drillMeta}>
                            <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
                            <Text style={styles.drillDuration}>{drill.duration}</Text>
                            {drill.rounds && (
                                <>
                                    <Text style={styles.drillDot}>•</Text>
                                    <Text style={styles.drillRounds}>{drill.rounds} rounds</Text>
                                </>
                            )}
                        </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    seeAllButton: {
        padding: 4,
    },
    seeAllText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 12,
        gap: 12,
    },
    drillCard: {
        width: 140,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 204, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    drillTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 6,
        height: 36,
    },
    drillMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    drillDuration: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    drillDot: {
        color: COLORS.textMuted,
        fontSize: 12,
    },
    drillRounds: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
});
