# 亚马逊主图生成器 v2 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零实现一个纯前端 AI 图片生成工具，解决亚马逊卖家制作产品图的痛点

**Architecture:** 纯前端单页应用，模块化架构，无后端直接调用 AI API。每个功能模块（Generator、Templates、History、Settings）独立管理状态，使用 useReducer + Context

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + React Router + Lucide React + Canvas API

---

## 文件结构

```
amazon-image-generator-v2/
├── src/
│   ├── modules/
│   │   ├── generator/
│   │   │   ├── components/
│   │   │   │   ├── ProductImageUploader.tsx
│   │   │   │   ├── ImageConfigCard.tsx
│   │   │   │   ├── GenerationProgress.tsx
│   │   │   │   └── GenerationControls.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useGenerator.ts
│   │   │   │   └── useGenerationQueue.ts
│   │   │   ├── context/
│   │   │   │   └── GeneratorContext.tsx
│   │   │   ├── types.ts
│   │   │   └── reducer.ts
│   │   ├── templates/
│   │   ├── history/
│   │   └── settings/
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── useLocalStorage.ts
│   │   ├── utils/
│   │   │   ├── imageProcessor.ts
│   │   │   └── file.ts
│   │   └── ai/
│   │       ├── types.ts
│   │       ├── index.ts
│   │       ├── doubao.ts
│   │       ├── stableDiffusion.ts
│   │       ├── dalle.ts
│   │       ├── gemini.ts
│   │       └── mock.ts
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
```

---

## 阶段 1：项目初始化与基础框架

### Task 1: 项目初始化

**Files:**
- Create: `amazon-image-generator-v2/package.json`
- Create: `amazon-image-generator-v2/vite.config.ts`
- Create: `amazon-image-generator-v2/tsconfig.json`
- Create: `amazon-image-generator-v2/tailwind.config.js`
- Create: `amazon-image-generator-v2/index.html`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "amazon-image-generator-v2",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.3.0",
    "lucide-react": "^0.511.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.4.1",
    "typescript": "~5.8.3",
    "vite": "^6.3.5",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.5.3",
    "autoprefixer": "^10.4.21"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 5: 创建 postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>亚马逊主图生成器</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: 运行 npm install**

Run: `cd /workspace/amazon-image-generator-v2 && npm install`

---

### Task 2: 基础入口文件与样式

**Files:**
- Create: `amazon-image-generator-v2/src/main.tsx`
- Create: `amazon-image-generator-v2/src/App.tsx`
- Create: `amazon-image-generator-v2/src/index.css`

