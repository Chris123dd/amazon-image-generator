# 亚马逊图片生成器 - 第二轮修复指示文档

**审查日期**: 2026-05-18
**状态**: 待修复

---

## 🔴 第一优先级：残留 Bug 修复

### Bug 1：暂停功能还是半残！

**文件**: [src/pages/Home.tsx](file:///workspace/src/pages/Home.tsx#L87-L95)

**问题描述**:
- 点击暂停后，当前正在生成的图片还是会继续直到完成
- `abortController` 传了但没正确处理请求取消
- API 请求被取消时没有给用户反馈，状态还是会标记为完成

**修复方案**:
```typescript
// 在 generateImage 函数中添加 abort 处理
const generateImage = async (index: number, abortController?: AbortController) => {
  try {
    // ... 现有代码 ...

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...}),
      signal: abortController?.signal,
    });

    // 检查响应是否正常
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.image) {
      setGeneratedImage(index + 1, result.image);
      setImageStatus(index + 1, 'done');
    } else {
      throw new Error(result.error || '生成失败');
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      // 用户点击了暂停
      setImageStatus(index + 1, 'pending');
    } else {
      console.error('生成错误:', error);
      setImageStatus(index + 1, 'error');
    }
  }
};
```

**验收标准**:
- 点击暂停后，正在进行的请求会立即停止
- 被取消的图片状态会重置为 pending
- 用户有明确的暂停反馈

---

### Bug 2：历史记录完全是摆设！

**文件**: [src/store/editorStore.ts](file:///workspace/src/store/editorStore.ts#L184-L209)

**问题描述**:
- `saveToHistory` 保存的东西根本没法用
- 没有预览图，没有时间信息，没有导出功能
- 不清理旧记录，localStorage 爆了你就等着哭吧

**修复方案**:
```typescript
// 修改 saveToHistory 函数
const MAX_HISTORY_ITEMS = 10;

const saveToHistory = (name) => {
  const { config, history } = get();
  if (!config.productImage) return;

  const generatedImages: GeneratedImage[] = config.images
    .filter((img) => img.generatedImage)
    .map((img) => ({
      referenceImages: img.referenceImages,
      prompt: img.prompt,
      generatedImage: img.generatedImage!,
      status: img.status,
    }));

  const newHistoryItem: HistoryItem = {
    id: Date.now().toString(),
    name: name || `生成记录 ${new Date().toLocaleString()}`,
    createdAt: Date.now(),
    productImage: config.productImage,
    aiEngine: config.aiEngine,
    generatedImages,
    thumbnail: generatedImages[0]?.generatedImage || config.productImage, // 添加缩略图
  };

  // 限制历史记录数量
  const updatedHistory = [newHistoryItem, ...history].slice(0, MAX_HISTORY_ITEMS);

  set({ history: updatedHistory });
  localStorage.setItem('amazon_history', JSON.stringify(updatedHistory));
};
```

**验收标准**:
- 历史记录有缩略图
- 超过10条自动删除最旧的
- History 页面可以查看

---

### Bug 3：图片上传没有大小限制！

**文件**: [src/components/ImageUploader.tsx](file:///workspace/src/components/ImageUploader.tsx)

**问题描述**:
- 用户传个 100MB 的 RAW 图进去，直接卡死浏览器
- 没有压缩，没有格式检查，啥都没有

**修复方案**:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 检查格式
  if (!ACCEPTED_FORMATS.includes(file.type)) {
    alert('仅支持 JPEG、PNG、WebP 格式');
    return;
  }

  // 检查大小
  if (file.size > MAX_FILE_SIZE) {
    alert('图片大小不能超过 10MB');
    return;
  }

  // ... 现有代码 ...
};
```

**验收标准**:
- 超过 10MB 的图片不能上传
- 不支持的格式有明确提示

---

## 🎯 第二优先级：隐含假设验证

### 假设 1：用户有所有 AI 服务的 API Key

**修复方案**:
- 在首页提供默认启用的引擎列表（比如只开启 mock、stable-diffusion）
- 其他引擎显示"暂不可用"或"需要配置"
- 添加"推荐引擎"提示

---

### 假设 2：用户永远只在本地浏览器使用

**修复方案**:
- 在 History 和 Settings 页面添加"导出数据"按钮
- 提供"导入数据"功能
- 提示用户数据存储在本地，换设备需要导出导入

---

### 假设 3：所有生成引擎的接口都是稳定的

**修复方案**:
- 在所有 API 请求中添加超时
- 添加重试机制（最多3次）
- 失败时提供降级方案（比如提示用户换引擎或稍后重试）

---

## 💩 第三优先级：过度工程优化

### 过度工程 1：那个 Express 后端！

**建议**: 暂时保留，但标记为"可以优化"

### 过度工程 2：Zustand 状态管理

**建议**: 暂时保留，重构风险大

### 过度工程 3：你那个 Template 系统！

**建议**: 添加模板导入导出功能，让它真的有用

---

## 📝 其他小修复

1. 把所有 `alert` 换成 UI 组件（比如 Toast）
2. 添加加载状态指示
3. 清理所有 console.log 和 TODO
4. 优化图片下载（用现代 API）

---

## 修复顺序

1. 先修暂停功能和图片上传限制
2. 再优化历史记录
3. 最后搞用户体验
