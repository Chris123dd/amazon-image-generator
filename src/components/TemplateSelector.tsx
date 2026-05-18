import { useState } from 'react';
import { Save, FolderOpen, Trash2, Plus } from 'lucide-react';
import { Template } from '../types';

interface TemplateSelectorProps {
  templates: Template[];
  onSave: (name: string) => void;
  onLoad: (templateId: string) => void;
  onDelete: (templateId: string) => void;
}

export function TemplateSelector({
  templates,
  onSave,
  onLoad,
  onDelete,
}: TemplateSelectorProps) {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSave = () => {
    if (templateName.trim()) {
      onSave(templateName.trim());
      setTemplateName('');
      setIsSaveModalOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setIsSaveModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
      >
        <Save size={18} />
        <span>保存模板</span>
      </button>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors"
        >
          <FolderOpen size={18} />
          <span>加载模板</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50 max-h-60 overflow-auto">
            {templates.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                暂无保存的模板
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b last:border-b-0"
                >
                  <button
                    onClick={() => {
                      onLoad(template.id);
                      setIsDropdownOpen(false);
                    }}
                    className="text-left flex-1"
                  >
                    <div className="font-medium text-gray-800 dark:text-white">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(template.createdAt).toLocaleString()}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(template.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              保存模板
            </h3>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="输入模板名称"
              className="w-full px-3 py-2 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!templateName.trim()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
