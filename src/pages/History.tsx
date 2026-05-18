import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '@/store/editorStore';
import { HistoryItem, AIEngine } from '@/types';

const AI_ENGINE_LABELS: Record<AIEngine, string> = {
  'stable-diffusion': 'Stable Diffusion',
  'dalle': 'DALL-E 3',
  'gemini': 'Google Gemini',
  'mock': '模拟生成',
};

export default function History() {
  const navigate = useNavigate();
  const { history, loadHistory, deleteHistoryItem, clearAllHistory } = useEditorStore();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这条历史记录吗？')) {
      deleteHistoryItem(id);
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      clearAllHistory();
      setSelectedItem(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">历史记录</h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              清空全部
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {history.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无历史记录</h2>
            <p className="text-gray-500 mb-6">生成图片后会自动保存到这里</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              去生成图片
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={item.productImage}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(item.createdAt)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {AI_ENGINE_LABELS[item.aiEngine]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.generatedImages.length} 张图片
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedItem ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(selectedItem.createdAt)} · {AI_ENGINE_LABELS[selectedItem.aiEngine]}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      重新生成
                    </button>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">原始产品图</h3>
                    <img
                      src={selectedItem.productImage}
                      alt="产品图"
                      className="max-w-xs rounded-lg border"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      生成的图片 ({selectedItem.generatedImages.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedItem.generatedImages.map((img, idx) => (
                        <div key={idx} className="space-y-2">
                          <img
                            src={img.generatedImage}
                            alt={`生成图片 ${idx + 1}`}
                            className="w-full rounded-lg border"
                          />
                          <p className="text-xs text-gray-500 line-clamp-2">{img.prompt}</p>
                          {img.referenceImages.length > 0 && (
                            <details className="text-xs">
                              <summary className="text-blue-600 cursor-pointer">参考图</summary>
                              <div className="flex gap-1 mt-1">
                                {img.referenceImages.map((ref, refIdx) => (
                                  <img
                                    key={refIdx}
                                    src={ref}
                                    alt={`参考图 ${refIdx + 1}`}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                  点击左侧卡片查看详情
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
