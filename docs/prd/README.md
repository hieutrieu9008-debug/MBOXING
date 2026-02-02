# Product Requirements Document (PRD)

This project follows a **Slice-Based PRD** structure. The goal is to define the product in vertical, independently value-providing slices rather than monolithic feature sets.

## Core Philosophy

1.  **Vertical Slices**: Every unit of work is a slice that cuts through UI, logic, and data.
2.  **Evolution**: Slices are not static. They mature from rough ideas to strict specifications.
3.  **No False Certainty**: We do not define strict behavior rules until we are ready to build.

## Slice Lifecycle

A slice moves through these phases:

1. **Placeholder** (Conceptual container)
2. **Explored** (Questions mostly answered)
3. **Build-Ready** (Fully specified rules)
4. **Implemented** (Code exists)

### Phase 0: Placeholder / Brainstorming
*Used for:* Ideas, concepts, and undefined features.
*Goal:* To ask "Why?" and "What do we not know?".
*Structure:*
- **Intent**: What this represents conceptually.
- **Questions**: Unknowns to answer before building.
- **Possible User Value**: Why this might exist.
- **Placeholders**: Rough descriptions of UI/Behavior/Data.

### Phase 1: Build-Ready Specification
*Used for:* Slices approved for implementation.
*Goal:* To give the agent/developer explicit instructions.
*Structure:*
- **Goal**: User capability.
- **User Flow**: Step-by-step actions.
- **UI Reference**: Links or paths to assets.
- **Behavior**: Explicit rules and state changes.
- **Data**: Entities and fields.
- **Edge Cases**: Failure states.

## Directory Structure

- `/docs/prd/slices/00_placeholders/`: Placeholder slices (thinking phase)
- `/docs/prd/slices/01_spec/`: Build-ready specification slices
- `/docs/prd/vision.md`: North Star, goals, constraints
- `/docs/prd/data-model.md`: Database schema (conceptual → exact)
- `/docs/prd/roadmap.md`: Milestone-based implementation plan
- `/docs/prd/workflow.md`: 5-phase development workflow
- `/design/exports/`: Figma exports (low/mid-fidelity)
- `/design/figma_links.md`: Links to live Figma files

### Slice Naming Convention
- Placeholders: `slice-XX-feature-name.md` (in `00_placeholders/`)
- Specs: `slice-XX-feature-name.md` (promoted to `01_spec/`)
