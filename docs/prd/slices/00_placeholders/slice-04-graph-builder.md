# Slice 04 — Graph Builder v0

## Intent
A minimal version of the node-based tool to prove the concept without building a full engine.

## Questions
- What library are we using for the canvas (React Flow, custom)?
- What is the simplest "node" we can create?
- Can users save their graphs in v1?
- Is this connected to courses or a standalone sandbox?

## Possible User Value
- Differentiator feature. Allows valid "active learning" or "structuring" of thoughts.
- Engaging, tactile UI.

## UI Placeholder
(Text description only; no real UI decisions yet)
- Full-screen canvas area.
- Floating toolbar with "Add Node" button.
- Nodes are draggable boxes with text.

## Behavior Placeholder
(High-level description, not rules)
- User clicks "Add Node" -> Node appears on canvas -> User drags node to new position.

## Data Placeholder
(Conceptual entities only)
- `Graph` (id, user_id, name)
- `Node` (id, graph_id, x_position, y_position, content)
- `Edge` (id, source_node_id, target_node_id)

## Notes
- Do NOT build complex logic yet. Just dragging and dropping text boxes is enough for v0.
