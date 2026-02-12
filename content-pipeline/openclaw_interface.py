#!/usr/bin/env python3
"""
OpenClaw interface for content pipeline
Call this with research data from OpenClaw tools
"""

import sys
import json
import os
from datetime import datetime
from pipeline import (
    init_db, check_duplicates, save_idea, create_task,
    get_embedding, generate_slug
)

def process_with_research(
    title: str,
    summary: str,
    tags: str = "",
    idea_type: str = "short",
    twitter_results: list = None,
    kb_results: list = None,
    web_results: list = None
):
    """
    Full pipeline with research results from OpenClaw
    
    Args:
        title: Content idea title
        summary: Brief description/pitch
        tags: Comma-separated tags
        idea_type: 'short' or 'long'
        twitter_results: List of Twitter search results
        kb_results: List of KB search results
        web_results: List of web search results
    
    Returns:
        dict with success, idea_id, task_file, etc.
    """
    
    # Initialize DB
    try:
        init_db()
    except Exception as e:
        pass  # DB already exists
    
    idea = {
        "title": title,
        "summary": summary,
        "type": idea_type,
        "tags": tags
    }
    
    # Dedupe check
    print("🔍 Checking for duplicates...")
    is_duplicate, similar = check_duplicates(idea)
    
    if is_duplicate:
        print(f"\n❌ DUPLICATE DETECTED (40% threshold)")
        print(f"Found {len(similar)} similar idea(s):\n")
        for match in similar:
            print(f"  [{match['id']}] {match['title']}")
            print(f"  └─ {match['score']:.1%} similarity | status: {match['status']}\n")
        
        return {
            "success": False,
            "duplicate": True,
            "matches": similar
        }
    
    print("✅ No duplicates found\n")
    
    # Generate embedding and save
    print("🧠 Generating embedding...")
    embedding = get_embedding(f"{title} {summary}")
    
    print("💾 Saving to database...")
    idea_id = save_idea(idea, embedding)
    
    # Format research
    research = {}
    
    if twitter_results:
        twitter_md = "\n".join([
            f"- [{r.get('title', 'Tweet')}]({r.get('url', '#')})"
            for r in twitter_results[:5]
        ])
        research['twitter'] = twitter_md
    else:
        research['twitter'] = "No Twitter results"
    
    if kb_results:
        kb_md = "\n".join([
            f"- {r.get('path', 'Unknown')} (score: {r.get('score', 0):.2f})"
            for r in kb_results[:3]
        ])
        research['kb'] = kb_md
    else:
        research['kb'] = "No related content in KB"
    
    if web_results:
        web_md = "\n".join([
            f"- [{r.get('title', 'Source')}]({r.get('url', '#')})"
            for r in web_results[:5]
        ])
        research['web'] = web_md
    else:
        research['web'] = "No web results"
    
    # Create task file
    print("📝 Creating task file...")
    task_file = create_task(idea, idea_id, research)
    
    print(f"\n✅ Success! Created: {idea_id}")
    print(f"📁 Task file: {task_file}")
    
    return {
        "success": True,
        "duplicate": False,
        "idea_id": idea_id,
        "slug": generate_slug(title),
        "task_file": task_file
    }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python openclaw_interface.py 'title' 'summary' [tags] [type] [research_json]")
        sys.exit(1)
    
    title = sys.argv[1]
    summary = sys.argv[2]
    tags = sys.argv[3] if len(sys.argv) > 3 else ""
    idea_type = sys.argv[4] if len(sys.argv) > 4 else "short"
    
    # Optional: research results as JSON
    research_data = {}
    if len(sys.argv) > 5:
        try:
            research_data = json.loads(sys.argv[5])
        except:
            pass
    
    result = process_with_research(
        title=title,
        summary=summary,
        tags=tags,
        idea_type=idea_type,
        twitter_results=research_data.get("twitter", []),
        kb_results=research_data.get("kb", []),
        web_results=research_data.get("web", [])
    )
    
    print("\n" + "="*60)
    print(json.dumps(result, indent=2))