- [ ] **Step 1: 创建 src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #FF9900;
  --color-secondary: #232F3E;
  --color-accent: #007185;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 2: 创建 src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 3: 创建 src/App.tsx**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>首页建设中...</div>} />
        <Route path="/history" element={<div>历史记录建设中...</div>} />
        <Route path="/templates" element={<div>模板管理建设中...</div>} />
        <Route path="/settings" element={<div>设置页建设中...</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 4: 测试项目运行**

Run: `cd /workspace/amazon-image-generator-v2 && npm run dev`
Expected: 浏览器打开 http://localhost:5173，显示空白页面

---

### Task 3: 共享类型定义

**Files:**
- Create: `amazon-image-generator-v2/src/shared/ai/types.ts`

- [ ] **Step 1: 创建 AI 引擎类型定义**

```typescript
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

export interface AIEngineMeta {
  id: AIEngine;
  name: string;
  available: boolean;
  description?: string;
}

export const AI_ENGINES: AIEngineMeta[] = [
  { id: 'doubao', name: '豆包', available: true, description: '默认引擎' },
  { id: 'mock', name: '模拟模式', available: true, description: '用于测试' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', available: true },
  { id: 'dalle', name: 'DALL-E 3', available: true },
  { id: 'gemini', name: 'Gemini', available: true },
  { id: 'jimeng', name: '即梦', available: false, description: '即将上线' },
  { id: 'tongyi', name: '通义万相', available: false, description: '即将上线' },
  { id: 'wenxin', name: '文心一格', available: false, description: '即将上线' },
  { id: 'hunyuan', name: '混元', available: false, description: '即将上线' },
];

export interface GenerateImageRequest {
  prompt: string;
  productImage?: string;
  referenceImages?: string[];
  apiKey: string;
  modelId?: string;
}

export interface GenerateImageResponse {
  success: boolean;
  image?: string;
  error?: string;
}

export interface IAIEngine {
  generate(request: GenerateImageRequest): Promise<GenerateImageResponse>;
  isAvailable(): boolean;
}
```

- [ ] **Step 2: 创建通用类型**

```typescript
export const DEFAULT_IMAGE_COUNT = 7;

export const IMAGE_SIZE = 1600;
export const IMAGE_QUALITY = 0.8;
export const MAX_FILE_SIZE = 100 * 1024;
```

---

## 阶段 2：共享工具实现

### Task 4: localStorage Hook

**Files:**
- Create: `amazon-image-generator-v2/src/shared/hooks/useLocalStorage.ts`

- [ ] **Step 1: 创建 useLocalStorage Hook**

```typescript
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      throw error;
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

export function checkStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function getStorageUsage(): { used: number; available: boolean } {
  let used = 0;
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage.getItem(key)?.length || 0;
      }
    }
  } catch {
    return { used: 0, available: false };
  }
  return { used, available: true };
}
```

---

### Task 5: 图片处理工具

**Files:**
- Create: `amazon-image-generator-v2/src/shared/utils/imageProcessor.ts`

- [ ] **Step 1: 创建图片处理核心函数**

```typescript
import { IMAGE_SIZE, IMAGE_QUALITY, MAX_FILE_SIZE } from '../ai/types';

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export function canvasToDataURL(canvas: HTMLCanvasElement, quality: number = IMAGE_QUALITY, format: string = 'image/jpeg'): string {
  return canvas.toDataURL(format, quality);
}

export function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
```

- [ ] **Step 2: 产品图正方形处理**

```typescript
export async function makeSquareWithPadding(imageData: string): Promise<string> {
  const img = await loadImage(imageData);
  const maxSize = Math.max(img.width, img.height);
  
  const canvas = document.createElement('canvas');
  canvas.width = maxSize;
  canvas.height = maxSize;
  
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, maxSize, maxSize);
  
  const x = (maxSize - img.width) / 2;
  const y = (maxSize - img.height) / 2;
  ctx.drawImage(img, x, y);
  
  return canvasToDataURL(canvas);
}
```

- [ ] **Step 3: 调整尺寸到 1600x1600**

```typescript
export async function resizeToStandard(imageData: string): Promise<string> {
  const img = await loadImage(imageData);
  
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
  
  const scale = Math.min(IMAGE_SIZE / img.width, IMAGE_SIZE / img.height);
  const x = (IMAGE_SIZE - img.width * scale) / 2;
  const y = (IMAGE_SIZE - img.height * scale) / 2;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  
  return canvasToDataURL(canvas);
}
```

- [ ] **Step 4: 去水印（右下角像素修复）**

```typescript
export async function removeWatermark(imageData: string): Promise<string> {
  const img = await loadImage(imageData);
  const canvas = imageToCanvas(img);
  const ctx = canvas.getContext('2d')!;
  
  const w = canvas.width;
  const h = canvas.height;
  const watermarkHeight = Math.floor(h * 0.08);
  const watermarkWidth = Math.floor(w * 0.25);
  
  const top = h - watermarkHeight;
  const left = w - watermarkWidth;
  
  const imageDataObj = ctx.getImageData(left, top, watermarkWidth, watermarkHeight);
  const data = imageDataObj.data;
  
  for (let y = 0; y < watermarkHeight; y++) {
    for (let x = 0; x < watermarkWidth; x++) {
      const i = (y * watermarkWidth + x) * 4;
      const sourceY = Math.max(0, top - watermarkHeight + y);
      const sourceX = Math.max(0, left - watermarkWidth + x);
      const sourceI = (sourceY * w + sourceX) * 4;
      
      data[i] = data[sourceI];
      data[i + 1] = data[sourceI + 1];
      data[i + 2] = data[sourceI + 2];
      data[i + 3] = 255;
    }
  }
  
  ctx.putImageData(imageDataObj, left, top);
  return canvasToDataURL(canvas);
}
```

- [ ] **Step 5: 压缩到 100KB 以内**

```typescript
export async function compressToSize(imageData: string): Promise<string> {
  const img = await loadImage(imageData);
  
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
  
  const scale = Math.min(IMAGE_SIZE / img.width, IMAGE_SIZE / img.height);
  const x = (IMAGE_SIZE - img.width * scale) / 2;
  const y = (IMAGE_SIZE - img.height * scale) / 2;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  
  let quality = 0.9;
  let result = canvasToDataURL(canvas, quality);
  
  while (result.length > MAX_FILE_SIZE && quality > 0.1) {
    quality -= 0.1;
    result = canvasToDataURL(canvas, quality);
  }
  
  return result;
}
```

- [ ] **Step 6: 后处理流程**

```typescript
export async function postProcessImage(imageData: string): Promise<string> {
  let result = imageData;
  
  result = await resizeToStandard(result);
  
  result = await compressToSize(result);
  
  return result;
}
```

---

### Task 6: 文件下载工具

**Files:**
- Create: `amazon-image-generator-v2/src/shared/utils/file.ts`

- [ ] **Step 1: 创建文件下载函数**

```typescript
export function downloadDataURL(dataURL: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadMultiple(urls: string[], baseName: string): Promise<void> {
  for (let i = 0; i < urls.length; i++) {
    const filename = `${baseName}-${String(i + 1).padStart(2, '0')}.jpg`;
    downloadDataURL(urls[i], filename);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}
```

---

## 阶段 3：AI 引擎实现

### Task 7: Mock 引擎

**Files:**
- Create: `amazon-image-generator-v2/src/shared/ai/mock.ts`

- [ ] **Step 1: 创建 Mock 引擎实现**

```typescript
import { GenerateImageRequest, GenerateImageResponse, IAIEngine } from './types';

export class MockEngine implements IAIEngine {
  async generate(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!request.productImage) {
      return { success: false, error: '需要产品图' };
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 800, 800);
    
    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = request.productImage!;
    });
    ctx.drawImage(img, 150, 150, 500, 500);
    
    ctx.fillStyle = '#333';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Mock Generated`, 400, 700);
    
    const result = canvas.toDataURL('image/jpeg', 0.9);
    return { success: true, image: result };
  }
  
  isAvailable(): boolean {
    return true;
  }
}
```

---

### Task 8: 豆包引擎

**Files:**
- Create: `amazon-image-generator-v2/src/shared/ai/doubao.ts`

- [ ] **Step 1: 创建豆包引擎实现**

```typescript
import { GenerateImageRequest, GenerateImageResponse, IAIEngine } from './types';

const REQUEST_TIMEOUT = 120000;
const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const DEFAULT_MODEL = 'doubao-seedream-4-5-251128';

export class DoubaoEngine implements IAIEngine {
  private apiKey: string;
  private modelId: string;
  
  constructor(apiKey: string, modelId?: string) {
    this.apiKey = apiKey;
    this.modelId = modelId || DEFAULT_MODEL;
  }
  
