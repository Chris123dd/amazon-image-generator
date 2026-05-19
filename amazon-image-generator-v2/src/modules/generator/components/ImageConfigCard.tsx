import { useCallback } from 'react';
import { RefreshCw, Download, Image as ImageIcon, AlertCircle, Upload, X, Check } from 'lucide-react';
import { useGenerator } from '../context/GeneratorContext';
import { ImageConfig as ImageConfigType } from '../types';
import { AI_ENGINES, AIEngine } from '@/shared/ai/types';

interface Props {
  config: ImageConfigType;
  index: number;
}

export function ImageConfigCard({ config, index }: Props) {
  const { state, updateImageConfig, regenerateImage, downloadImage, toggleImageSelected } = useGenerator();
  
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
  
  const handleReferenceUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateImageConfig(config.id, {
          referenceImages: [...config.referenceImages, dataUrl]
        });
      };
      reader.readAsDataURL(file);
    });
  }, [config.id, config.referenceImages, updateImageConfig]);
  
  const handleRemoveReference = useCallback((refIndex: number) => {
    const newReferences = config.referenceImages.filter((_, i) => i !== refIndex);
    updateImageConfig(config.id, { referenceImages: newReferences });
  }, [config.id, config.referenceImages, updateImageConfig]);
  
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleImageSelected(config.id)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              config.selected
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-gray-300 hover:border-orange-400'
            }`}
          >
            {config.selected && <Check size={12} />}
          </button>
          <span className="font-medium text-gray-800">
            {isMainImage ? '主图' : `附图 ${index}`}
          </span>
        </div>
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
          rows={2}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          参考图 {config.referenceImages.length > 0 && `(${config.referenceImages.length}张)`}
        </label>
        
        {config.referenceImages.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {config.referenceImages.map((ref, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={ref}
                  alt={`参考图 ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
                <button
                  onClick={() => handleRemoveReference(idx)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition text-sm text-gray-500">
          <Upload size={16} />
          添加参考图
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleReferenceUpload}
            className="hidden"
          />
        </label>
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
