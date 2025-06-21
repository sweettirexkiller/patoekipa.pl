# GitHub Authentication Setup for Admin Panel

## Overview
The admin panel now uses Azure Static Web Apps' built-in GitHub authentication instead of a simple password. This provides secure authentication with invited GitHub users only.

## What's Been Changed

### 1. Admin Panel (`nextjs/src/app/admin/page.tsx`)
- ✅ Removed password authentication form
- ✅ Changed logout button to use `/.auth/logout` endpoint
- ✅ Admin panel now loads directly (authentication handled by Azure)

### 2. Static Web App Configuration (`nextjs/staticwebapp.config.json`)
- ✅ Added `/admin*` route protection requiring `authenticated` role
- ✅ Configured GitHub identity provider
- ✅ Set up client credentials configuration

## Azure Setup Required

### Step 1: Create GitHub OAuth App
1. Go to GitHub.com → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `Patoekipa Admin Panel`
   - **Homepage URL**: `https://your-swa-domain.azurestaticapps.net` (replace with your actual domain)
   - **Authorization callback URL**: `https://your-swa-domain.azurestaticapps.net/.auth/login/github/callback`
4. Click "Register application"
5. Note down the **Client ID** and generate a **Client Secret**

### Step 2: Configure Azure Static Web Apps
1. Go to Azure Portal → Your Static Web App
2. Go to **Configuration** in the left menu
3. Add two new application settings:
   - **Name**: `GITHUB_CLIENT_ID`, **Value**: [Your GitHub Client ID]
   - **Name**: `GITHUB_CLIENT_SECRET`, **Value**: [Your GitHub Client Secret]
4. Click **Save**

### Step 3: Invite Users (Free Tier)
1. In Azure Portal → Your Static Web App
2. Go to **Role management** in the left menu
3. Click **Invite**
4. Enter the GitHub username or email of users you want to invite
5. Select role: **authenticated** (or create custom role if needed)
6. Send invitation

## How It Works

### For Users:
1. Visit `/admin` on your site
2. Automatically redirected to GitHub login if not authenticated
3. After GitHub login, redirected back to admin panel
4. Access granted only to invited users

### Authentication Endpoints:
- **Login**: `/.auth/login/github` (or let Azure handle redirect)
- **Logout**: `/.auth/logout`
- **User Info**: `/.auth/me` (for getting current user info)

## Testing Authentication

### Test Locally (Limited):
- Azure Static Web Apps CLI has limited auth simulation
- Full testing requires deployment to Azure

### Test in Production:
1. Deploy your changes to Azure
2. Visit `https://your-domain.azurestaticapps.net/admin`
3. Should redirect to GitHub login
4. After login, access admin panel

## Optional: Get User Information in Admin Panel

If you want to display the logged-in user's info in the admin panel, you can add this to your React component:

```typescript
const [user, setUser] = useState<any>(null);

useEffect(() => {
  fetch('/.auth/me')
    .then(res => res.json())
    .then(data => {
      if (data.clientPrincipal) {
        setUser(data.clientPrincipal);
      }
    });
}, []);

// Display user info
{user && (
  <div className="p-4 bg-blue-50 rounded-lg">
    <p>Logged in as: <strong>{user.userDetails}</strong></p>
    <p>Provider: {user.identityProvider}</p>
  </div>
)}
```

## Security Benefits
- ✅ No hardcoded passwords
- ✅ Leverages GitHub's security (2FA, etc.)
- ✅ Only invited users can access
- ✅ Automatic session management
- ✅ Secure logout functionality
- ✅ Free tier compatible

## Next Steps
1. Complete Azure setup (Steps 1-3 above)
2. Deploy to Azure Static Web Apps
3. Test authentication flow
4. Invite team members who need admin access

## Troubleshooting
- **403 Forbidden**: User not invited or wrong role
- **Redirect loops**: Check callback URL matches exactly
- **Auth not working**: Verify client ID/secret are set correctly in Azure 