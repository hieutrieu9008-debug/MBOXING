# Slice 10 — Daily Knowledge Heatmap

## Intent
A visual "consistency tracker" (similar to GitHub's contribution graph) that shows user activity intensity per day. It visualizes "neuro-path building" efforts.

## Open Questions
- What counts as "activity"? (Watching videos, finishing drills, logging reps?)
- Does the heatmap reset monthly or show a rolling year?
- Is it purely visual or interactive (tap a square to see what I did)?
- How does this interact with the "Streak" system?

## Possible User Value
- **Visual Motivation**: "Don't break the chain" effect.
- **Consumption Patterning**: Users can see if they are "binging" vs. "consistently learning".
- **Gamification**: Darker squares = more training = "Work Ethic" badge.

## UI Placeholder
(Text description)
- A grid of small squares (Days x Weeks).
- Color intensity scales with activity count.
- Legend: "Rest Day" (Gray) → "Light Work" (Light Green) → "Heavy Bag Work" (Dark Green).
- Header: "Consistency Score" or "Discipline Index".

## Behavior Placeholder
(High-level)
- User watches video OR logs drill reps → System calculates "Activity Points".
- Points > Threshold → Update today's square color.
- Data persists historically to show long-term discipline.

## Data Placeholder
(Conceptual)
- `UserActivityLog` (user_id, date, points_earned, activity_type)
- `HeatmapConfig` (point_thresholds, color_theme)

## Notes
- "Consumption info better" means incentivizing *consistent* daily intake rather than binging one day a month.
- Great fit for the "Discipline" brand.
