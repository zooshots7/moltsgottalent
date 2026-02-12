#!/usr/bin/env python3
"""
Content Idea Pipeline
Researches topics, prevents duplicates, creates tasks
"""

import sqlite3
import json
import re
import os
from datetime import datetime
from typing import List, Dict, Tuple
import requests
import numpy as np
from dotenv import load_dotenv

# Load .env file
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

DB_PATH = os.path.join(os.path.dirname(__file__), "ideas.db")
TASKS_DIR = os.path.join(os.path.dirname(__file__), "tasks")

# Gemini API (free tier)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent"

# Similarity threshold
DUPLICATE_THRESHOLD = 0.40  # 40% combined similarity

def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect(DB_PATH)
    with open(os.path.join(os.path.dirname(__file__), "schema.sql")) as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

def get_embedding(text: str) -> List[float]:
    """Get embedding from Gemini API"""
    if not GEMINI_API_KEY:
        print("⚠️  GEMINI_API_KEY not set. Using mock embeddings.")
        # Mock: simple hash-based vector for testing
        h = hash(text.lower())
        return [float((h >> i) & 0xFF) / 255.0 for i in range(0, 768, 8)]
    
    headers = {"Content-Type": "application/json"}
    data = {
        "content": {"parts": [{"text": text}]}
    }
    
    response = requests.post(
        f"{GEMINI_EMBED_URL}?key={GEMINI_API_KEY}",
        headers=headers,
        json=data
    )
    
    if response.status_code != 200:
        raise Exception(f"Gemini API error: {response.text}")
    
    return response.json()["embedding"]["values"]

def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def keyword_similarity(new: Dict, existing: Dict) -> float:
    """Calculate keyword-based similarity"""
    def tokenize(text: str) -> set:
        return set(re.findall(r'\w+', text.lower()))
    
    # Title similarity (30% of keyword score)
    new_title = tokenize(new.get("title", ""))
    old_title = tokenize(existing.get("title", ""))
    title_sim = len(new_title & old_title) / max(len(new_title | old_title), 1)
    
    # Summary similarity (20% of keyword score)
    new_summary = tokenize(new.get("summary", ""))
    old_summary = tokenize(existing.get("summary", ""))
    summary_sim = len(new_summary & old_summary) / max(len(new_summary | old_summary), 1)
    
    # Tag similarity (20% of keyword score)
    new_tags = set(new.get("tags", "").split(","))
    old_tags = set(existing.get("tags", "").split(","))
    tag_sim = len(new_tags & old_tags) / max(len(new_tags | old_tags), 1)
    
    # Weighted average
    return (title_sim * 0.3 + summary_sim * 0.2 + tag_sim * 0.2) / 0.7

def generate_slug(title: str) -> str:
    """Generate URL-friendly slug"""
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug[:60].strip('-')

