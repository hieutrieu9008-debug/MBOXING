# Slice 01 — Browse Courses

## Intent
To provide users with a catalog of available courses so they can discover and select content to learn.

## Questions
- How should courses be categorized or filtered?
- Do we need a search bar for this first version?
- What metadata (author, duration, difficulty) is essential for the list view?
- Is there a "featured" or "recommended" section?

## Possible User Value
- Core entry point for the learning experience.
- Allows users to gauge the depth and variety of content available.

## UI Placeholder
(Text description only; no real UI decisions yet)
- A grid or list view of course cards.
- Each card shows a thumbnail, title, and valid metadata.
- Clicking a card navigates to the Course Detail view.

## Behavior Placeholder
(High-level description, not rules)
- User opens app -> Lands on Browse screen -> Scrolls through list -> Taps a course -> Navigates to detail.

## Data Placeholder
(Conceptual entities only)
- `Course` (id, title, description, thumbnail_url, category)
- `Category` (id, name)

## Notes
- Keep it simple for v1. No complex filtering algorithms yet.
