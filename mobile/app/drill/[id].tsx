import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { colors, typography, spacing, radius, shadows } from '../../constants/theme'
import {
  getDrill,
  getDrillLogs,
  logDrillReps,
  getDrillTotalReps,
  Drill,
  DrillLog,
} from '../../lib/drills'
import Button from '../../components/Button'

export default function DrillDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const [drill, setDrill] = useState<Drill | null>(null)
  const [logs, setLogs] = useState<DrillLog[]>([])
  const [totalReps, setTotalReps] = useState(0)
  const [loading, setLoading] = useState(true)

  const [reps, setReps] = useState('')
  const [notes, setNotes] = useState('')
  const [logging, setLogging] = useState(false)

  useEffect(() => {
    if (id) {
      loadDrill()
      loadLogs()
      loadTotalReps()
    }
  }, [id])

  async function loadDrill() {
    const data = await getDrill(id as string)
    setDrill(data)
    if (data) {
      setReps(data.default_reps.toString())
    }
    setLoading(false)
  }

  async function loadLogs() {
    const data = await getDrillLogs(id as string, 20)
    setLogs(data)
  }

  async function loadTotalReps() {
    const total = await getDrillTotalReps(id as string)
    setTotalReps(total)
  }

  async function handleLogReps() {
    const repsNum = parseInt(reps)
    if (isNaN(repsNum) || repsNum <= 0) {
      Alert.alert('Invalid Reps', 'Please enter a valid number of reps')
      return
    }

    setLogging(true)
    try {
      const result = await logDrillReps(id as string, repsNum, notes.trim() || undefined)
      if (result) {
        Alert.alert('Success!', `Logged ${repsNum} reps`)
        setNotes('')
        setReps(drill?.default_reps.toString() || '')
        loadLogs()
        loadTotalReps()
      } else {
        Alert.alert('Error', 'Failed to log reps')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log reps')
    } finally {
      setLogging(false)
    }
  }

  function quickAdd(amount: number) {
    const current = parseInt(reps) || 0
    setReps((current + amount).toString())
  }

  if (loading || !drill) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.category}>{drill.category.toUpperCase()}</Text>
          <Text style={styles.title}>{drill.name}</Text>
          <Text style={styles.description}>{drill.description}</Text>

          {/* Total Reps */}
          <View style={styles.totalRepsCard}>
            <Text style={styles.totalRepsValue}>
              {totalReps.toLocaleString()}
            </Text>
            <Text style={styles.totalRepsLabel}>Total Reps</Text>
          </View>
        </View>

        {/* Rep Logger */}
        <View style={styles.loggerSection}>
          <Text style={styles.sectionTitle}>Log Reps</Text>

          {/* Reps Input */}
          <View style={styles.repsInputContainer}>
            <TextInput
              style={styles.repsInput}
              value={reps}
              onChangeText={setReps}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.text.tertiary}
            />
            <Text style={styles.repsUnit}>reps</Text>
          </View>

          {/* Quick Add Buttons */}
          <View style={styles.quickAddContainer}>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => quickAdd(-10)}
            >
              <Text style={styles.quickAddText}>-10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => quickAdd(-5)}
            >
              <Text style={styles.quickAddText}>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => quickAdd(5)}
            >
              <Text style={styles.quickAddText}>+5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => quickAdd(10)}
            >
              <Text style={styles.quickAddText}>+10</Text>
            </TouchableOpacity>
          </View>

          {/* Notes Input */}
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            placeholderTextColor={colors.text.tertiary}
            multiline
          />

          {/* Log Button */}
          <Button
            title={logging ? 'Logging...' : 'Log Reps'}
            onPress={handleLogReps}
            fullWidth
            size="lg"
            disabled={logging || !reps}
          />
        </View>

        {/* Recent Logs */}
        <View style={styles.logsSection}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>

          {logs.length > 0 ? (
            logs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.logReps}>{log.reps} reps</Text>
                  <Text style={styles.logDate}>
                    {new Date(log.logged_at).toLocaleDateString()}
                  </Text>
                </View>
                {log.notes && (
                  <Text style={styles.logNotes}>{log.notes}</Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No logs yet</Text>
              <Text style={styles.emptySubtext}>
                Start logging reps to track your progress!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: spacing[8],
  },

  backButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  backButtonText: {
    fontSize: typography.sizes.base,
    color: colors.primary[400],
    fontWeight: '600',
  },

  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },

  category: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary[400],
    marginBottom: spacing[2],
  },

  title: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[3],
    lineHeight: typography.lineHeights.tight * typography.sizes['4xl'],
  },

  description: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    marginBottom: spacing[6],
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
  },

  totalRepsCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing[6],
    alignItems: 'center',
    ...shadows.base,
  },

  totalRepsValue: {
    fontSize: typography.sizes['5xl'],
    fontWeight: '700',
    color: colors.primary[500],
    marginBottom: spacing[2],
  },

  totalRepsLabel: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },

  loggerSection: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[8],
  },

  sectionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[4],
  },

  repsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },

  repsInput: {
    fontSize: typography.sizes['5xl'],
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    minWidth: 120,
  },

  repsUnit: {
    fontSize: typography.sizes['2xl'],
    color: colors.text.tertiary,
    marginLeft: spacing[2],
  },

  quickAddContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[6],
  },

  quickAddButton: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    minWidth: 60,
  },

  quickAddText: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },

  notesInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius.md,
    padding: spacing[4],
    fontSize: typography.sizes.base,
    color: colors.text.primary,
    marginBottom: spacing[4],
    minHeight: 80,
    textAlignVertical: 'top',
  },

  logsSection: {
    paddingHorizontal: spacing[4],
  },

  logCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.base,
  },

  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },

  logReps: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.text.primary,
  },

  logDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },

  logNotes: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },

  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
})
