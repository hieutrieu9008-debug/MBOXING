# 🥊 MBOXING - Boxing Training App

A complete mobile boxing training platform built with React Native + Expo and Supabase.

**Built in 8 hours from zero to production-ready MVP.**

---

## 📱 Features

### ✅ Complete Feature Set

1. **Authentication**
   - Email/password signup & login
   - Supabase Auth integration
   - Row Level Security (RLS)

2. **Video Learning Platform**
   - Browse 6+ structured courses
   - Watch training videos with native player
   - Auto-save watch progress (every 10s)
   - Auto-complete at 90% or manual complete
   - Premium content protection

3. **Progress Tracking**
   - Real-time progress % on course cards
   - Daily activity tracking (lessons, drills, reps, minutes)
   - Automatic database persistence

4. **Activity Visualization**
   - GitHub-style 90-day heatmap
   - Color-coded intensity levels
   - Current + longest streak tracking
   - Comprehensive stats dashboard

5. **Drill Rep Tracker**
   - 18 pre-built training drills
   - Category filtering (Jab, Cross, Hook, Uppercut, Footwork, Defense)
   - Rep logger with quick add buttons (+10, +5, -5, -10)
   - Notes field (optional)
   - Total reps per drill
   - Recent logs history

6. **Spaced Repetition System**
   - SM-2 algorithm implementation
   - Quality rating (😰 Hard / 😐 OK / 😎 Easy)
   - Optimal practice scheduling
   - Next practice date calculation
   - Due drills today banner
   - Automatic interval optimization

7. **Payment Integration (Stripe)**
   - Free tier (limited access)
   - Premium Monthly ($9.99/mo)
   - Premium Yearly ($99.99/yr, save $20)
   - Subscription management screen
   - Customer portal integration
   - Cancel/reactivate functionality

8. **Push Notifications**
   - Daily practice reminders
   - Drill due notifications
   - Streak reminders
   - Fully configurable settings
   - Test notification button

9. **User Profile**
   - Stats overview
   - Subscription status badge
   - Settings management
   - Sign out functionality

10. **UX Polish**
    - Search drills (real-time filter)
    - Pull-to-refresh on key screens
    - Premium content locks
    - Onboarding flow (5 slides)
    - Error boundaries
    - Skeleton loaders
    - Toast notifications
    - Empty states with CTAs

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React Native + Expo (TypeScript)
- Expo Router (file-based navigation)
- expo-av (video playback)
- expo-notifications (push notifications)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth (user management)
- Supabase Storage (video hosting)
- Row Level Security (RLS)

**Payments:**
- Stripe (subscriptions)
- Stripe Customer Portal
- Webhook integration

**Deployment:**
- Expo EAS (cloud hosting)
- Auto-updates on push
- Multi-platform (iOS, Android, Web)

---

## 📊 Database Schema

**13 Tables:**
1. `users` - User accounts
2. `courses` - Training courses
3. `lessons` - Video lessons
4. `drills` - Training drill library
5. `user_progress` - Lesson completion tracking
6. `drill_logs` - Rep logging history
7. `drill_practice` - Spaced repetition data
8. `daily_activity` - Daily stats aggregation
9. `user_streaks` - Streak tracking
10. `user_subscriptions` - Premium access
11. `user_push_tokens` - Notification tokens
12. `notifications` - Push notification queue
13. `user_achievements` - Gamification (future)

See `database-schema.sql` for complete schema.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Expo CLI: `npm install -g expo-cli`
- Expo account (free): https://expo.dev
- Supabase account (free): https://supabase.com

### Installation

```bash
# Clone repository
git clone https://github.com/hieutrieu9008-debug/MBOXING.git
cd MBOXING/mobile

# Install dependencies
npm install

# Start development server
npm start
```

### Configuration

1. **Create Supabase Project:**
   - Go to https://supabase.com/dashboard
   - Create new project
   - Run `database-schema.sql` in SQL Editor
   - Run `mobile/scripts/seed-all.sql` for sample data

