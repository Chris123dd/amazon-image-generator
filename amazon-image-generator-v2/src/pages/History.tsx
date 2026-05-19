import { Trash2, Clock, Image as ImageIcon, Download } from 'lucide-react';
import { useHistory } from '@/modules/history/context/HistoryContext';
import { useGenerator } from '@/modules/generator/context/GeneratorContext';
import { downloadDataURL } from '@/shared/utils/file';

export default function History() {
  const { history, deleteHistoryItem, clearAllHistory, loadHistoryConfig } = useHistory();
  const { loadConfig } = useGenerator();
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };
  
  const handleDownloadAll = (item: any) => {
    item.images.forEach((img: any, idx: number) => {
      setTimeout(() => {
        downloadDataURL(img.generatedImage, `${item.name || 'history'}-${idx + 1}.jpg`);
      }, idx * 300);
    });
  };
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">历史记录</h1>
        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            清空全部
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Clock size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无历史记录</p>
          <p className="text-sm mt-1">生成图片后会自动保存到这里</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                </div>
                <button
                  onClick={() => deleteHistoryItem(item.id)}
                  className="p-1.5 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-8 gap-2 mb-3">
                {item.images.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded overflow-hidden bg-gray-100">
                    {img.generatedImage ? (
                      <img src={img.generatedImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const config = loadHistoryConfig(item.id);
                    if (config) loadConfig(config);
                  }}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  加载配置
                </button>
                <button
                  onClick={() => handleDownloadAll(item)}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Download size={16} />
                  下载全部
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
