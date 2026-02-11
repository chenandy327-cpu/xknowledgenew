# x² Knowledge Nebula Deployment Guide

## 1. System Requirements

### 1.1 Hardware Requirements
- **Minimum**: 2 GB RAM, 1 CPU core, 20 GB disk space
- **Recommended**: 4 GB RAM, 2 CPU cores, 40 GB disk space

### 1.2 Software Requirements
- **Operating System**: Ubuntu 20.04 LTS or later, macOS 12.0 or later, Windows 10 or later
- **Node.js**: v16.0.0 or later
- **Python**: v3.10.0 or later
- **PostgreSQL**: v14.0 or later (if not using Supabase)
- **Git**: v2.20.0 or later

## 2. Deployment Architecture

### 2.1 Recommended Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Vite)        │────│   (FastAPI)     │────│   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.2 Alternative Architectures
- **Full Stack Deployment**: Deploy frontend and backend on the same server
- **Containerized Deployment**: Use Docker containers for both frontend and backend
- **Cloud Deployment**: Use managed services like Vercel for frontend and Heroku for backend

## 3. Environment Setup

### 3.1 Frontend Environment

#### 3.1.1 Install Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node

# Windows
# Download and install from https://nodejs.org/en/download/
```

#### 3.1.2 Install Dependencies
```bash
cd /path/to/project
npm install
```

### 3.2 Backend Environment

#### 3.2.1 Install Python
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv

# macOS
brew install python

# Windows
# Download and install from https://www.python.org/downloads/
```

#### 3.2.2 Create Virtual Environment
```bash
cd /path/to/project/backend
python3 -m venv venv

# Activate virtual environment
# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

#### 3.2.3 Install Dependencies
```bash
pip install -r requirements.txt
```

### 3.3 Database Setup

#### 3.3.1 Using Supabase (Recommended)
1. **Create Supabase Account**:
   - Go to [Supabase](https://supabase.com/)
   - Sign up for an account
   - Create a new project

2. **Get Project Credentials**:
   - In your Supabase project dashboard, go to Settings > API
   - Copy the `Project URL` and `anon` key

3. **Configure Environment Variables**:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     SUPABASE_URL=your-project-url
     SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

#### 3.3.2 Using Local PostgreSQL (Alternative)
1. **Install PostgreSQL**:
   - Follow the instructions for your operating system

2. **Create Database**:
   ```bash
   createdb knowledge_nebula
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/knowledge_nebula
     ```

## 4. Configuration

### 4.1 Frontend Configuration

#### 4.1.1 Environment Variables
Create a `.env` file in the frontend directory:
```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8000/api

# Supabase Configuration (if using direct frontend access)
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4.2 Backend Configuration

#### 4.2.1 Environment Variables
Create a `.env` file in the backend directory:
```env
# Database Configuration
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# Application Configuration
APP_NAME="x² Knowledge Nebula"
DEBUG=True
```

## 5. Deployment Steps

### 5.1 Backend Deployment

#### 5.1.1 Start Development Server
```bash
cd /path/to/project/backend
uvicorn app.main:app --reload
```

#### 5.1.2 Deploy to Production

##### 5.1.2.1 Using Heroku
1. **Install Heroku CLI**:
   ```bash
   # Ubuntu/Debian
   curl https://cli-assets.heroku.com/install.sh | sh

   # macOS
   brew tap heroku/brew && brew install heroku

   # Windows
   # Download and install from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku App**:
   ```bash
   heroku create knowledge-nebula-backend
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set SUPABASE_URL=your-project-url
   heroku config:set SUPABASE_ANON_KEY=your-anon-key
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set ALGORITHM=HS256
   heroku config:set ACCESS_TOKEN_EXPIRE_MINUTES=30
   heroku config:set BACKEND_CORS_ORIGINS=["https://your-frontend-domain.com"]
   heroku config:set APP_NAME="x² Knowledge Nebula"
   heroku config:set DEBUG=False
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```

6. **Run Database Migrations**:
   ```bash
   heroku run python -m app.db.migrate
   ```

##### 5.1.2.2 Using Docker
1. **Create Dockerfile**:
   ```dockerfile
   FROM python:3.10-slim

   WORKDIR /app

   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   COPY . .

   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Build and Run**:
   ```bash
   docker build -t knowledge-nebula-backend .
   docker run -p 8000:8000 --env-file .env knowledge-nebula-backend
   ```

