# Implementation Roadmap (Milestone-Based)

> **Philosophy**: Progress by milestones, not arbitrary deadlines.

---

## Milestone 0: Foundation

### Goal
Runnable app with authentication and basic navigation.

### Success Criteria
- [ ] User can sign up with email/password
- [ ] User can log in and see main navigation
- [ ] Subscription tier system works (free vs. premium check)
- [ ] Payment integration functional (RevenueCat + Stripe)
- [ ] App runs on physical iOS and Android devices

### Dependencies
- Decide: React Native vs. Flutter
- Set up Supabase project
- Configure RevenueCat

---

## Milestone 1: Core Value Delivery

### Goal
Users can browse courses, watch videos, and track progress.

### Slices Implemented
- Slice 01: Browse Courses
- Slice 02: Watch Lesson
- Slice 03: Save Progress

### Success Criteria
- [ ] Free users can browse all courses and watch free content
- [ ] Premium users can access all premium courses
- [ ] Video player works smoothly (chosen hosting platform)
- [ ] Progress tracking persists (checkmarks, progress bars)
- [ ] Paywall correctly blocks free users from premium content

### Dependencies
- Milestone 0 complete
- Video hosting platform finalized (Vimeo/Mux)
- Coach Mustafa's videos uploaded and tagged

---

## Milestone 2: Retention Engine

### Goal
Daily engagement through drill reminders and habit tracking.

### Slices Implemented
- Slice 07: Spaced Repetition Drill System
- Slice 08: Drill Rep Tracker
- Slice 09: Deep Notification System
- Slice 10: Daily Heatmap

### Success Criteria
- [ ] Users can schedule drill reminders
- [ ] Push notifications work on iOS and Android
- [ ] Users can log reps after completing drills
- [ ] Streak system functions (increments, resets, displays)
- [ ] Heatmap visualizes consistency (color intensity based on activity)
- [ ] Weekly/monthly stats dashboard shows progress

### Dependencies
- Milestone 1 complete
- Push notification infrastructure set up
- Drill library created and uploaded

---

## Milestone 3: Differentiation Features

### Goal
Unique features that set the app apart from competitors.

### Slices Implemented
- Slice 05: Combo Sequence Builder
- Slice 06: Smart Video Recommendations

### Success Criteria
- [ ] Users can create fight sequences on node-based canvas
- [ ] Sequences can be saved and loaded
- [ ] Smart recommendation engine suggests videos based on user input
- [ ] Video tagging system complete (manual or AI-assisted)
- [ ] Users can share sequences (if social features added later)

### Dependencies
- Milestone 2 complete
- Canvas library chosen (React Flow or Flutter equivalent)
- Video tagging infrastructure in place

---

## Milestone 4: Launch & Scale

### Goal
Polished product ready for public release and growth.

### Success Criteria
- [ ] All critical bugs fixed
- [ ] Performance optimized (video load times, app responsiveness)
- [ ] Promotional website live (Next.js landing page)
- [ ] Analytics tracking implemented (user behavior, retention)
- [ ] Content management system for Coach Mustafa (upload new videos)
- [ ] App Store and Google Play listings live
- [ ] Marketing materials ready

### Dependencies
- Milestone 3 complete
- User testing completed
- App Store review process initiated

---

## Milestone Dependencies Graph

```
M0 (Foundation)
  ↓
M1 (Core Value) ← Must have auth, subscriptions, video hosting
  ↓
M2 (Retention) ← Can start parallel to M1 end (different data models)
  ↓
M3 (Differentiation) ← Requires content library + user base
  ↓
M4 (Launch) ← Polish, optimize, market
```

---

## Notes

- **No Fixed Timelines**: Progress measured by completion, not calendar dates
- **Iteration at Each Milestone**: User testing and feedback refine next milestone
- **Slice Evolution**: Slices mature from Placeholder → Spec as we enter each milestone
- **Reality Wins**: If a milestone reveals wrong assumptions, we update the PRD and adjust
- **Current Status**: Phase 1 (Thinking/Brainstorming) - All slices are in `00_placeholders/`
