import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '@/store/editorStore';
import {
  Save,
  FolderOpen,
  Trash2,
  Edit,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import type { Template } from '@/types';

export default function Templates() {
  const navigate = useNavigate();
  const {
    templates,
    loadTemplates,
    loadTemplate,
    deleteTemplate,
    resetAll,
  } = useEditorStore();

  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editName, setEditName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleLoadTemplate = (template: Template) => {
    resetAll();
    loadTemplate(template.id);
    navigate('/');
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setEditName(template.name);
  };

  const handleSaveEdit = () => {
    if (!editingTemplate || !editName.trim()) return;

    const updatedTemplates = templates.map(t =>
      t.id === editingTemplate.id ? { ...t, name: editName.trim() } : t
    );

    // 更新 localStorage 和 store
    localStorage.setItem('amazon_templates', JSON.stringify(updatedTemplates));
    loadTemplates();
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('确定要删除这个模板吗？')) {
      deleteTemplate(templateId);
    }
  };

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      createdAt: Date.now(),
      imageConfigs: Array(7).fill(null).map(() => ({ 
        referenceImages: [],
        prompt: '' 
      })),
    };

    const updatedTemplates = [...templates, newTemplate];
    localStorage.setItem('amazon_templates', JSON.stringify(updatedTemplates));
    loadTemplates();
    setShowCreateModal(false);
    setNewTemplateName('');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                <ArrowLeft size={20} />
                <span>返回</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                模板管理
              </h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
            >
              <Plus size={20} />
              <span>新建模板</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {templates.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              暂无模板
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              开始创建你的第一个模板吧！
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
            >
              <Plus size={20} />
              <span>创建第一个模板</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              return (
                <div
                  key={template.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700"
                >
                  {/* Template Card Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    {editingTemplate?.id === template.id ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => setEditingTemplate(null)}
                          className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                        >
                          <ArrowLeft size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <FolderOpen className="text-orange-600" size={20} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {template.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(template.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Template Content */}
                  <div className="p-4">
                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      <p>包含 {template.imageConfigs.length} 张图片配置</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoadTemplate(template)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition"
                      >
                        <FolderOpen size={16} />
                        <span>使用模板</span>
                      </button>
                      {!editingTemplate && (
                        <>
                          <button
                            onClick={() => navigate(`/templates/${template.id}/edit`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                            title="编辑完整配置"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                            title="重命名"
                          >
                            <Save size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              创建新模板
            </h3>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="输入模板名称"
              className="w-full px-4 py-3 mb-6 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTemplate()}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleCreateTemplate}
                disabled={!newTemplateName.trim()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
