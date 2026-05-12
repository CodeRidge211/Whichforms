# AXIS Deployment to Railway

This guide walks you through deploying AXIS to Railway with PostgreSQL.

## Prerequisites
- [Railway account](https://railway.app)
- [Railway CLI](https://docs.railway.app/ Railway/cli/installation)

## Step 1: Fork/Clone the Repository

```bash
git clone <your-repo-url>
cd axis
```

## Step 2: Set Up Railway Project

### Option A: Via Railway CLI
```bash
railway login
railway init
# Select "Empty Project" or connect to your GitHub repo
```

### Option B: Via Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect to GitHub repository

## Step 3: Add PostgreSQL Database

1. In Railway dashboard, click on your project
2. Click "Add Plugin" or "+ New"
3. Select "PostgreSQL" from the database options
4. Railway will automatically set `DATABASE_URL` environment variable

## Step 4: Configure Environment Variables

In Railway dashboard, add the following environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `ANTHROPIC_API_KEY` | `sk-...` | Your Anthropic API key |
| `TWILIO_ACCOUNT_SID` | `AC...` | Optional - for SMS |
| `TWILIO_AUTH_TOKEN` | `...` | Optional - for SMS |
| `TWILIO_PHONE_NUMBER` | `+1...` | Optional - for SMS |
| `PORT` | `3000` | Railway sets this automatically |

### Optional: Error Tracking & Analytics

| Variable | Value | Notes |
|----------|-------|-------|
| `SENTRY_DSN` | `https://xxx@sentry.io/xxx` | Sentry error tracking (free tier) |
| `GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics 4 |

**Sentry Setup:**
1. Create account at [sentry.io](https://sentry.io)
2. Create project → Copy DSN
3. Add to Railway variables

**Google Analytics Setup:**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create GA4 property → Add Web stream
3. Copy Measurement ID (G-XXXXXXXXXX)
4. Add to Railway variables

## Step 5: Deploy

### Option A: Automatic Deploy (GitHub)
1. Push your code to GitHub
2. Connect repository to Railway project
3. Railway auto-deploys on push

### Option B: Manual Deploy (CLI)
```bash
railway up
```

## Step 6: Run Database Migrations

```bash
# Run migrations
railway run npx prisma migrate deploy

# Seed the database (optional)
railway run npm run db:seed
```

Or use Railway's release phase in `railway.json`:
```json
{
  "deploy": {
    "releaseCommand": "npx prisma migrate deploy"
  }
}
```

## Step 7: Verify Deployment

Check the health endpoint:
```bash
curl https://your-railway-app.railway.app/health
```

## HTTPS & Custom Domain Configuration

### Railway Automatic HTTPS
Railway provides automatic HTTPS for all deployments. No additional SSL configuration is needed - Railway's load balancer handles SSL termination automatically.

### Custom Domain Setup
1. In Railway dashboard, go to your project → Settings → Domains
2. Add your custom domain (e.g., `axis.yourdomain.com`)
3. Configure DNS to point to Railway's deployment URL
4. Railway automatically provisions SSL certificate

### CORS Configuration for Custom Domains
Update your Railway environment variables to restrict CORS:

| Variable | Value |
|----------|-------|
| `CORS_ORIGINS` | `https://axis.yourdomain.com,https://www.yourdomain.com` |

For local development, CORS is set to `*` (allow all). In production with Railway, update `server.js` line ~27 to use the CORS_ORIGINS environment variable:

```javascript
app.use(cors({ 
  origin: process.env.CORS_ORIGINS?.split(',') || '*', 
  credentials: true 
}));
```

## Monitoring

### Railway Dashboard
- View logs: `railway logs`
- Check status: `railway status`
- Environment variables: `railway variables`
- Metrics: Built-in Railway metrics in dashboard

### Sentry (Error Tracking)
Errors are automatically captured and reported to Sentry when `SENTRY_DSN` is configured. View error details, stack traces, and user context in your Sentry dashboard.

### Health Check
```bash
curl https://your-railway-app.railway.app/health
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set in Railway environment variables
- Check PostgreSQL plugin is active in Railway dashboard

### Prisma Client Errors
- Ensure `postinstall` script runs `prisma generate`
- Check binary targets in `schema.prisma` if using custom targets

### Build Failures
- Verify Node.js version (18+) is specified in `package.json`
- Check build logs in Railway dashboard

## Project Structure for Deployment

```
axis/
├── server.js           # Main entry point
├── package.json        # Scripts and dependencies
├── railway.json        # Railway configuration
├── prisma/
│   └── schema.prisma   # Database schema
├── lib/                # Core modules
│   ├── personaRouter.js
│   ├── pingScheduler.js
│   ├── habitLearner.js
│   ├── multilingualRouter.js
│   └── twilioService.js
└── public/             # Static files (PWA)
    ├── index.html
    ├── manifest.json
    └── sw.js
```

## Monitoring

- View logs: `railway logs`
- Check status: `railway status`
- Environment variables: `railway variables`

## Scaling

To scale AXIS:
1. Upgrade Railway plan for more resources
2. Adjust `numReplicas` in `railway.json`
3. Consider Railway's built-in metrics
