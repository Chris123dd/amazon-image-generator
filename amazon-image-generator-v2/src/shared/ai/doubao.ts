import { GenerateImageRequest, GenerateImageResponse, IAIEngine } from './types';

const REQUEST_TIMEOUT = 120000;
const DOUBAO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const DEFAULT_MODEL = 'doubao-seedream-4-5-251128';

export class DoubaoEngine implements IAIEngine {
  private apiKey: string;
  private modelId: string;
  
  constructor(apiKey: string, modelId?: string) {
    this.apiKey = apiKey;
    this.modelId = modelId || DEFAULT_MODEL;
  }
  
  async generate(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    if (!this.apiKey) {
      return { success: false, error: '未配置豆包 API Key' };
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      
      const body: Record<string, unknown> = {
        model: this.modelId,
        prompt: request.prompt,
        size: '2048x2048',
        response_format: 'b64_json',
        watermark: false,
        n: 1,
      };
      
      // 收集所有图片：产品图 + 参考图
      const allImages: string[] = [];
      if (request.productImage) {
        allImages.push(request.productImage);
      }
      if (request.referenceImages && request.referenceImages.length > 0) {
        allImages.push(...request.referenceImages);
      }
      
      if (allImages.length > 0) {
        // 多图生图模式
        body.image = allImages.length === 1 ? allImages[0] : allImages;
      }
      
      const response = await fetch(DOUBAO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `豆包 API 错误: ${response.status} - ${errorText}` };
      }
      
      const data = await response.json();
      
      if (data.data?.[0]?.b64_json) {
        return { success: true, image: `data:image/png;base64,${data.data[0].b64_json}` };
      }
      
      return { success: false, error: '豆包未返回图片' };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, error: '请求超时（120秒）' };
      }
      return { success: false, error: `豆包调用失败: ${error instanceof Error ? error.message : '未知错误'}` };
    }
  }
  
  isAvailable(): boolean {
    return !!this.apiKey;
  }
}
