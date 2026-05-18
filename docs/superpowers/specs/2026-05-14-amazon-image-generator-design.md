# 亚马逊主图生成工具 - 设计文档

**版本**: V1.0  
**日期**: 2026-05-18  
**状态**: ✅ 已实现

---

## 1. 项目概述

### 1.1 目标
帮助亚马逊卖家快速生成一整套高质量的产品图片，通过 AI 驱动的方式，大幅提升效率。

### 1.2 核心价值
- 🚀 效率提升：从几小时缩短到几分钟
- 🎨 风格一致：保证整套图片视觉统一
- 📋 模板复用：一次配置，多次使用
- 🤖 AI 驱动：使用最先进的图像生成技术

---

## 2. 功能需求

### 2.1 核心功能清单

| 功能模块 | 功能描述 | 优先级 |
|---------|---------|-------|
| 产品图上传 | 支持白底产品图上传 | P0 |
| AI 引擎选择 | 可选择 Stable Diffusion/DALL-E/Gemini/豆包等 | P0 |
| 7 图批量配置 | 每张图可单独设置参考图和提示词 | P0 |
| 模板系统 | 保存/加载/删除配置模板 | P0 |
| 队列生成 | 逐张生成，显示进度，支持暂停 | P0 |
| 历史记录 | 保存和管理历史生成记录 | P0 |
| 打包导出 | 一键下载全套图片 | P0 |
| API 密钥配置 | 在前端配置各 AI 服务的密钥 | P0 |

### 2.2 详细功能说明

#### 2.2.1 产品图上传
- 支持 JPG/PNG 格式
- 推荐比例 1:1（正方形）
- 文件大小限制：建议 < 20MB

#### 2.2.2 AI 引擎选择
- 统一选择一个 AI 引擎生成所有 7 张图
- **目的**：保证套图风格一致性
- 已支持：
  - Stable Diffusion (通过 Replicate)
  - DALL-E 3 (通过 OpenAI)
  - Gemini (通过 Google AI)
  - 豆包 (通过火山引擎)
  - Mock (模拟模式，用于测试)
- 待实现：即梦、通义万相、文心一格、混元

#### 2.2.3 7 图批量配置
- 界面显示 7 个卡片，对应 7 张图片
- 每个卡片包含：
  - 参考图上传区域（可选）
  - 提示词输入框
  - 生成结果预览区

#### 2.2.4 模板系统
**保存模板**：
- 输入模板名称
- 保存所有 7 张图的配置（参考图+提示词+AI 选择）
- 存储在本地（localStorage）

**加载模板**：
- 从模板列表选择
- 一键填入所有配置
- 用户只需替换新的产品图

**删除模板**：
- 从模板列表删除不需要的模板

#### 2.2.5 队列生成
- 点击"开始生成"后按顺序处理
- 实时显示进度（当前第几张/共 7 张）
- 支持：
  - 暂停/继续
  - 重置
  - 失败重试（手动重新生成）

#### 2.2.6 历史记录
- 自动保存生成历史
- 包含产品图、生成结果、配置信息
- 支持查看和删除历史记录
- 存储在本地（localStorage）

#### 2.2.7 打包导出
- 生成完成后可预览所有图片
- 支持单独下载某张
- 支持一键下载所有 7 张
- 文件名规范：`amazon-product-01.jpg`, `amazon-product-02.jpg`...

#### 2.2.8 API 密钥配置
- 在设置页面配置各 AI 服务的 API 密钥
- 密钥保存在本地（localStorage）
- 支持配置：
  - Replicate API Key (Stable Diffusion)
  - OpenAI API Key (DALL-E 3)
  - Google API Key (Gemini)
  - 火山引擎 API Key (豆包/即梦)
  - 豆包模型 ID
  - 阿里云 API Key (通义万相)
  - 百度 API Key (文心一格)
  - 腾讯云 API Key (混元)

---

## 3. 技术架构

