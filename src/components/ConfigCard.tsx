import { ImageUploader } from './ImageUploader';
import { ImageConfig } from '../types';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ConfigCardProps {
  config: ImageConfig;
  onUpdate: (updates: Partial<ImageConfig>) => void;
}

export function ConfigCard({ config, onUpdate }: ConfigCardProps) {
  const statusColors = {
    pending: 'border-gray-300 dark:border-gray-700',
    generating: 'border-orange-500 animate-pulse',
    done: 'border-green-500',
    error: 'border-red-500',
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 shadow-sm overflow-hidden ${statusColors[config.status]}`}
    >
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          图片 {config.id}
        </h3>
        <div className="flex items-center">
          {config.status === 'pending' && (
            <span className="text-xs text-gray-500">等待中</span>
          )}
          {config.status === 'generating' && (
            <div className="flex items-center text-orange-600">
              <Loader2 className="animate-spin mr-1" size={14} />
              <span className="text-xs">生成中...</span>
            </div>
          )}
          {config.status === 'done' && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-1" size={14} />
              <span className="text-xs">完成</span>
            </div>
          )}
          {config.status === 'error' && (
            <div className="flex items-center text-red-600">
              <XCircle className="mr-1" size={14} />
              <span className="text-xs">错误</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        <ImageUploader
          value={config.referenceImages[0] || null}
          onChange={(img) =>
            onUpdate({
              referenceImages: img ? [img] : [],
            })
          }
          label="参考图"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            提示词
          </label>
          <textarea
            value={config.prompt}
            onChange={(e) => onUpdate({ prompt: e.target.value })}
            placeholder="描述你想要生成的图片风格..."
            className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            rows={3}
          />
        </div>

        {config.generatedImage && (
          <div className="pt-2 border-t">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              生成结果
            </label>
            <img
              src={config.generatedImage}
              alt={`Generated ${config.id}`}
              className="w-full rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
