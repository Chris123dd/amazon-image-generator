import { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export function ApiKeysConfig() {
  const { apiKeys, setApiKeys } = useEditorStore();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Key className="text-orange-500" size={24} />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          API 密钥配置
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Replicate API Key (Stable Diffusion)
          </label>
          <div className="relative">
            <input
              type={showKeys.replicate ? 'text' : 'password'}
              value={apiKeys.replicateApiKey || ''}
              onChange={(e) => setApiKeys({ replicateApiKey: e.target.value })}
              placeholder="r8_xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 pr-12 border rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => toggleShowKey('replicate')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKeys.replicate ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            获取地址：https://replicate.com/account/api-tokens
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            OpenAI API Key (DALL-E 3)
          </label>
          <div className="relative">
            <input
              type={showKeys.openai ? 'text' : 'password'}
              value={apiKeys.openaiApiKey || ''}
              onChange={(e) => setApiKeys({ openaiApiKey: e.target.value })}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 pr-12 border rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => toggleShowKey('openai')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKeys.openai ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            获取地址：https://platform.openai.com/api-keys
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Google API Key (Gemini)
          </label>
          <div className="relative">
            <input
              type={showKeys.google ? 'text' : 'password'}
              value={apiKeys.googleApiKey || ''}
              onChange={(e) => setApiKeys({ googleApiKey: e.target.value })}
              placeholder="AIzaxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 pr-12 border rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => toggleShowKey('google')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKeys.google ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            获取地址：https://aistudio.google.com/app/apikey
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="text-orange-600">🔒</span> API 密钥安全存储在你的浏览器本地，永远不会上传到任何服务器
        </p>
      </div>
    </div>
  );
}
