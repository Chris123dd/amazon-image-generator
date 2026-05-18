import { AIEngine } from '../types';
import { Brain, Zap, Gem, Play, Cloud, CloudLightning, CloudRain, CloudFog, Flower2 } from 'lucide-react';

interface AISelectorProps {
  value: AIEngine;
  onChange: (engine: AIEngine) => void;
}

const AVAILABLE_ENGINES: AIEngine[] = ['mock', 'stable-diffusion', 'dalle', 'gemini', 'doubao'];

const AI_OPTIONS: {
  id: AIEngine;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description: string;
  category: 'domestic' | 'foreign';
}[] = [
  {
    id: 'mock',
    name: '模拟生成',
    icon: Play,
    description: '无需 API Key，快速测试功能',
    category: 'foreign'
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    icon: Brain,
    description: '开源模型，控制度高，适合产品图片',
    category: 'foreign'
  },
  {
    id: 'dalle',
    name: 'DALL-E 3',
    icon: Zap,
    description: 'OpenAI 出品，理解能力强',
    category: 'foreign'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: Gem,
    description: 'Google 最新模型，品质优秀',
    category: 'foreign'
  },
  {
    id: 'doubao',
    name: '豆包',
    icon: Flower2,
    description: '字节豆包Seedream模型，优秀的中文理解能力',
    category: 'domestic'
  },
  {
    id: 'jimeng',
    name: '即梦',
    icon: Cloud,
    description: '字节即梦AI，快速生图',
    category: 'domestic'
  },
  {
    id: 'tongyi',
    name: '通义万相',
    icon: CloudLightning,
    description: '阿里云出品，理解中文强',
    category: 'domestic'
  },
  {
    id: 'wenxin',
    name: '文心一格',
    icon: CloudRain,
    description: '百度出品，中文场景丰富',
    category: 'domestic'
  },
  {
    id: 'hunyuan',
    name: '混元',
    icon: CloudFog,
    description: '腾讯云出品，艺术风格多样',
    category: 'domestic'
  },
];

export function AISelector({ value, onChange }: AISelectorProps) {
  const foreignOptions = AI_OPTIONS.filter(opt => opt.category === 'foreign');
  const domesticOptions = AI_OPTIONS.filter(opt => opt.category === 'domestic');

  const isEngineAvailable = (id: AIEngine) => AVAILABLE_ENGINES.includes(id);

  const renderOptions = (options: typeof AI_OPTIONS) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.id;
        const isAvailable = isEngineAvailable(option.id);
        return (
          <button
            key={option.id}
            onClick={() => isAvailable && onChange(option.id)}
            disabled={!isAvailable}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
            } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Icon
                className={isSelected ? 'text-orange-600' : 'text-gray-400'}
                size={24}
              />
              <span className="font-semibold text-gray-800 dark:text-white">
                {option.name}
                {!isAvailable && <span className="text-xs text-gray-400 ml-1">(暂不可用)</span>}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        选择 AI 引擎
      </label>
      
      <div>
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">🌍 国外 API</h4>
        {renderOptions(foreignOptions)}
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">🇨🇳 国内 API</h4>
        {renderOptions(domesticOptions)}
      </div>
    </div>
  );
}

export { AVAILABLE_ENGINES };
