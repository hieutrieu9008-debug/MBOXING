# Slice 09 — Deep Notification System

## Intent
A comprehensive notification infrastructure to power drill reminders, re-engagement, new content alerts, and streak milestones.

## Open Questions
- Do we use push notifications, in-app notifications, or both?
- How do users control notification preferences (frequency, types)?
- Do we need email notifications too?
- What's the notification priority system (urgent vs. casual)?
- Do we track notification analytics (open rates, etc.)?

## Possible User Value
- **Habit Formation**: Daily drill reminders keep users consistent
- **Re-Engagement**: "You haven't trained in 3 days" brings users back
- **Content Discovery**: "New course: Advanced Footwork" drives engagement
- **Celebration**: "You hit a 30-day streak!" creates positive reinforcement

## UI Placeholder
(Text description only; no real UI decisions yet)
- Notification settings screen (toggle each type on/off)
- In-app notification center (list of recent notifications)
- Badge icon showing unread count
- Deep links: Tapping notification goes to specific screen (drill, course, etc.)

## Behavior Placeholder
(High-level description, not rules)
- System checks `Drill Schedules` table → Sends reminder at scheduled time
- User completes drill → System cancels today's reminder
- User misses drill → System sends gentle nudge next day
- User hits milestone → System sends celebration notification

## Data Placeholder
(Conceptual entities only)
- `Notification` (user_id, type, title, message, action_url, is_read, scheduled_for, sent_at)
- `NotificationPreference` (user_id, notification_type, is_enabled, frequency)

## Notification Types (Proposed)
1. **Drill Reminders**: "Time for your jab drills!"
2. **Streak Alerts**: "Don't break your 7-day streak!"
3. **New Content**: "New course: Counter-Punching Mastery"
4. **Milestones**: "You've completed 10 courses!"
5. **Re-Engagement**: "We miss you! Come back and train"
6. **Social**: "Someone commented on your sequence" (if we add social features)

## Notes
- This is infrastructure, not a user-facing feature
- Powers multiple slices (Drill System, Courses, Sequences)
- Critical for retention strategy
- Must respect user preferences (avoid spam)
