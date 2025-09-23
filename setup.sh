#!/bin/bash

# Fashion TryOn Studio Setup Script

echo "🚀 Setting up Fashion TryOn Studio..."

# Copy environment template
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
    echo "⚠️  Please edit .env.local with your OpenRouter API key"
else
    echo "ℹ️  .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your OpenRouter API key"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:5173 in your browser"