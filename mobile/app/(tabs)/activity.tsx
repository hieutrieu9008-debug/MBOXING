import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export default function ActivityScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>📊</Text>
            <Text style={styles.title}>Activity Tracker</Text>
            <Text style={styles.subtitle}>Coming in Slice 08</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 64,
        marginBottom: SIZES.lg,
    },
    title: {
        fontSize: SIZES.fontXl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SIZES.sm,
    },
    subtitle: {
        fontSize: SIZES.fontMd,
        color: COLORS.textMuted,
    },
});
