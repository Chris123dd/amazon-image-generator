# 亚马逊主图生成器 v2 - 设计文档

**版本:** V2.0  
**日期:** 2026-05-18  
**状态:** 设计完成，待实现

---

## 1. 项目概述

### 1.1 目标

帮助亚马逊卖家快速生成一整套高质量的产品展示图片，通过 AI 驱动的方式，解决没有美工设计的痛点。

### 1.2 核心价值

- 🎨 **AI 生成** - 自动生成专业的产品场景图
- ⚡ **高效** - 从几小时缩短到几分钟
- 📋 **模板复用** - 一次配置，多次使用
- 🔧 **图片处理** - 自动去水印、转格式、压缩

### 1.3 目标用户

亚马逊卖家，需要自己制作产品 listing 图片，但没有美工设计能力。

---

## 2. 功能需求

### 2.1 核心功能清单

| 功能模块 | 功能描述 | 优先级 |
|---------|---------|-------|
| 产品图上传 | 支持白底产品图上传，自动处理为正方形 | P0 |
| AI 引擎选择 | 主用豆包，支持多种引擎，不可用引擎禁用 | P0 |
| 7 张图批量配置 | 主图 + 6 张附图，每张图可单独配置 | P0 |
| 图片生成 | 队列生成，支持暂停，完善错误处理 | P0 |
| 图片后处理 | 自动去水印、转 1600x1600、压缩到 100k | P0 |
| 图片下载 | 单张或打包下载 | P0 |
| 模板管理 | 保存、加载、删除、导出、导入模板 | P1 |
| 历史记录 | 保存历史，含配置信息，可复现 | P1 |
| 单张重生成 | 可单独重生成某张图，可换引擎 | P1 |
| API Key 配置 | 配置各 AI 服务密钥 | P0 |

### 2.2 详细功能说明

#### 2.2.1 产品图上传

- 支持 JPG/PNG 格式
- 支持拖拽上传
- 自动预览
- 上传后自动处理：保持比例，两侧留白变成正方形

#### 2.2.2 AI 引擎选择

- 统一选择默认 AI 引擎（豆包为默认）
- 每张图可单独覆盖选择不同的引擎
- 不可用引擎在 UI 中显示禁用状态
- 已支持的引擎：
  - 豆包（默认）
  - Mock（模拟模式，用于测试）
  - Stable Diffusion
  - DALL-E 3
  - Gemini
- 待实现引擎（禁用）：即梦、通义万相、文心一格、混元

#### 2.2.3 7 张图批量配置

- 界面显示 7 个配置卡片
- 第 1 张：主图
- 第 2-7 张：附图
- 每个卡片包含：
  - 提示词输入框
  - 参考图上传（可多张）
  - AI 引擎选择（可选，覆盖默认）
  - 生成结果预览
  - 状态显示（待生成/生成中/完成/失败）
  - 重生成按钮

#### 2.2.4 图片生成

- 点击"开始生成"后按顺序处理
- 实时显示进度（当前第几张/共 7 张）
- 支持暂停：立即停止当前正在生成的图
- 暂停后可修改配置，然后点击继续
- 刷新页面后暂停状态不保留
- 完善的错误提示：AI 调用失败时明确提示错误信息
- 不静默失败

#### 2.2.5 图片后处理

生成完成后自动处理：
1. **去水印**：优先使用 AI API 的 `watermark: false` 参数；如果生成的图还是有水印，使用像素级修复算法处理右下角区域
2. **格式转换**：统一转为 1600x1600 正方形
3. **压缩**：压缩到 100KB 以内，JPG 格式

#### 2.2.6 模板管理

**保存模板：**
- 输入模板名称
- 保存内容：7 张图的配置（提示词、参考图信息、每张图的引擎选择）
- 注意：不保存完整产品图和完整参考图，只保存配置

**加载模板：**
- 从模板列表选择
- 一键填入所有配置
- 用户只需替换新的产品图

**删除模板：**
- 从模板列表删除不需要的模板

**导出/导入模板：**
- 导出为 JSON 文件
- 从 JSON 文件导入模板

