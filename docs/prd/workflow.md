# 5-Phase Workflow (Process-First Development)

> **Philosophy**: Think → Design → Mature → Build → Evolve

---

## PHASE 1 — THINKING / BRAINSTORMING (NO BUILDING)

### What You're Doing
You are **shaping understanding**, not designing features or writing code.

### How It Works
1. Run the discovery interview in Antigravity
2. Answer questions one at a time
3. Agent creates placeholder slices

### What Gets Written
**Location**: `/docs/prd/slices/00_placeholders/`

**Contents**:
- Intent (what this represents conceptually)
- Open Questions (unknowns to resolve)
- Possible User Value (why this might exist)
- UI/Behavior/Data Placeholders (high-level descriptions, NO rules)

### Rule
**Placeholder slices are thinking containers, not commitments.**

---

## PHASE 2 — DESIGN (LOW/MEDIUM FIDELITY)

### What "Low-Fidelity" Means
- Structure, not polish
- Boxes, flows, labels
- No final colors, fonts, animations

### How It Works
1. Sketch screens in Figma
2. Export only key frames
3. Store in `/design/exports/`
4. Link in `/design/figma_links.md`

### Rule
**Figma defines appearance, not behavior.**

---

## PHASE 3 — SLICE MATURATION (STILL NO BUILDING)

### What Happens Here
When a placeholder slice starts making sense:
1. Promote it to a **spec slice**
2. Move to: `/docs/prd/slices/01_spec/`

**Spec slices contain**:
- Explicit behavior rules
- Data definitions (exact fields, types)
- Edge cases
- Boundaries (what NOT to do)

### Rule
**Behavior is locked per slice, not forever.** Slices can still evolve based on feedback.

---

## PHASE 4 — BUILD (ONE SLICE AT A TIME)

### Agent-Native Execution
1. Tell Antigravity: "Build Slice 01"
2. Agent:
   - Reads PRD + design refs
   - Plans implementation
   - Implements code
   - Verifies against spec
   - Proposes PRD fixes if needed
3. You approve
4. Commit to GitHub

### Rule
**No slice is built without a spec.**

---

## PHASE 5 — FEEDBACK LOOP (CRITICAL)

### Reality Always Wins
When building reveals:
- Missing rules
- Wrong assumptions
- Better structure

**Then**:
1. PRD is updated FIRST
2. Change is committed
3. Slice evolves
4. Agents re-read and continue

### Rule
**PRD changes precede code changes.**

---

## The Daily Loop (Simple)

```
1. Answer a discovery question
2. Update or add a placeholder slice
3. (Optional) Sketch UI in Figma
4. Promote slice when ready
5. Build slice
6. Commit truth
7. Repeat
```

---

## One-Line Summary
**Think in placeholder slices → mature them → build one slice → commit truth → repeat.**

---

## Why This Workflow Works

✅ No context loss  
✅ No bloated PRD  
✅ No premature decisions  
✅ AI never guesses  
✅ You can stop for weeks and resume cleanly  
✅ Scales from idea → production
