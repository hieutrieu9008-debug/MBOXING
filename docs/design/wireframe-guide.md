# Phase 2: Design Guide - Wireframing in Figma

> **Goal**: Create low-fidelity wireframes for the 5 core screens before building.

---

## Why Design First?

**Remember the 5-phase workflow:**
1. **Thinking** ✅ (Done - you have 10 placeholder slices)
2. **Design** 👈 (You are here)
3. Maturation (Turn wireframes into detailed specs)
4. Build (Code the features)
5. Feedback (Iterate based on reality)

**Designing first helps you:**
- Visualize the user experience before coding
- Catch UX issues early (cheaper to fix in Figma than in code)
- Communicate your vision clearly to developers (or AI agents)
- Avoid rebuilding screens because "it didn't feel right"

---

## What is "Low-Fidelity"?

**Low-fidelity wireframes are:**
- ✅ Boxes, buttons, text labels
- ✅ Basic layout and flow
- ✅ Black, white, and gray
- ❌ NO final colors, fonts, or images yet
- ❌ NO pixel-perfect polish

**Think of it like:** A blueprint for a house, not the finished interior design.

---

## The 5 Key Screens to Wireframe

Based on your PRD, these are the **must-have screens for MVP**:

### 1. **Login / Onboarding** (Foundation)
- Email/password fields
- "Sign in with Google" button (optional)
- "Create Account" link
- Simple branding (app name + logo)

### 2. **Course Browse** (Slice 01 - Core Value)
- List of courses (tiles or cards)
- Course thumbnail, title, difficulty
- Search bar
- Filter by: Free vs. Premium
- Bottom navigation bar

### 3. **Video Player** (Slice 02 - Core Value)
- Video playback area
- Play/pause, scrubber
- "Mark as Complete" button
- Related videos (optional)
- Progress indicator

### 4. **Drill Tracker / Heatmap** (Slice 08 + 10 - Retention)
- Daily heatmap (GitHub-style grid)
- "Log Reps" button
- Input: How many jabs did you do?
- Streak counter: "7-day streak 🔥"
- Weekly stats

### 5. **Combo Builder** (Slice 05 - Differentiation)
- Canvas area (blank space)
- Drag-and-drop nodes (Jab, Cross, Slip, etc.)
- Connect nodes with arrows
- "Save Sequence" button
- Preview animation (optional for v1)

---

## Step-by-Step Figma Setup

### Step 1: Create a Figma Account

1. Go to: https://www.figma.com/signup
2. Sign up (use Google for convenience)
3. Create a **free account** (no credit card needed)

### Step 2: Create a New Design File

1. Click **"New Design File"**
2. Rename it: **"Mustafa's Boxing - Wireframes"**
3. Set the frame size: **iPhone 14 Pro** (393 x 852)
   - Press `F` to create a frame
   - Choose "Phone" → "iPhone 14 Pro"

### Step 3: Start with Login Screen

**Use these Figma shortcuts:**
- `R` = Rectangle
- `T` = Text
- `V` = Move tool (select and drag)
- Hold `Shift` while dragging = keep proportions

**Wireframe elements:**
- App logo (placeholder rectangle at top)
- Email input field (rectangle + "Email" text)
- Password input field (rectangle + "Password" text)
- "Sign In" button (rectangle with rounded corners)
- "Don't have an account? Sign up" (small text at bottom)

**Tip:** Use **Auto Layout** (Shift + A) to make elements stack vertically with spacing.

### Step 4: Duplicate for Other Screens

1. Select your Login frame
2. Press `Cmd + D` (Mac) or `Ctrl + D` (Windows) to duplicate
3. Rename the new frame: "Course Browse"
4. Clear the content and wireframe the Course Browse screen
5. Repeat for all 5 screens

---

## Design Principles for Mustafa's Boxing

### Color Palette (For Later - Phase 3)
- **Primary**: Gold (#D4AF37) - "Championship belt"
- **Background**: Black (#000000) - "Boxing ring darkness"
- **Text**: White (#FFFFFF) - "Clean, high-contrast"
- **Accent**: Red (#DC143C) - "Discipline, intensity"

### Typography (For Later)
- **Headings**: Bold, sans-serif (e.g., Outfit, Montserrat)
- **Body**: Clean, readable (e.g., Inter, Roboto)

### Mood
- **Premium**: Not cheap or basic
- **Intense**: Like a training camp
- **Disciplined**: Structured, organized
- **Motivating**: "You got this" energy

**For now (wireframes):** Just use Figma's default font and gray boxes!

---

## Time Estimate

- **30-45 minutes per screen** (if new to Figma)
- **Total: 2-4 hours** for all 5 screens

**Don't aim for perfection!** Wireframes are meant to be rough.

---

## Next Steps After Wireframes

1. **Export your wireframes** as PNG files
2. **Save them** to `/design/exports/`
3. **Update** `/design/figma_links.md` with the Figma file link
4. **Move to Phase 3**: Pick one slice (e.g., Slice 01: Browse Courses)
5. **Promote it to Build-Ready Spec** (add wireframe, exact behavior rules, data schema)

---

## Need Help?

**Figma Tutorials:**
- Official Beginner Guide: https://help.figma.com/hc/en-us/articles/360040450233
- YouTube: "Figma Tutorial for Beginners" (15 mins)

**Questions?**
- "I'm stuck on X in Figma" → I can guide you
- "Should this screen have X?" → Let's discuss based on your PRD
- "Is this wireframe good enough?" → Show me (screenshot) and I'll give feedback

---

**Status**: Ready to start wireframing! Open Figma and create your first screen (Login).
