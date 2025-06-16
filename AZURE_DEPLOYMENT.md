# Azure Static Web Apps Deployment Guide

This guide will help you deploy your Next.js application to Azure Static Web Apps.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Azure CLI** (optional): For command-line deployment

## Deployment Steps

### Option 1: Deploy via Azure Portal (Recommended)

1. **Create Azure Static Web App**:
   - Go to [Azure Portal](https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Static Web App" and select it
   - Click "Create"

2. **Configure the Static Web App**:
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or select existing
   - **Name**: Choose a unique name for your app
   - **Plan type**: Select "Free" for development or "Standard" for production
   - **Region**: Choose the closest region to your users
   - **Source**: Select "GitHub"

3. **Connect to GitHub**:
   - Sign in to GitHub when prompted
   - **Organization**: Select your GitHub organization/username
   - **Repository**: Select this repository (`patoekipa.pl`)
   - **Branch**: Select your main branch (usually `main` or `master`)

4. **Build Configuration**:
   - **Build Presets**: Select "Next.js"
   - **App location**: `/nextjs`
   - **API location**: Leave empty (no API)
   - **Output location**: `out`

5. **Review and Create**:
   - Review all settings
   - Click "Create"

### Option 2: Deploy via Azure CLI

```bash
# Install Azure CLI if not already installed
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login to Azure
az login

# Create resource group (if needed)
az group create --name myResourceGroup --location "East US 2"

# Create static web app
az staticwebapp create \
  --name myNextjsApp \
  --resource-group myResourceGroup \
  --source https://github.com/YOUR_USERNAME/patoekipa.pl \
  --location "East US 2" \
  --branch main \
  --app-location "/nextjs" \
  --output-location "out" \
  --login-with-github
```

## What Happens After Deployment

1. **GitHub Actions Workflow**: Azure automatically creates a GitHub Actions workflow file in your repository
2. **Automatic Builds**: Every push to your main branch triggers a new deployment
3. **Pull Request Previews**: Pull requests get preview deployments automatically
4. **Custom Domain**: You can configure a custom domain in the Azure portal

## Configuration Files Created

- **`.github/workflows/azure-static-web-apps.yml`**: GitHub Actions workflow for CI/CD
- **`nextjs/staticwebapp.config.json`**: Azure SWA configuration for routing
- **`nextjs/next.config.js`**: Updated with static export settings

## Important Notes

1. **Static Export**: Your Next.js app is configured for static export (`output: 'export'`)
2. **Image Optimization**: Disabled (`unoptimized: true`) as required for static export
3. **API Routes**: Server-side API routes won't work with static export
4. **Rewrites**: Custom rewrites don't work with static export

## Accessing Your Deployed App

After deployment:
1. Go to your Azure Static Web App resource in the portal
2. Click on the URL shown in the "Overview" section
3. Your app will be available at: `https://YOUR_APP_NAME.azurestaticapps.net`

## Custom Domain Setup

1. In Azure portal, go to your Static Web App
2. Click "Custom domains" in the left menu
3. Click "Add" and follow the instructions
4. Add DNS records as instructed by Azure

## Environment Variables

To add environment variables:
1. Go to your Static Web App in Azure portal
2. Click "Configuration" in the left menu
3. Add your environment variables
4. Redeploy your app

## Troubleshooting

- **Build Failures**: Check the GitHub Actions logs in your repository
- **Routing Issues**: Verify `staticwebapp.config.json` configuration
- **404 Errors**: Ensure your routes are properly configured for static export

## Cost

- **Free Tier**: 100 GB bandwidth, 0.5 GB storage, custom domains
- **Standard Tier**: 100 GB bandwidth, 0.5 GB storage, staging environments, custom authentication

For more information, visit the [Azure Static Web Apps documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/). 