#### 2.2.7 历史记录

**保存历史：**
- 自动保存每次生成任务
- 保存内容：
  - 产品图缩略图
  - 7 张生成图
  - 完整配置信息（可复现）
  - 时间戳
  - 使用的 AI 引擎

**查看历史：**
- 历史记录列表
- 点击查看详情

**复现配置：**
- 从历史记录一键复现配置

**删除历史：**
- 手动删除单个历史记录
- 清空所有历史
- 单张重生成会产生新的历史记录，旧记录保留不变

#### 2.2.8 单张图重生成

- 可单独重生成某一张图
- 重生成时可单独给这张图换 AI 引擎
- 重生成作为新的历史记录保存
- 原来那套图的其他 6 张图在旧记录中保留

#### 2.2.9 API Key 配置

- 在设置页面配置各 AI 服务的 API Key
- 密钥保存在 `localStorage`
- 支持配置：
  - 火山引擎 API Key（豆包、即梦）
  - 豆包模型 ID
  - Replicate API Key（Stable Diffusion）
  - OpenAI API Key（DALL-E 3）
  - Google API Key（Gemini）
  - 阿里云 API Key（通义万相）
  - 百度 API Key（文心一格）
  - 腾讯云 API Key（混元）

---

## 3. 技术架构

### 3.1 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                    纯前端应用                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │              React 应用                            │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │  │
│  │  │  Generator   │ │  Templates   │ │  History   │ │  │
│  │  │   Module     │ │   Module     │ │  Module    │ │  │
│  │  └──────────────┘ └──────────────┘ └────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │           Settings Module                    │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │         Shared: Image Processor              │ │  │
│  │  │         Shared: AI Engines                   │ │  │
│  │  └──────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │         AI API (直接从前端调用)                  │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐           │  │
│  │  │  豆包   │ │  SD     │ │ DALL-E  │   ...     │  │
│  │  └─────────┘ └─────────┘ └─────────┘           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 3.2 技术栈

| 层级 | 技术选型 |
|-----|---------|
| 框架 | React 18 |
| 语言 | TypeScript |
| 构建工具 | Vite |
| 样式 | Tailwind CSS |
| 路由 | React Router |
| 图标 | Lucide React |
| 状态管理 | React 原生 `useReducer` + `Context` |
| 存储 | `localStorage` |
| 图片处理 | Canvas API + 自定义算法 |

### 3.3 项目目录结构

```
amazon-image-generator-v2/
├── src/
│   ├── modules/                  # 各个功能模块
│   │   ├── generator/            # 图片生成器（核心模块）
│   │   │   ├── components/       # 组件
│   │   │   │   ├── ProductImageUploader.tsx
│   │   │   │   ├── ImageConfigCard.tsx
│   │   │   │   ├── GenerationProgress.tsx
│   │   │   │   └── GenerationControls.tsx
│   │   │   ├── hooks/            # 自定义 Hooks
│   │   │   │   ├── useGenerator.ts
│   │   │   │   └── useGenerationQueue.ts
│   │   │   ├── context/          # Context 提供者
│   │   │   │   └── GeneratorContext.tsx
│   │   │   ├── types.ts          # 类型定义
│   │   │   └── reducer.ts        # Reducer
│   │   ├── templates/            # 模板管理
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── context/
│   │   │   └── types.ts
│   │   ├── history/              # 历史记录
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── context/
│   │   │   └── types.ts
│   │   └── settings/             # 设置
│   │       ├── components/
│   │       ├── context/
│   │       └── types.ts
│   ├── shared/                   # 共享组件和工具
│   │   ├── components/           # 通用组件
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── AISelector.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   ├── hooks/                # 通用 Hooks
│   │   │   └── useLocalStorage.ts
│   │   ├── utils/                # 工具函数
│   │   │   ├── imageProcessor.ts  # 图片处理核心
│   │   │   └── file.ts
│   │   └── ai/                   # AI 引擎封装
│   │       ├── types.ts
│   │       ├── index.ts
│   │       ├── doubao.ts
│   │       ├── stableDiffusion.ts
│   │       ├── dalle.ts
│   │       ├── gemini.ts
│   │       └── mock.ts
│   ├── pages/                    # 页面组件
│   │   ├── Home.tsx
│   │   ├── History.tsx
│   │   ├── Templates.tsx
│   │   └── Settings.tsx
│   ├── App.tsx                   # 根组件
│   ├── main.tsx                  # 入口文件
│   └── index.css
├── public/                       # 静态资源
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 4. 数据模型

### 4.1 TypeScript 类型定义

```typescript
// src/shared/ai/types.ts