### 5.2 Frontend Deployment

#### 5.2.1 Build for Production
```bash
cd /path/to/project
npm run build
```

#### 5.2.2 Deploy to Production

##### 5.2.2.1 Using Vercel
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   - In the Vercel dashboard, go to your project settings
   - Add the required environment variables

##### 5.2.2.2 Using Netlify
1. **Create Netlify Account**:
   - Go to [Netlify](https://www.netlify.com/)
   - Sign up for an account

2. **Deploy**:
   - Click "New site from Git"
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Set Environment Variables**:
   - In the Netlify dashboard, go to your site settings
   - Add the required environment variables

##### 5.2.2.3 Using GitHub Pages
1. **Update vite.config.ts**:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/knowledge-nebula/' // Replace with your repository name
   })
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

## 6. Database Management

### 6.1 Supabase Dashboard
1. **Access Supabase Dashboard**:
   - Go to [Supabase](https://supabase.com/)
   - Log in to your account
   - Select your project

2. **Database Management**:
   - **Tables**: View and edit database tables
   - **SQL Editor**: Run custom SQL queries
   - **Authentication**: Manage users and authentication
   - **Storage**: Manage uploaded files

### 6.2 Database Migrations

#### 6.2.1 Creating Migrations
```bash
cd /path/to/project/backend
python -m app.db.migrate
```

#### 6.2.2 Running Migrations
```bash
cd /path/to/project/backend
python -m app.db.migrate
```

## 7. Monitoring and Maintenance

### 7.1 Logs

#### 7.1.1 Frontend Logs
- **Vercel/Netlify**: Check the dashboard for deployment and runtime logs
- **GitHub Pages**: Check the GitHub Actions logs for deployment issues

#### 7.1.2 Backend Logs
- **Heroku**: `heroku logs --tail`
- **Docker**: `docker logs container-id`
- **Local Development**: Check the console output

### 7.2 Performance Monitoring

#### 7.2.1 Frontend Performance
- **Lighthouse**: Run Google Lighthouse audits
- **WebPageTest**: Test performance from different locations
- **New Relic**: Set up frontend monitoring

#### 7.2.2 Backend Performance
- **Heroku Metrics**: Check the Heroku dashboard for performance metrics
- **New Relic**: Set up backend monitoring
- **Datadog**: Monitor server performance

### 7.3 Security Monitoring

#### 7.3.1 Regular Security Audits
- **OWASP ZAP**: Run regular security scans
- **Snyk**: Monitor dependencies for vulnerabilities
- **Dependabot**: Enable automatic dependency updates

#### 7.3.2 Security Best Practices
- Keep dependencies up to date
- Use HTTPS for all connections
- Implement rate limiting
- Use strong passwords and encryption

## 8. Backup and Recovery

### 8.1 Database Backups

#### 8.1.1 Supabase Backups
- Supabase automatically creates daily backups
- Access backups in the Supabase dashboard under Settings > Database > Backups

#### 8.1.2 Manual Backups
```bash
# Using pg_dump (if using PostgreSQL directly)
pg_dump -d knowledge_nebula > backup.sql
```

### 8.2 Recovery

#### 8.2.1 From Supabase Backup
- In the Supabase dashboard, go to Settings > Database > Backups
- Select a backup and click "Restore"

#### 8.2.2 From Manual Backup
```bash
# Using psql (if using PostgreSQL directly)
psql -d knowledge_nebula < backup.sql
```

## 9. Troubleshooting

### 9.1 Common Issues

#### 9.1.1 Frontend Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Blank page | Missing environment variables | Check VITE_API_BASE_URL is set correctly |
| API errors | Backend not running | Start the backend server |
| CORS errors | Backend CORS configuration | Update BACKEND_CORS_ORIGINS in backend .env |

#### 9.1.2 Backend Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Server won't start | Missing dependencies | Run `pip install -r requirements.txt` |
| Database connection errors | Incorrect database URL | Check SUPABASE_URL and SUPABASE_ANON_KEY |
| Authentication errors | Invalid JWT secret | Check SECRET_KEY in backend .env |

#### 9.1.3 Deployment Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Deployment failed | Build errors | Check the build logs for details |
| Environment variables not set | Missing variables in deployment platform | Add environment variables in the platform dashboard |
| 500 errors | Runtime errors | Check the server logs for details |

### 9.2 Debugging

#### 9.2.1 Frontend Debugging
- **Browser DevTools**: Use the console and network tabs
- **React DevTools**: Install the React DevTools extension
- **Vite Dev Server**: Run `npm run dev` for hot reloading

#### 9.2.2 Backend Debugging
- **FastAPI Docs**: Access `/docs` for interactive API documentation
- **Python Debugger**: Use `import pdb; pdb.set_trace()` for breakpoints
- **Logging**: Check the server logs for error messages

## 10. Scaling

### 10.1 Horizontal Scaling

#### 10.1.1 Frontend Scaling
- **CDN**: Use a content delivery network for static assets
- **Multiple Regions**: Deploy to multiple regions for global coverage
- **Caching**: Implement browser and server-side caching

#### 10.1.2 Backend Scaling
- **Load Balancing**: Use a load balancer to distribute traffic
- **Auto-scaling**: Configure auto-scaling based on traffic
- **Database Scaling**: Use read replicas for high traffic

### 10.2 Vertical Scaling

#### 10.2.1 Frontend Scaling
- **Bundle Optimization**: Reduce bundle size with code splitting
- **Image Optimization**: Use responsive images and lazy loading
- **Code Optimization**: Optimize critical rendering path

#### 10.2.2 Backend Scaling
- **Database Optimization**: Add indexes and optimize queries
- **Caching**: Implement Redis for caching
- **Connection Pooling**: Use connection pooling for database connections

## 11. Continuous Integration/Continuous Deployment (CI/CD)

### 11.1 GitHub Actions

#### 11.1.1 Frontend CI/CD
Create `.github/workflows/frontend.yml`:
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 16
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
    - name: Deploy to Vercel
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      run: |
        npm install -g vercel
        vercel deploy --prod
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

#### 11.1.2 Backend CI/CD
Create `.github/workflows/backend.yml`:
```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r backend/requirements.txt
    - name: Test
      run: |
        cd backend
        python -m pytest
    - name: Deploy to Heroku
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      run: |
        git remote add heroku https://heroku:$HEROKU_API_KEY@git.heroku.com/knowledge-nebula-backend.git
        git push heroku main
      env:
        HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
```

## 12. Appendix

### 12.1 Environment Variable Reference

#### 12.1.1 Frontend Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| VITE_API_BASE_URL | Base URL for backend API | Yes | http://localhost:8000/api |
| VITE_SUPABASE_URL | Supabase project URL | No | - |
| VITE_SUPABASE_ANON_KEY | Supabase anon key | No | - |

#### 12.1.2 Backend Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| SUPABASE_URL | Supabase project URL | Yes | - |
| SUPABASE_ANON_KEY | Supabase anon key | Yes | - |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key | Yes | - |
| SECRET_KEY | JWT secret key | Yes | - |
| ALGORITHM | JWT algorithm | Yes | HS256 |
| ACCESS_TOKEN_EXPIRE_MINUTES | Access token expiration | Yes | 30 |
| BACKEND_CORS_ORIGINS | CORS allowed origins | Yes | ["http://localhost:3000"] |
| APP_NAME | Application name | No | x² Knowledge Nebula |
| DEBUG | Debug mode | No | False |

### 12.2 Command Reference

#### 12.2.1 Frontend Commands

| Command | Description |
|---------|-------------|
| npm run dev | Start development server |
| npm run build | Build for production |
| npm run preview | Preview production build |
| npm run lint | Run linter |

#### 12.2.2 Backend Commands

| Command | Description |
|---------|-------------|
| uvicorn app.main:app --reload | Start development server |
| python -m app.db.migrate | Run database migrations |
| python -m pytest | Run tests |

### 12.3 Resources

- **React Documentation**: https://reactjs.org/docs/
- **FastAPI Documentation**: https://fastapi.tiangolo.com/docs/
- **Supabase Documentation**: https://supabase.com/docs
- **Vite Documentation**: https://vitejs.dev/guide/
- **Heroku Documentation**: https://devcenter.heroku.com/
- **Vercel Documentation**: https://vercel.com/docs
- **Netlify Documentation**: https://docs.netlify.com/

## 13. Conclusion

This deployment guide provides a comprehensive overview of how to deploy and maintain the x² Knowledge Nebula platform. By following these instructions, you can set up a production-ready deployment that is secure, scalable, and reliable.

For additional assistance, please refer to the official documentation of the technologies used or contact the development team.
