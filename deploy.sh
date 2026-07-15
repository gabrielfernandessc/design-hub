#!/bin/bash

# Design Hub Deployment Script

echo "🚀 Starting deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run 'git init' first."
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes."
    read -p "Do you want to commit them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S')"
    fi
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "📦 Railway will auto-deploy the backend"
echo "🌐 Vercel will auto-deploy the frontend"
echo ""
echo "Monitor deployment status:"
echo "  - Railway: https://railway.app"
echo "  - Vercel: https://vercel.com"
