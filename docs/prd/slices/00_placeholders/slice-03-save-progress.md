# Slice 03 — Save Progress

## Intent
To persist the user's learning state so they don't lose their place.

## Questions
- When do we save? (On complete? Continuously during playback?)
- Do we track exact timestamp or just "completed" status?
- How do we handle offline vs. online sync?

## Possible User Value
- Essential for long courses; users rarely finish in one sitting.
- Provides a sense of accomplishment (visual progress bars).

## UI Placeholder
(Text description only; no real UI decisions yet)
- Visual indicators on the course list (e.g., checkmarks or progress bars).
- "Mark as Complete" button on the lesson page.

## Behavior Placeholder
(High-level description, not rules)
- User finishes lesson -> App saves `is_completed=true` to DB -> UI updates progress bar.

## Data Placeholder
(Conceptual entities only)
- `UserMethod` (user_id, course_id, percent_complete)
- `LessonCompletion` (user_id, lesson_id, timestamp)

## Notes
- Start with explicit "Mark Complete" button to avoid complex video event tracking issues in v1.
