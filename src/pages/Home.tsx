import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../store/editorStore';
import { ImageUploader } from '../components/ImageUploader';
import { ConfigCard } from '../components/ConfigCard';
import { AISelector } from '../components/AISelector';
import { AIEngine } from '../types';

const ENGINE_API_KEY_MAP: Record<AIEngine, string | null> = {
  'mock': null,
  'stable-diffusion': 'replicateApiKey',
  'dalle': 'openaiApiKey',
  'gemini': 'googleApiKey',
  'doubao': 'volcanoApiKey',
  'jimeng': 'volcanoApiKey',
  'tongyi': 'aliApiKey',
  'wenxin': 'baiduApiKey',
  'hunyuan': 'tencentApiKey',
};
import { TemplateSelector } from '../components/TemplateSelector';
import {
  Play,
  Pause,
  Download,
  RotateCcw,
  ShoppingBag,
  Package,
  History,
  Key,
  Settings,
} from 'lucide-react';

type GenerationState = 'idle' | 'generating' | 'paused' | 'completed';

export default function Home() {
  const navigate = useNavigate();
  const {
    config,
    templates,
    apiKeys,
    history,
    setProductImage,
    setAIEngine,
    updateImageConfig,
    setGeneratedImage,
    setImageStatus,
    resetAll,
    loadTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    loadHistory,
    saveToHistory,
  } = useEditorStore();

  const [generationState, setGenerationState] =
    useState<GenerationState>('idle');
  const [currentGeneratingIndex, setCurrentGeneratingIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadTemplates();
    loadHistory();
  }, [loadTemplates, loadHistory]);

  const handleStartGeneration = async () => {
    if (!config.productImage) {
      alert('请先上传产品图片');
      return;
    }

    const requiredKey = ENGINE_API_KEY_MAP[config.aiEngine];
    if (requiredKey && !apiKeys[requiredKey as keyof typeof apiKeys]) {
      alert(`该 AI 引擎需要配置 ${requiredKey.replace('ApiKey', '')} API Key`);
      return;
    }

    setGenerationState('generating');
    setCurrentGeneratingIndex(0);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      for (let i = 0; i < config.images.length; i++) {
        const currentState = useEditorStore.getState().generationState;
        if (currentState === 'paused') {
          break;
        }

        setImageStatus(i + 1, 'generating');
        setCurrentGeneratingIndex(i);

        await generateImage(i, abortControllerRef.current);
        setProgress(((i + 1) / config.images.length) * 100);
      }

      setGenerationState('completed');
      saveToHistory(`生成 ${new Date().toLocaleString()}`);
    } catch (e) {
      console.error('Generation error', e);
      setGenerationState('idle');
    }
  };

  const generateImage = async (index: number, abortController?: AbortController) => {
    const imgConfig = config.images[index];
    
    if (config.aiEngine === 'mock') {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (config.productImage) {
          const img = new Image();
          img.src = config.productImage;
          await new Promise((resolve) => {
            img.onload = resolve;
          });
          ctx.drawImage(img, 250, 250, 500, 500);
        }

        ctx.fillStyle = '#333';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Amazon Image ${index + 1}`, 500, 800);
      }

      const mockResult = canvas.toDataURL('image/jpeg', 0.9);
      setGeneratedImage(index + 1, mockResult);
      setImageStatus(index + 1, 'done');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engine: config.aiEngine,
          productImage: config.productImage,
          referenceImages: imgConfig.referenceImages,
          prompt: imgConfig.prompt,
          apiKeys,
        }),
        signal: abortController?.signal,
      });

      const result = await response.json();

      if (result.success && result.image) {
        setGeneratedImage(index + 1, result.image);
        setImageStatus(index + 1, 'done');
      } else {
        throw new Error(result.error || '生成失败');
      }
    } catch (error) {
      console.error('生成错误:', error);
      setImageStatus(index + 1, 'error');
    }
  };

  const handlePause = () => {
    setGenerationState('paused');
    abortControllerRef.current?.abort();
  };

  const handleReset = () => {
    setGenerationState('idle');
    setProgress(0);
    setCurrentGeneratingIndex(0);
    resetAll();
  };

  const handleDownloadAll = () => {
    config.images.forEach((img, idx) => {
      if (img.generatedImage) {
        const link = document.createElement('a');
        link.href = img.generatedImage;
        link.download = `amazon-product-${idx + 1}.jpg`;
        link.click();
      }
    });
  };

  const completedCount = config.images.filter(
    (i) => i.status === 'done'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <ShoppingBag className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  亚马逊主图生成器
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AI 驱动的全套产品图片自动生成
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/history')}
                className="relative flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg transition"
              >
                <History size={18} />
                <span className="hidden md:inline">历史记录</span>
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {history.length > 9 ? '9+' : history.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/templates')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg transition"
              >
                <Settings size={18} />
                <span className="hidden md:inline">模板管理</span>
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg transition"
              >
                <Key size={18} />
                <span className="hidden md:inline">API 密钥</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <Package size={20} />
                产品图片
              </h2>
              <ImageUploader
                value={config.productImage}
                onChange={setProductImage}
                label="白底产品图"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
              <AISelector
                value={config.aiEngine}
                onChange={setAIEngine}
                apiKeys={apiKeys}
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                生成控制
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg text-gray-700 dark:text-gray-200"
                >
                  <RotateCcw size={18} />
                  重置
                </button>

                {generationState === 'idle' && (
                  <button
                    onClick={handleStartGeneration}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
                  >
                    <Play size={18} />
                    开始生成
                  </button>
                )}

                {generationState === 'generating' && (
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium"
                  >
                    <Pause size={18} />
                    暂停
                  </button>
                )}

                {(generationState === 'completed' ||
                  generationState === 'paused') && (
                  <button
                    onClick={handleDownloadAll}
                    disabled={completedCount === 0}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    <Download size={18} />
                    全部下载 ({completedCount})
                  </button>
                )}
              </div>
            </div>

            {generationState !== 'idle' && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>进度: {Math.round(progress)}%</span>
                  <span>图片 {currentGeneratingIndex + 1} / 7</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              图片配置 (7 张)
            </h2>
            <TemplateSelector
              templates={templates}
              onSave={saveTemplate}
              onLoad={loadTemplate}
              onDelete={deleteTemplate}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {config.images.map((imgConfig, idx) => (
              <ConfigCard
                key={imgConfig.id}
                config={imgConfig}
                onUpdate={(updates) =>
                  updateImageConfig(imgConfig.id, updates)
                }
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
