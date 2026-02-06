import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search courses...' }: SearchBarProps) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.icon} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radiusMd,
        paddingHorizontal: SIZES.md,
        marginHorizontal: SIZES.lg,
        marginBottom: SIZES.lg,
    },
    icon: {
        marginRight: SIZES.sm,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: SIZES.fontMd,
        color: COLORS.text,
    },
});
