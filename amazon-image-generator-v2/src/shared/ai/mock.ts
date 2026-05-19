import { GenerateImageRequest, GenerateImageResponse, IAIEngine } from './types';

export class MockEngine implements IAIEngine {
  async generate(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!request.productImage) {
      return { success: false, error: '需要产品图' };
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 800, 800);
    
    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = request.productImage!;
    });
    ctx.drawImage(img, 150, 150, 500, 500);
    
    ctx.fillStyle = '#333';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Mock Generated`, 400, 700);
    
    const result = canvas.toDataURL('image/jpeg', 0.9);
    return { success: true, image: result };
  }
  
  isAvailable(): boolean {
    return true;
  }
}
