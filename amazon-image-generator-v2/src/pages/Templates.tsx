import { useState } from 'react';
import { Plus, Download, Upload, Trash2, FileText, Clock, Edit, X } from 'lucide-react';
import { useTemplates } from '@/modules/templates/context/TemplatesContext';
import { useGenerator } from '@/modules/generator/context/GeneratorContext';
import { AI_ENGINES, AIEngine } from '@/shared/ai/types';
import { Template } from '@/modules/templates/types';

export default function Templates() {
  const { templates, saveTemplate, loadTemplate, updateTemplate, deleteTemplate, exportTemplate, importTemplate } = useTemplates();
  const { loadConfig, getConfigForSave } = useGenerator();
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  
  const handleSave = () => {
    if (!newTemplateName.trim()) return;
    saveTemplate(newTemplateName, getConfigForSave());
    setNewTemplateName('');
    setShowSaveModal(false);
  };
  
  const handleEdit = (template: Template) => {
    setEditingTemplate({ ...template });
  };
  
  const handleUpdate = () => {
    if (!editingTemplate) return;
    updateTemplate(editingTemplate.id, editingTemplate.name, {
      defaultEngine: editingTemplate.defaultEngine,
      images: editingTemplate.imageConfigs.map((img, idx) => ({
        id: idx + 1,
        prompt: img.prompt,
        engine: img.engine,
        referenceImages: img.referenceImages || [],
      })),
    });
    setEditingTemplate(null);
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importTemplate(file);
  };
  
  const handleReferenceUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editingTemplate) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newConfigs = [...editingTemplate.imageConfigs];
        newConfigs[idx] = { 
          ...newConfigs[idx], 
          referenceImages: [...(newConfigs[idx].referenceImages || []), dataUrl]
        };
        setEditingTemplate({ ...editingTemplate, imageConfigs: newConfigs });
      };
      reader.readAsDataURL(file);
    });
  };
  
  const handleRemoveReference = (configIdx: number, refIdx: number) => {
    if (!editingTemplate) return;
    const newConfigs = [...editingTemplate.imageConfigs];
    const refs = newConfigs[configIdx].referenceImages || [];
    newConfigs[configIdx] = {
      ...newConfigs[configIdx],
      referenceImages: refs.filter((_, i) => i !== refIdx)
    };
    setEditingTemplate({ ...editingTemplate, imageConfigs: newConfigs });
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">保存模板</h3>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="输入模板名称"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 border rounded-lg">取消</button>
              <button onClick={handleSave} className="px-4 py-2 bg-orange-500 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
      
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">编辑模板</h3>
              <button onClick={() => setEditingTemplate(null)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">模板名称</label>
              <input
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">默认 AI 引擎</label>
              <select
                value={editingTemplate.defaultEngine}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, defaultEngine: e.target.value as AIEngine })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {AI_ENGINES.filter(e => e.available).map(engine => (
                  <option key={engine.id} value={engine.id}>{engine.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {editingTemplate.imageConfigs.map((config, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">
                      {idx === 0 ? '主图' : `附图 ${idx}`}
                    </span>
                  </div>
                  <textarea
                    value={config.prompt}
                    onChange={(e) => {
                      const newConfigs = [...editingTemplate.imageConfigs];
                      newConfigs[idx] = { ...config, prompt: e.target.value };
                      setEditingTemplate({ ...editingTemplate, imageConfigs: newConfigs });
                    }}
                    placeholder="输入提示词..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                  <div className="mt-2">
                    <select
                      value={config.engine || ''}
                      onChange={(e) => {
                        const newConfigs = [...editingTemplate.imageConfigs];
                        newConfigs[idx] = { ...config, engine: e.target.value as AIEngine || undefined };
                        setEditingTemplate({ ...editingTemplate, imageConfigs: newConfigs });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">使用默认引擎</option>
                      {AI_ENGINES.filter(e => e.available).map(engine => (
                        <option key={engine.id} value={engine.id}>{engine.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 参考图编辑区域 */}
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      参考图 {config.referenceImages && config.referenceImages.length > 0 && `(${config.referenceImages.length}张)`}
                    </label>
                    
                    {config.referenceImages && config.referenceImages.length > 0 && (
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {config.referenceImages.map((ref, refIdx) => (
                          <div key={refIdx} className="relative group">
                            <img
                              src={ref}
                              alt={`参考图 ${refIdx + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <button
                              onClick={() => handleRemoveReference(idx, refIdx)}
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
                        onChange={(e) => handleReferenceUpload(idx, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button onClick={() => setEditingTemplate(null)} className="px-4 py-2 border rounded-lg">取消</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-orange-500 text-white rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">模板管理</h1>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <Upload size={18} />
            导入
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Plus size={18} />
            保存当前配置
          </button>
        </div>
      </div>
      
      {templates.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无模板</p>
          <p className="text-sm mt-1">保存当前配置为模板，方便下次使用</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(template.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {template.imageConfigs.filter(img => img.prompt).length} 张图已配置
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const config = loadTemplate(template.id);
                    if (config) loadConfig(config);
                  }}
                  className="flex-1 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  加载
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  className="p-1.5 text-blue-500 hover:text-blue-700"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => exportTemplate(template.id)}
                  className="p-1.5 text-gray-500 hover:text-gray-700"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1.5 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
