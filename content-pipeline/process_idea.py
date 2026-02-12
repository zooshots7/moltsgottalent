#!/usr/bin/env python3
"""
Main pipeline orchestrator - call this from OpenClaw
"""

import sys
import json
from pipeline import (
    init_db, check_duplicates, save_idea, create_task,
    get_embedding, format_research_results
)

def process_content_idea(topic: str, idea_type: str = "short") -> Dict:
    """
    Process a content idea through the full pipeline
    
    Returns: {
        "success": bool,
        "idea_id": str or None,
        "duplicate": bool,
        "matches": list,
        "task_file": str or None,
        "message": str
    }
    """
    
    # Parse input - extract title and tags if provided
    parts = topic.split("|")
    title = parts[0].strip()
    tags = parts[1].strip() if len(parts) > 1 else ""
    
    idea = {
        "title": title,
        "summary": title,  # Will be enhanced by OpenClaw before calling
        "type": idea_type,
        "tags": tags
    }
    
    # Step 2: Dedupe check (research will be done by OpenClaw)
    is_duplicate, similar = check_duplicates(idea)
    
    if is_duplicate:
        return {
            "success": False,
            "idea_id": None,
            "duplicate": True,
            "matches": similar,
            "task_file": None,
            "message": f"❌ Duplicate detected! {len(similar)} similar idea(s) found."
        }
    
    # Step 3: Save idea
    embedding = get_embedding(f"{idea['title']} {idea['summary']}")
    idea_id = save_idea(idea, embedding)
    
    # Step 4: Create task (research results will be added by OpenClaw)
    task_file = create_task(idea, idea_id, {})
    
    return {
        "success": True,
        "idea_id": idea_id,
        "duplicate": False,
        "matches": [],
        "task_file": task_file,
        "message": f"✅ Idea saved as {idea_id}"
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "message": "Usage: python process_idea.py 'topic description' [type]"
        }))
        sys.exit(1)
    
    # Initialize DB if needed
    try:
        init_db()
    except:
        pass
    
    topic = sys.argv[1]
    idea_type = sys.argv[2] if len(sys.argv) > 2 else "short"
    
    result = process_content_idea(topic, idea_type)
    print(json.dumps(result, indent=2))
