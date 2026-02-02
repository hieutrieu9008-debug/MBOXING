# Slice 06 — Smart Video Recommendations

## Intent
Help users find the most relevant training videos based on their specific needs (upcoming fight, weakness, sparring prep).

## Open Questions
- How do users input their needs? (Form, chat, tags?)
- Do we use AI/ML for recommendations or rule-based matching?
- How do we tag Coach Mustafa's existing videos?
- Is this a search feature or a "quiz" that suggests videos?

## Possible User Value
- **Personalized Learning**: No more scrolling through 100+ videos
- **Fight Prep**: "I'm fighting a southpaw next week" → Get relevant videos
- **Weakness Targeting**: "I get hit by overhand rights" → Get defense drills

## UI Placeholder
(Text description only; no real UI decisions yet)
- Input screen: "What are you working on?" (text or dropdown)
- Options: "Upcoming fight", "Specific weakness", "General improvement"
- System shows 3-5 recommended videos with explanation

## Behavior Placeholder
(High-level description, not rules)
- User selects "I'm fighting a southpaw"
- System filters videos tagged with "southpaw", "stance switching", "angles"
- User sees curated list with "Why this video?" explanations

## Data Placeholder
(Conceptual entities only)
- `Video` (id, title, tags, difficulty_level)
- `Tag` (id, name, category)
- `Recommendation` (user_id, video_id, reason, timestamp)

## Notes
- Could start with manual tagging (Coach Mustafa tags his own videos)
- Future: AI analyzes video transcripts for auto-tagging
- Aligns with "Content Recycling" goal (same videos, multiple access points)
