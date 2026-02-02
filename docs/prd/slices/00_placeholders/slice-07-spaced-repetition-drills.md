# Slice 07 — Spaced Repetition Drill System (Neuro-Path Builder)

## Intent
A Duolingo-style system to help fighters build and maintain muscle memory through scheduled drill reminders.

## Open Questions
- How do we schedule drills? (Daily, weekly, custom?)
- Do users self-report completion or do we track it automatically?
- What's the "streak" mechanic? (Like Duolingo's flame icon?)
- Do drills come from course content or are they standalone?

## Possible User Value
- **Habit Formation**: Turns "I should practice" into "I must practice"
- **Neuro-Path Maintenance**: Prevents skill decay between training sessions
- **Gamification**: Streaks and progress tracking increase engagement

## UI Placeholder
(Text description only; no real UI decisions yet)
- Home screen widget: "Today's Drill: 3-Minute Jab-Cross Combo"
- Notification: "Don't break your 7-day streak!"
- Progress tracker: Visual calendar showing completed drills

## Behavior Placeholder
(High-level description, not rules)
- User sets drill schedule (e.g., "Footwork drills every Monday/Wednesday")
- App sends push notification at scheduled time
- User marks drill as complete → Streak increments
- If user misses 2 days → Streak resets, gentle reminder sent

## Data Placeholder
(Conceptual entities only)
- `Drill` (id, name, video_url, duration, difficulty)
- `UserDrillSchedule` (user_id, drill_id, frequency, next_due_date)
- `DrillCompletion` (user_id, drill_id, completed_at)
- `Streak` (user_id, current_streak, longest_streak)

## Notes
- This is the "retention engine" - keeps users coming back daily
- Aligns with Coach Mustafa's "Discipline over Motivation" philosophy
- Start simple: just reminders and manual check-ins
- Future: Video verification (user records themselves doing the drill)
