import { Upload, X } from 'lucide-react';
import { useState, useCallback } from 'react';

interface ImageUploaderProps {
  value?: string | null;
  onChange?: (image: string | null) => void;
  label?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export function ImageUploader({
  value,
  onChange,
  label = '上传图片',
  multiple = false,
  maxFiles = 3,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange?.(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${
        isDragging
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
          : 'border-gray-300 dark:border-gray-700 hover:border-orange-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
        multiple={multiple}
      />

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="max-h-40 mx-auto rounded-lg object-contain"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center py-4 cursor-pointer">
          <Upload
            className={`mb-2 ${
              isDragging ? 'text-orange-500' : 'text-gray-400'
            }`}
            size={32}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            点击或拖拽上传
          </span>
        </div>
      )}
    </div>
  );
}
