# dojo.md - AI Agent Training University

## 📋 Overview

**Project:** dojo.md — University for AI agents  
**Version:** 0.3.2  
**Purpose:** Scenario-based training system that graduates agents with domain expertise in the form of SKILL.md files  
**License:** MIT  
**Works with:** Claude Code, OpenClaw, Cursor, Windsurf, any MCP-compatible agent

---

## 🎯 Core Concept

AI agents are unreliable in production. They demo well but fail on edge cases, skip validation steps, call wrong tools, and miss domain-specific knowledge that practitioners take for granted.

**Problems with existing approaches:**
- Fine-tuning: expensive, slow, model-locked
- Prompt engineering: fragile, doesn't scale
- Manual skill writing: error-prone, inconsistent

**dojo.md solution:**
- Run agents through progressively difficult scenarios
- Evaluate with hybrid deterministic + LLM-judged assertions
- Extract failure corrections AND curriculum knowledge
- Distill everything into a SKILL.md document (AgentSkills standard)
- Graduation = proven domain expertise, not just theory

---

## 🔄 How It Works

```
Scenario YAML → Engine → Mock Services → Evaluator → Skill Generator
    ↓            ↓         ↓            ↓             ↓
Isolated LLM   State   Deterministic   Judge      SKILL.md
  Judge       + Assertions               extractCurriculum()
```

**Process:**
1. **Scenario** (YAML) defines state, trigger, assertions
2. **Engine** runs agent in isolated environment with mock services
3. **Evaluator** checks deterministic assertions + LLM judge
4. **Skill Generator** extracts:
   - Failure patterns (score < 100)
   - Curriculum knowledge (always)
5. **Output:** SKILL.md with domain expertise

---

## 📦 Installation

```bash
# Global install
npm install -g dojo.md

# Verify
dojo --version  # 0.3.2
```

**Requirements:**
- Node.js 18+
- API keys for target models (OpenRouter, Anthropic, etc.)
- For MCP mode: MCP client (mcporter, OpenClaw)

---

## 🎓 Courses Available (106+)

### Customer Support
- `stripe-refunds` — Handle Stripe refund requests correctly
- `escalation-handling` — Escalate issues appropriately
- `churn-prevention` — Retain customers at risk
- `sla-breach-communication` — Communicate SLA issues
- `onboarding-sequences` — Guide new users
- `ecommerce-tickets` — Handle product/order issues

### Sales
- `cold-email-b2b` — Write effective cold emails
- `objection-handling` — Address prospect objections
- `proposal-writing` — Create winning proposals
- `competitive-battlecards` — Position against competitors
- `follow-up-sequences` — Nurture leads
- `offer-negotiation` — Negotiate deals

### Marketing
- `ad-copy-google-ads` — Google Ads copywriting
- `ad-copy-meta-facebook` — Meta/Facebook ads
- `seo-blog-writing` — SEO-optimized content
- `social-media-content` — Platform-specific posts
- `email-campaigns` — Email marketing sequences
- `content-calendar-planning` — Plan content strategy

### DevOps
- `incident-response` — Handle outages/incidents
- `deployment-alerts` — Communicate deployments
- `bug-triage` — Prioritize and classify bugs
- `github-issue-management` — Triage and respond
- `docker-debugging` — Debug container issues
- `aws-lambda-debugging` — Serverless troubleshooting

### Content & Education
- `newsletter-writing` — Create engaging newsletters
- `twitter-x-threads` — Write viral threads
- `product-launches` — Announce new products
- `brand-voice-documentation` — Define brand guidelines
- `tutorial-writing` — Create step-by-step guides
- `workshop-facilitation` — Design training workshops

### Legal & Compliance
- `contract-review-summaries` — Summarize key terms
- `compliance-checklists` — Ensure regulatory compliance
- `contract-clause-summarization` — Break down legal language

### Real Estate
- `property-listing-descriptions` — Write compelling listings
- `open-house-promotions` — Promote events
- `showing-feedback` — Collect and analyze feedback
- `buyer-inquiry-response` — Answer prospect questions

### Healthcare
- `patient-appointment-reminders` — Reduce no-shows
- `intake-form-review` — Process new patient info
- `medical-billing-inquiries` — Handle billing questions
- `insurance-pre-authorization` — Manage insurance

### Technical
- `api-documentation-writing` — Write API docs
- `accessibility-audit-reporting` — WCAG compliance audits
- `ab-test-analysis` — Experiment analysis
- `git-commit-message-writing` — Write meaningful commit messages

---

## 🚀 Usage Examples

### Train a Model
```bash
# Train default model (Claude Sonnet 4.6)
dojo train stripe-refunds

# Train specific model via OpenRouter
dojo train stripe-refunds --model openai/gpt-4o

# Train with custom judge (better evaluation)
dojo train stripe-refunds --model openai/gpt-4o --judge claude-sonnet-4-6

# Auto-loop until target score
dojo train stripe-refunds --model openai/gpt-4o --target 90
```

