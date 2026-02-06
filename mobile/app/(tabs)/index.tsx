import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Good Morning, Fighter</Text>
                <Text style={styles.name}>Hieu</Text>
            </View>

            <View style={styles.streakCard}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <View>
                    <Text style={styles.streakText}>14 Day Streak</Text>
                    <Text style={styles.streakSubtext}>Keep pushing!</Text>
                </View>
            </View>

            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>🏠 Home Dashboard</Text>
                <Text style={styles.placeholderSubtext}>Coming in future slice</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: SIZES.lg,
        marginBottom: SIZES.lg,
    },
    greeting: {
        fontSize: SIZES.fontLg,
        color: COLORS.text,
    },
    name: {
        fontSize: SIZES.fontXl,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    streakCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        marginHorizontal: SIZES.lg,
        padding: SIZES.lg,
        borderRadius: SIZES.radiusLg,
        borderWidth: 1,
        borderColor: COLORS.primary,
        marginBottom: SIZES.xl,
    },
    streakEmoji: {
        fontSize: 40,
        marginRight: SIZES.md,
    },
    streakText: {
        fontSize: SIZES.fontXl,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    streakSubtext: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.xxl,
    },
    placeholderText: {
        fontSize: SIZES.fontXl,
        color: COLORS.textMuted,
        marginBottom: SIZES.sm,
    },
    placeholderSubtext: {
        fontSize: SIZES.fontSm,
        color: COLORS.textMuted,
    },
});
