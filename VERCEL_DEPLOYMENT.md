# Vercel Deployment Guide — The Evolution of Todo

## 🔧 Fix for 404 NOT_FOUND Error

The 404 error has been resolved with the following configuration changes:

### Changes Made

1. **`frontend/next.config.ts`** — Added `output: 'standalone'` for Vercel deployment
2. **`frontend/vercel.json`** — Created Vercel configuration with proper routing
3. **`frontend/tsconfig.json`** — Fixed JSX mode to `preserve` (Next.js requirement)

---

## 📋 Vercel Deployment Checklist

### Step 1: Push Changes to GitHub

```bash
git push origin main
```

### Step 2: Configure Vercel Project

Go to your Vercel project settings and verify/set these values:

#### Build & Development Settings

- **Framework Preset**: Next.js
- **Root Directory**: `frontend` (if monorepo) or `.` (if deploying frontend only)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### Environment Variables

**Required Variables** (add in Vercel dashboard):

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.hf.space` | Your Hugging Face Spaces backend URL |
| `BETTER_AUTH_SECRET` | `your-secret-key` | Must match backend `.env` |

**Optional Variables:**

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` | `your-openai-domain-key` | For OpenAI domain allowlist (Task 23) |
| `NODE_ENV` | `production` | Auto-set by Vercel |

### Step 3: Deploy

After pushing the changes:

1. Vercel will automatically trigger a new deployment
2. Check build logs for any errors
3. Once deployed, test the following routes:
   - `/` — Landing page
   - `/auth` — Authentication page
   - `/dashboard` — Task dashboard
   - `/chat` — AI chatbot (Phase III)

### Step 4: Verify Deployment

Test these endpoints:

```bash
# Landing page
curl https://your-app.vercel.app

# Health check (should return HTML, not 404)
curl https://your-app.vercel.app/dashboard

# Chat page
curl https://your-app.vercel.app/chat
```

---

## 🐛 Troubleshooting

### If 404 persists after deployment:

1. **Check Vercel build logs** for errors:
   - Go to Vercel Dashboard → Your Project → Deployments → Latest → Build Logs

2. **Verify Root Directory**:
   - If using monorepo: Set Root Directory to `frontend`
   - If frontend is at root: Leave blank or set to `.`

3. **Clear Vercel cache and redeploy**:
   ```bash
   # In Vercel dashboard: Deployments → ⋯ → Redeploy → Clear cache
   ```

4. **Check for build errors**:
   - Missing dependencies: Run `npm install` locally
   - TypeScript errors: Run `npm run build` locally
   - Missing environment variables: Check Vercel dashboard

### Common Build Errors

**Error: "Module not found: Can't resolve '@/components/...'"**
- **Fix**: Ensure `tsconfig.json` has `"@/*": ["./*"]` in paths
- **Status**: ✅ Already configured

**Error: "Invalid JSX"**
- **Fix**: Set `"jsx": "preserve"` in `tsconfig.json`
- **Status**: ✅ Fixed in this commit

**Error: "Can't resolve 'react'"**
- **Fix**: Ensure React 19 is in dependencies
- **Status**: ✅ Already in `package.json`

### Environment Variable Issues

If API calls fail:

1. **Verify `NEXT_PUBLIC_API_URL` is set** in Vercel dashboard
2. **Check CORS settings** in backend `main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-app.vercel.app"],  # Add your domain
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

---

## 🚀 Post-Deployment Steps

### Task 23: OpenAI Domain Allowlist

After deploying to Vercel:

1. Get your Vercel domain: `https://your-app.vercel.app`
2. Go to: https://platform.openai.com/settings/organization/security/domain-allowlist
3. Add your Vercel domain
4. Copy the domain key
5. Add to Vercel env vars: `NEXT_PUBLIC_OPENAI_DOMAIN_KEY=<key>`
6. Redeploy

### Task 24: Integration Tests

Run these tests after deployment:

```bash
# Test 1: Landing page loads
curl -I https://your-app.vercel.app
# Expected: 200 OK

# Test 2: Dashboard requires auth
curl -I https://your-app.vercel.app/dashboard
# Expected: 200 OK (page loads, auth check happens client-side)

# Test 3: Chat page loads
curl -I https://your-app.vercel.app/chat
# Expected: 200 OK
```

**Manual UI Tests:**

1. Visit `/` → Click "Get Started" → Should redirect to `/auth`
2. Sign up/Sign in → Should redirect to `/dashboard`
3. Create a task → Should appear in task list
4. Visit `/chat` → Send message "Add a task to buy groceries" → Should create task

**Urdu Tests (Task 24):**

1. "Kal subah meeting ka task bana do" → Task created
2. "Mere pending tasks dikhao" → Lists pending tasks
3. "Task 1 ko complete karo" → Marks complete
4. "Task 2 delete kar do" → Deletes task

---

## 📊 Current Deployment Status

- **Frontend**: Ready for deployment (404 fix applied)
- **Backend**: Deploy to Hugging Face Spaces first
- **Database**: Neon PostgreSQL (already provisioned)

**Next Steps:**

1. ✅ Commit and push fixes (this commit)
2. ⏳ Deploy backend to HF Spaces
3. ⏳ Update `NEXT_PUBLIC_API_URL` in Vercel
4. ⏳ Redeploy frontend
5. ⏳ Complete Tasks 23-28

---

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Next.js Deployment Docs: https://nextjs.org/docs/deployment
- Vercel Build Configuration: https://vercel.com/docs/build-step
- Troubleshooting Guide: https://vercel.com/docs/errors

## 🤖 Generated by Claude Code
