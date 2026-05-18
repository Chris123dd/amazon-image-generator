# 亚马逊主图生成器

一款 AI 驱动的亚马逊产品图片生成工具，帮助卖家快速生成一整套（7张）高质量、风格一致的产品展示图片。

## ✨ 功能特性

- 🤖 **多 AI 引擎支持** - Stable Diffusion、DALL-E 3、Gemini、豆包等
- 📷 **7 张套图生成** - 一次性配置，批量生成全套产品图片
- 📋 **模板管理** - 保存和加载配置模板，提高重复使用效率
- 📜 **历史记录** - 查看和管理历史生成记录
- 🔑 **API 密钥配置** - 在本地安全管理各 AI 服务的密钥
- 📥 **一键下载** - 打包下载全套生成图片

## 🛠️ 技术栈

- **前端** - React 18 + TypeScript + Tailwind CSS 3 + Vite
- **后端** - Node.js + Express
- **状态管理** - Zustand
- **AI 服务** - Replicate、OpenAI、Google AI、火山引擎等
- **图像处理** - Sharp
- **UI 组件** - Lucide React 图标

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

同时启动前端和后端：

```bash
npm run dev
```

或者分别启动：

```bash
# 启动前端
npm run client:dev

# 启动后端
npm run server:dev
```

- 前端将在 `http://localhost:5173` 运行
- 后端将在 `http://localhost:3001` 运行

### 构建

```bash
npm run build
```

### 代码检查

```bash
# 类型检查
npm run check

# ESLint 检查
npm run lint
```

## 📖 使用说明

1. **上传产品图** - 在首页上传白底产品原图
2. **选择 AI 引擎** - 选择你想用的 AI 图像生成引擎
3. **配置 API 密钥** - 在设置页面配置对应 AI 服务的 API 密钥
4. **配置 7 张图** - 为每张图片设置提示词和参考图（可选）
5. **保存模板（可选）** - 如果需要，可以保存配置为模板
6. **开始生成** - 点击"开始生成"按钮
7. **下载图片** - 生成完成后，一键下载全套图片

## 📁 项目结构

```
/workspace
├── /src              # 前端源码
│   ├── /components   # React 组件
│   ├── /pages        # 页面组件
│   ├── /store        # Zustand 状态管理
│   ├── /types        # TypeScript 类型
│   └── /lib          # 工具函数
├── /api              # 后端源码
│   └── /routes       # API 路由
├── /docs             # 文档
└── /public           # 静态资源
```

## 📝 支持的 AI 引擎

| 引擎 | 状态 | 说明 |
|------|------|------|
| Mock | ✅ 可用 | 模拟模式，用于测试 |
| Stable Diffusion | ✅ 可用 | 通过 Replicate |
| DALL-E 3 | ✅ 可用 | 通过 OpenAI |
| Gemini | ✅ 可用 | 通过 Google AI |
| 豆包 | ✅ 可用 | 通过火山引擎 |
| 即梦 | ⏳ 待实现 | - |
| 通义万相 | ⏳ 待实现 | - |
| 文心一格 | ⏳ 待实现 | - |
| 混元 | ⏳ 待实现 | - |

## ⚙️ 环境变量

可以通过环境变量配置后端：

```
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
PORT=3001
```

## 📄 许可证

MIT License
