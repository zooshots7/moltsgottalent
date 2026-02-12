#!/usr/bin/env python3
"""
Manage content ideas - list, approve, reject, view
"""

import sqlite3
import json
import os
from datetime import datetime
from script_generator import approve_and_generate

DB_PATH = os.path.join(os.path.dirname(__file__), "ideas.db")

def list_ideas(status=None, limit=10):
    """List content ideas"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if status:
        query = """
            SELECT id, date, type, title, status, tags
            FROM content_ideas
            WHERE status = ?
            ORDER BY date DESC, id DESC
            LIMIT ?
        """
        cursor.execute(query, (status, limit))
    else:
        query = """
            SELECT id, date, type, title, status, tags
            FROM content_ideas
            ORDER BY date DESC, id DESC
            LIMIT ?
        """
        cursor.execute(query, (limit,))
    
    ideas = []
    for row in cursor.fetchall():
        ideas.append({
            "id": row[0],
            "date": row[1],
            "type": row[2],
            "title": row[3],
            "status": row[4],
            "tags": row[5]
        })
    
    conn.close()
    return ideas

def get_idea(idea_id):
    """Get full details of an idea"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, date, type, title, slug, summary, tags, status, response, created_at
        FROM content_ideas
        WHERE id = ?
    """, (idea_id,))
    
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        return None
    
    return {
        "id": result[0],
        "date": result[1],
        "type": result[2],
        "title": result[3],
        "slug": result[4],
        "summary": result[5],
        "tags": result[6],
        "status": result[7],
        "response": result[8],
        "created_at": result[9]
    }

def update_status(idea_id, new_status, response=None):
    """Update idea status"""
    valid_statuses = ["pitched", "accepted", "rejected", "archived", "duplicate"]
    
    if new_status not in valid_statuses:
        return {
            "success": False,
            "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        }
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if response:
        cursor.execute("""
            UPDATE content_ideas
            SET status = ?, response = ?
            WHERE id = ?
        """, (new_status, response, idea_id))
    else:
        cursor.execute("""
            UPDATE content_ideas
            SET status = ?
            WHERE id = ?
        """, (new_status, idea_id))
    
    if cursor.rowcount == 0:
        conn.close()
        return {"success": False, "error": f"Idea {idea_id} not found"}
    
    conn.commit()
    conn.close()
    
    return {
        "success": True,
        "idea_id": idea_id,
        "new_status": new_status
    }

def approve_idea(idea_id, generate_script=True):
    """Approve idea and optionally generate script"""
    if generate_script:
        # Use script_generator to approve + generate
        return approve_and_generate(idea_id)
    else:
        # Just update status
        return update_status(idea_id, "accepted")

def reject_idea(idea_id, reason=None):
    """Reject idea with optional reason"""
    return update_status(idea_id, "rejected", response=reason)

def format_idea_list(ideas):
    """Format ideas for display"""
    if not ideas:
        return "No ideas found"
    
    output = []
    for idea in ideas:
        status_emoji = {
            "pitched": "📝",
            "accepted": "✅",
            "rejected": "❌",
            "archived": "📦",
            "duplicate": "🔁"
        }.get(idea["status"], "❓")
        
        type_badge = "📹" if idea["type"] == "short" else "📄"
        
        output.append(
            f"{status_emoji} [{idea['id']}] {type_badge} {idea['title']}\n"
            f"    Status: {idea['status']} | Tags: {idea['tags'] or 'none'}"
        )
    
    return "\n\n".join(output)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python manage.py list [status] [limit]")
        print("  python manage.py view <idea_id>")
        print("  python manage.py approve <idea_id>")
        print("  python manage.py reject <idea_id> [reason]")
        print("  python manage.py status <idea_id> <new_status>")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "list":
        status = sys.argv[2] if len(sys.argv) > 2 else None
        limit = int(sys.argv[3]) if len(sys.argv) > 3 else 10
        ideas = list_ideas(status, limit)
        print(format_idea_list(ideas))
    
    elif command == "view":
        if len(sys.argv) < 3:
            print("Error: Missing idea_id")
            sys.exit(1)
        idea = get_idea(sys.argv[2])
        if idea:
            print(json.dumps(idea, indent=2))
        else:
            print(f"Idea {sys.argv[2]} not found")
    
    elif command == "approve":
        if len(sys.argv) < 3:
            print("Error: Missing idea_id")
            sys.exit(1)
        result = approve_idea(sys.argv[2])
        print(json.dumps(result, indent=2))
    
    elif command == "reject":
        if len(sys.argv) < 3:
            print("Error: Missing idea_id")
            sys.exit(1)
        reason = " ".join(sys.argv[3:]) if len(sys.argv) > 3 else None
        result = reject_idea(sys.argv[2], reason)
        print(json.dumps(result, indent=2))
    
    elif command == "status":
        if len(sys.argv) < 4:
            print("Error: Missing idea_id or new_status")
            sys.exit(1)
        result = update_status(sys.argv[2], sys.argv[3])
        print(json.dumps(result, indent=2))
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
