# Deployment Guide for PT Task Manager

This guide will walk you through deploying your PT Task Manager application to GitHub and Vercel.

## Deploying to GitHub

1. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com) and sign in
   - Click the "+" icon in the top-right corner and select "New repository"
   - Name your repository (e.g., "task-manager")
   - Choose public or private visibility
   - Click "Create repository"

2. **Initialize Git in Your Project (if not already done)**
   ```bash
   git init
   ```

3. **Add Your GitHub Repository as Remote**
   ```bash
   git remote add origin https://github.com/yourusername/task-manager.git
   ```

4. **Add, Commit, and Push Your Code**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git push -u origin main
   ```

## Deploying to Vercel

### Option 1: Deploy from GitHub

1. **Create a Vercel Account**
   - Go to [Vercel](https://vercel.com) and sign up or sign in

2. **Import Your GitHub Repository**
   - Click "Add New..." > "Project"
   - Connect to GitHub if not already connected
   - Select your task-manager repository
   - Vercel will automatically detect that it's a React app

3. **Configure Project**
   - Project Name: "pt-task-manager" (or your preferred name)
   - Framework Preset: "Create React App"
   - Root Directory: `.` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `build` (default)

4. **Environment Variables**
   - Add any environment variables if needed (not required for this project)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once complete, you'll get a URL to access your deployed app

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Your Project**
   ```bash
   vercel
   ```

4. **For Production Deployment**
   ```bash
   vercel --prod
   ```

## Continuous Deployment

The GitHub Actions workflows in `.github/workflows/` will automatically:
1. Run CI checks on every push and pull request
2. Deploy to Vercel when changes are pushed to the main branch

### Setting Up GitHub Secrets

For the Vercel deployment workflow to work, you need to add a secret to your GitHub repository:

1. Generate a Vercel token:
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Create a new token
   - Copy the token

2. Add the token to GitHub:
   - Go to your GitHub repository
   - Click "Settings" > "Secrets and variables" > "Actions"
   - Click "New repository secret"
   - Name: `VERCEL_TOKEN`
   - Value: [paste your Vercel token]
   - Click "Add secret"

## Custom Domain (Optional)

To use a custom domain with your Vercel deployment:

1. Go to your project on Vercel
2. Click "Settings" > "Domains"
3. Add your domain and follow the instructions to configure DNS

## Troubleshooting

- **Build Failures**: Check the build logs for errors
- **Deployment Issues**: Verify your package.json has correct build scripts
- **404 Errors**: Ensure vercel.json has proper route configurations
- **Environment Variables**: Check that all required environment variables are set

## Additional Resources

- [GitHub Documentation](https://docs.github.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/) 