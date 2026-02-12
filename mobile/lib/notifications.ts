import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { supabase } from './supabase'

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

/**
 * Register for push notifications and get Expo push token
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices')
      return null
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    // Request permission if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      console.log('Permission not granted for push notifications')
      return null
    }

    // Get push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    })

    // Configure Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF4433',
      })
    }

    return tokenData.data
  } catch (error) {
    console.error('Error registering for push notifications:', error)
    return null
  }
}

/**
 * Save push token to database
 */
export async function savePushToken(token: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_push_tokens')
      .upsert({
        user_id: user.id,
        token,
        device_type: Platform.OS,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,token'
      })

    if (error) throw error
  } catch (error) {
    console.error('Error saving push token:', error)
  }
}

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput
): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    })
    return id
  } catch (error) {
    console.error('Error scheduling notification:', error)
    return null
  }
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId)
  } catch (error) {
    console.error('Error canceling notification:', error)
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
  } catch (error) {
    console.error('Error canceling all notifications:', error)
  }
}

/**
 * Schedule daily practice reminder
 */
export async function scheduleDailyReminder(
  hour: number,
  minute: number
): Promise<string | null> {
  try {
    // Cancel existing daily reminder first
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    for (const notif of scheduled) {
      if (notif.content.title === 'Time to Train! 🥊') {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier)
      }
    }

    // Schedule new daily reminder
    return await scheduleLocalNotification(
      'Time to Train! 🥊',
      'Ready to practice? Check your drills due today!',
      {
        hour,
        minute,
        repeats: true,
      }
    )
  } catch (error) {
    console.error('Error scheduling daily reminder:', error)
    return null
  }
}

/**
 * Schedule drill practice reminder
 */
export async function scheduleDrillReminder(
  drillName: string,
  date: Date
): Promise<string | null> {
  const now = new Date()
  if (date <= now) return null

  return await scheduleLocalNotification(
    'Practice Due! 🎯',
    `Time to practice: ${drillName}`,
    {
      date,
    }
  )
}

/**
 * Schedule streak reminder (if user hasn't trained today)
 */
export async function scheduleStreakReminder(): Promise<string | null> {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(20, 0, 0, 0) // 8 PM

  return await scheduleLocalNotification(
    "Don't Break Your Streak! 🔥",
    "You haven't trained today. Keep your streak alive!",
    {
      date: tomorrow,
    }
  )
}

/**
 * Send immediate local notification
 */
export async function sendImmediateNotification(
  title: string,
  body: string
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // Send immediately
    })
  } catch (error) {
    console.error('Error sending immediate notification:', error)
  }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync()
  } catch (error) {
    console.error('Error getting scheduled notifications:', error)
    return []
  }
}

/**
 * Set up notification listeners
 */
export function setupNotificationListeners(
  onNotification?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) {
  // Listener for when notification is received while app is foregrounded
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received:', notification)
      if (onNotification) {
        onNotification(notification)
      }
    }
  )

  // Listener for when user taps on notification
  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('Notification response:', response)
      if (onNotificationResponse) {
        onNotificationResponse(response)
      }
    }
  )

  // Return cleanup function
  return () => {
    Notifications.removeNotificationSubscription(notificationListener)
    Notifications.removeNotificationSubscription(responseListener)
  }
}

/**
 * Check notification permissions status
 */
export async function getNotificationPermissions(): Promise<{
  granted: boolean
  canAskAgain: boolean
}> {
  try {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync()
    return {
      granted: status === 'granted',
      canAskAgain: canAskAgain ?? true,
    }
  } catch (error) {
    console.error('Error checking notification permissions:', error)
    return { granted: false, canAskAgain: true }
  }
}
