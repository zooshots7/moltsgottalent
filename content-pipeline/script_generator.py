#!/usr/bin/env python3
"""
Auto-generate scripts for approved content ideas
Uses Gemini Flash for cost-effective script generation
"""

import os
import sqlite3
import json
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

DB_PATH = os.path.join(os.path.dirname(__file__), "ideas.db")
SCRIPTS_DIR = os.path.join(os.path.dirname(__file__), "scripts")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def generate_script(idea_id: str) -> dict:
    """
    Generate script for an approved idea
    Returns: {success, script_file, error}
    """
    
    # Get idea from database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, type, title, summary, tags, status
        FROM content_ideas
        WHERE id = ?
    """, (idea_id,))
    
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        return {"success": False, "error": f"Idea {idea_id} not found"}
    
    idea = {
        "id": result[0],
        "type": result[1],
        "title": result[2],
        "summary": result[3],
        "tags": result[4],
        "status": result[5]
    }
    
    if idea["status"] != "accepted":
        return {
            "success": False,
            "error": f"Idea is '{idea['status']}', not 'accepted'. Approve it first."
        }
    
    # Generate script using Gemini
    print(f"🎬 Generating script for: {idea['title']}")
    
    prompt = build_script_prompt(idea)
    script_content = call_gemini(prompt)
    
    if not script_content:
        return {"success": False, "error": "Failed to generate script"}
    
    # Save script file
    os.makedirs(SCRIPTS_DIR, exist_ok=True)
    script_file = os.path.join(SCRIPTS_DIR, f"{idea_id}-script.md")
    
    with open(script_file, 'w') as f:
        f.write(generate_script_markdown(idea, script_content))
    
    print(f"✅ Script saved: {script_file}")
    
    return {
        "success": True,
        "script_file": script_file,
        "idea": idea
    }

def build_script_prompt(idea: dict) -> str:
    """Build prompt for script generation"""
    
    content_type = "video script" if idea["type"] == "short" else "long-form article outline and script"
    
    prompt = f"""You are a professional content writer. Generate a {content_type} for the following content idea:

Title: {idea['title']}
Brief: {idea['summary']}
Tags: {idea['tags']}
Type: {idea['type']}-form

"""
    
    if idea["type"] == "short":
        prompt += """For a SHORT-FORM video (TikTok/Reels/Shorts), provide:

1. **Hook** (first 3 seconds) - Attention-grabbing opening
2. **Main Content** (20-40 seconds) - Core message, 3-5 key points
3. **CTA** (last 5 seconds) - Clear call-to-action
4. **Visual Suggestions** - What to show on screen
5. **Captions/Text Overlays** - Key text to display

Keep it punchy, fast-paced, and engaging. Total: 30-60 seconds.
"""
    else:
        prompt += """For LONG-FORM content (YouTube/Blog), provide:

1. **Title Options** (3 variations)
2. **Hook/Intro** (first 30 seconds) - Why this matters
3. **Outline** (main sections with timestamps)
4. **Full Script** (detailed narration for each section)
5. **B-Roll Suggestions** - Visual elements to include
6. **SEO Keywords** - For discoverability
7. **CTA** - End screen action

Make it comprehensive, informative, and structured. Target: 8-15 minutes.
"""
    
    prompt += """
Format your response in clear markdown with headers. Be specific and actionable."""
    
    return prompt

def call_gemini(prompt: str) -> str:
    """Call Gemini API for script generation"""
    
    if not GEMINI_API_KEY:
        return "Mock script content (GEMINI_API_KEY not set)"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 8192,
        }
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code != 200:
        print(f"⚠️  Gemini API error: {response.text}")
        return None
    
    result = response.json()
    return result["candidates"][0]["content"]["parts"][0]["text"]

def generate_script_markdown(idea: dict, script: str) -> str:
    """Format script as markdown file"""
    
    from datetime import datetime
    
    return f"""# {idea['title']}

**ID:** {idea['id']}
**Type:** {idea['type']}-form
**Status:** {idea['status']}
**Tags:** {idea['tags']}

---

{script}

---

*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
*Source Brief: tasks/{idea['id']}.md*
"""

def approve_and_generate(idea_id: str) -> dict:
    """
    Approve an idea and generate its script
    Two-step process: update status → generate script
    """
    
    # Step 1: Update status to "accepted"
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE content_ideas
        SET status = 'accepted'
        WHERE id = ? AND status = 'pitched'
    """, (idea_id,))
    
    if cursor.rowcount == 0:
        conn.close()
        return {
            "success": False,
            "error": f"Idea {idea_id} not found or already processed"
        }
    
    conn.commit()
    conn.close()
    
    print(f"✅ Approved: {idea_id}")
    
    # Step 2: Generate script
    return generate_script(idea_id)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python script_generator.py approve <idea_id>   # Approve + generate")
        print("  python script_generator.py generate <idea_id>  # Generate only (must be approved)")
        sys.exit(1)
    
    command = sys.argv[1]
    idea_id = sys.argv[2] if len(sys.argv) > 2 else None
    
    if command == "approve" and idea_id:
        result = approve_and_generate(idea_id)
        print(json.dumps(result, indent=2))
    
    elif command == "generate" and idea_id:
        result = generate_script(idea_id)
        print(json.dumps(result, indent=2))
    
    else:
        print("Invalid command or missing idea_id")
        sys.exit(1)
