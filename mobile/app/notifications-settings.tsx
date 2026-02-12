import { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { colors, typography, spacing, layout, radius, shadows } from '../constants/theme'
import {
  registerForPushNotifications,
  savePushToken,
  scheduleDailyReminder,
  cancelAllNotifications,
  getNotificationPermissions,
  getScheduledNotifications,
} from '../lib/notifications'
import Button from '../components/Button'

export default function NotificationsSettingsScreen() {
  const router = useRouter()
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [dailyReminder, setDailyReminder] = useState(false)
  const [drillReminders, setDrillReminders] = useState(true)
  const [streakReminders, setStreakReminders] = useState(true)
  const [reminderTime, setReminderTime] = useState({ hour: 9, minute: 0 })
  const [scheduledCount, setScheduledCount] = useState(0)

  useEffect(() => {
    checkPermissions()
    loadScheduledNotifications()
  }, [])

  async function checkPermissions() {
    const perms = await getNotificationPermissions()
    setPermissionsGranted(perms.granted)
  }

  async function loadScheduledNotifications() {
    const scheduled = await getScheduledNotifications()
    setScheduledCount(scheduled.length)
  }

  async function handleEnableNotifications() {
    const token = await registerForPushNotifications()
    if (token) {
      await savePushToken(token)
      setPermissionsGranted(true)
      Alert.alert('Success!', 'Push notifications enabled')
    } else {
      Alert.alert(
        'Permission Denied',
        'Please enable notifications in your device settings'
      )
    }
  }

  async function handleDailyReminderToggle(value: boolean) {
    setDailyReminder(value)
    
    if (value) {
      const notifId = await scheduleDailyReminder(reminderTime.hour, reminderTime.minute)
      if (notifId) {
        Alert.alert('Reminder Set!', `Daily reminder scheduled for ${reminderTime.hour}:${reminderTime.minute.toString().padStart(2, '0')}`)
        loadScheduledNotifications()
      }
    } else {
      await cancelAllNotifications()
      Alert.alert('Reminder Canceled', 'Daily reminder has been removed')
      loadScheduledNotifications()
    }
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            Stay motivated with smart reminders
          </Text>
        </View>

        {/* Permissions Card */}
        {!permissionsGranted && (
          <View style={styles.permissionCard}>
            <Text style={styles.permissionEmoji}>🔔</Text>
            <Text style={styles.permissionTitle}>Enable Notifications</Text>
            <Text style={styles.permissionDescription}>
              Get reminders to practice drills, maintain your streak, and stay on track with your boxing journey.
            </Text>
            <Button
              title="Enable Notifications"
              onPress={handleEnableNotifications}
              fullWidth
              variant="primary"
            />
          </View>
        )}

        {/* Settings (only show if permissions granted) */}
        {permissionsGranted && (
          <>
            {/* Status Card */}
            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Notifications Enabled</Text>
              <Text style={styles.statusValue}>
                {scheduledCount} scheduled
              </Text>
            </View>

            {/* Daily Reminder */}
            <View style={styles.settingSection}>
              <Text style={styles.sectionTitle}>Daily Reminders</Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>Practice Reminder</Text>
                  <Text style={styles.settingDescription}>
                    Daily reminder to train at {reminderTime.hour}:00
                  </Text>
                </View>
                <Switch
                  value={dailyReminder}
                  onValueChange={handleDailyReminderToggle}
                  trackColor={{
                    false: colors.background.tertiary,
                    true: colors.primary[500],
                  }}
                  thumbColor={colors.neutral[0]}
                />
              </View>

              {dailyReminder && (
                <View style={styles.timePickerPlaceholder}>
                  <Text style={styles.timePickerText}>
                    Time: {reminderTime.hour}:00
                  </Text>
                  <Text style={styles.timePickerHint}>
                    (Time picker coming soon)
                  </Text>
                </View>
              )}
            </View>

            {/* Drill Reminders */}
            <View style={styles.settingSection}>
              <Text style={styles.sectionTitle}>Training Reminders</Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>Drill Due Reminders</Text>
                  <Text style={styles.settingDescription}>
                    Get notified when drills are due for practice
                  </Text>
                </View>
                <Switch
                  value={drillReminders}
                  onValueChange={setDrillReminders}
                  trackColor={{
                    false: colors.background.tertiary,
                    true: colors.primary[500],
                  }}
                  thumbColor={colors.neutral[0]}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>Streak Reminders</Text>
                  <Text style={styles.settingDescription}>
                    Don't break your streak! Get reminded if you haven't trained
                  </Text>
                </View>
                <Switch
                  value={streakReminders}
                  onValueChange={setStreakReminders}
                  trackColor={{
                    false: colors.background.tertiary,
                    true: colors.primary[500],
                  }}
                  thumbColor={colors.neutral[0]}
                />
              </View>
            </View>

            {/* Test Notification */}
            <View style={styles.testSection}>
              <Button
                title="Send Test Notification"
                onPress={async () => {
                  const { sendImmediateNotification } = require('../lib/notifications')
                  await sendImmediateNotification(
                    'Test Notification 🥊',
                    'Your notifications are working perfectly!'
                  )
                }}
                fullWidth
                variant="outline"
              />
            </View>
          </>
        )}

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Notifications</Text>
          <Text style={styles.infoText}>
            • Notifications help you stay consistent with your training
          </Text>
          <Text style={styles.infoText}>
            • Drill reminders use spaced repetition for optimal learning
          </Text>
          <Text style={styles.infoText}>
            • You can disable notifications anytime in settings
          </Text>
          <Text style={styles.infoText}>
            • All notification data is stored locally on your device
          </Text>
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
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing[6],
  },

  headerTitle: {
    fontSize: typography.sizes['4xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
  },

  headerSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },

  permissionCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing[6],
    alignItems: 'center',
    marginBottom: spacing[6],
    ...shadows.base,
  },

  permissionEmoji: {
    fontSize: 64,
    marginBottom: spacing[4],
  },

  permissionTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },

  permissionDescription: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: typography.lineHeights.normal * typography.sizes.base,
  },

  statusCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.primary[500],
    borderRadius: radius.md,
    padding: spacing[4],
    marginBottom: spacing[6],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusLabel: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.neutral[900],
  },

  statusValue: {
    fontSize: typography.sizes.sm,
    color: colors.neutral[800],
  },

  settingSection: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[6],
  },

  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing[4],
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: radius.md,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.base,
  },

  settingInfo: {
    flex: 1,
    marginRight: spacing[4],
  },

  settingName: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  settingDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },

  timePickerPlaceholder: {
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.md,
    padding: spacing[4],
    marginBottom: spacing[3],
  },

  timePickerText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[1],
  },

  timePickerHint: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
  },

  testSection: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[6],
  },

  infoSection: {
    paddingHorizontal: layout.screenPadding,
  },

  infoTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[3],
  },

  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.text.tertiary,
    marginBottom: spacing[2],
  },
})
