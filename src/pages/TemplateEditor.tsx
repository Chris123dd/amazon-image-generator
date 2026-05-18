import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditorStore } from '@/store/editorStore';
import { ImageUploader } from '@/components/ImageUploader';
import { Save, ArrowLeft } from 'lucide-react';
import type { Template } from '@/types';

export default function TemplateEditor() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { templates, loadTemplates } = useEditorStore();

  const [template, setTemplate] = useState<Template | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [imageConfigs, setImageConfigs] = useState<Array<{ referenceImages: string[]; prompt: string }>>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  useEffect(() => {
    if (templateId && templates.length > 0) {
      const foundTemplate = templates.find(t => t.id === templateId);
      if (foundTemplate) {
        const normalizedConfigs = foundTemplate.imageConfigs.map(cfg => ({
          referenceImages: cfg.referenceImages || [],
          prompt: cfg.prompt || '',
        }));
        setTemplate(foundTemplate);
        setTemplateName(foundTemplate.name);
        setImageConfigs(normalizedConfigs);
        setHasChanges(false);
      }
    }
  }, [templateId, templates]);

  const handleConfigChange = (
    index: number,
    field: 'referenceImages' | 'prompt',
    value: string | string[]
  ) => {
    const newConfigs = [...imageConfigs];
    while (newConfigs.length < 7) {
      newConfigs.push({ referenceImages: [], prompt: '' });
    }
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setImageConfigs(newConfigs);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!template) return;
    const updatedTemplates = templates.map(t =>
      t.id === template.id
        ? { ...t, name: templateName.trim() || t.name, imageConfigs }
        : t
    );
    localStorage.setItem('amazon_templates', JSON.stringify(updatedTemplates));
    loadTemplates();
    setHasChanges(false);
    alert('模板保存成功！');
  };

  if (!template && templateId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">模板不存在</h2>
          <button onClick={() => navigate('/templates')} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">
            返回模板管理
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/templates')} className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
                <ArrowLeft size={20} />
                <span>返回</span>
              </button>
              <input
                type="text"
                value={templateName}
                onChange={(e) => { setTemplateName(e.target.value); setHasChanges(true); }}
                className="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-orange-500 focus:border-orange-500 text-gray-900 dark:text-white outline-none px-2"
                placeholder="模板名称"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${hasChanges ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
            >
              <Save size={20} />
              <span>保存修改</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">图片配置 (7 张)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {imageConfigs.slice(0, 7).map((config, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white">图片 {index + 1}</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">参考图</label>
                  <ImageUploader
                    value={config?.referenceImages[0] || null}
                    onChange={(img) => handleConfigChange(index, 'referenceImages', img ? [img] : [])}
                    label="点击上传参考图"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">提示词</label>
                  <textarea
                    value={config?.prompt || ''}
                    onChange={(e) => handleConfigChange(index, 'prompt', e.target.value)}
                    placeholder="描述这张图片想要的风格..."
                    className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-lg transition ${hasChanges ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          >
            <Save size={24} />
            <span>保存模板</span>
          </button>
        </div>
      </main>
    </div>
  );
}