  async generate(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    if (!this.apiKey) {
      return { success: false, error: '未配置豆包 API Key' };
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      const response = await fetch(DOUBAO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelId,
          prompt: request.prompt,
          size: '2048x2048',
          response_format: 'b64_json',
          watermark: false,
          n: 1,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `豆包 API 错误: ${response.status} - ${errorText}` };
      }
      
      const data = await response.json();
      
      if (data.data?.[0]?.b64_json) {
        return { success: true, image: `data:image/png;base64,${data.data[0].b64_json}` };
      }
      
      return { success: false, error: '豆包未返回图片' };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: '请求超时（120秒）' };
      }
      return { success: false, error: `豆包调用失败: ${error instanceof Error ? error.message : '未知错误'}` };
    }
  }
  
  isAvailable(): boolean {
    return !!this.apiKey;
  }
}
```

---

### Task 9: AI 引擎统一入口

**Files:**
- Create: `amazon-image-generator-v2/src/shared/ai/index.ts`

- [ ] **Step 1: 创建引擎工厂函数**

```typescript
import { AIEngine, GenerateImageRequest, GenerateImageResponse, IAIEngine } from './ai/types';
import { MockEngine } from './ai/mock';
import { DoubaoEngine } from './ai/doubao';

export function createEngine(engine: AIEngine, apiKey: string, modelId?: string): IAIEngine {
  switch (engine) {
    case 'mock':
      return new MockEngine();
    case 'doubao':
      return new DoubaoEngine(apiKey, modelId);
    case 'stable-diffusion':
    case 'dalle':
    case 'gemini':
    case 'jimeng':
    case 'tongyi':
    case 'wenxin':
    case 'hunyuan':
    default:
      return new MockEngine();
  }
}

export async function generateWithEngine(
  engine: AIEngine,
  request: GenerateImageRequest,
  apiKey: string,
  modelId?: string
): Promise<GenerateImageResponse> {
  const engineInstance = createEngine(engine, apiKey, modelId);
  return engineInstance.generate(request);
}
```

---

## 阶段 4：Settings 模块

### Task 10: Settings Context

**Files:**
- Create: `amazon-image-generator-v2/src/modules/settings/types.ts`
- Create: `amazon-image-generator-v2/src/modules/settings/context/SettingsContext.tsx`

- [ ] **Step 1: 创建 Settings 类型**

```typescript
import { AIEngine } from '@/shared/ai/types';

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

export interface SettingsContextType {
  apiKeys: ApiKeysConfig;
  updateApiKeys: (keys: Partial<ApiKeysConfig>) => void;
  getApiKeyForEngine: (engine: AIEngine) => string | undefined;
}
```

- [ ] **Step 2: 创建 Settings Context**

```typescript
import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { AIEngine } from '@/shared/ai/types';
import { ApiKeysConfig, SettingsContextType } from './types';

const SettingsContext = createContext<SettingsContextType | null>(null);

