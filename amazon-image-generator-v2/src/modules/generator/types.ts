import { AIEngine } from '@/shared/ai/types';

export type ImageStatus = 'pending' | 'generating' | 'completed' | 'failed';

export interface ImageConfig {
  id: number;
  prompt: string;
  referenceImages: string[];
  engine?: AIEngine;
  generatedImage?: string;
  status: ImageStatus;
  error?: string;
  selected: boolean;
}

export interface GenerationConfig {
  productImage: string | null;
  originalProductImage: string | null;
  defaultEngine: AIEngine;
  images: ImageConfig[];
}

export interface GenerationState {
  config: GenerationConfig;
  isGenerating: boolean;
  isPaused: boolean;
  currentImageIndex: number;
}

export type GenerationAction =
  | { type: 'SET_PRODUCT_IMAGE'; payload: string | null }
  | { type: 'SET_DEFAULT_ENGINE'; payload: AIEngine }
  | { type: 'UPDATE_IMAGE_CONFIG'; payload: { id: number; updates: Partial<ImageConfig> } }
  | { type: 'START_GENERATION' }
  | { type: 'PAUSE_GENERATION' }
  | { type: 'RESUME_GENERATION' }
  | { type: 'SET_CURRENT_IMAGE'; payload: number }
  | { type: 'SET_IMAGE_STATUS'; payload: { id: number; status: ImageStatus; error?: string } }
  | { type: 'SET_GENERATED_IMAGE'; payload: { id: number; image: string } }
  | { type: 'RESET' }
  | { type: 'LOAD_CONFIG'; payload: Partial<GenerationConfig> }
  | { type: 'TOGGLE_IMAGE_SELECTED'; payload: number }
  | { type: 'SET_ALL_IMAGES_SELECTED'; payload: boolean }
  | { type: 'SET_IMAGE_COUNT'; payload: number };
