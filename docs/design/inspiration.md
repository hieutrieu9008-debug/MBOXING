# Design Inspiration & Research

> **Research Date**: February 3, 2026  
> **Purpose**: Study top fitness/boxing apps to inform Mustafa's Boxing design

---

## Apps Researched

1. **FightCamp** - Home Boxing Workouts
2. **Peloton** - Fitness & Workouts  
3. **Nike Training Club** - Fitness

---

## Key Design Patterns Discovered

### 1. Visual Identity & Color Schemes

#### **Dark Mode Dominance**
- **FightCamp**: Deep navy/black backgrounds with **bold red** accents
- **Peloton**: Pure black backgrounds with **white text** and subtle color highlights
- **Nike Training Club**: High-contrast black/white with **orange** accents

**Takeaway for Mboxing:**
- Use **black background** (#000000) as primary
- **Gold accents** (#D4AF37) for premium feel (championship belt)
- **Red highlights** (#DC143C) for CTAs and intensity
- **White text** (#FFFFFF) for maximum readability

---

### 2. Course/Workout Browsing Patterns

#### **Card-Based Layouts**
All three apps use **large image cards** for courses/workouts:
- **FightCamp**: Horizontal carousels with instructor photos
- **Peloton**: Mix of large hero cards + smaller grid cards
- **Nike Training Club**: Category chips at top + scrollable workout cards below

**Common Elements:**
- High-quality imagery (instructor or action shot)
- Clear title + difficulty/duration badges
- Category tags (e.g., "Boxing", "HIIT", "Beginner")
- Horizontal scrolling for collections

**Takeaway for Slice 01 (Browse Courses):**
```
[Search Bar]

[Category Chips: All | Boxing | Footwork | Defense]

[Featured Course - Large Card]
  - Full-width image
  - Course title overlay
  - "12 lessons • Beginner"

[Recent Courses - Horizontal Scroll]
[All Courses - Vertical List]
  - Thumbnail + Title + Metadata
```

---

### 3. Video Player Interface

#### **Minimalist & Focused**
- **Large video area** (80% of screen)
- **Minimal overlays** during playback
- **Progress bar** at bottom
- **Metadata below video**: Title, instructor, duration

**FightCamp Unique Feature:**
- Real-time punch count overlay (if sensors connected)

**Takeaway for Slice 02 (Watch Lesson):**
```
[Video Player - Full Width]
[< Back] [Mark Complete ✓]

[Lesson Title]
Instructor: Coach Mustafa
Duration: 8:45 | Watched: 3:20

[Related Lessons - Horizontal Scroll]
```

---

### 4. Progress Tracking & Gamification

#### **Heatmap/Streak Visualization**
- **FightCamp**: "Active Days" heatmap (GitHub-style calendar)
- **Nike Training Club**: Activity history with total workout time
- **Peloton**: Leaderboards + achievement badges

**Common Gamification Elements:**
- 🔥 **Streak counters** ("7-day streak!")
- 🏆 **Badges/Achievements** ("10k Punches", "30-Day Warrior")
- 📊 **Stats cards**: Total workouts, total time, calories

**Takeaway for Slice 08 + 10 (Drill Tracker + Heatmap):**
```
[Heatmap Grid - 7 columns x 52 rows]
  - Each cell = 1 day
  - Color intensity = reps logged
  
[Current Streak: 🔥 14 days]

[Log Reps]
  - "How many jabs today?"
  - Quick number input

[This Week Stats]
  - Total Reps: 1,250
  - Combos Practiced: 8
```

---

### 5. Typography & Hierarchy

#### **Bold, High-Contrast Type**
- **Headings**: Bold, uppercase, sans-serif (conveys strength)
- **Body**: Clean, readable sans-serif (Inter, Roboto family)
- **CTAs**: All caps, bold buttons

**Recommended Fonts for Mboxing:**
- **Headings**: Outfit Bold / Montserrat Bold
- **Body**: Inter / Roboto
- **Stats/Numbers**: Monospace (for digital feel)

---

### 6. Navigation Patterns

#### **Bottom Tab Bar (Standard)**
All apps use a **5-icon bottom navigation**:
- 🏠 **Home** (featured content)
- 🔍 **Browse** (all courses)
- 📊 **Activity** (progress tracking)
- 👤 **Profile** (settings, account)
- ➕ **Extra** (varies: Community, Shop, etc.)

**Takeaway for Mboxing:**
```
[Tab Bar at Bottom]
Home | Browse | Drills | Builder | Profile
```

---

### 7. Onboarding & Auth

#### **Minimal Friction**
- **FightCamp**: Email/password + Google/Apple sign-in
- **Peloton**: Emphasizes free trial upfront
- **Nike**: Opt-in for social features (not required)

**Best Practices:**
- ✅ Offer social login (Google, Apple)
- ✅ Show value proposition before asking for signup
- ✅ Allow guest browsing (convert later)

**Takeaway for Login Screen:**
```
[App Logo + Tagline]
"Train Like a Champion"

[Continue with Google]
[Continue with Apple]
-- or --
[Email Sign In]

[Don't have an account? Join Free]
```

---

## Design Decisions for Mustafa's Boxing

### Color Palette (Confirmed)
- **Background**: `#000000` (Black)
- **Primary**: `#D4AF37` (Championship Gold)
- **Accent**: `#DC143C` (Crimson Red)
- **Text**: `#FFFFFF` (White)
- **Muted**: `#888888` (Gray for secondary text)

### Visual Mood
- **Premium**: High-quality imagery, clean spacing
- **Intense**: Dark colors, bold type, red accents
- **Disciplined**: Structured grids, clear hierarchy
- **Motivational**: Streaks, badges, progress visuals

---

## Screenshots Captured

All reference screenshots saved to artifacts directory:

### FightCamp
- `fightcamp_appstore_overview_1770144459105.png`

![FightCamp App Store Screenshots](file:///C:/Users/hieut/.gemini/antigravity/brain/05ae4478-6dbf-423d-8181-58c250c7043c/fightcamp_appstore_overview_1770144459105.png)

### Peloton
- `peloton_appstore_overview_1770144502802.png`

![Peloton App Store Screenshots](file:///C:/Users/hieut/.gemini/antigravity/brain/05ae4478-6dbf-423d-8181-58c250c7043c/peloton_appstore_overview_1770144502802.png)

### Nike Training Club
- `nike_training_club_overview_1_1770144555664.png`
- `nike_training_club_overview_2_1770144571832.png`

![Nike Training Club Overview 1](file:///C:/Users/hieut/.gemini/antigravity/brain/05ae4478-6dbf-423d-8181-58c250c7043c/nike_training_club_overview_1_1770144555664.png)

![Nike Training Club Overview 2](file:///C:/Users/hieut/.gemini/antigravity/brain/05ae4478-6dbf-423d-8181-58c250c7043c/nike_training_club_overview_2_1770144571832.png)

---

## Next Steps

1. ✅ Research complete
2. **Generate initial mockups** for 5 MVP screens:
   - Login/Onboarding
   - Course Browse
   - Video Player
   - Drill Tracker + Heatmap
   - Combo Builder
3. Get user feedback on mockups
4. Refine designs based on feedback
5. Export final designs to `/design/exports/`
6. Update slice specs with screen references

---

**Status**: Ready to generate mockups!
