import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, spacing, radius } from '../constants/theme'

interface HeatmapProps {
  data: {
    date: string
    count: number
  }[]
  maxCount?: number
}

export default function Heatmap({ data, maxCount = 10 }: HeatmapProps) {
  // Generate last 90 days
  const days = 90
  const today = new Date()
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (days - 1 - i))
    return date.toISOString().split('T')[0]
  })

  // Map data to dates
  const dataMap = new Map(data.map(d => [d.date, d.count]))

  // Group by weeks
  const weeks: string[][] = []
  let week: string[] = []
  
  dates.forEach((date, index) => {
    week.push(date)
    if (week.length === 7 || index === dates.length - 1) {
      weeks.push([...week])
      week = []
    }
  })

  function getColor(count: number): string {
    if (count === 0) return colors.background.tertiary
    const intensity = Math.min(count / maxCount, 1)
    
    if (intensity < 0.25) return colors.primary[200]
    if (intensity < 0.5) return colors.primary[400]
    if (intensity < 0.75) return colors.primary[500]
    return colors.primary[600]
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map((date) => {
              const count = dataMap.get(date) || 0
              return (
                <View
                  key={date}
                  style={[
                    styles.day,
                    { backgroundColor: getColor(count) },
                  ]}
                />
              )
            })}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendDots}>
          <View
            style={[styles.legendDot, { backgroundColor: colors.background.tertiary }]}
          />
          <View
            style={[styles.legendDot, { backgroundColor: colors.primary[200] }]}
          />
          <View
            style={[styles.legendDot, { backgroundColor: colors.primary[400] }]}
          />
          <View
            style={[styles.legendDot, { backgroundColor: colors.primary[500] }]}
          />
          <View
            style={[styles.legendDot, { backgroundColor: colors.primary[600] }]}
          />
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  grid: {
    flexDirection: 'row',
    gap: spacing[1],
  },

  week: {
    flex: 1,
    gap: spacing[1],
  },

  day: {
    aspectRatio: 1,
    borderRadius: radius.sm,
  },

  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing[3],
    gap: spacing[2],
  },

  legendText: {
    fontSize: typography.sizes.xs,
    color: colors.text.tertiary,
  },

  legendDots: {
    flexDirection: 'row',
    gap: spacing[1],
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: radius.sm,
  },
})