def get_next_id() -> str:
    """Generate next ID in YYYY-MM-DD-NNN format"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    today = datetime.now().strftime("%Y-%m-%d")
    
    cursor.execute(
        "SELECT id FROM content_ideas WHERE date = ? ORDER BY id DESC LIMIT 1",
        (today,)
    )
    result = cursor.fetchone()
    conn.close()
    
    if result:
        last_num = int(result[0].split('-')[-1])
        return f"{today}-{last_num + 1:03d}"
    return f"{today}-001"

def check_duplicates(idea: Dict) -> Tuple[bool, List[Dict]]:
    """
    Check if idea is duplicate using hybrid similarity
    Returns: (is_duplicate, similar_ideas)
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, title, summary, tags, embedding, status
        FROM content_ideas
        WHERE status != 'rejected'
    """)
    
    new_embedding = get_embedding(f"{idea['title']} {idea['summary']}")
    similar = []
    
    for row in cursor.fetchall():
        existing = {
            "id": row[0],
            "title": row[1],
            "summary": row[2],
            "tags": row[3],
            "embedding": json.loads(row[4]) if row[4] else None,
            "status": row[5]
        }
        
        if not existing["embedding"]:
            continue
        
        # Semantic similarity (70%)
        semantic_score = cosine_similarity(new_embedding, existing["embedding"])
        
        # Keyword similarity (30%)
        keyword_score = keyword_similarity(idea, existing)
        
        # Combined score
        combined_score = (semantic_score * 0.7) + (keyword_score * 0.3)
        
        if combined_score > DUPLICATE_THRESHOLD:
            similar.append({
                "id": existing["id"],
                "title": existing["title"],
                "score": combined_score,
                "status": existing["status"]
            })
    
    conn.close()
    is_duplicate = len(similar) > 0
    return is_duplicate, sorted(similar, key=lambda x: x["score"], reverse=True)

def save_idea(idea: Dict, embedding: List[float]) -> str:
    """Save idea to database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    idea_id = get_next_id()
    slug = generate_slug(idea["title"])
    
    # Handle duplicate slugs
    counter = 1
    original_slug = slug
    while True:
        cursor.execute("SELECT id FROM content_ideas WHERE slug = ?", (slug,))
        if not cursor.fetchone():
            break
        slug = f"{original_slug}-{counter}"
        counter += 1
    
    cursor.execute("""
        INSERT INTO content_ideas 
        (id, date, type, title, slug, summary, tags, status, embedding)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        idea_id,
        datetime.now().strftime("%Y-%m-%d"),
        idea.get("type", "short"),
        idea["title"],
        slug,
        idea["summary"],
        idea.get("tags", ""),
        "pitched",
        json.dumps(embedding)
    ))
    
    conn.commit()
    conn.close()
    
    return idea_id

def create_task(idea: Dict, idea_id: str, research: Dict):
    """Create markdown task file"""
    os.makedirs(TASKS_DIR, exist_ok=True)
    
    task_file = os.path.join(TASKS_DIR, f"{idea_id}.md")
    
    content = f"""# {idea['title']}

**ID:** {idea_id}
**Type:** {idea.get('type', 'short')}-form
**Status:** pitched
**Tags:** {idea.get('tags', 'N/A')}

## Brief

{idea['summary']}

## Research

### Twitter/X
{research.get('twitter', 'No results')}

### Knowledge Base
{research.get('kb', 'No related content')}

### Web
{research.get('web', 'No additional sources')}

---
*Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
    
    with open(task_file, 'w') as f:
        f.write(content)
    
    return task_file

def format_research_results(twitter_results: List, kb_results: List, web_results: List) -> Dict:
    """Format research results for task"""
    research = {}
    
    # Twitter
    if twitter_results:
        twitter_md = "\n".join([
            f"- [{r.get('title', 'Tweet')}]({r.get('url', '#')})"
            for r in twitter_results[:5]
        ])
        research['twitter'] = twitter_md
    
    # KB
    if kb_results:
        kb_md = "\n".join([
            f"- {r.get('path', 'Unknown')} (score: {r.get('score', 0):.2f})"
            for r in kb_results[:3]
        ])
        research['kb'] = kb_md
    
    # Web
    if web_results:
        web_md = "\n".join([
            f"- [{r.get('title', 'Source')}]({r.get('url', '#')})"
            for r in web_results[:5]
        ])
        research['web'] = web_md
    
    return research

# CLI for testing
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python pipeline.py init")
        print("       python pipeline.py test 'idea title' 'summary' 'tags'")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "init":
        init_db()
        print("✅ Database initialized")
    
    elif command == "test":
        if len(sys.argv) < 4:
            print("Usage: python pipeline.py test 'title' 'summary' 'tags'")
            sys.exit(1)
        
        idea = {
            "title": sys.argv[2],
            "summary": sys.argv[3],
            "tags": sys.argv[4] if len(sys.argv) > 4 else ""
        }
        
        print(f"🔍 Checking: {idea['title']}")
        is_dup, similar = check_duplicates(idea)
        
        if is_dup:
            print(f"\n❌ DUPLICATE DETECTED (threshold: {DUPLICATE_THRESHOLD})")
            for match in similar:
                print(f"  - {match['title']} ({match['score']:.1%} similarity)")
        else:
            print("\n✅ No duplicates found")
            embedding = get_embedding(f"{idea['title']} {idea['summary']}")
            idea_id = save_idea(idea, embedding)
            print(f"💾 Saved as: {idea_id}")
