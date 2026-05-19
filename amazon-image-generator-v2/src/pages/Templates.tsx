import { useState } from 'react';
import { Plus, Download, Upload, Trash2, FileText, Clock, Edit } from 'lucide-react';
import { useTemplates } from '@/modules/templates/context/TemplatesContext';
import { useGenerator } from '@/modules/generator/context/GeneratorContext';

export default function Templates() {
  const { templates, saveTemplate, loadTemplate, updateTemplate, deleteTemplate, exportTemplate, importTemplate } = useTemplates();
  const { loadConfig, getConfigForSave } = useGenerator();
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<{ id: string; name: string } | null>(null);
  const [editName, setEditName] = useState('');
  
  const handleSave = () => {
    if (!newTemplateName.trim()) return;
    saveTemplate(newTemplateName, getConfigForSave());
    setNewTemplateName('');
    setShowSaveModal(false);
  };
  
  const handleEdit = (template: any) => {
    setEditingTemplate({ id: template.id, name: template.name });
    setEditName(template.name);
  };
  
  const handleUpdate = () => {
    if (!editName.trim() || !editingTemplate) return;
    updateTemplate(editingTemplate.id, editName);
    setEditingTemplate(null);
    setEditName('');
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await importTemplate(file);
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">编辑模板</h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="输入模板名称"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
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
