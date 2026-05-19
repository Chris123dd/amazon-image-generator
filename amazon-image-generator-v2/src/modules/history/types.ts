import { AIEngine } from '@/shared/ai/types';

export interface HistoryImage {
  prompt: string;
  engine: AIEngine;
  generatedImage: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  createdAt: number;
  productImage: string;
  defaultEngine: AIEngine;
  images: HistoryImage[];
  configSnapshot: any;
}