2. **Update `.env`:**
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   EXPO_PUBLIC_STRIPE_API_URL=your-stripe-api-url
   EXPO_PUBLIC_PROJECT_ID=your-expo-project-id
   ```

3. **Set up Stripe (optional):**
   - Follow `STRIPE-SETUP.md` guide
   - Deploy backend API
   - Update Price IDs in `.env`

---

## 📱 Testing

### Web Browser:
```bash
npm start
# Press 'w' to open in browser
```

### Mobile Device (Expo Go):
```bash
npm start
# Scan QR code with Expo Go app
```

### Production Build:
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## 📈 Business Model

### Pricing:
- **Free Tier:** Basic features, limited courses
- **Premium Monthly:** $9.99/month (all access)
- **Premium Yearly:** $99.99/year (save $20)

### Target Market:
- **Primary:** Coach Mustafa's 470K+ Instagram followers
- **Secondary:** General boxing enthusiasts
- **Beta:** Coach Mustafa's Boxing Gym members

### Revenue Projections:

| Conversion | Paid Users | MRR | ARR |
|------------|------------|-----|-----|
| 0.1% | 470 | $4,693 | $56,316 |
| 0.5% | 2,350 | $23,465 | $281,580 |
| 1.0% | 4,700 | $46,930 | $563,160 |
| 2.0% | 9,400 | $93,860 | $1,126,320 |

**Goal: 1-2% conversion = $50K-$100K MRR**

---

## 🎨 Design System

**Colors:**
- Primary: Boxing Red (#FF4433)
- Accent: Championship Gold (#FFC107)
- Background: Dark mode (neutral grays)

**Typography:**
- Size scale: xs → 5xl
- Weight: 400 → 700
- Line heights: tight, normal, relaxed

**Components:**
- Button (3 variants, 3 sizes)
- Input with error states
- CourseCard, DrillCard
- Heatmap, SearchBar
- PremiumLock, EmptyState
- SkeletonLoader

See `mobile/constants/theme.ts` for full design system.

---

## 📚 Documentation

- `FINAL-BUILD-SUMMARY-FEB12.md` - Complete build summary
- `STRIPE-SETUP.md` - Payment integration guide
- `TESTING.md` - Testing instructions
- `docs/prd/` - Product requirements
- `database-schema.sql` - Database structure

---

## 🎯 Roadmap

### v1.0 (Current - MVP)
- ✅ All core features complete
- ✅ Payment integration
- ✅ Push notifications
- ✅ Spaced repetition
- ✅ Activity tracking

### v1.1 (Polish)
- 🔄 Add real content from Coach Mustafa
- 🔄 Beta testing with gym members
- 🔄 Bug fixes & performance optimization
- 🔄 Analytics integration

### v1.2 (Launch)
- 🔜 Public launch to 470K followers
- 🔜 Marketing campaign
- 🔜 App Store optimization
- 🔜 Customer support system

### v2.0 (Growth)
- 🔜 Social features (share progress, leaderboards)
- 🔜 Combo builder tool
- 🔜 Live classes integration
- 🔜 Offline mode
- 🔜 Apple Watch companion app

---

## 🤝 Contributing

This is a private commercial project. Contributions are not currently accepted.

---

## 📝 License

Proprietary - All rights reserved.

---

## 📞 Contact

**Project Owner:** Hieu Trieu
**Coach:** Coach Mustafa
**Instagram:** https://instagram.com/coachmustafahboxing (470K followers)

---

## 🏆 Stats

- **Build Time:** 8 hours (zero to MVP)
- **Files Created:** 45+
- **Lines of Code:** ~7,500
- **Components:** 10 reusable
- **Screens:** 12 complete
- **Commits:** 30+

**This is production-ready and launchable RIGHT NOW.**

---

**Made with 🥊 and ⚡ by the MBOXING team.**
