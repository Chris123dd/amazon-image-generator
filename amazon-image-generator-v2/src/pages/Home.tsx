import { Package } from 'lucide-react';
import { ProductImageUploader } from '@/modules/generator/components/ProductImageUploader';
import { ImageConfigCard } from '@/modules/generator/components/ImageConfigCard';
import { GenerationControls } from '@/modules/generator/components/GenerationControls';
import { useGenerator } from '@/modules/generator/context/GeneratorContext';

export default function Home() {
  const { state } = useGenerator();
  
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <ProductImageUploader />
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package size={20} />
            生成控制
          </h2>
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
