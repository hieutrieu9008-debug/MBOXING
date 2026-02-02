# Slice 05 — Combo Sequence Builder (Graph Tool)

## Intent
Allow boxers to visualize fight sequences as a node-based decision tree. This is the "graph builder" feature mentioned in initial brainstorming, now with specific boxing context.

## Open Questions
- Do we use React Flow or a custom canvas library?
- Can users save and share their sequences?
- Is this connected to course content or standalone?
- Do we need pre-built templates (e.g., "Counter to Jab-Cross")?

## Possible User Value
- **Tactical Visualization**: Helps fighters understand "if opponent does X, I do Y" logic
- **Study Tool**: Complements Coach Mustafa's "Film Study" approach
- **Personalization**: Each fighter can build their own response playbook

## UI Placeholder
(Text description only; no real UI decisions yet)
- Full-screen canvas with draggable nodes
- Each node represents a move (Jab, Cross, Slip, etc.)
- Arrows connect nodes to show sequences
- Toolbar: "Add Move", "Save Sequence", "Share"

## Behavior Placeholder
(High-level description, not rules)
- User taps "Add Move" → Selects from list (Jab, Cross, Hook, etc.) → Node appears
- User drags node to position
- User connects nodes with arrows to show "if/then" logic
- System saves sequence to user profile

## Data Placeholder
(Conceptual entities only)
- `Sequence` (id, user_id, name, is_public)
- `Node` (id, sequence_id, move_type, x_position, y_position)
- `Edge` (id, source_node_id, target_node_id, condition)

## Notes
- This aligns perfectly with Coach Mustafa's analytical teaching style
- Start simple: just nodes and arrows, no complex logic yet
- Future: Could link to specific drill videos

### Performance Optimization Path (If Needed)
- **Phase 1-2**: Build with React Native (`react-native-svg` + Gesture Handler)
- **Phase 3**: If canvas performance is insufficient, rebuild as **native module** (Swift/Kotlin)
- **Integration**: Native module communicates with React Native via:
  - Shared Supabase database (Sequences, Nodes, Edges tables)
  - Event bridge (onSequenceSaved, onNodeTapped callbacks)
  - Props (userId, initialSequence data)
- **Benefit**: Keeps app unified while optimizing the one feature that needs it
