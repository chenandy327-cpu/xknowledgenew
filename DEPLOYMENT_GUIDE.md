# x² Knowledge Nebula 部署指南

## 部署选项

### 选项1：仅前端部署（推荐用于演示）

此选项使用模拟数据，无需后端服务。

#### 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com) 并连接您的 GitHub 账户
3. 导入您的仓库
4. 在构建设置中使用以下配置：
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: `npm run dev`

5. 环境变量设置：
   - `USE_MOCK_DATA`: `true`

#### 部署到 Netlify

1. 连接到 GitHub 并选择您的仓库
2. 构建设置：
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### 选项2：全栈部署

#### 部署后端 (FastAPI)

1. **部署到 Railway**

   - 安装 Railway CLI 或直接连接 GitHub 仓库
   - 添加环境变量：
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_key
     SECRET_KEY=your_secret_key
     ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     ```

2. **更新前端 API 地址**

   修改 `src/services/api.ts` 中的 `API_BASE_URL` 为您的后端地址：
   ```typescript
   const API_BASE_URL = 'https://your-backend-domain.onrender.com/api'; // 或其他域名
   const USE_MOCK_DATA = false; // 禁用模拟数据
   ```

## 管理后台访问

### 本地开发环境

1. 启动后端：`cd backend && python3 main.py`
2. 启动前端：`npm run dev`
3. 访问 `http://localhost:3000`
4. 使用邮箱 `admin@example.com` 登录以访问管理后台

### 生产环境

- 管理后台路径：`/admin`
- 管理员账户：`admin@example.com`
- 注意：确保在生产环境中使用安全的认证机制

## 环境变量

### 前端 (Vite)
```bash
VITE_USE_MOCK_DATA=true # 设置为 false 以连接真实后端
VITE_API_BASE_URL=https://your-backend.com/api
```

### 后端 (FastAPI)
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## CI/CD 配置示例

### GitHub Actions 部署到 Vercel

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
    - name: Deploy to Vercel
      run: |
        npm i -g vercel
        vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

## 管理功能说明

### 管理员权限

- 管理员用户：`admin@example.com`
- 普通用户无管理权限
- 管理后台包含：用户管理、内容管理、系统设置等功能

### 访问控制

- 前端路由控制：非管理员用户无法访问 `/admin` 路径
- 后端权限验证：API 层面验证管理员身份
- 管理员功能包括：
  - 用户管理（查看、删除用户）
  - 内容管理（审核、删除内容）
  - 系统统计（用户数、内容数等）
  - 系统配置