const STORAGE_KEY = 'amazon_v2_api_keys';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeysConfig>(STORAGE_KEY, {});
  
  const updateApiKeys = useCallback((keys: Partial<ApiKeysConfig>) => {
    setApiKeys({ ...apiKeys, ...keys });
  }, [apiKeys, setApiKeys]);
  
  const getApiKeyForEngine = useCallback((engine: AIEngine): string | undefined => {
    switch (engine) {
      case 'doubao':
      case 'jimeng':
        return apiKeys.volcanoApiKey;
      case 'stable-diffusion':
        return apiKeys.replicateApiKey;
      case 'dalle':
        return apiKeys.openaiApiKey;
      case 'gemini':
        return apiKeys.googleApiKey;
      case 'tongyi':
        return apiKeys.aliApiKey;
      case 'wenxin':
        return apiKeys.baiduApiKey;
      case 'hunyuan':
        return apiKeys.tencentApiKey;
      default:
        return undefined;
    }
  }, [apiKeys]);
  
  return (
    <SettingsContext.Provider value={{ apiKeys, updateApiKeys, getApiKeyForEngine }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
```

---

### Task 11: Settings 页面

**Files:**
- Create: `amazon-image-generator-v2/src/pages/Settings.tsx`
- Create: `amazon-image-generator-v2/src/modules/settings/components/ApiKeysForm.tsx`

- [ ] **Step 1: 创建 API Keys 表单组件**

```typescript
import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { ApiKeysConfig } from '../types';
import { Shield, Eye, EyeOff, Save, Check } from 'lucide-react';

export function ApiKeysForm() {
  const { apiKeys, updateApiKeys } = useSettings();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  
  const fields: { key: keyof ApiKeysConfig; label: string; placeholder: string }[] = [
    { key: 'volcanoApiKey', label: '火山引擎 API Key（豆包/即梦）', placeholder: 'sk-...' },
    { key: 'doubaoModelId', label: '豆包模型 ID', placeholder: 'doubao-seedream-4-5-251128' },
    { key: 'replicateApiKey', label: 'Replicate API Key（SD）', placeholder: 'r8_...' },
    { key: 'openaiApiKey', label: 'OpenAI API Key（DALL-E）', placeholder: 'sk-...' },
    { key: 'googleApiKey', label: 'Google API Key（Gemini）', placeholder: 'AI...' },
  ];
  
  const handleChange = (key: keyof ApiKeysConfig, value: string) => {
    updateApiKeys({ [key]: value });
    setSaved(false);
  };
  
  const toggleShow = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">API 密钥配置</h2>
      </div>
      
      {fields.map(field => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          <div className="relative">
            <input
              type={showKeys[field.key] ? 'text' : 'password'}
              value={apiKeys[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <button
              type="button"
              onClick={() => toggleShow(field.key)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showKeys[field.key] ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      ))}
      
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
      >
        {saved ? <Check size={18} /> : <Save size={18} />}
        {saved ? '已保存' : '保存配置'}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: 创建 Settings 页面**

```typescript
import { ApiKeysForm } from '@/modules/settings/components/ApiKeysForm';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">设置</h1>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <ApiKeysForm />
        </div>
      </main>
    </div>
  );
}
```

---

## 阶段 5：Generator 模块核心

### Task 12: Generator 类型与 Reducer

**Files:**
- Create: `amazon-image-generator-v2/src/modules/generator/types.ts`
- Create: `amazon-image-generator-v2/src/modules/generator/reducer.ts`

- [ ] **Step 1: 创建 Generator 类型**

```typescript
import { AIEngine, DEFAULT_IMAGE_COUNT } from '@/shared/ai/types';

export type ImageStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface ImageConfig {
  id: number;
  prompt: string;
  referenceImages: string[];
  engine?: AIEngine;
  generatedImage?: string;
  status: ImageStatus;
  error?: string;
}

export interface GenerationConfig {
  productImage: string | null;
  originalProductImage: string | null;
  defaultEngine: AIEngine;
  images: ImageConfig[];
}

export interface GenerationState {
  config: GenerationConfig;
  isGenerating: boolean;
  isPaused: boolean;
  currentImageIndex: number;
}

export type GenerationAction =
  | { type: 'SET_PRODUCT_IMAGE'; payload: string | null }
  | { type: 'SET_DEFAULT_ENGINE'; payload: AIEngine }
  | { type: 'UPDATE_IMAGE_CONFIG'; payload: { id: number; updates: Partial<ImageConfig> } }
  | { type: 'START_GENERATION' }
  | { type: 'PAUSE_GENERATION' }
  | { type: 'RESUME_GENERATION' }
  | { type: 'SET_CURRENT_IMAGE'; payload: number }
  | { type: 'SET_IMAGE_STATUS'; payload: { id: number; status: ImageStatus; error?: string } }
  | { type: 'SET_GENERATED_IMAGE'; payload: { id: number; image: string } }
  | { type: 'RESET' }
  | { type: 'LOAD_CONFIG'; payload: Partial<GenerationConfig> };
```

- [ ] **Step 2: 创建 Reducer**

```typescript
import { GenerationState, GenerationAction, ImageConfig, DEFAULT_IMAGE_COUNT } from './types';

const createInitialImages = (): ImageConfig[] =>
  Array.from({ length: DEFAULT_IMAGE_COUNT }, (_, i) => ({
    id: i + 1,
    prompt: '',
    referenceImages: [],
    status: 'pending',
  }));

const initialState: GenerationState = {
  config: {
    productImage: null,
    originalProductImage: null,
    defaultEngine: 'doubao',
    images: createInitialImages(),
  },
  isGenerating: false,
  isPaused: false,
  currentImageIndex: 0,
};

export function generationReducer(state: GenerationState, action: GenerationAction): GenerationState {
  switch (action.type) {
    case 'SET_PRODUCT_IMAGE':
      return {
        ...state,
        config: { ...state.config, productImage: action.payload, originalProductImage: action.payload },
      };
      
    case 'SET_DEFAULT_ENGINE':
      return {
        ...state,
        config: { ...state.config, defaultEngine: action.payload },
      };
      
    case 'UPDATE_IMAGE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          images: state.config.images.map(img =>
            img.id === action.payload.id ? { ...img, ...action.payload.updates } : img
          ),
        },
      };
      
    case 'START_GENERATION':
      return {
        ...state,
        isGenerating: true,
        isPaused: false,
        currentImageIndex: 0,
        config: {
          ...state.config,
          images: state.config.images.map(img => ({
            ...img,
            status: 'pending' as const,
            generatedImage: undefined,
            error: undefined,
          })),
        },
      };
      
    case 'PAUSE_GENERATION':
      return { ...state, isPaused: true };
      
    case 'RESUME_GENERATION':
      return { ...state, isPaused: false };
      
    case 'SET_CURRENT_IMAGE':
      return { ...state, currentImageIndex: action.payload };
      
    case 'SET_IMAGE_STATUS':
      return {
        ...state,
        config: {
          ...state.config,
          images: state.config.images.map(img =>
            img.id === action.payload.id
              ? { ...img, status: action.payload.status, error: action.payload.error }
              : img
          ),
        },
      };
      
    case 'SET_GENERATED_IMAGE':
      return {
        ...state,
        config: {
          ...state.config,
          images: state.config.images.map(img =>
            img.id === action.payload.id
              ? { ...img, generatedImage: action.payload.image, status: 'completed' as const }
              : img
          ),
        },
      };
      
    case 'RESET':
      return {
        ...initialState,
        config: {
          ...initialState.config,
          defaultEngine: state.config.defaultEngine,
        },
      };
      
    case 'LOAD_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
          images: action.payload.images || state.config.images,
        },
      };
      
    default:
      return state;
  }
}
```

---

### Task 13: Generator Context

**Files:**
- Create: `amazon-image-generator-v2/src/modules/generator/context/GeneratorContext.tsx`

- [ ] **Step 1: 创建 Generator Context**

```typescript
import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { GenerationState, GenerationAction, GenerationConfig, ImageConfig } from '../types';
import { generationReducer } from '../reducer';
import { AIEngine } from '@/shared/ai/types';
import { useSettings } from '@/modules/settings/context/SettingsContext';
import { generateWithEngine } from '@/shared/ai';
import { postProcessImage } from '@/shared/utils/imageProcessor';
import { downloadDataURL } from '@/shared/utils/file';

interface GeneratorContextType {
  state: GenerationState;
  dispatch: React.Dispatch<GenerationAction>;
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
  getConfigForSave: () => Partial<GenerationConfig>;
}

const GeneratorContext = createContext<GeneratorContextType | null>(null);

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(generationReducer, {
    config: {
      productImage: null,
      originalProductImage: null,
      defaultEngine: 'doubao',
      images: Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        prompt: '',
        referenceImages: [],
        status: 'pending' as const,
      })),
    },
    isGenerating: false,
    isPaused: false,
    currentImageIndex: 0,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const { getApiKeyForEngine } = useSettings();
  
  const setProductImage = useCallback((image: string | null) => {
    dispatch({ type: 'SET_PRODUCT_IMAGE', payload: image });
  }, []);
  
  const setDefaultEngine = useCallback((engine: AIEngine) => {
    dispatch({ type: 'SET_DEFAULT_ENGINE', payload: engine });
  }, []);
  
  const updateImageConfig = useCallback((id: number, updates: Partial<ImageConfig>) => {
    dispatch({ type: 'UPDATE_IMAGE_CONFIG', payload: { id, updates } });
  }, []);
  
  const generateSingleImage = useCallback(async (
    imageConfig: ImageConfig,
    engine: AIEngine,
    productImage: string
  ) => {
    const apiKey = getApiKeyForEngine(engine);
    if (!apiKey) {
      throw new Error(`未配置 ${engine} 的 API Key`);
    }
    
    const result = await generateWithEngine(engine, {
      prompt: imageConfig.prompt,
      productImage,
      referenceImages: imageConfig.referenceImages,
      apiKey,
    });
    
    if (!result.success || !result.image) {
      throw new Error(result.error || '生成失败');
    }
    
    const processedImage = await postProcessImage(result.image);
    return processedImage;
  }, [getApiKeyForEngine]);
  
  const startGeneration = useCallback(async () => {
    if (!state.config.productImage) {
      alert('请先上传产品图');
      return;
    }
    
    dispatch({ type: 'START_GENERATION' });
    abortControllerRef.current = new AbortController();
    
    try {
      for (let i = 0; i < state.config.images.length; i++) {
        if (abortControllerRef.current.signal.aborted || state.isPaused) {
          break;
        }
        
        dispatch({ type: 'SET_CURRENT_IMAGE', payload: i });
        dispatch({ type: 'SET_IMAGE_STATUS', payload: { id: i + 1, status: 'generating' } });
        
        const imageConfig = state.config.images[i];
        const engine = imageConfig.engine || state.config.defaultEngine;
        
        try {
          const generatedImage = await generateSingleImage(
            imageConfig,
            engine,
            state.config.productImage
          );
          dispatch({ type: 'SET_GENERATED_IMAGE', payload: { id: i + 1, image: generatedImage } });
        } catch (error) {
          dispatch({
            type: 'SET_IMAGE_STATUS',
            payload: {
              id: i + 1,
              status: 'failed',
              error: error instanceof Error ? error.message : '生成失败',
            },
          });
        }
      }
    } finally {
      dispatch({ type: 'START_GENERATION' });
    }
  }, [state.config, state.isPaused, generateSingleImage]);
  
  const pauseGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    dispatch({ type: 'PAUSE_GENERATION' });
  }, []);
  
  const resumeGeneration = useCallback(() => {
    dispatch({ type: 'RESUME_GENERATION' });
    startGeneration();
  }, [startGeneration]);
  
  const regenerateImage = useCallback(async (id: number, engine?: AIEngine) => {
    const imageConfig = state.config.images.find(img => img.id === id);
    if (!imageConfig || !state.config.productImage) return;
    
    const targetEngine = engine || imageConfig.engine || state.config.defaultEngine;
    
    dispatch({ type: 'SET_IMAGE_STATUS', payload: { id, status: 'generating' } });
    
    try {
      const generatedImage = await generateSingleImage(
        { ...imageConfig, engine: targetEngine },
        targetEngine,
        state.config.productImage
      );
      dispatch({ type: 'SET_GENERATED_IMAGE', payload: { id, image: generatedImage } });
    } catch (error) {
      dispatch({
        type: 'SET_IMAGE_STATUS',
        payload: {
          id,
          status: 'failed',
          error: error instanceof Error ? error.message : '生成失败',
        },
      });
    }
  }, [state.config, generateSingleImage]);
  
  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    dispatch({ type: 'RESET' });
  }, []);
  
  const downloadImage = useCallback((id: number) => {
    const imageConfig = state.config.images.find(img => img.id === id);
    if (imageConfig?.generatedImage) {
      downloadDataURL(imageConfig.generatedImage, `amazon-product-${id}.jpg`);
    }
  }, [state.config.images]);
  
  const downloadAll = useCallback(() => {
    state.config.images.forEach((img, idx) => {
      if (img.generatedImage) {
        setTimeout(() => {
          downloadDataURL(img.generatedImage!, `amazon-product-${idx + 1}.jpg`);
        }, idx * 300);
      }
    });
  }, [state.config.images]);
  
  const loadConfig = useCallback((config: Partial<GenerationConfig>) => {
    dispatch({ type: 'LOAD_CONFIG', payload: config });
  }, []);
  
  const getConfigForSave = useCallback((): Partial<GenerationConfig> => {
    return {
      defaultEngine: state.config.defaultEngine,
      images: state.config.images.map(img => ({
        id: img.id,
        prompt: img.prompt,
        engine: img.engine,
      })),
    };
  }, [state.config]);
  
  return (
    <GeneratorContext.Provider
      value={{
        state,
        dispatch,
        setProductImage,
        setDefaultEngine,
        updateImageConfig,
        startGeneration,
        pauseGeneration,
        resumeGeneration,
        regenerateImage,
        reset,
        downloadImage,
        downloadAll,
        loadConfig,
        getConfigForSave,
      }}
    >
      {children}
    </GeneratorContext.Provider>
  );
}

export function useGenerator(): GeneratorContextType {
  const context = useContext(GeneratorContext);
  if (!context) {
    throw new Error('useGenerator must be used within GeneratorProvider');
  }
  return context;
}
```

---

## 阶段 6：Generator 组件

### Task 14: 产品图上传组件

**Files:**
- Create: `amazon-image-generator-v2/src/modules/generator/components/ProductImageUploader.tsx`

- [ ] **Step 1: 创建产品图上传组件**

```typescript
import { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useGenerator } from '../context/GeneratorContext';
import { makeSquareWithPadding } from '@/shared/utils/imageProcessor';

export function ProductImageUploader() {
  const { state, setProductImage } = useGenerator();
  
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const squareImage = await makeSquareWithPadding(dataUrl);
      setProductImage(squareImage);
    };
    reader.readAsDataURL(file);
  }, [setProductImage]);
  
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const squareImage = await makeSquareWithPadding(dataUrl);
      setProductImage(squareImage);
    };
    reader.readAsDataURL(file);
  }, [setProductImage]);
  
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-800">产品图片</h3>
      
      {state.config.productImage ? (
        <div className="relative">
          <img
            src={state.config.productImage}
            alt="产品图"
            className="w-full aspect-square object-contain rounded-lg border"
          />
          <label className="absolute bottom-2 right-2 px-3 py-1.5 bg-white rounded-lg shadow cursor-pointer text-sm hover:bg-gray-50">
            重新上传
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">点击或拖拽上传</span>
          <span className="text-xs text-gray-400 mt-1">JPG/PNG，建议白底</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
```

---

### Task 15: 图片配置卡片组件

**Files:**
- Create: `amazon-image-generator-v2/src/modules/generator/components/ImageConfigCard.tsx`

- [ ] **Step 1: 创建图片配置卡片组件**

```typescript
import { useCallback } from 'react';
import { RefreshCw, Download, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useGenerator } from '../context/GeneratorContext';
import { ImageConfig } from '../types';
import { AI_ENGINES, AIEngine } from '@/shared/ai/types';

interface Props {
  config: ImageConfig;
  index: number;
}

export function ImageConfigCard({ config, index }: Props) {
  const { state, updateImageConfig, regenerateImage, downloadImage } = useGenerator();
  
  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateImageConfig(config.id, { prompt: e.target.value });
  }, [config.id, updateImageConfig]);
  
  const handleEngineChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateImageConfig(config.id, { engine: e.target.value as AIEngine });
  }, [config.id, updateImageConfig]);
  
  const handleRegenerate = useCallback(() => {
    regenerateImage(config.id);
  }, [config.id, regenerateImage]);
  
  const handleDownload = useCallback(() => {
    downloadImage(config.id);
  }, [config.id, downloadImage]);
  
  const statusColors = {
    pending: 'bg-gray-100 text-gray-600',
    generating: 'bg-blue-100 text-blue-600',
    completed: 'bg-green-100 text-green-600',
    failed: 'bg-red-100 text-red-600',
  };
  
  const statusLabels = {
    pending: '待生成',
    generating: '生成中...',
    completed: '已完成',
    failed: '失败',
  };
  
  const isMainImage = index === 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800">
          {isMainImage ? '主图' : `附图 ${index}`}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[config.status]}`}>
          {statusLabels[config.status]}
        </span>
      </div>
      
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {config.generatedImage ? (
          <img
            src={config.generatedImage}
            alt={`生成图 ${config.id}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon size={48} />
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">提示词</label>
        <textarea
          value={config.prompt}
          onChange={handlePromptChange}
          placeholder="描述这张图要呈现的效果..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          rows={3}
        />
      </div>
      
      {config.engine && config.engine !== state.config.defaultEngine && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">AI 引擎（覆盖默认）</label>
          <select
            value={config.engine}
            onChange={handleEngineChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            {AI_ENGINES.filter(e => e.available).map(engine => (
              <option key={engine.id} value={engine.id}>{engine.name}</option>
            ))}
          </select>
        </div>
      )}
      
      {config.status === 'failed' && config.error && (
        <div className="flex items-start gap-2 text-red-600 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{config.error}</span>
        </div>
      )}
      
      <div className="flex gap-2">
        {(config.status === 'completed' || config.status === 'failed') && (
          <button
            onClick={handleRegenerate}
            disabled={state.isGenerating}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <RefreshCw size={14} />
            重生成
          </button>
        )}
        
        {config.status === 'completed' && (
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            <Download size={14} />
            下载
          </button>
        )}
      </div>
    </div>
  );
}
```

---

### Task 16: 生成控制组件

**Files:**
- Create: `amazon-image-generator-v2/src/modules/generator/components/GenerationControls.tsx`

- [ ] **Step 1: 创建生成控制组件**

```typescript
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { useGenerator } from '../context/GeneratorContext';
import { AI_ENGINES } from '@/shared/ai/types';

export function GenerationControls() {
  const { state, setDefaultEngine, startGeneration, pauseGeneration, resumeGeneration, reset, downloadAll } = useGenerator();
  
  const completedCount = state.config.images.filter(img => img.status === 'completed').length;
  const progress = (completedCount / state.config.images.length) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">默认 AI 引擎</span>
        <select
          value={state.config.defaultEngine}
          onChange={(e) => setDefaultEngine(e.target.value as any)}
          disabled={state.isGenerating}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {AI_ENGINES.filter(e => e.available).map(engine => (
            <option key={engine.id} value={engine.id}>
              {engine.name} {!engine.available && '(暂不可用)'}
            </option>
          ))}
        </select>
      </div>
      
      {state.isGenerating && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>进度: {Math.round(progress)}%</span>
            <span>图片 {state.currentImageIndex + 1} / {state.config.images.length}</span>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        {!state.isGenerating ? (
          <button
            onClick={startGeneration}
            disabled={!state.config.productImage}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Play size={18} />
            开始生成
          </button>
        ) : (
          <button
            onClick={pauseGeneration}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition"
          >
            <Pause size={18} />
            暂停
          </button>
        )}
        
        {state.isPaused && (
          <button
            onClick={resumeGeneration}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
          >
            <Play size={18} />
            继续
          </button>
        )}
        
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <RotateCcw size={18} />
          重置
        </button>
        
        {completedCount > 0 && !state.isGenerating && (
          <button
            onClick={downloadAll}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <Download size={18} />
            下载全部 ({completedCount})
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## 阶段 7：Home 页面

### Task 17: Home 页面

**Files:**
- Create: `amazon-image-generator-v2/src/pages/Home.tsx`
- Modify: `amazon-image-generator-v2/src/App.tsx`

- [ ] **Step 1: 更新 App.tsx 添加 Providers**

```typescript
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { GeneratorProvider } from './modules/generator/context/GeneratorContext'
import { SettingsProvider } from './modules/settings/context/SettingsContext'
import { ShoppingBag, History, Settings, FileText } from 'lucide-react'
import Home from './pages/Home'
import HistoryPage from './pages/History'
import TemplatesPage from './pages/Templates'
import SettingsPage from './pages/Settings'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: ShoppingBag, label: '首页' },
    { path: '/history', icon: History, label: '历史记录' },
    { path: '/templates', icon: FileText, label: '模板管理' },
    { path: '/settings', icon: Settings, label: '设置' },
  ]
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500 rounded-lg">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <span className="font-bold text-gray-900">亚马逊主图生成器</span>
          </Link>
          
          <nav className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition ${
                  location.pathname === item.path
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

function App() {
  return (
    <SettingsProvider>
      <GeneratorProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </GeneratorProvider>
    </SettingsProvider>
  )
}

export default App
```

- [ ] **Step 2: 创建 Home 页面**

```typescript
import { Package } from 'lucide-react'
import { ProductImageUploader } from '@/modules/generator/components/ProductImageUploader'
import { ImageConfigCard } from '@/modules/generator/components/ImageConfigCard'
import { GenerationControls } from '@/modules/generator/components/GenerationControls'
import { useGenerator } from '@/modules/generator/context/GeneratorContext'

export default function Home() {
  const { state } = useGenerator()
  
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <ProductImageUploader />
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package size={20} />
            生成控制
          </h2>
          <GenerationControls />
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">图片配置（7 张）</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {state.config.images.map((img, idx) => (
            <ImageConfigCard key={img.id} config={img} index={idx} />
          ))}
        </div>
      </div>
    </main>
  )
}
```

---

## 阶段 8：Templates 模块

### Task 18: Templates Context

**Files:**
- Create: `amazon-image-generator-v2/src/modules/templates/types.ts`
- Create: `amazon-image-generator-v2/src/modules/templates/context/TemplatesContext.tsx`

- [ ] **Step 1: 创建 Templates 类型和 Context**

```typescript
import { AIEngine } from '@/shared/ai/types';

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
```

```typescript
import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Template } from '../types';

interface TemplatesContextType {
  templates: Template[];
  saveTemplate: (name: string, config: any) => void;
  loadTemplate: (templateId: string) => any;
  deleteTemplate: (templateId: string) => void;
  exportTemplate: (templateId: string) => void;
  importTemplate: (file: File) => Promise<void>;
}

const TemplatesContext = createContext<TemplatesContextType | null>(null);
const STORAGE_KEY = 'amazon_v2_templates';

export function TemplatesProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useLocalStorage<Template[]>(STORAGE_KEY, []);
  
  const saveTemplate = useCallback((name: string, config: any) => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      defaultEngine: config.defaultEngine,
      imageConfigs: config.images.map((img: any) => ({
        prompt: img.prompt,
        engine: img.engine,
      })),
    };
    setTemplates([...templates, newTemplate]);
  }, [templates, setTemplates]);
  
  const loadTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;
    
    return {
      defaultEngine: template.defaultEngine,
      images: template.imageConfigs.map((img, idx) => ({
        id: idx + 1,
        prompt: img.prompt,
        engine: img.engine,
        referenceImages: [],
        status: 'pending' as const,
      })),
    };
  }, [templates]);
  
  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  }, [templates, setTemplates]);
  
  const exportTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [templates]);
  
  const importTemplate = useCallback(async (file: File) => {
    const text = await file.text();
    const template = JSON.parse(text) as Template;
    template.id = Date.now().toString();
    template.createdAt = Date.now();
    setTemplates([...templates, template]);
  }, [templates, setTemplates]);
  
  return (
    <TemplatesContext.Provider value={{ templates, saveTemplate, loadTemplate, deleteTemplate, exportTemplate, importTemplate }}>
      {children}
    </TemplatesContext.Provider>
  );
}

