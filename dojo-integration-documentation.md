# dojo.md Integration - AI Agent Training System

## 📋 Overview

**Project:** dojo.md - University for AI Agents
**Purpose:** Train any model through scenario-based courses, graduate with SKILL.md (portable expertise)
**Version:** 0.3.2
**Installed:** ✅ Global npm package
**Courses Available:** 106 courses, 4400+ scenarios
**Compatibility:** OpenClaw, Claude Code, Cursor, Windsurf, any MCP-compatible agent

---

## 🎯 What is dojo.md?

dojo.md solves the problem of AI agents being unreliable in production. They demo well but fail on edge cases, skip validation steps, call wrong tools, and miss domain-specific knowledge.

**Key Concept:**
- Train agents through progressively difficult scenarios
- Evaluate with hybrid deterministic + LLM-judged assertion system
- Extract failure corrections AND curriculum knowledge
- Distill everything into a SKILL.md document
- Inject SKILL.md into agent's context for production reliability

**No fine-tuning required.** No weight modification. Just knowledge, distilled and proven.

---

## 📦 Installation & Prerequisites

### Requirements
- Node.js v18+ (✅ v22.22.0 installed)
- npm v10+ (✅ v10.9.4 installed)
- API keys for target models (OpenRouter, Anthropic, OpenAI, etc.)

### Installed
```bash
npm install -g dojo.md
# Version: 0.3.2
# Location: /root/.nvm/versions/node/v22.22.0/bin/dojo
```

### API Keys Needed
- **OpenRouter:** `OPENROUTER_API_KEY=sk-or-...` (for training on 200+ models)
- **Anthropic:** `ANTHROPIC_API_KEY=sk-ant-...` (for Claude models as judge)

---

## 🔧 MCP Integration

dojo.md works as an MCP server, allowing training directly from your editor/agent.

### MCP Server Configuration

Add to `~/.mcporter/mcporter.json`:

```json
{
  "mcpServers": {
    "dojo": {
      "command": "npx",
      "args": ["tsx", "/path/to/dojomd/src/mcp/server.ts"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-..."  // Required for judge model
      }
    }
  }
}
```

**Note:** The MCP server provides tools: `dojo_discover`, `dojo_train`, `dojo_results`, `dojo_skill`, `dojo_apply`.

### Available Tools
| Tool | Purpose |
|------|---------|
| `dojo_discover` | List available courses |
| `dojo_train` | Run training session for a course |
| `dojo_results` | Show latest training results |
| `dojo_skill` | Export graduated SKILL.md |
| `dojo_apply` | Apply skill to agent context |

---

## 📚 Course Catalog (Top Categories)

### Customer Support
- `stripe-refunds` - Handle Stripe refund requests correctly
- `customer-churn-prevention` - Proactive retention strategies
- `customer-onboarding-emails` - Welcome sequences and activation
- `customer-support-escalation` - Multi-tier escalation handling
- `ecommerce-customer-support` - Order, returns, shipping issues
- `refund-cancellation-handling` - Refunds + cancellations + retention
- `stripe-dispute-chargeback-handling` - Chargeback representment
- `stripe-subscription-management` - Subscription lifecycle
- `saas-customer-support` - Full SaaS support coverage

### Sales & Marketing
- `ad-copy-google-ads` - Google Ads copywriting (RSA, PMax, Shopping)
- `ad-copy-meta-facebook` - Meta/Facebook ad copy
- `cold-email-b2b` - B2B cold email writing
- `content-newsletter` - Newsletter writing
- `social-media-content` - Social media content creation
- `seo-blog-writing` - SEO-optimized blog posts

### Technical & DevOps
- `devops-incident-response` - Incident handling and alerts
- `devops-deployment-alerts` - Deployment monitoring
- `bug-report-triage` - Bug classification and prioritization
- `github-issue-management` - GitHub issue workflow
- `docker-debugging` - Docker troubleshooting
- `aws-lambda` - AWS Lambda development

### Business & Legal
- `legal-contract-review` - Contract review summaries
- `compliance-checklists` - Regulatory compliance
- `product-feature-requests` - Intake and prioritization
- `nps-survey-followup` - NPS response handling
- `ab-test-analysis` - A/B test statistical analysis
- `accessibility-audit-reporting` - WCAG compliance audits

---

## 🚀 Training Workflow

