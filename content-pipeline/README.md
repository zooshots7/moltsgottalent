# Content Idea Pipeline

Researches topics, prevents duplicates, creates production-ready tasks.

## Features

✅ **Research**: Twitter/X, knowledge base, web search
✅ **Semantic Dedupe**: 40% similarity threshold (70% semantic + 30% keyword)
✅ **Brief Assembly**: Short, actionable task descriptions
✅ **Task Creation**: Markdown files with research links

## Architecture

```
Topic Input
    ↓
Research (Twitter/KB/Web)
    ↓
Generate Embedding (Gemini)
    ↓
Dedupe Check (40% threshold)
    ↓
Save to SQLite
    ↓
Create Task File
```

## Database Schema

```sql
content_ideas:
  - id: YYYY-MM-DD-NNN
  - date, type, title, slug (unique)
  - summary, tags
  - status: pitched/accepted/rejected/archived/duplicate
  - response: your feedback
  - embedding: Gemini vector (BLOB)
  - created_at
```

## Similarity Algorithm

**Semantic (70%)**: Cosine similarity between embeddings
**Keyword (30%)**: Title (30%) + Summary (20%) + Tags (20%)
**Combined**: (semantic * 0.7) + (keyword * 0.3)

**Gate**: If any existing idea > 40% similarity → REJECT

## Usage

### From OpenClaw Chat

Just describe the topic:
```
"Video idea: How to use AI for content research"
```

OpenClaw will:
1. Search Twitter/web/KB
2. Check for duplicates
3. Create brief + task if unique
4. Show you matches if duplicate

### Manual (CLI)

```bash
# Initialize database
python pipeline.py init

# Test idea
python pipeline.py test "My Video Title" "Brief description" "tag1,tag2"

# Process full pipeline
python process_idea.py "Topic description | tags" short
```

## Files

- `schema.sql` - Database schema
- `pipeline.py` - Core logic (embeddings, similarity, storage)
- `process_idea.py` - Main orchestrator
- `ideas.db` - SQLite database (created on first run)
- `tasks/` - Markdown task files (YYYY-MM-DD-NNN.md)

## Configuration

Set `GEMINI_API_KEY` environment variable:
```bash
export GEMINI_API_KEY="your-key-here"
```

Without API key, uses mock embeddings (testing only).

## Cost

**$0** - using free tier:
- Gemini Flash: 1500 embeds/day free
- SQLite: local file
- Brave Search: via OpenClaw

## Roadmap

- [ ] Add Twitter API integration (if needed)
- [ ] Export to Asana/Notion/Todoist
- [ ] Web UI for browsing ideas
- [ ] Bulk import existing content
- [ ] Auto-tag suggestions
- [ ] Scheduled research updates
