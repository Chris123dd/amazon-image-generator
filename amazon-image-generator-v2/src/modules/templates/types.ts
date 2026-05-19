import { AIEngine } from '@/shared/ai/types';

export interface Template {
  id: string;
  name: string;
  createdAt: number;
  defaultEngine: AIEngine;
  imageConfigs: Array<{
    prompt: string;
    engine?: AIEngine;
    referenceImages?: string[];
  }>;
}
