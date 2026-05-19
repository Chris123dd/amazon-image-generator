import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { useGenerator } from '../context/GeneratorContext';
import { AI_ENGINES } from '@/shared/ai/types';

export function GenerationControls() {
  const { state, setDefaultEngine, startGeneration, pauseGeneration, reset, downloadAll } = useGenerator();
  
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
