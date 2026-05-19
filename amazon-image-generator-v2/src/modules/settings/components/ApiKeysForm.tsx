import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { ApiKeysConfig } from '../types';
import { Shield, Eye, EyeOff, Save, Check } from 'lucide-react';

export function ApiKeysForm() {
  const { apiKeys, updateApiKeys } = useSettings();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  
  const fields: { key: keyof ApiKeysConfig; label: string; placeholder: string }[] = [
    { key: 'volcanoApiKey', label: '火山引擎 API Key（豆包/即梦）', placeholder: 'sk-...' },
    { key: 'doubaoModelId', label: '豆包模型 ID', placeholder: 'doubao-seedream-4-5-251128' },
    { key: 'replicateApiKey', label: 'Replicate API Key（SD）', placeholder: 'r8_...' },
    { key: 'openaiApiKey', label: 'OpenAI API Key（DALL-E）', placeholder: 'sk-...' },
    { key: 'googleApiKey', label: 'Google API Key（Gemini）', placeholder: 'AI...' },
  ];
  
  const handleChange = (key: keyof ApiKeysConfig, value: string) => {
    updateApiKeys({ [key]: value });
    setSaved(false);
  };
  
  const toggleShow = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">API 密钥配置</h2>
      </div>
      
      {fields.map(field => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          <div className="relative">
            <input
              type={showKeys[field.key] ? 'text' : 'password'}
              value={apiKeys[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <button
              type="button"
              onClick={() => toggleShow(field.key)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showKeys[field.key] ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      ))}
      
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
      >
        {saved ? <Check size={18} /> : <Save size={18} />}
        {saved ? '已保存' : '保存配置'}
      </button>
    </div>
  );
}