// AI 引擎类型
export type AIEngine =
  | 'doubao'
  | 'stable-diffusion'
  | 'dalle'
  | 'gemini'
  | 'mock'
  | 'jimeng'
  | 'tongyi'
  | 'wenxin'
  | 'hunyuan';

// 引擎元数据
export interface AIEngineMeta {
  id: AIEngine;
  name: string;
  available: boolean;
  description?: string;
}

// 生成图片请求
export interface GenerateImageRequest {
  prompt: string;
  productImage?: string; // base64
  referenceImages?: string[]; // base64
  apiKey: string;
  modelId?: string;
}

// 生成图片响应
export interface GenerateImageResponse {
  success: boolean;
  image?: string; // base64
  error?: string;
}

// AI 引擎接口
export interface IAIEngine {
  generate(request: GenerateImageRequest): Promise<GenerateImageResponse>;
  isAvailable(): boolean;
}
```

```typescript
// src/modules/generator/types.ts

// 单张图片配置
export interface ImageConfig {
  id: number; // 1-7
  prompt: string;
  referenceImages: string[]; // base64
  engine?: AIEngine; // 可选，覆盖默认
  generatedImage?: string; // base64
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
}

// 完整生成配置
export interface GenerationConfig {
  productImage: string | null; // base64，正方形处理后
  originalProductImage: string | null; // base64，原始
  defaultEngine: AIEngine;
  images: ImageConfig[]; // 长度为 7
}

// 生成状态
export interface GenerationState {
  config: GenerationConfig;
  isGenerating: boolean;
  isPaused: boolean;
  currentImageIndex: number;
  progress: number;
}

// Generator Context 类型
export interface GeneratorContextType {
  state: GenerationState;
  dispatch: React.Dispatch<GeneratorAction>;
  // Actions
  setProductImage: (image: string | null) => void;
  setDefaultEngine: (engine: AIEngine) => void;
  updateImageConfig: (id: number, updates: Partial<ImageConfig>) => void;
  startGeneration: () => Promise<void>;
  pauseGeneration: () => void;
  resumeGeneration: () => void;
  regenerateImage: (id: number, engine?: AIEngine) => Promise<void>;
  reset: () => void;
  downloadImage: (id: number) => void;
  downloadAll: () => void;
  loadConfig: (config: Partial<GenerationConfig>) => void;
  getConfigForSave: () => any;
}
```

```typescript
// src/modules/templates/types.ts

// 模板
export interface Template {
  id: string;
  name: string;
  createdAt: number;
  defaultEngine: AIEngine;
  imageConfigs: Array<{
    prompt: string;
    engine?: AIEngine;
  }>;
}

// Templates Context 类型
export interface TemplatesContextType {
  templates: Template[];
  saveTemplate: (name: string, config: any) => void;
  loadTemplate: (templateId: string) => any;
  deleteTemplate: (templateId: string) => void;
  exportTemplate: (templateId: string) => void;
  importTemplate: (file: File) => Promise<void>;
}
```

```typescript
// src/modules/history/types.ts

// 单张历史图片
export interface HistoryImage {
  prompt: string;
  engine: AIEngine;
  generatedImage: string; // base64
}

// 历史记录项
export interface HistoryItem {
  id: string;
  name: string;
  createdAt: number;
  productImage: string; // base64 缩略图
  defaultEngine: AIEngine;
  images: HistoryImage[];
  configSnapshot: any; // 用于复现
}

