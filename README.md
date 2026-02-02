# Mustafa's Boxing - Product Requirements Document

## Current Phase
**Phase 1: Thinking/Brainstorming** ✅ COMPLETE

This repository contains the Product Requirements Document (PRD) for Mustafa's Boxing mobile app using a slice-based, milestone-driven approach.

---

## Project Vision

A premium boxing training app for Coach Mustafa Meekins (@mustafasboxing) featuring:
- Structured video courses
- Spaced repetition drill system (Duolingo for boxing)
- Combo sequence builder (node-based fight visualizer)
- Daily consistency heatmap

**Target**: 10k-100k paying users  
**Monetization**: Hybrid (Free tier + Premium subscription)  
**Quality Standard**: Polished & Professional

---

## Tech Stack

- **Mobile**: React Native (TypeScript) with Expo
- **Backend**: Supabase (PostgreSQL + Auth)
- **Payments**: RevenueCat
- **Video Hosting**: TBD (Vimeo/Mux - not YouTube)
- **Landing Page**: Next.js

---

## Repository Structure

```
/docs/prd/              # Product Requirements
├── README.md           # Slice philosophy
├── vision.md           # Goals, constraints
├── data-model.md       # Database schema
├── roadmap.md          # Milestone-based plan
├── workflow.md         # 5-phase process
└── slices/
    ├── 00_placeholders/  # 10 placeholder slices
    └── 01_spec/          # Build-ready specs (empty for now)

/docs/workflows/        # Agent workflows & automation
/design/                # Figma exports & links
```

---

## Current Status

### ✅ Completed (Phase 1)
- Discovery interview (12 questions)
- 10 placeholder slices defined
- Data model (12 entities)
- 4-milestone roadmap
- Framework decision (React Native)

### 📋 Next Steps
- Set up development environment
- Create Figma wireframes (Phase 2)
- Promote slices to specs (Phase 3)
- Begin Milestone 0 build (Phase 4)

---

## Quick Links

- [Vision & Goals](docs/prd/vision.md)
- [5-Phase Workflow](docs/prd/workflow.md)
- [Milestone Roadmap](docs/prd/roadmap.md)
- [Data Model](docs/prd/data-model.md)
- [Task Checklist](task.md)

---

## How to Use This PRD

This is an **AI-native PRD** designed for collaboration with coding agents (Antigravity, Cursor, etc.).

**Workflow**:
1. **Think** → Create placeholder slices
2. **Design** → Add Figma wireframes
3. **Mature** → Promote slices to specs
4. **Build** → Implement one slice at a time
5. **Evolve** → Update PRD based on reality

**Key Principle**: PRD changes precede code changes.

---

**Coach**: Mustafa Meekins  
**Developer**: [Your Name]  
**Started**: February 2026
