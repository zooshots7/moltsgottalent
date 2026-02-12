# How to Use Content Pipeline from OpenClaw

## Quick Start

Just describe your content idea in chat:

```
"Video idea: How cryptocurrency works for beginners"
```

I'll automatically:
1. Research Twitter, web, and your knowledge base
2. Check for duplicates (40% threshold)
3. Create a task file with research links
4. Save to database

## What Gets Created

### Database Entry
- Unique ID: `2026-02-12-001`
- URL slug: `how-cryptocurrency-works-for-beginners`
- Embedding for similarity matching
- Status: `pitched` (you can update to `accepted`/`rejected`/`archived`)

### Task File
`tasks/2026-02-12-001.md` with:
- Title and brief
- Research links (Twitter, KB, web)
- Tags
- Metadata

## Commands

### Submit Idea
```
"Content idea: [your topic]"
"Video idea: [your topic]"
```

### Check Specific Topic
```
"Check if we've covered: [topic]"
```

### View Recent Ideas
```
"Show me recent content ideas"
```

### Update Status
```
"Mark 2026-02-12-001 as accepted"
"Reject idea 2026-02-12-002"
```

## Duplicate Detection

The system will REJECT if similarity > 40%:
- 70% semantic (embedding cosine similarity)
- 30% keyword (title, summary, tags overlap)

If rejected, I'll show you what it matched:
```
❌ DUPLICATE DETECTED
  [2026-02-10-015] How Bitcoin Works for Newbies
  └─ 67% similarity | status: accepted
```

## Tips

1. **Be specific**: "AI tools for video editing" > "AI video stuff"
2. **Include tags**: Helps with categorization and deduplication
3. **Indicate type**: Say "long-form" if it's not a short
4. **Review matches**: If rejected, the similar idea might need updating

## Gemini API (Optional)

For better semantic matching, set:
```bash
export GEMINI_API_KEY="your-key-here"
```

Without it, uses mock embeddings (less accurate but functional).

Get free key: https://aistudio.google.com/app/apikey

## Examples

### Good
```
"Short video idea: Top 5 free AI tools for designers | ai,design,tools"
```

### Also Good
```
"I want to make a video about how to use Midjourney for product mockups"
```

### Not Ideal
```
"video about stuff"  # Too vague
```

## File Locations

- Database: `content-pipeline/ideas.db`
- Tasks: `content-pipeline/tasks/YYYY-MM-DD-NNN.md`
- Research: Included in task markdown

## Status Values

- `pitched`: New idea, pending review
- `accepted`: Approved for production
- `rejected`: Not moving forward
- `archived`: Old/outdated
- `duplicate`: Caught by similarity check
