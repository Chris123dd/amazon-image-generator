import { useState } from 'react';
import { Package, Save } from 'lucide-react';
import { ProductImageUploader } from '@/modules/generator/components/ProductImageUploader';
import { ImageConfigCard } from '@/modules/generator/components/ImageConfigCard';
import { GenerationControls } from '@/modules/generator/components/GenerationControls';
import { useGenerator } from '@/modules/generator/context/GeneratorContext';
import { useTemplates } from '@/modules/templates/context/TemplatesContext';

export default function Home() {
  const { state, getConfigForSave } = useGenerator();
  const { saveTemplate } = useTemplates();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    saveTemplate(templateName, getConfigForSave());
    setTemplateName('');
    setShowSaveModal(false);
  };
  
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">保存模板</h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="输入模板名称"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 border rounded-lg">取消</button>
              <button onClick={handleSaveTemplate} className="px-4 py-2 bg-orange-500 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <ProductImageUploader />
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Package size={20} />
              生成控制
            </h2>
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Save size={16} />
              保存配置
            </button>
          </div>
          <GenerationControls />
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">图片配置（7 张）</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {state.config.images.map((img, idx) => (
            <ImageConfigCard key={img.id} config={img} index={idx} />
          ))}
        </div>
      </div>
    </main>
  );
}