### View Results
```bash
# Show latest results for a course
dojo results stripe-refunds

# Show all courses
dojo list
```

### Benchmark Models (Arena)
```bash
# Compare models head-to-head
dojo arena ad-copy-google-ads --level 1

# With specific models
dojo arena ad-copy-google-ads --models openai/gpt-4o,google/gemini-2.5-pro,meta-llama/llama-3.3-70b-instruct
```

### Retrain with SKILL.md Injection
```bash
# Auto-loop: train → evaluate → inject SKILL.md → retrain
dojo retrain stripe-refunds

# With custom target
dojo retrain stripe-refunds --target 85 --max-retrain 5
```

### Generate Custom Course
```bash
# Create a new course from description
dojo generate "Handle Zendesk ticket routing and priority assignment"
```

---

## 📊 Training Output

### Graduated SKILL.md Structure
```markdown
---
name: stripe-refunds
description: Handle Stripe refund requests correctly...
---

## Domain Knowledge
[Non-obvious insights from curriculum]

## Quick Start
[Most common failure, corrected]

## Core Rules
[ALWAYS/step-by-step/prefer guidelines]

## Decision Tree
[If/then branching logic]

## Edge Cases
[Every trap with correct handling]

## Anti-Patterns
[DON'T X. Instead, Y.]
```

**Locations:**
- Default: `.claude/skills/<course>/<model>/SKILL.md`
- Customizable via `--output-dir`

### Training Metrics
- **Score:** 0-100 (hybrid deterministic + LLM judge)
- **Levels:** 1-5 (progressive difficulty)
- **Iterations:** Track improvement across retrain loops
- **Failure patterns:** What the agent struggled with
- **Curriculum extraction:** What the course intended to teach

**Example output:**
```
Level 1: ████████████ 3/3 (100%)
Level 2: ████████░░░░ 2/3 (67%)
Score: 83/100

Domain knowledge distilled:
 → "Verify customer identity before ANY charge lookup"
 → "Duplicate charges within 5 min window = single refund"
 → "Always explain refund timeline (5-10 business days)"
```

---

## 🔌 Integration with OpenClaw

### 1. MCP Server Mode
dojo.md can run as an MCP server, enabling training from inside your editor:

```json
{
  "mcpServers": {
    "dojo": {
      "command": "npx",
      "args": ["tsx", "/path/to/dojomd/src/mcp/server.ts"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-...",
        "OPENROUTER_API_KEY": "sk-or-..."
      }
    }
  }
}
```

**MCP Tools:**
- `dojo_discover` — List available courses
- `dojo_train` — Start training session
- `dojo_results` — Get training results
- `dojo_skill` — Retrieve graduated SKILL.md
- `dojo_apply` — Inject skill into agent context

### 2. Manual Training → Skill Deployment
```bash
# Step 1: Train model
dojo train stripe-refunds --model openai/gpt-4o --target 90

# Step 2: Find graduated SKILL.md
ls .claude/skills/stripe-refunds/openai--gpt-4o/SKILL.md

# Step 3: Copy to OpenClaw skills directory
cp .claude/skills/stripe-refunds/openai--gpt-4o/SKILL.md /root/.openclaw/workspace/skills/stripe-refunds/

# Step 4: Agent instantly has domain expertise
```

### 3. Automated Skill Pipeline
```bash
#!/bin/bash
# train-and-deploy.sh
COURSE=$1
MODEL=$2

# Train
dojo train $COURSE --model $MODEL --target 90

# Deploy
SKILL_DIR=".claude/skills/$COURSE/$(echo $MODEL | tr '/' '--')"
cp $SKILL_DIR/SKILL.md /root/.openclaw/workspace/skills/$COURSE/

echo "✅ Skill $COURSE trained and deployed for $MODEL"
```

---

## 🛠️ Technical Details

### Scenario Format (YAML)
```yaml
meta:
  id: simple-refund
  level: 1
  course: stripe-refunds
  description: Process a straightforward refund
  type: tool

state:
  customers:
    - id: cus_001
      email: alice@example.com
      name: Alice Johnson
  charges:
    - id: ch_001
      amount: 5000
      customer: cus_001
      status: succeeded

trigger: >
  Customer Alice Johnson (cus_001) is requesting
  a refund for charge ch_001 ($50.00).

assertions:
  - type: api_called
    tool: stripe_customers_retrieve
    description: Verify customer identity
  - type: api_called
    tool: stripe_refunds_create
    params: { charge: ch_001 }
    description: Create the refund
  - type: llm_judge
    criteria: >
      Agent confirms refund was processed and explains
      the 5-10 business day timeline for the credit
      to appear on the customer's statement.
    description: Communicate success with timeline
```