// History Context 类型
export interface HistoryContextType {
  history: HistoryItem[];
  saveToHistory: (name: string, data: any) => void;
  deleteHistoryItem: (id: string) => void;
  clearAllHistory: () => void;
  loadHistoryConfig: (id: string) => any;
}
```

```typescript
// src/modules/settings/types.ts

// API Keys 配置
export interface ApiKeysConfig {
  volcanoApiKey?: string;
  doubaoModelId?: string;
  replicateApiKey?: string;
  openaiApiKey?: string;
  googleApiKey?: string;
  aliApiKey?: string;
  baiduApiKey?: string;
  tencentApiKey?: string;
}

// Settings Context 类型
export interface SettingsContextType {
  apiKeys: ApiKeysConfig;
  updateApiKeys: (keys: Partial<ApiKeysConfig>) => void;
  getApiKeyForEngine: (engine: AIEngine) => string | undefined;
}
```

---

## 5. 核心模块设计

### 5.1 Generator 模块

#### 状态管理 (useReducer)

**State 结构：**
```typescript
interface GenerationState {
  config: GenerationConfig;
  isGenerating: boolean;
  isPaused: boolean;
  currentImageIndex: number;
  abortController: AbortController | null;
}
```

**Actions：**
- SET_PRODUCT_IMAGE
- SET_DEFAULT_ENGINE
- UPDATE_IMAGE_CONFIG
- START_GENERATION
- PAUSE_GENERATION
- RESUME_GENERATION
- SET_CURRENT_IMAGE
- SET_IMAGE_STATUS
- SET_GENERATED_IMAGE
- RESET

#### useGenerationQueue Hook

**职责：**
- 管理生成队列
- 处理暂停/继续
- 使用 AbortController 取消请求

**关键实现：**
```typescript
async function generateQueue(
  images: ImageConfig[],
  startIndex: number,
  onProgress: (index: number, status: any) => void,
  abortSignal: AbortSignal
) {
  for (let i = startIndex; i < images.length; i++) {
    if (abortSignal.aborted) break;
    
    // 生成当前图片
    await generateSingleImage(images[i], abortSignal);
    
    // 更新进度
    onProgress(i, ...);
  }
}
```

### 5.2 图片处理 (imageProcessor.ts)

**核心功能：**

1. **产品图处理：**
   ```typescript
   function makeSquareWithPadding(imageData: string): Promise<string>
   ```
   - 保持比例，两侧留白变成正方形

2. **去水印：**
   ```typescript
   function removeWatermark(imageData: string): Promise<string>
   ```
   - 检测右下角区域
   - 使用周围像素填充修复

3. **后处理：**
   ```typescript
   function postProcessImage(imageData: string): Promise<string>
   ```
   - 调整尺寸到 1600x1600
   - 转换为 JPG
   - 压缩到 100KB 以内

### 5.3 AI 引擎封装

**统一接口：**
```typescript
interface IAIEngine {
  generate(request: GenerateImageRequest): Promise<GenerateImageResponse>;
  isAvailable(): boolean;
}
```

**豆包实现：**
- 调用火山引擎 API
- 默认 `watermark: false`

---

## 6. 核心流程

### 6.1 完整生成流程

```
1. 用户上传白底产品图
   ↓
2. 产品图自动处理：保持比例，留白变正方形
   ↓
3. 选择默认 AI 引擎（豆包）
   ↓
4. 配置 7 张图：提示词、参考图、可选单独引擎
   ↓
5. (可选) 保存配置为模板
   ↓
6. 点击"开始生成"
   ↓
7. 队列处理：
   ├─ 创建 AbortController
   ├─ 循环处理每张图
   ├─ 调用 AI API
   ├─ 自动后处理（去水印、转格式、压缩）
   ├─ 检查是否暂停
   └─ 更新进度和状态
   ↓
8. 生成过程中：
   ├─ 可暂停（立即停止当前图）
   ├─ 可单张重生成
   └─ 显示错误信息
   ↓
9. 全部完成后：
   ├─ 保存到历史记录
   ├─ 预览图片
   └─ 下载（单张或打包）
```

### 6.2 单张重生成流程

```
1. 用户点击某张图的"重生成"
   ↓
