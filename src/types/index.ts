export type AIEngine = 
  | 'stable-diffusion' 
  | 'dalle' 
  | 'gemini' 
  | 'mock'
  | 'jimeng'       // 即梦
  | 'doubao'       // 豆包
  | 'tongyi'       // 通义万相
  | 'wenxin'       // 文心一格
  | 'hunyuan';     // 混元

export type ImageStatus = 'pending' | 'generating' | 'done' | 'error';

export interface ImageConfig {
  id: number;
  referenceImages: string[]; // base64 或临时 URL
  prompt: string;
  generatedImage: string | null; // base64
  status: ImageStatus;
}

export interface GenerationConfig {
  productImage: string | null; // base64
  aiEngine: AIEngine;
  images: ImageConfig[];
}

export interface Template {
  id: string;
  name: string;
  createdAt: number;
  aiEngine: AIEngine;
  imageConfigs: Array<{
    referenceImages: string[];
    prompt: string;
  }>;
}

export interface GenerateRequest {
  productImage: string;
  aiEngine: AIEngine;
  images: Array<{
    referenceImages: string[];
    prompt: string;
  }>;
}

export interface GenerateResponse {
  taskId: string;
  status: 'started';
}

export interface TaskStatus {
  taskId: string;
  currentImage: number;
  totalImages: number;
  images: Array<{
    id: number;
    status: ImageStatus;
    result?: string;
    error?: string;
  }>;
}

export interface ApiKeysConfig {
  // 国外 API
  replicateApiKey?: string;
  openaiApiKey?: string;
  googleApiKey?: string;
  // 国内 API
  volcanoApiKey?: string;       // 火山引擎（即梦/豆包）
  doubaoModel?: string;          // 豆包模型版本
  aliApiKey?: string;            // 阿里云（通义万相）
  baiduApiKey?: string;          // 百度（文心一格）
  tencentApiKey?: string;        // 腾讯云（混元）
}

export interface GeneratedImage {
  referenceImages: string[];
  prompt: string;
  generatedImage: string;
  status: ImageStatus;
}

export interface HistoryItem {
  id: string;
  name: string;
  createdAt: number;
  productImage: string;
  aiEngine: AIEngine;
  generatedImages: GeneratedImage[];
}