### Assertion Types
- `api_called` — Agent called the correct tool with correct params
- `state_changed` — State mutation verified
- `llm_judge` — LLM evaluates response quality/correctness
- `custom` — JavaScript/TypeScript custom assertion

### Evaluation System
- **Deterministic checks:** API calls, state changes (100% accurate)
- **LLM judge:** Response quality, communication, edge cases (consistent across models)
- **Hybrid score:** Weighted combination (default 70% deterministic, 30% judge)

---

## 📈 Comparison with Other Approaches

| Feature | dojo.md | Fine-tuning | Prompt Engineering | Manual Writing |
|---------|---------|-------------|-------------------|----------------|
| Cost | Low | High | Low | Medium |
| Speed | Fast | Slow | Fast | Slow |
| Model-locked | No | Yes | No | No |
| Proven expertise | ✅ | ❌ | ❌ | ❌ |
| Edge case coverage | ✅ | ❌ | ❌ | ❌ |
| Portable skills | ✅ SKILL.md | ❌ | ❌ | ❓ |
| Production-ready | ✅ | ⚠️ | ❌ | ⚠️ |

---

## 🎯 Use Cases in OpenClaw

### 1. Customer Support Automation
```bash
dojo train stripe-refunds --model openrouter/openrouter/free
# Deploy SKILL.md → Agent handles Stripe refunds expertly
```

### 2. DevOps Incident Response
```bash
dojo train incident-response --model openrouter/anthropic/claude-3.5-sonnet
# Deploy → Agent joins on-call rotation reliably
```

### 3. Sales & Marketing
```bash
dojo train cold-email-b2b --model openrouter/google/gemini-2.5-pro
dojo train ad-copy-google-ads --model openrouter/meta-llama/llama-3.3-70b
# Deploy multiple skills → Full-stack marketing agent
```

### 4. Content Creation
```bash
dojo train newsletter-writing --model openrouter/openrouter/free
dojo train twitter-x-threads --model openrouter/anthropic/claude-3.5-sonnet
# Deploy → Content creator with proven templates
```

---

## 🔧 Advanced Usage

### Multi-Model Training & Comparison
```bash
# Train same course on multiple models
for model in openai/gpt-4o google/gemini-2.5-pro meta-llama/llama-3.3-70b; do
  dojo train stripe-refunds --model $model --target 90 &
done
wait

# Compare results
dojo arena stripe-refunds --models openai/gpt-4o,google/gemini-2.5-pro,meta-llama/llama-3.3-70b

# Deploy best model's SKILL.md
BEST_MODEL=$(dojo results stripe-refunds --format json | jq -r '.bestModel')
cp .claude/skills/stripe-refunds/$BEST_MODEL/SKILL.md /root/.openclaw/workspace/skills/stripe-refunds/
```

### Course Development
```bash
# Generate new course from spec
dojo generate "Handle Zendesk ticket routing and priority assignment" \
  --tools zendesk_ticket_retrieve,zendesk_ticket_update,zendesk_user_retrieve \
  --levels 5 \
  --scenarios-per-level 10

# Edit generated course YAML
vim courses/zendesk-ticket-routing/level1.yaml

# Test course
dojo train zendesk-ticket-routing --model openai/gpt-4o

# Iterate based on results
# Add edge cases, refine assertions, increase difficulty
```

### CI/CD Integration
```yaml
# .github/workflows/train-skills.yml
name: Train Skills
on:
  push:
    paths:
      - 'courses/**'
jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx dojo train stripe-refunds --model openrouter/openrouter/free --target 95
      - run: cp .claude/skills/**/SKILL.md ./deployed-skills/
      - uses: actions/upload-artifact@v3
        with:
          name: skills
          path: deployed-skills/
```

---

## 📚 Resource Links

- **npm:** https://www.npmjs.com/package/dojo.md
- **GitHub:** https://github.com/edholofy/dojo.md
- **Live Leaderboard:** https://dojo.md
- **AgentSkills Standard:** https://agentskills.io
- **MCP Spec:** https://modelcontextprotocol.io

---

## ✅ Current Status

**Installation:** ✅ Complete (v0.3.2)  
**Courses:** 106 installed  
**MCP Server:** Available via `dojo mcp`  
**Integration:** Ready for OpenClaw deployment

**Next Steps:**
1. Explore courses: `dojo list`
2. Train a test course: `dojo train stripe-refunds --model openrouter/openrouter/free`
3. Deploy graduated SKILL.md to OpenClaw
4. Consider MCP integration for in-editor training

---

**Last Updated:** 2026-03-11 06:25 UTC  
**Agent:** OpenClaw Agent (nolimit)