export function useTemplates(): TemplatesContextType {
  const context = useContext(TemplatesContext);
  if (!context) {
    throw new Error('useTemplates must be used within TemplatesProvider');
  }
  return context;
}
```

---

### Task 19: Templates 页面

**Files:**
- Create: `amazon-image-generator-v2/src/pages/Templates.tsx`

- [ ] **Step 1: 创建 Templates 页面**

```typescript
import { useState } from 'react';
import { Plus, Download, Upload, Trash2, FileText, Clock } from 'lucide-react';
import { useTemplates } from '@/modules/templates/context/TemplatesContext';
import { useGenerator } from '@/modules/generator/context/GeneratorContext';

export default function Templates() {
  const { templates, saveTemplate, loadTemplate, deleteTemplate, exportTemplate, importTemplate } = useTemplates();
  const { loadConfig, getConfigForSave } = useGenerator();
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const handleSave = () => {
    if (!newTemplateName.trim()) return;
    saveTemplate(newTemplateName, getConfigForSave());
    setNewTemplateName('');
    setShowSaveModal(false);
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importTemplate(file);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">模板管理</h1>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <Upload size={18} />
            导入
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Plus size={18} />
            保存当前配置
          </button>
        </div>
      </div>
      
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">保存模板</h3>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="输入模板名称"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 border rounded-lg">取消</button>
              <button onClick={handleSave} className="px-4 py-2 bg-orange-500 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
      
      {templates.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无模板</p>
          <p className="text-sm mt-1">保存当前配置为模板，方便下次使用</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(template.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {template.imageConfigs.filter(img => img.prompt).length} 张图已配置
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => loadTemplate(template.id)}
                  className="flex-1 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  加载
                </button>
                <button
                  onClick={() => exportTemplate(template.id)}
                  className="p-1.5 text-gray-500 hover:text-gray-700"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1.5 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
```

---

## 阶段 9：History 模块

### Task 20: History 模块

**Files:**
- Create: `amazon-image-generator-v2/src/modules/history/types.ts`
- Create: `amazon-image-generator-v2/src/modules/history/context/HistoryContext.tsx`
- Create: `amazon-image-generator-v2/src/pages/History.tsx`

- [ ] **Step 1: 创建 History 类型和 Context**

```typescript
import { AIEngine } from '@/shared/ai/types';

export interface HistoryImage {
  prompt: string;
  engine: AIEngine;
  generatedImage: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  createdAt: number;
  productImage: string;
  defaultEngine: AIEngine;
  images: HistoryImage[];
  configSnapshot: any;
}
```

```typescript
import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage, checkStorageAvailable } from '@/shared/hooks/useLocalStorage';
import { HistoryItem } from '../types';

interface HistoryContextType {
  history: HistoryItem[];
  saveToHistory: (name: string, data: any) => void;
  deleteHistoryItem: (id: string) => void;
  clearAllHistory: () => void;
  loadHistoryConfig: (id: string) => any;
}

const HistoryContext = createContext<HistoryContextType | null>(null);
const STORAGE_KEY = 'amazon_v2_history';

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(STORAGE_KEY, []);
  
  const saveToHistory = useCallback((name: string, data: any) => {
    if (!checkStorageAvailable()) {
      alert('存储空间不足，请清理历史记录');
      return;
    }
    
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        name,
        createdAt: Date.now(),
        productImage: data.productImage,
        defaultEngine: data.defaultEngine,
        images: data.images.filter((img: any) => img.generatedImage),
        configSnapshot: {
          defaultEngine: data.defaultEngine,
          images: data.images.map((img: any) => ({
            id: img.id,
            prompt: img.prompt,
            engine: img.engine,
          })),
        },
      };
      setHistory([newItem, ...history]);
    } catch (error) {
      alert('保存失败，存储空间可能不足');
    }
  }, [history, setHistory]);
  
  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(history.filter(item => item.id !== id));
  }, [history, setHistory]);
  
  const clearAllHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);
  
  const loadHistoryConfig = useCallback((id: string) => {
    const item = history.find(h => h.id === id);
    if (!item) return null;
    return item.configSnapshot;
  }, [history]);
  
  return (
    <HistoryContext.Provider value={{ history, saveToHistory, deleteHistoryItem, clearAllHistory, loadHistoryConfig }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextType {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
}
```

- [ ] **Step 2: 创建 History 页面**

```typescript
import { Trash2, Clock, Image as ImageIcon } from 'lucide-react';
import { useHistory } from '@/modules/history/context/HistoryContext';
import { useGenerator } from '@/modules/generator/context/GeneratorContext';
import { downloadDataURL } from '@/shared/utils/file';

export default function History() {
  const { history, deleteHistoryItem, clearAllHistory } = useHistory();
  const { loadConfig, state } = useGenerator();
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };
  
  const handleLoad = (id: string) => {
    const item = history.find(h => h.id === id);
    if (!item) return;
    loadConfig(item.configSnapshot);
    if (item.productImage) {
      // 需要更新 productImage
    }
  };
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">历史记录</h1>
        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            清空全部
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Clock size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无历史记录</p>
          <p className="text-sm mt-1">生成图片后会自动保存到这里</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                </div>
                <button
                  onClick={() => deleteHistoryItem(item.id)}
                  className="p-1.5 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-8 gap-2 mb-3">
                {item.images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded overflow-hidden bg-gray-100">
                    {img.generatedImage ? (
                      <img src={img.generatedImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handleLoad(item.id)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                加载配置
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
```

---

## 阶段 10：整合与测试

### Task 21: 更新 App 添加所有 Provider

**Files:**
- Modify: `amazon-image-generator-v2/src/App.tsx`

- [ ] **Step 1: 更新 App.tsx**

```typescript
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { GeneratorProvider } from './modules/generator/context/GeneratorContext'
import { SettingsProvider } from './modules/settings/context/SettingsContext'
import { TemplatesProvider } from './modules/templates/context/TemplatesContext'
import { HistoryProvider } from './modules/history/context/HistoryContext'
import { ShoppingBag, History, Settings, FileText } from 'lucide-react'
import Home from './pages/Home'
import HistoryPage from './pages/History'
import TemplatesPage from './pages/Templates'
import SettingsPage from './pages/Settings'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: ShoppingBag, label: '首页' },
    { path: '/history', icon: History, label: '历史记录' },
    { path: '/templates', icon: FileText, label: '模板管理' },
    { path: '/settings', icon: Settings, label: '设置' },
  ]
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500 rounded-lg">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <span className="font-bold text-gray-900">亚马逊主图生成器</span>
          </Link>
          
          <nav className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition ${
                  location.pathname === item.path
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

function App() {
  return (
    <SettingsProvider>
      <TemplatesProvider>
        <HistoryProvider>
          <GeneratorProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <Navigation />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/templates" element={<TemplatesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </BrowserRouter>
          </GeneratorProvider>
        </HistoryProvider>
      </TemplatesProvider>
    </SettingsProvider>
  )
}

export default App
```

---

### Task 22: 测试与修复

- [ ] **Step 1: 运行开发服务器**

Run: `cd /workspace/amazon-image-generator-v2 && npm run dev`

- [ ] **Step 2: 测试产品图上传**

测试上传 JPG/PNG 图片，验证正方形处理

- [ ] **Step 3: 测试 AI 引擎选择**

验证 Mock 引擎可用，验证不可用引擎被禁用

- [ ] **Step 4: 测试生成流程**

验证生成队列、暂停、错误处理

- [ ] **Step 5: 测试模板保存/加载**

- [ ] **Step 6: 测试历史记录**

- [ ] **Step 7: 修复发现的问题**

---

## 实现计划完成

**文件清单：**
- 创建约 25 个新文件
- 修改 1 个文件（App.tsx）

**预计任务数：** 22 个 Task

**下一步：**
选择执行方式：
1. **Subagent-Driven（推荐）** - 我调度子代理逐任务执行，任务间审查，快速迭代
2. **Inline Execution** - 在本会话中批量执行，有检查点
