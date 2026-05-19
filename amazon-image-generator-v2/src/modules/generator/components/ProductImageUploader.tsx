import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useGenerator } from '../context/GeneratorContext';
import { makeSquareWithPadding } from '@/shared/utils/imageProcessor';

export function ProductImageUploader() {
  const { state, setProductImage } = useGenerator();
  
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const squareImage = await makeSquareWithPadding(dataUrl);
      setProductImage(squareImage);
    };
    reader.readAsDataURL(file);
  }, [setProductImage]);
  
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const squareImage = await makeSquareWithPadding(dataUrl);
      setProductImage(squareImage);
    };
    reader.readAsDataURL(file);
  }, [setProductImage]);
  
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-800">产品图片</h3>
      
      {state.config.productImage ? (
        <div className="relative">
          <img
            src={state.config.productImage}
            alt="产品图"
            className="w-full aspect-square object-contain rounded-lg border"
          />
          <label className="absolute bottom-2 right-2 px-3 py-1.5 bg-white rounded-lg shadow cursor-pointer text-sm hover:bg-gray-50">
            重新上传
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">点击或拖拽上传</span>
          <span className="text-xs text-gray-400 mt-1">JPG/PNG，建议白底</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
