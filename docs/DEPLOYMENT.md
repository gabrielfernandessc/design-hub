# Deployment Guide

## Overview

Design Hub uses:

- **Vercel** for frontend (static/SSR)
- **Railway** for backend API and database

## Prerequisites

1. GitHub account
2. Vercel account (https://vercel.com)
3. Railway account (https://railway.app)
4. Stripe account (https://stripe.com)

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/design-hub.git
git push -u origin main
```

## Step 2: Setup Railway (Backend + Database)

### 2.1 Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository

### 2.2 Add PostgreSQL

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Wait for database to be created
4. Copy the `DATABASE_URL` from the Connect tab

### 2.3 Configure Environment Variables

In Railway, go to Settings → Variables and add:

```
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2.4 Deploy

Railway will automatically deploy when you push to GitHub.

## Step 3: Setup Vercel (Frontend)

### 3.1 Create Vercel Project

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Other
   - Root Directory: apps/web
   - Build Command: bun run build
   - Output Directory: dist

### 3.2 Configure Environment Variables

In Vercel, go to Settings → Environment Variables and add:

```
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3.3 Deploy

Vercel will automatically deploy when you push to GitHub.

## Step 4: Setup Stripe Webhooks

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://your-app.up.railway.app/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret and add to Railway env vars

## Step 5: Configure Custom Domains (Optional)

### Railway

1. Go to your service in Railway
2. Settings → Networking
3. Click "Generate Domain" or add custom domain

### Vercel

1. Go to your project in Vercel
2. Settings → Domains
3. Add your custom domain

## Environment Variables Reference

| Variable               | Description                  | Where to set |
| ---------------------- | ---------------------------- | ------------ |
| DATABASE_URL           | PostgreSQL connection string | Railway      |
| JWT_SECRET             | Secret for JWT tokens        | Railway      |
| STRIPE_SECRET_KEY      | Stripe secret key            | Railway      |
| STRIPE_PUBLISHABLE_KEY | Stripe publishable key       | Vercel       |
| STRIPE_WEBHOOK_SECRET  | Stripe webhook secret        | Railway      |
| NEXT_PUBLIC_APP_URL    | Frontend URL                 | Railway      |
| NEXT_PUBLIC_API_URL    | Backend API URL              | Vercel       |

## Troubleshooting

### CORS Errors

- Ensure `NEXT_PUBLIC_APP_URL` is set correctly in Railway
- Ensure `NEXT_PUBLIC_API_URL` is set correctly in Vercel

### Database Connection Issues

- Check DATABASE_URL is correct
- Ensure Railway PostgreSQL is running
- Check IP whitelist if using external database

### Stripe Webhook Issues

- Verify webhook URL is correct
- Check webhook signing secret matches
- Look at Stripe webhook logs for errors

## Monitoring

### Railway

- View logs in the Deployments tab
- Monitor resource usage in Metrics tab

### Vercel

- View function logs in the Logs tab
- Monitor performance in Analytics tab

## Updates

To update the application:

1. Make changes to code
2. Commit and push to GitHub
3. Vercel and Railway will auto-deploy

For manual deployments:

- Railway: Click "Deploy" in the dashboard
- Vercel: Click "Redeploy" in the dashboard
