# Product Vision

## North Star
**A dedicated platform for a boxing coach to monetize their expertise through structured, premium video content.**

## Core Problem
The coach has valuable content but needs a centralized, monetizable structure (courses) rather than scattering free content on social media.

## Target Audience
- **Primary**: Boxing students and enthusiasts looking for structured training.
- **Goal**: To learn boxing techniques systematically.
- **Coach Profile**: Mustafa Meekins (@mustafasboxing)
  - 470K+ Instagram followers
  - Teaching Style: "Old School" fundamentals + Film Study analysis
  - Philosophy: "Discipline beats motivation" (Mamba Mentality)
  - Focus: Movement, defense, tactical sequences ("if/then" responses)

## Monetization Model
- **Primary**: Monthly subscription ($X/month for all premium content)
- **Secondary**: One-time purchases (future feature for specific courses/products)
- **Model**: Hybrid (Free tier + Premium tier)
  - **Free Tier**: Access to some videos, limited features
  - **Premium Tier**: Full video library, advanced features (Combo Builder, Drill System, etc.)
  - **Database Design**: Requires "tier" field, not just "is_subscribed" boolean

## Retention Strategy
- **Content Recycling**: Course content will be repurposed into multiple formats/features
- **Goal**: Keep users engaged beyond just watching videos

## Platform & Tech Stack

### Primary Platform
- **Mobile Framework**: React Native (with Expo)
- **Language**: TypeScript
- **Why**: Easier hiring, better third-party integrations, faster MVP

### Future Optimization Path
- **Combo Builder (Slice 05)**: If performance optimization is needed in Phase 3, this feature can be rebuilt as a **native module** (Swift/Kotlin) while keeping the rest of the app in React Native
- **Integration**: Native modules communicate with React Native via shared database (Supabase) and event bridges
- **Decision Point**: Milestone 3 (after user testing of React Native version)

### Secondary Platform
- **Promotional Website** (Web)
  - Next.js (SEO-friendly landing page)

### Video Hosting (To Be Decided)
- **Constraint**: NOT YouTube (no ads)
- **Scale Target**: Must support 10k-100k+ paying users
- **Options**: Vimeo Enterprise, Mux, or AWS CloudFront
- **Decision Pending**: will evaluate based on scalability vs. ease of use

### Payment Infrastructure
- **Provider**: RevenueCat
- **Why**: Handles cross-platform subscriptions (iOS/Android/Stripe) easily

## Quality Standards

### Version 1 Target: "Polished & Professional"
- **Timeline**: 4-5 months to launch
- **Quality Bar**: Zero known bugs, smooth animations, premium feel
- **Brand Alignment**: Matches Coach Mustafa's "high-level" and "discipline" brand
- **Ultimate Goal**: Apple-level perfection (future versions)

### What This Means
- ✅ Professional UI/UX (not just "clean enough")
- ✅ Smooth video playback
- ✅ Reliable streak/notification system
- ✅ Thorough testing before each phase
- ❌ NOT "move fast and break things"

---

## Success Metrics (To be defined)
- [ ] Monthly recurring revenue (MRR)
- [ ] Subscriber retention rate
- [ ] Lesson completion rates
- [ ] Feature engagement (beyond courses)

---

## Constraints & Boundaries
- **No Community Features (v1)**: No forums, social feeds, or direct user-to-user messaging. Focus is on *individual* training and discipline.
- **Video Hosting**: NOT YouTube.
- **Approvals**: ALL new features require explicit user approval before adding to PRD.
