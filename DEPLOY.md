# 部署指南

## 免费部署方案

### 第一步：部署后端 (Railway)

1. 访问 https://railway.app 并用 GitHub 登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 连接你的 GitHub 仓库
4. Railway 会自动检测 Node.js 项目并部署
5. 部署完成后，记下你的后端 URL（例如：`https://your-app.up.railway.app`）

### 第二步：部署前端 (Vercel)

1. 访问 https://vercel.com 并用 GitHub 登录
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. 在环境变量中添加：
   - `VITE_API_URL`: 你的 Railway 后端地址（例如：`https://your-app.up.railway.app`）
5. 点击 "Deploy"

### 第三步：更新配置

部署完成后：
1. 记下 Vercel 给你的域名（例如：`your-app.vercel.app`）
2. 更新 Railway 后端的 CORS 配置允许这个域名
3. 更新 vercel.json 中的后端地址

---

## 替代方案：Cloudflare Pages + Workers

如果想更简单，可以使用 Cloudflare：
- Pages 托管前端
- Workers 运行后端 API

---

## 本地测试

如果只是想本地使用：
```bash
npm install
npm run dev
# 访问 http://localhost:5173
```
