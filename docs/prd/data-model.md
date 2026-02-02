# Data Model (Schema-First Design)

> **Status**: Phase 0 (Conceptual)
> This will evolve into exact SQL/database schema once we finalize requirements.

## Core Entities (Confirmed)

### 1. Users
**Purpose**: Track user accounts and subscription status

**Key Fields** (Conceptual):
- id
- email
- password_hash
- subscription_tier (free, premium)
- created_at
- profile_data (name, skill_level, goals)

---

### 2. Courses
**Purpose**: Group related lessons into structured learning paths

**Key Fields** (Conceptual):
- id
- title
- description
- thumbnail_url
- difficulty_level (beginner, intermediate, advanced)
- is_premium (boolean - true if requires subscription)

**Important Note**: 
- Courses are NOT sold individually in v1
- All premium courses unlocked with subscription
- "is_premium" flag controls free vs. paid access

---

### 3. Lessons (Videos)
**Purpose**: Individual video content within courses

**Key Fields** (Conceptual):
- id
- course_id (foreign key)
- title
- video_url
- duration
- order_index (position in course)
- transcript (optional, for search)

---

### 4. User Progress
**Purpose**: Track which lessons users have completed

**Key Fields** (Conceptual):
- id
- user_id (foreign key)
- lesson_id (foreign key)
- status (not_started, in_progress, completed)
- last_watched_timestamp
- completed_at

---

### 5. Drills
**Purpose**: Standalone practice exercises (for spaced repetition system)

**Key Fields** (Conceptual):
- id
- name
- description
- video_url (demonstration)
- duration
- difficulty_level
- target_reps (e.g., "100 jabs")
- is_premium

---

### 6. Drill Sessions (NEW - Workout Tracker)
**Purpose**: Track individual drill practice sessions (like a workout log)

**Key Fields** (Conceptual):
- id
- user_id (foreign key)
- drill_id (foreign key)
- reps_completed
- duration_minutes
- notes (user's self-assessment)
- completed_at

**Why This Matters**:
- Allows users to log "I did 50 jabs today"
- Tracks progress over time (neuro-path building)
- Powers streak system

---

### 7. Drill Schedules
**Purpose**: User's personalized drill reminder schedule

**Key Fields** (Conceptual):
- id
- user_id (foreign key)
- drill_id (foreign key)
- frequency (daily, weekly, custom)
- next_due_date
- reminder_time (e.g., "9:00 AM")

---

### 8. Sequences (Combo Builder)
**Purpose**: User-created fight sequences (node-based)

**Key Fields** (Conceptual):
- id
- user_id (foreign key)
- name
- description
- is_public (can others see it?)
- created_at

---

### 9. Sequence Nodes
**Purpose**: Individual moves in a sequence

**Key Fields** (Conceptual):
- id
- sequence_id (foreign key)
- move_type (jab, cross, slip, etc.)
- x_position (canvas position)
- y_position (canvas position)
- order_index

---

### 10. Sequence Edges
**Purpose**: Connections between nodes (the "if/then" logic)

**Key Fields** (Conceptual):
- id
- sequence_id (foreign key)
- source_node_id (foreign key)
- target_node_id (foreign key)
- condition (optional - e.g., "if opponent blocks")

---

### 11. Subscriptions
**Purpose**: Payment and billing management

**Key Fields** (Conceptual):
- id
- user_id (foreign key)
- plan_type (monthly, annual)
- status (active, canceled, past_due)
- current_period_start
- current_period_end
- stripe_subscription_id (or payment provider ID)

---

### 12. Notifications (NEW - Deep Notification System)
**Purpose**: Track all app notifications (drill reminders, new content, etc.)

**Key Fields** (Conceptual):
- id
- user_id (foreign key)
- type (drill_reminder, new_course, streak_milestone, etc.)
- title
- message
- action_url (deep link to specific screen)
- is_read
- scheduled_for (when to send)
- sent_at

**Why This Matters**:
- Powers drill reminders
- Re-engagement notifications ("You haven't trained in 3 days")
- New content alerts
- Streak milestones

---

## Relationships Summary

```
Users
  ├─ has many → User Progress
  ├─ has many → Drill Sessions
  ├─ has many → Drill Schedules
  ├─ has many → Sequences
  ├─ has many → Notifications
  └─ has one → Subscription

Courses
  └─ has many → Lessons

Drills
  ├─ has many → Drill Sessions
  └─ has many → Drill Schedules

Sequences
  ├─ has many → Sequence Nodes
  └─ has many → Sequence Edges
```

---

## Next Steps

1. Finalize field names and types (string, integer, timestamp, etc.)
2. Decide on database (Supabase PostgreSQL recommended for React Native)
3. Create migration scripts
4. Set up Row-Level Security (RLS) policies
