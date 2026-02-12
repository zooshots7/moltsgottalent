# Hybrid Workflow: Idea → Approval → Script

## How It Works

```
1. Pitch Idea
   └─> Research (Twitter/Web/KB)
   └─> Dedupe Check (40% gate)
   └─> Create Brief
   └─> Status: "pitched"

2. Review Brief
   └─> Read task file
   └─> Decide: approve or reject

3. Approve Idea
   └─> Status: "pitched" → "accepted"
   └─> Auto-generate script (Gemini 2.0 Flash)
   └─> Save to scripts/ folder
```

## Commands

### From OpenClaw Chat

**Pitch a new idea:**
```
"Video idea: How to use AI for video editing"
```

**List pending ideas:**
```
"Show me pitched content ideas"
```

**Approve an idea (generates script):**
```
"Approve idea 2026-02-12-002"
```

**Reject an idea:**
```
"Reject idea 2026-02-12-001 because it's too similar to existing content"
```

### From CLI

**List ideas:**
```bash
python manage.py list pitched     # Only pitched ideas
python manage.py list accepted    # Only accepted ideas
python manage.py list             # All ideas (last 10)
```

**View idea details:**
```bash
python manage.py view 2026-02-12-002
```

**Approve + generate script:**
```bash
python manage.py approve 2026-02-12-002
```

**Reject an idea:**
```bash
python manage.py reject 2026-02-12-001 "Too similar to existing content"
```

**Change status manually:**
```bash
python manage.py status 2026-02-12-002 archived
```

## File Structure

```
content-pipeline/
├── ideas.db                    # All ideas + embeddings
├── tasks/
│   └── 2026-02-12-002.md      # Brief + research
└── scripts/
    └── 2026-02-12-002-script.md   # Full script (auto-generated)
```

## Status Flow

```
pitched → accepted → (script generated)
   ↓
rejected (with optional reason)
   ↓
archived (old/outdated)
```

## Script Generation

When you approve an idea:
- **Short-form**: Hook, main content, CTA, visual suggestions (30-60s)
- **Long-form**: Title options, outline with timestamps, full script, B-roll, SEO keywords (8-15min)

Uses **Gemini 2.0 Flash** (fast + cheap).

## Cost Breakdown

**Per idea:**
- Research: $0 (Brave API via OpenClaw)
- Embedding: ~$0.0001 (Gemini)
- Script: ~$0.002-0.005 (Gemini 2.0 Flash)

**Total per idea:** < $0.01

With free tier (1500 requests/day), you can process **~500 ideas/day** for free.

## Example: Full Flow

```bash
# 1. Pitch idea (from chat)
"Video idea: Top 5 AI tools for designers | ai,design,tools"

# OpenClaw auto-researches and creates:
# → tasks/2026-02-12-003.md (brief + research)
# → Status: pitched

# 2. Review brief
cat tasks/2026-02-12-003.md

# 3. Approve (from chat)
"Approve 2026-02-12-003"

# OpenClaw auto-generates:
# → scripts/2026-02-12-003-script.md (full script)
# → Status: accepted

# 4. Done!
# Now you have:
# - Research links
# - Brief
# - Full script with hook, outline, CTA, etc.
```

## Tips

1. **Review before approving** - Read the brief, check research quality
2. **Batch approvals** - `python manage.py list pitched` → approve multiple at once
3. **Iterate on scripts** - Generated scripts are starting points, edit as needed
4. **Update status** - Mark old ideas as "archived" to keep database clean
5. **Learn from rejections** - Add rejection reasons to improve future pitches

## Integration

Works seamlessly with OpenClaw:
- Pitch ideas in any chat session
- I handle research, dedupe, and brief creation
- You approve when ready
- Scripts auto-generate

No manual intervention unless you want it ✨