### 3.1 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                     前端 (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  页面组件     │  │  Zustand 状态 │  │  API 调用     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  后端 (Node.js + Express)                │
│  ┌────────────────────────────────────────────────────┐ │
│  │            AI 服务适配层                              │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │ │
│  │  │     SD       │ │    DALL-E    │ │   Gemini    │ │ │
│  │  └──────────────┘ └──────────────┘ └─────────────┘ │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │ │
│  │  │    豆包      │ │    即梦      │ │    通义     │ │ │
│  │  └──────────────┘ └──────────────┘ └─────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↓
              ┌───────────────────┐
              │  各 AI 云服务平台  │
              └───────────────────┘
```

### 3.2 技术栈

| 层级 | 技术选型 |
|-----|---------|
| 前端 | React 18 + TypeScript + Tailwind CSS 3 + Vite |
| 后端 | Node.js + Express |
| 状态管理 | Zustand |
| AI 服务 | Replicate, OpenAI, Google AI, 火山引擎等 |
| 图像处理 | Sharp |
| 存储 | 浏览器 localStorage (模板/历史/API Key) |
| UI 组件 | Lucide React 图标 |

### 3.3 项目目录结构

```
/workspace
├── /src                          # 前端源码
│   ├── /assets                   # 静态资源
│   ├── /components
│   │   ├── ImageUploader.tsx     # 图片上传组件
│   │   ├── ConfigCard.tsx        # 单图配置卡片
│   │   ├── TemplateSelector.tsx  # 模板选择器
│   │   ├── AISelector.tsx        # AI 引擎选择器
│   │   ├── ApiKeysConfig.tsx     # API 密钥配置
│   │   ├── Empty.tsx             # 空状态组件
│   │   └── ConfigCard.tsx        # 配置卡片组件
│   ├── /hooks
│   │   └── useTheme.ts           # 主题 Hook
│   ├── /lib
│   │   └── utils.ts              # 工具函数
│   ├── /pages
│   │   ├── Home.tsx              # 首页
│   │   ├── History.tsx           # 历史记录页
│   │   ├── Templates.tsx         # 模板管理页
│   │   ├── TemplateEditor.tsx    # 模板编辑器页
│   │   └── Settings.tsx          # 设置页
│   ├── /store
│   │   └── editorStore.ts        # Zustand 状态管理
│   ├── /types
│   │   └── index.ts              # TypeScript 类型定义
│   ├── App.tsx                   # 应用根组件
│   ├── main.tsx                  # 应用入口
│   └── index.css                 # 全局样式
├── /api                          # 后端源码
│   ├── /routes
│   │   ├── auth.ts               # 认证路由
│   │   └── generate.ts           # 生成路由
│   ├── app.ts                    # Express 应用
│   └── server.ts                 # 服务器入口
├── /docs                         # 文档
├── /public                       # 静态资源
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 4. 数据模型

### 4.1 TypeScript 类型定义

```typescript
// AI 引擎类型
type AIEngine = 
  | 'stable-diffusion' 
  | 'dalle' 
  | 'gemini' 
  | 'mock'
  | 'jimeng'
  | 'doubao'
  | 'tongyi'
  | 'wenxin'
  | 'hunyuan';

// 图片状态
type ImageStatus = 'pending' | 'generating' | 'done' | 'error';

// 单张图片配置
interface ImageConfig {
  id: number;                      // 1-7
  referenceImages: string[];       // base64 参考图
  prompt: string;                  // 提示词
  generatedImage: string | null;   // 生成结果 (base64)
  status: ImageStatus;
}

// 完整配置
interface GenerationConfig {
  productImage: string | null;     // base64 白底产品图
  aiEngine: AIEngine;
  images: ImageConfig[];           // 长度为 7
}

// 模板
interface Template {
  id: string;
  name: string;
  createdAt: number;
  aiEngine: AIEngine;
  imageConfigs: Array<{
    referenceImages: string[];
    prompt: string;
  }>;
}

// API 密钥配置
interface ApiKeysConfig {
  replicateApiKey?: string;
  openaiApiKey?: string;
  googleApiKey?: string;
  volcanoApiKey?: string;
  doubaoModel?: string;
  aliApiKey?: string;
  baiduApiKey?: string;
  tencentApiKey?: string;
}

// 历史记录项
interface HistoryItem {
  id: string;
  name: string;
  createdAt: number;
  productImage: string;
  aiEngine: AIEngine;
  generatedImages: Array<{
    referenceImages: string[];
    prompt: string;
    generatedImage: string;
    status: ImageStatus;
  }>;
}
```

