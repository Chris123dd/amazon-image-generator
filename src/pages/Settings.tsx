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
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-purple-500 pl-3">🌍 国外 API</h3>
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
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-l-4 border-red-500 pl-3">🇨🇳 国内 API</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">🔴</span>
                      火山引擎 API Key (即梦 / 豆包)
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys.volcano ? 'text' : 'password'}
                      value={apiKeys.volcanoApiKey || ''}
                      onChange={(e) => setApiKeys({ volcanoApiKey: e.target.value })}
                      placeholder="火山引擎 API Key"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('volcano')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.volcano ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    获取地址：<a href="https://console.volcengine.com/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">console.volcengine.com</a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-pink-600">🌸</span>
                      豆包模型版本
                    </div>
                  </label>
                  <select
                    value={apiKeys.doubaoModel || 'doubao-seedream-4-5-251128'}
                    onChange={(e) => setApiKeys({ doubaoModel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="doubao-seedream-5-0-260128">Seedream 5.0 (最新)</option>
                    <option value="doubao-seedream-4-5-251128">Seedream 4.5 (推荐)</option>
                    <option value="doubao-seedream-4-0-250828">Seedream 4.0</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    选择豆包使用的Seedream模型版本，5.0最新，4.5性价比最高
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">🟠</span>
                      阿里云 API Key (通义万相)
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys.ali ? 'text' : 'password'}
                      value={apiKeys.aliApiKey || ''}
                      onChange={(e) => setApiKeys({ aliApiKey: e.target.value })}
                      placeholder="阿里云 API Key"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('ali')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.ali ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    获取地址：<a href="https://dashscope.console.aliyun.com/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">dashscope.console.aliyun.com</a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500">🔵</span>
                      百度 API Key (文心一格)
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys.baidu ? 'text' : 'password'}
                      value={apiKeys.baiduApiKey || ''}
                      onChange={(e) => setApiKeys({ baiduApiKey: e.target.value })}
                      placeholder="百度 API Key"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('baidu')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.baidu ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    获取地址：<a href="https://cloud.baidu.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">cloud.baidu.com</a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-600">🩵</span>
                      腾讯云 API Key (混元)
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys.tencent ? 'text' : 'password'}
                      value={apiKeys.tencentApiKey || ''}
                      onChange={(e) => setApiKeys({ tencentApiKey: e.target.value })}
                      placeholder="腾讯云 API Key"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('tencent')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.tencent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    获取地址：<a href="https://console.cloud.tencent.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">console.cloud.tencent.com</a>
                  </p>
                </div>
              </div>
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
                  <li>即梦通过火山引擎 API 调用</li>
                  <li>通义万相通过阿里云百炼平台 API 调用</li>
                  <li>文心一格通过百度智能云 API 调用</li>
                  <li>混元通过腾讯云 API 调用</li>
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
