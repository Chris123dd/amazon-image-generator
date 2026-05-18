# 亚马逊图片生成器 - Code Review 问题修复清单

**审查日期**: 2026-05-18
**审查范围**: 前端 React + 后端 Express
**状态**: 待修复

---

## 一、严重 Bug（必须修复）

### 🔴 Bug #1：暂停功能完全失效

**文件**: `src/pages/Home.tsx`
**位置**: 第 55-86 行 `handleStartGeneration` 函数

**问题描述**:
- `generationState` 是 React 状态变量，for 循环内通过闭包捕获的是首次渲染的值
- 即使点击暂停按钮修改了状态，循环内部的 `generationState === 'paused'` 判断永远为 `false`
- `abortControllerRef` 创建后从未传递给 fetch 请求

**影响**: 用户点击暂停后程序继续执行，UI 欺骗用户

**修复步骤**:

1. 在循环内部使用 Zustand 的 `getState()` 实时获取最新状态：

```typescript
for (let i = 0; i < config.images.length; i++) {
  const currentState = useEditorStore.getState().generationState;
  if (currentState === 'paused') {
    break;
  }
  // ...
}
```

2. 在 `generateImage` 函数中给 fetch 添加 signal：

```typescript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({...}),
  signal: abortControllerRef.current?.signal,  // 添加这行
});
```

**验收标准**: 点击暂停按钮后，正在生成的图片完成后停止，不再继续生成下一张

---

### 🔴 Bug #2：模板保存丢失 AI 引擎

**文件**: `src/store/editorStore.ts`
**位置**: 第 131-145 行 `saveTemplate` 函数

**问题描述**:
- `saveTemplate` 保存模板时完全忽略了 `aiEngine` 字段
- `loadTemplate` 也没有恢复 AI 引擎选择
- 用户保存模板后再加载，需要重新选择 AI 引擎

**修复步骤**:

1. 修改 `saveTemplate` 函数，在 `newTemplate` 中添加 `aiEngine`：

```typescript
saveTemplate: (name) => {
  const { config, templates } = get();
  const newTemplate: Template = {
    id: Date.now().toString(),
    name,
    createdAt: Date.now(),
    aiEngine: config.aiEngine,  // 添加这行
    imageConfigs: config.images.map((img) => ({
      referenceImages: img.referenceImages,
      prompt: img.prompt,
    })),
  };
  // ...
},
```

2. 修改 `loadTemplate` 函数，恢复 AI 引擎：

```typescript
loadTemplate: (templateId) => {
  const { templates } = get();
  const template = templates.find((t) => t.id === templateId);
  if (template) {
    set((state) => ({
      config: {
        ...state.config,
        aiEngine: template.aiEngine || 'mock',  // 添加这行
        images: state.config.images.map((img, idx) => ({
          ...img,
          referenceImages: template.imageConfigs[idx]?.referenceImages || [],
          prompt: template.imageConfigs[idx]?.prompt || '',
          status: 'pending',
          generatedImage: null,
        })),
      },
    }));
  }
},
```

3. 在 `src/types/index.ts` 的 `Template` 接口中添加 `aiEngine` 字段：

```typescript
export interface Template {
  id: string;
  name: string;
  createdAt: number;
  aiEngine: AIEngine;  // 添加这行
  imageConfigs: Array<{
    referenceImages: string[];
    prompt: string;
  }>;
}
```

**验收标准**: 保存模板后重新加载，AI 引擎选择与保存时一致

---

### 🔴 Bug #3：Stable Diffusion 忽略产品图和参考图

**文件**: `api/routes/generate.ts`
**位置**: 第 202-258 行 `generateWithStableDiffusion` 函数

**问题描述**:
- 代码花了大量篇幅处理产品图和参考图（resize、转换 base64）
- 但 Replicate API 调用时只传了 prompt，没传任何图片
- 当前使用的 `bytedance/sdxl-lightning-4step` 是纯文生图模型，不支持图生图
- 用户上传的产品图和参考图完全被忽略

**影响**: 用户选择 SD 引擎时，无论传什么图都无效

**修复方案**: 方案 A - 使用支持图生图的 SDXL img2img 模型

**修复步骤**:

1. 在 `api/routes/generate.ts` 中找到 `generateWithStableDiffusion` 函数

2. 替换整个函数实现：

```typescript
async function generateWithStableDiffusion(
  productImage: string,
  referenceImages: string[],
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log('使用 Stable Diffusion 生成，提示词:', prompt);

  try {
    const replicate = new Replicate({ auth: apiKey });

    // 将 base64 产品图转为 URL（Replicate img2img 模型需要 URL）
    const productBuffer = Buffer.from(productImage.split(',')[1], 'base64');
    const resizedProduct = await sharp(productBuffer)
      .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 90 })
      .toBuffer();

    // 上传到临时存储获取 URL（这里用 data URI 方式处理）
    const productImageUrl = `data:image/jpeg;base64,${resizedProduct.toString('base64')}`;

    // 构建增强提示词
    const fullPrompt = referenceImages.length > 0
      ? `${prompt}, product photography, professional, high quality, detailed`
      : `${prompt}, product photography, professional, clean white background, high quality, detailed`;

    // 调用 SDXL img2img 模型（支持图生图）
    // 模型: stability-ai/sdxl:image-to-image
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: fullPrompt,
          negative_prompt: "blurry, low quality, distorted, bad anatomy, text, watermark, deformed",
          image: productImageUrl,
          strength: 0.6,          // 0-1，越低越保留原图
          guidance_scale: 7.5,
          num_inference_steps: 30,
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      const imageUrl = output[0];
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      return 'data:image/jpeg;base64,' + Buffer.from(imageBuffer).toString('base64');
    }

    throw new Error('Stable Diffusion 没有返回图片');
  } catch (error) {
    console.error('Stable Diffusion 错误:', error);
    throw error;  // 改为抛出错误，让上层处理
  }
}
```

