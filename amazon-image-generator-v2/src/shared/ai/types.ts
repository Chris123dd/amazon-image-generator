export type AIEngine =
  | 'doubao'
  | 'stable-diffusion'
  | 'dalle'
  | 'gemini'
  | 'mock'
  | 'jimeng'
  | 'tongyi'
  | 'wenxin'
  | 'hunyuan';

export interface AIEngineMeta {
  id: AIEngine;
  name: string;
  available: boolean;
  description?: string;
}

export const AI_ENGINES: AIEngineMeta[] = [
  { id: 'doubao', name: '豆包', available: true, description: '默认引擎' },
  { id: 'mock', name: '模拟模式', available: true, description: '用于测试' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', available: true },
  { id: 'dalle', name: 'DALL-E 3', available: true },
  { id: 'gemini', name: 'Gemini', available: true },
  { id: 'jimeng', name: '即梦', available: false, description: '即将上线' },
  { id: 'tongyi', name: '通义万相', available: false, description: '即将上线' },
  { id: 'wenxin', name: '文心一格', available: false, description: '即将上线' },
  { id: 'hunyuan', name: '混元', available: false, description: '即将上线' },
];

export interface GenerateImageRequest {
  prompt: string;
  productImage?: string;
  referenceImages?: string[];
  apiKey: string;
  modelId?: string;
}

export interface GenerateImageResponse {
  success: boolean;
  image?: string;
  error?: string;
}

export interface IAIEngine {
  generate(request: GenerateImageRequest): Promise<GenerateImageResponse>;
  isAvailable(): boolean;
}

export const DEFAULT_IMAGE_COUNT = 7;

export const IMAGE_SIZE = 1600;
export const IMAGE_QUALITY = 0.95;
export const MAX_FILE_SIZE = 100 * 1024;
