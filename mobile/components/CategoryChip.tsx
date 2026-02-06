import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface CategoryChipProps {
    label: string;
    isSelected: boolean;
    onPress: () => void;
}

export default function CategoryChip({ label, isSelected, onPress }: CategoryChipProps) {
    return (
        <TouchableOpacity
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.sm,
        borderRadius: SIZES.radiusXl,
        backgroundColor: COLORS.card,
        marginRight: SIZES.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    label: {
        fontSize: SIZES.fontSm,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    labelSelected: {
        color: COLORS.background,
    },
});
