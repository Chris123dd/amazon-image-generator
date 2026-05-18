export type AIEngine = 'stable-diffusion' | 'dalle' | 'gemini' | 'mock';

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
  replicateApiKey?: string;
  openaiApiKey?: string;
  googleApiKey?: string;
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
