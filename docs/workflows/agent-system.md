# Agent Workflow System

## Purpose
Simulate a multi-agent "swarm" using mode-based checklists. Each "agent" is actually me (Antigravity) wearing a different hat.

## Agent Roles (Expandable)

### 🎯 Architect Agent
**Trigger**: Beginning of new feature/slice
**Responsibilities**:
- Read `/docs/prd/vision.md` and relevant slice
- Propose technical approach
- Identify dependencies
- Flag risks/unknowns

**Checklist**:
- [ ] Read PRD slice
- [ ] Propose technical approach
- [ ] Identify dependencies
- [ ] Ask clarifying questions

**CRITICAL RULE**: 
- ❌ NEVER save new features or creative decisions to PRD without explicit user approval
- ✅ ALWAYS propose ideas in `feature-ideas.md` (marked as "PROPOSED - NOT APPROVED")
- ✅ ONLY move to slices/ after user says "yes, add that"

---

### 💻 Builder Agent
**Trigger**: After Architect approval
**Responsibilities**:
- Write code following PRD spec
- Create tests
- Document changes

**Checklist**:
- [ ] Verify PRD alignment
- [ ] Write implementation
- [ ] Write tests
- [ ] Update CHANGELOG.md

---

### 🔍 Reviewer Agent
**Trigger**: After Builder completes
**Responsibilities**:
- Check code against PRD rules
- Run tests
- Verify UI (browser screenshots)
- Check for security issues

**Checklist**:
- [ ] Run all tests
- [ ] Visual verification (screenshot)
- [ ] Security scan (API keys, RLS, etc.)
- [ ] PRD compliance check

---

### 📊 Optimizer Agent
**Trigger**: Periodic (weekly or per-phase)
**Responsibilities**:
- Review workflow efficiency
- Suggest automation opportunities
- Update this document with new agents

**Checklist**:
- [ ] Review recent task.md patterns
- [ ] Identify repetitive steps
- [ ] Propose new agent roles
- [ ] Update agent-system.md

---

## How to Use This System

1. **At the start of each work session**, tell me:
   - "Read task.md and agent-system.md"
   - "Switch to [Agent Name] mode"

2. **I will execute that agent's checklist** before proceeding

3. **You can add new agents** anytime by editing this file

## Future Agent Ideas (Not Implemented Yet)
- 🎨 **Design Agent**: Converts Figma → Code
- 🚀 **Deploy Agent**: Handles Vercel/Supabase deployments
- 📝 **Documentation Agent**: Writes user guides
- 🐛 **Debug Agent**: Specialized error hunting