2. (可选) 选择不同的 AI 引擎
   ↓
3. 创建新的配置（基于当前配置）
   ↓
4. 生成这张图
   ↓
5. 后处理
   ↓
6. 保存为新的历史记录
   ↓
7. 旧记录保留不变
```

---

## 7. UI 设计

### 7.1 主界面布局

```
┌─────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────┐  │
│  │  顶部导航 [Logo] [历史] [模板] [设置]             │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │  左侧栏        │  │  主内容区                    │  │
│  │  ┌───────────┐ │  │  ┌────────────────────────┐ │  │
│  │  │产品图上传 │ │  │  │  生成控制区             │ │  │
│  │  │(预览)     │ │  │  │ [开始] [暂停] [重置]   │ │  │
│  │  └───────────┘ │  │  │ 进度条                 │ │  │
│  │  ┌───────────┐ │  │  └────────────────────────┘ │  │
│  │  │默认引擎   │ │  │                            │  │
│  │  │选择       │ │  │  7 个配置卡片（网格）      │  │
│  │  └───────────┘ │  │  ┌────┐ ┌────┐ ┌────┐    │  │
│  └─────────────────┘  │  │ 主图│ │图2 │ │图3 │... │  │
│                       │  └────┘ └────┘ └────┘    │  │
│                       └────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 7.2 单个配置卡片

```
┌─────────────────────────┐
│  图 X (主图/附图 X)      │
├─────────────────────────┤
│  ┌─────────────────┐  │
│  │   预览区       │  │
│  │  (生成后显示)  │  │
│  └─────────────────┘  │
├─────────────────────────┤
│  [参考图上传]           │
├─────────────────────────┤
│  提示词输入框           │
├─────────────────────────┤
│  [AI 引擎选择] (可选)  │
├─────────────────────────┤
│  状态：待生成           │
│  [重生成]  [下载]       │
└─────────────────────────┘
```

---

## 8. 错误处理

### 8.1 错误类型

- **AI 调用失败**：网络错误、API Key 无效、配额不足
- **图片处理失败**：格式不支持、处理出错
- **存储失败**：`localStorage` 满

### 8.2 处理策略

- **用户友好提示**：明确的错误信息，不是技术栈追踪
- **不静默失败**：所有错误都要告知用户
- **可重试**：失败的图可以重试
- **降级方案**：AI 失败时，给用户明确提示

### 8.3 存储溢出处理

- 保存历史记录时使用 `try-catch` 包裹
- 如果 `localStorage.setItem` 抛出异常（配额不足）：
  - 提示用户："存储空间不足，请清理历史记录"
  - 建议用户删除不需要的历史记录
- 可选增强：自动检查存储使用量，超过 80% 时显示警告

### 8.4 请求超时机制

- 每个 AI API 调用设置 120 秒超时
- 超时使用 `Promise.race` 实现：
  ```typescript
  const withTimeout = (promise: Promise, ms: number) =>
    Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('请求超时')), ms)
      )
    ]);
  ```
- 超时后显示明确提示："AI 服务响应超时，请重试或切换其他引擎"
- 超时不视为永久失败，用户可重试

---

## 9. 开发计划

### 阶段 1：基础框架
- 项目初始化
- 基础 UI 组件和布局
- 路由配置

### 阶段 2：Generator 模块核心
- 产品图上传和处理
- 7 张图配置界面
- AI 引擎基础封装（豆包 + Mock）
- 基础生成流程

### 阶段 3：完善 Generator
- 真正可暂停的队列
- 错误处理
- 单张重生成
- 图片后处理（去水印、转换、压缩）
- 下载功能

### 阶段 4：其他模块
- Templates 模块（保存、加载、删除、导出、导入）
- History 模块（保存、查看、复现、删除）
- Settings 模块（API Key 配置）

### 阶段 5：完善和测试
- 整合所有模块
- 测试
- 优化

---

## 10. 后续迭代方向

- 更多 AI 引擎支持
- 云端存储（可选）
- 更智能的去水印
- 批量产品处理
- A+ 页面自动生成