---

## 5. 界面设计

### 5.1 主界面布局

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐   │
│  │  顶部导航栏                                      │   │
│  │  [Logo]  [历史记录] [模板管理] [API 密钥]        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │  左侧栏         │  │  主内容区                   │  │
│  │  ┌───────────┐ │  │  ┌───────────────────────┐ │  │
│  │  │产品图上传 │ │  │  │  生成控制区           │ │  │
│  │  └───────────┘ │  │  │ [开始] [暂停] [重置]  │ │  │
│  │  ┌───────────┐ │  │  │ 进度条               │ │  │
│  │  │AI 引擎选择│ │  │  └───────────────────────┘ │  │
│  │  └───────────┘ │  │                             │  │
│  └─────────────────┘  │  7 个配置卡片 (网格布局)   │  │
│                       │  ┌──┐ ┌──┐ ┌──┐ ┌──┐     │  │
│                       │  │图1│ │图2│ │图3│ │图4│ ... │  │
│                       │  └──┘ └──┘ └──┘ └──┘     │  │
│                       └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 5.2 单个配置卡片设计

```
┌──────────────────┐
│  图 1            │
│  ┌───────────┐  │
│  │ 预览区    │  │
│  │ (生成后)  │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │ 参考图上传│  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │ 提示词输入│  │
│  └───────────┘  │
│  [状态: 待生成]  │
└──────────────────┘
```

---

## 6. 核心流程

### 6.1 完整生成流程

```
1. 用户上传白底产品图
   ↓
2. 选择 AI 引擎
   ↓
3. (可选) 加载现有模板，或手动配置 7 张图
   ↓
4. 为每张图设置参考图和提示词
   ↓
5. (可选) 保存配置为模板
   ↓
6. 点击"开始生成"
   ↓
7. 前端队列处理，逐张调用后端 API
   ↓
8. 实时更新前端进度和结果
   ↓
9. 全部完成后，用户预览并下载
```

### 6.2 AI 生成流程 (以 Stable Diffusion 为例)

```
接收请求
   ↓
准备输入：产品图 + 参考图 + 提示词
   ↓
使用 Sharp 处理图片 (resize)
   ↓
调用 Replicate SD API (img2img)
   ↓
获取生成结果
   ↓
转换为 base64
   ↓
返回给前端
```

---

## 7. API 设计

### 7.1 后端 API 端点

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/generate | 生成单张图片 |
| POST | /api/generate/test-doubao | 测试豆包 API 连接 |
| GET | /api/health | 健康检查 |

### 7.2 请求/响应示例

**生成图片请求**
```typescript
POST /api/generate
{
  engine: 'stable-diffusion',
  productImage: base64,
  referenceImages: [base64...],
  prompt: '...',
  apiKeys: {
    replicateApiKey: '...',
    openaiApiKey: '...',
    ...
  }
}
```

**生成图片响应**
```typescript
{
  success: true,
  image: 'data:image/jpeg;base64,...'
}
```

---

## 8. 开发状态 (V1.0)

### 已完成功能
- ✅ 项目初始化 (React + Express)
- ✅ 基础 UI 组件和布局
- ✅ 图片上传
- ✅ 7 图配置界面
- ✅ AI 选择器
- ✅ 模板系统 (本地存储)
- ✅ Stable Diffusion API 集成
- ✅ DALL-E 3 API 集成
- ✅ Gemini API 集成
- ✅ 豆包 API 集成
- ✅ 队列生成逻辑
- ✅ 进度更新
- ✅ 历史记录
- ✅ API 密钥配置
- ✅ 导出功能

### 待改进/修复
- ⚠️ 暂停功能需要完善
- ⚠️ 部分 AI 引擎是空实现（即梦、通义万相、文心一格、混元）
- ⚠️ 错误处理需要改进
- ⚠️ 历史记录存储需要优化（localStorage 大小限制）

---

## 9. 后续迭代方向 (V2.0/V3.0)

- 更多 AI 引擎支持
- 云端模板/历史存储
- 用户账户系统
- 更丰富的编辑功能
- A+ 页面自动生成
- 批量产品处理
- 图像编辑功能（裁剪、滤镜等）