### Basic Training
```bash
# List all courses
dojo list

# Train a course (default model: claude-sonnet-4-6)
dojo train stripe-refunds

# Train on specific model via OpenRouter
dojo train stripe-refunds --model openai/gpt-4o

# Judge with different model (cross-evaluation)
dojo train stripe-refunds --model openai/gpt-4o --judge claude-sonnet-4-6

# Target specific score (auto-loop until reached)
dojo train stripe-refunds --model openai/gpt-4o --target 85

# Limit retrain iterations
dojo train stripe-refunds --model openai/gpt-4o --target 90 --max-retrain 5
```

### Auto-Loop Example
```
Iteration 1: 25/100
Iteration 2: 50/100 (+25) — SKILL.md injected
Iteration 3: 68/100 (+18)
Iteration 4: 72/100 (+4) — plateau detected, stopping
```

### Model Comparison (Arena)
```bash
# Benchmark multiple models on same course
dojo arena ad-copy-google-ads --level 1

# Custom model set
dojo arena ad-copy-google-ads --models openai/gpt-4o,google/gemini-2.5-pro,anthropic/claude-sonnet-4-6
```

---

## 🎓 Graduated SKILL.md Structure

After training, dojo generates a SKILL.md in the AgentSkills standard:

```markdown
---
name: stripe-refunds
description: >
  Handle Stripe refund requests correctly. Use when processing
  refunds, duplicate charges, or customer disputes.
---

## Domain Knowledge
[Non-obvious insights distilled from training curriculum]

## Quick Start
[Most common failure, corrected]

## Core Rules
[Freedom-calibrated: ALWAYS/step-by-step/prefer]

## Decision Tree
[If/then branching logic]

## Edge Cases
[Every trap, with correct handling]

## Anti-Patterns
[DON'T X. Instead, Y.]
```

**What it captures:**
- **Failure patterns** — what the agent struggled with (when score < 100)
- **Curriculum extraction** — domain knowledge from assertion criteria (always)
- **Score & scenarios** — validated against specific test cases

---

## 📊 Training System Architecture

```
Scenario YAML → Engine → Mock Services → Evaluator → Skill Generator
    ↓           ↓         ↓              ↓           ↓
Isolated   LLM Judge   State +    Deterministic   SKILL.md
                      Assertions
```

**Components:**
1. **Scenario Engine** — Runs isolated scenarios with mock services
2. **LLM Judge** — Evaluates responses (can be different model)
3. **Assertions** — Deterministic checks + LLM rubric scoring
4. **Skill Generator** — Extracts both corrections and curriculum knowledge
5. **SKILL.md Output** — Portable expertise document

---

## 🔄 Integration with OpenClaw

### Step 1: Install dojo.md
```bash
npm install -g dojo.md
# Already installed ✅
```

### Step 2: Set API Keys
```bash
export OPENROUTER_API_KEY=sk-or-...   # For training models
export ANTHROPIC_API_KEY=sk-ant-...  # For judge (optional)
```

### Step 3: Train a Skill
```bash
# Train on OpenRouter free model
dojo train stripe-refunds --model openrouter/openrouter/free --target 85
```

### Step 4: Locate Graduated SKILL.md
```bash
# Skills saved in:
~/.claude/skills/stripe-refunds/openrouter--openrouter--free/SKILL.md

# Or for Anthropic:
~/.claude/skills/stripe-refunds/anthropic--claude-sonnet-4-6/SKILL.md
```

### Step 5: Deploy to OpenClaw
```bash
# Copy SKILL.md to OpenClaw skills directory
cp ~/.claude/skills/stripe-refunds/*/SKILL.md /root/.openclaw/workspace/skills/stripe-refunds/

# Or symlink for auto-updates
ln -s ~/.claude/skills/stripe-refunds /root/.openclaw/workspace/skills/
```

### Step 6: Use in OpenClaw
The SKILL.md will be automatically loaded when the agent encounters relevant tasks:
- **Trigger:** Processing refunds, duplicate charges, customer disputes
- **Effect:** Agent uses trained domain expertise, avoids known failure patterns
- **Context:** ~5000 tokens when activated (progressive disclosure)

---

## 💡 Example Training Run

### Command:
```bash
dojo train stripe-refunds --model openrouter/openrouter/free --target 85
```

