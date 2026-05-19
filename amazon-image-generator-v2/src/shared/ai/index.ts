import { AIEngine, GenerateImageRequest, GenerateImageResponse, IAIEngine } from './types';
import { MockEngine } from './mock';
import { DoubaoEngine } from './doubao';

export function createEngine(engine: AIEngine, apiKey: string, modelId?: string): IAIEngine {
  switch (engine) {
    case 'mock':
      return new MockEngine();
    case 'doubao':
      return new DoubaoEngine(apiKey, modelId);
    case 'stable-diffusion':
    case 'dalle':
    case 'gemini':
    case 'jimeng':
    case 'tongyi':
    case 'wenxin':
    case 'hunyuan':
    default:
      return new MockEngine();
  }
}

export async function generateWithEngine(
  engine: AIEngine,
  request: GenerateImageRequest,
  apiKey: string,
  modelId?: string
): Promise<GenerateImageResponse> {
  const engineInstance = createEngine(engine, apiKey, modelId);
  return engineInstance.generate(request);
}
