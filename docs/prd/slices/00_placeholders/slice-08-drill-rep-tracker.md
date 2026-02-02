# Slice 08 — Drill Rep Tracker (Workout Logger)

## Intent
A workout-style logging system where users can record how many reps they completed for each drill. This powers the "neuro-path building" feature by tracking practice volume over time.

## Open Questions
- Do users manually enter reps or does the app auto-detect (via video)?
- Do we show historical graphs (e.g., "You did 500 jabs this week")?
- Can users set rep goals (e.g., "100 jabs per day")?
- Do we integrate with Apple Health / Google Fit?

## Possible User Value
- **Accountability**: Concrete proof of practice volume
- **Progress Visualization**: See improvement over weeks/months
- **Neuro-Path Building**: Reinforces the "discipline over motivation" philosophy
- **Gamification**: Unlock badges for hitting rep milestones

## UI Placeholder
(Text description only; no real UI decisions yet)
- After completing a drill, user sees "Log Your Reps" screen
- Simple number input: "How many jabs did you do?"
- Optional notes field: "How did it feel?"
- "Save" button → Updates streak and progress

## Behavior Placeholder
(High-level description, not rules)
- User finishes drill video → App prompts "Log your reps?"
- User enters number → System saves to `Drill Sessions` table
- System updates weekly/monthly totals
- If user hits a milestone (e.g., 1000 total jabs), show celebration animation

## Data Placeholder
(Conceptual entities only)
- `DrillSession` (user_id, drill_id, reps_completed, duration, notes, completed_at)
- `RepMilestone` (user_id, drill_id, total_reps, milestone_level)

## Notes
- This is the "tracking" half of the spaced repetition system
- Slice 07 (Spaced Repetition) handles reminders, this handles logging
- Together they create the full "Duolingo for boxing" experience