### Expected Output:
```
Level 1: ████████████ 3/3 (100%)
Level 2: ████████░░░░ 2/3 (67%)
Score: 83/100

Domain knowledge distilled:
 → "Verify customer identity before ANY charge lookup"
 → "Duplicate charges within 5 min window = single refund"
 → "Always explain refund timeline (5-10 business days)"

SKILL.md written → .claude/skills/stripe-refunds/openrouter--openrouter--free/SKILL.md
```

### Graduated SKILL.md Contains:
- **Quick Start:** Most common failure corrected
- **Core Rules:** Freedom-calibrated guidelines
- **Edge Cases:** Every trap with correct handling
- **Anti-Patterns:** What NOT to do
- **Decision Tree:** If/then branching logic
- **Domain Knowledge:** Non-obvious insights from curriculum

---

## 🏆 Arena Leaderboard (Model Comparison)

dojo can benchmark multiple models head-to-head on the same course:

```
═══ Arena Leaderboard ════════════════════════
 1st Claude Opus 4.6 █████████████████░░░ 84
 2nd Claude Sonnet 4.6 █████████████████░░░ 84
 3rd GPT-5.2 ████████████████░░░░ 82
 4th GLM 5 ████████████████░░░░ 79
 5th Gemini 3 Flash ███████████████░░░░░ 76
══════════════════════════════════════════════
```

Use this to choose the best model for each domain before training.

---

## 🎯 Use Cases for This System

Based on current tools and integrations:

1. **Stripe Refunds Agent** — Train on `stripe-refunds` course
2. **Customer Support Specialist** — Multiple courses: churn prevention, escalation, onboarding
3. **DevOps Incident Responder** — `devops-incident-response`, `bug-report-triage`
4. **Marketing Copywriter** — `ad-copy-google-ads`, `ad-copy-meta-facebook`, `cold-email-b2b`
5. **Compliance Officer** — `accessibility-audit-reporting`, `compliance-checklists`

**Each SKILL.md becomes a portable expertise module** that can be dropped into any MCP-compatible agent.

---

## 📈 Benefits of dojo.md Integration

### Before (Manual Skills)
- Hand-written SKILL.md files
- Incomplete edge case coverage
- No validation against scenarios
- Static knowledge (may become outdated)

### After (dojo-trained)
- Scenario-validated expertise (4400+ test scenarios)
- Comprehensive edge case handling
- Failure pattern analysis
- Model-specific blind spots addressed
- Graduation score proves competency
- Continuous improvement (re-train on new failures)

---

## 🔧 Advanced Configuration

### Custom Course Generation
```bash
# Generate a new course from description
dojo generate "Handle Zendesk ticket routing and priority assignment"
```

### Auto-Retrain Loop
```bash
# Keep retraining until target or plateau
dojo retrain stripe-refunds
# Equivalent to: dojo train stripe-refunds --target 90 --max-retrain 5
```

### Detailed Reports
```bash
# Save training report for analysis
dojo train stripe-refunds --report training-report.json
```

---

## 🛡️ Security & Best Practices

1. **Mock Services Only** — dojo uses mock services, no real API calls to production systems
2. **Scope Enforcement** — nmap-mcp already has CIDR allowlist; dojo is isolated
3. **Skill Validation** — Each SKILL.md comes with a score (0-100) and scenario coverage
4. **Model Isolation** — Training happens in isolated environment, no cross-contamination
5. **Audit Trail** — Training logs saved, can reproduce results

---

## 📚 References

- **dojo.md GitHub:** https://github.com/edholofy/dojo.md
- **AgentSkills Standard:** https://agentskills.io
- **Live Leaderboard:** https://dojo.md
- **MCP Specification:** https://modelcontextprotocol.io
- **OpenClaw Docs:** https://docs.openclaw.ai

---

## ✅ Current Status

- ✅ dojo.md v0.3.2 installed globally
- ✅ 106 courses cataloged (4400+ scenarios)
- ✅ MCP server setup ready (config example provided)
- ✅ API keys configured for OpenRouter
- ✅ Integration documented
- ⏳ **Next:** Train first skill (e.g., `stripe-refunds`) and deploy to OpenClaw

---

**Last Updated:** 2026-03-11 06:30 UTC
**Author:** OpenClaw Agent (nolimit)
**Integration Status:** Ready for training 🎯