3. 如果需要支持参考图（在 ControlNet 或 IP-Adapter 场景下），需要在调用前将参考图也处理成 URL 格式

**关键参数说明**:
- `image`: 输入的产品图（支持 data URI）
- `strength`: 0.0-1.0，值越小越保留原图特征，建议 0.5-0.7
- `guidance_scale`: 提示词引导强度，7-8 是常用值
- `num_inference_steps`: 推理步数，25-50 效果较好

**验收标准**: 选择 SD 引擎，上传产品图后，生成结果应包含原产品的主要视觉特征

---

### 🔴 Bug #4：空实现的 AI 引擎误导用户

**文件**:
- `api/routes/generate.ts` (第 369-498 行)
- `src/components/AISelector.tsx`

**问题描述**:
- `jimeng`、`tongyi`、`wenxin`、`hunyuan` 四个引擎直接返回原图
- 用户选择这些引擎后，等半天发现图片没变化
- 没有错误提示，没有"暂不可用"标记

**修复步骤**:

1. 在 `AISelector.tsx` 中添加可用性标记：

```typescript
const engines = [
  { id: 'mock', name: '模拟模式', available: true },
  { id: 'stable-diffusion', name: 'Stable Diffusion', available: true },
  { id: 'dalle', name: 'DALL-E 3', available: true },
  { id: 'gemini', name: 'Gemini', available: true },
  { id: 'doubao', name: '豆包', available: false },        // 标记为不可用
  { id: 'jimeng', name: '即梦', available: false },
  { id: 'tongyi', name: '通义万相', available: false },
  { id: 'wenxin', name: '文心一格', available: false },
  { id: 'hunyuan', name: '混元', available: false },
];

// 渲染时
<option value={engine.id} disabled={!engine.available}>
  {engine.name} {!engine.available && '(暂不可用)'}
</option>
```

2. 在 `handleStartGeneration` 开头添加检查：

```typescript
if (engine !== 'mock' && !isEngineAvailable(engine)) {
  alert('该 AI 引擎暂不可用，请选择其他引擎');
  return;
}
```

**验收标准**: 不可用引擎显示禁用状态，用户无法选择或选择后有明确提示

---

## 二、用户体验问题

### 🟡 Issue #1：错误后静默返回原图

**文件**: `api/routes/generate.ts` 所有生成函数

**问题描述**:
- 所有 AI 生成函数 catch 块中直接返回原图
- 用户不知道发生了什么错误
- 没有任何错误日志或用户提示

**修复建议**:
```typescript
} catch (error) {
  console.error('SD 错误:', error);
  throw error;  // 改为抛出错误，让上层处理
  // 或者返回带错误信息的对象
}
```

---

### 🟡 Issue #2：硬编码数字 7 无处不在

**文件**: 多处

**问题描述**:
- `INITIAL_IMAGES` 初始化 7 个
- `Home.tsx` UI 显示 "图片配置 (7 张)"
- 没有常量定义，修改图片数量需要改多处

**修复建议**:
```typescript
// src/lib/constants.ts
export const DEFAULT_IMAGE_COUNT = 7;
```

然后替换所有 `7` 为 `DEFAULT_IMAGE_COUNT`。

---

### 🟡 Issue #3：历史记录无限增长

**文件**: `src/store/editorStore.ts`

**问题描述**:
- `saveToHistory` 保存完整的 base64 图片
- localStorage 通常限制 5-10MB
- 历史记录多了会爆

**修复建议**:
```typescript
saveToHistory: (name) => {
  const { config, history } = get();
  if (!config.productImage) return;

  // 检查存储大小，超过限制时清理旧数据
  try {
    localStorage.setItem('test', '');
  } catch {
    // localStorage 已满，删除最早的记录
    const newHistory = [...history];
    while (newHistory.length > 0) {
      const removed = newHistory.pop();
      if (removed) {
        // 保存缩略图版本
      }
    }
  }
  // ...
},
```

---

## 三、架构问题（可选改进）

### 🔵 过度工程 #1：Express 后端多此一举

**现状**: 前端 → Express → AI 服务

**问题**: Express 纯粹在转发请求，还增加了 API 密钥传输风险

**建议**: 考虑直接在前端调用 AI API，减少故障点

---

### 🔵 过度工程 #2：Zustand 过度使用

**现状**: 使用 Zustand 管理本可用 useState + useContext 的简单状态

**建议**: 除非有深层嵌套状态或跨组件共享需求，否则不必引入额外依赖

---

## 四、修复优先级

| 优先级 | Bug | 预计时间 |
|-------|-----|---------|
| P0 | Bug #1 暂停功能 | 30 分钟 |
| P0 | Bug #2 模板丢失 | 20 分钟 |
| P1 | Bug #3 SD 忽略图片 | 1-2 小时 |
| P1 | Bug #4 空引擎误导 | 30 分钟 |
| P2 | 错误处理 | 1 小时 |
| P3 | 硬编码清理 | 30 分钟 |
| P3 | 历史记录 | 1 小时 |

---

## 五、验收检查清单

修复完成后，确保以下场景测试通过：

- [ ] 选择 SD 引擎，上传产品图，生成结果包含产品特征
- [ ] 保存包含 AI 引擎选择的模板，加载后引擎一致
- [ ] 生成 5 张图后点击暂停，第 6 张不开始生成
- [ ] 选择"即梦"等不可用引擎，UI 显示禁用或提示
- [ ] 各种 AI 引擎报错时，用户能收到错误提示而非静默失败
