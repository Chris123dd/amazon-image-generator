import { AIEngine } from '../types';
import { Brain, Sparkles, Zap, Gem, Play } from 'lucide-react';

interface AISelectorProps {
  value: AIEngine;
  onChange: (engine: AIEngine) => void;
}

const AI_OPTIONS: {
  id: AIEngine;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}[] = [
  {
    id: 'mock',
    name: '模拟生成',
    icon: Play,
    description: '无需 API Key，快速测试功能',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    icon: Brain,
    description: '开源模型，控制度高，适合产品图片',
  },
  {
    id: 'dalle',
    name: 'DALL-E 3',
    icon: Zap,
    description: 'OpenAI 出品，理解能力强',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: Gem,
    description: 'Google 最新模型，品质优秀',
  },
];

export function AISelector({ value, onChange }: AISelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        选择 AI 引擎
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {AI_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon
                  className={isSelected ? 'text-orange-600' : 'text-gray-400'}
                  size={24}
                />
                <span className="font-semibold text-gray-800 dark:text-white">
                  {option.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
