# Session Startup Automation

## When to Use This

**Trigger**: Every time you start a **new chat session** with Antigravity.

*Beginner Context:*
- **New Chat Session** = When you close and reopen the Antigravity app/window
- **NOT** every single message you send
- **NOT** every time you switch files in your editor

Think of it like "logging in" - you only need to do it once per session to restore my memory.

## Solution: Auto-Restore Script

Create a file called `START_SESSION.md` in your project root. Every time you open Antigravity, **paste this into the chat**:

```
Read START_SESSION.md and execute the startup sequence
```

### What Goes in START_SESSION.md

```markdown
# Antigravity Session Startup Sequence

## Step 1: Context Restore
Read these files in order:
1. task.md (current work status)
2. docs/prd/vision.md (product goals)
3. docs/workflows/agent-system.md (agent roles)

## Step 2: Determine Current Phase
Check task.md to see which task is marked [/] (in progress).

## Step 3: Auto-Select Agent Mode
Based on the current task:
- If task involves "Design" or "Plan" → Switch to **Architect Agent**
- If task involves "Build" or "Code" → Switch to **Builder Agent**
- If task involves "Test" or "Verify" → Switch to **Reviewer Agent**
- If task involves "Optimize" → Switch to **Optimizer Agent**

## Step 4: Execute Agent Checklist
Follow the checklist for the selected agent before asking me what to do next.

## Step 5: Report Status
Tell me:
- Which agent mode you're in
- What task you're working on
- What you're about to do next
```

---

## Even Simpler Option (Beginner-Friendly)

Just add this to the **top of task.md**:

```markdown
> **STARTUP COMMAND**: "Read task.md, vision.md, agent-system.md. Switch to [Agent] mode based on current [/] task."
```

Then you just copy-paste that one line each session.

---

## Future Automation (Advanced)

Once we have a GitHub repo, we can create a **GitHub Action** that:
- Runs when you open a PR
- Auto-comments with the agent checklist
- Forces you to check off items before merging

But that's Phase 2. For now, the `START_SESSION.md` trick works perfectly.
