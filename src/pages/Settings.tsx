import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

export default function Settings() {
  const navigate = useNavigate();
  const { apiKeys, setApiKeys } = useEditorStore();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">API 密钥配置</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
            <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-medium text-blue-900">安全说明</h3>
              <p className="text-sm text-blue-700 mt-1">
                所有 API 密钥都安全存储在你的浏览器本地（localStorage），永远不会上传到任何服务器。
                请确保只在可信的环境中使用。
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">🎨</span>
                  Replicate API Key (Stable Diffusion)
                </div>
              </label>
              <div className="relative">
                <input
                  type={showKeys.replicate ? 'text' : 'password'}
                  value={apiKeys.replicateApiKey || ''}
                  onChange={(e) => setApiKeys({ replicateApiKey: e.target.value })}
                  placeholder="r8_xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('replicate')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.replicate ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                获取地址：<a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">replicate.com/account/api-tokens</a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">🖼️</span>
                  OpenAI API Key (DALL-E 3)
                </div>
              </label>
              <div className="relative">
                <input
                  type={showKeys.openai ? 'text' : 'password'}
                  value={apiKeys.openaiApiKey || ''}
                  onChange={(e) => setApiKeys({ openaiApiKey: e.target.value })}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('openai')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.openai ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                获取地址：<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">platform.openai.com/api-keys</a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">✨</span>
                  Google API Key (Gemini)
                </div>
              </label>
              <div className="relative">
                <input
                  type={showKeys.google ? 'text' : 'password'}
                  value={apiKeys.googleApiKey || ''}
                  onChange={(e) => setApiKeys({ googleApiKey: e.target.value })}
                  placeholder="AIzaxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('google')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.google ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                获取地址：<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aistudio.google.com/app/apikey</a>
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Key size={16} />
                <span>配置已自动保存</span>
              </div>
              {saved && (
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已保存
                </span>
              )}
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm">
                <p className="font-medium text-amber-900">注意事项</p>
                <ul className="text-amber-700 mt-1 space-y-1 list-disc list-inside">
                  <li>不同 AI 引擎的费用和效果不同，建议先使用模拟模式测试</li>
                  <li>Stable Diffusion 通过 Replicate 托管服务运行</li>
                  <li>DALL-E 3 通过 OpenAI API 调用</li>
                  <li>Gemini 通过 Google AI Studio API 调用</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            返回主页
          </button>
        </div>
      </main>
    </div>
  );
}
