# Slice 02 — Watch Lesson

## Intent
The core consumption experience where users actually learn. This handles the video player and associated content display.

## Questions
- What video host are we using (YouTube embed, Mux, custom)?
- Does the player need autoplay or playback speed controls in v1?
- How do we handle completion state (auto-mark complete vs. manual button)?
- Is there text/notes below the video?

## Possible User Value
- The primary value delivery mechanism of the "course" aspect.
- Frictionless playback encourages longer sessions.

## UI Placeholder
(Text description only; no real UI decisions yet)
- Video player area (top).
- Lesson title and description (below).
- "Next Lesson" button.

## Behavior Placeholder
(High-level description, not rules)
- User enters lesson screen -> Video loads -> User presses play -> Video finishes -> System updates progress.

## Data Placeholder
(Conceptual entities only)
- `Lesson` (id, course_id, video_url, duration, transcript)
- `Progress` (user_id, lesson_id, status)

## Notes
- Focus on a stable player first. Fancy controls can come later.
