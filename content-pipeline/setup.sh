#!/bin/bash
# Quick setup script

echo "🚀 Setting up Content Pipeline..."

# Make scripts executable
chmod +x pipeline.py
chmod +x process_idea.py
chmod +x openclaw_interface.py

# Create directories
mkdir -p tasks

# Initialize database
python3 pipeline.py init

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set GEMINI_API_KEY (optional, uses mock embeddings without it)"
echo "2. Test: python3 pipeline.py test 'Test Idea' 'Summary' 'tag1,tag2'"
echo "3. Use from OpenClaw: Just describe your content idea in chat"
