import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { GenerationState, GenerationAction, GenerationConfig, ImageConfig } from '../types';
import { generationReducer } from '../reducer';
import { AIEngine, DEFAULT_IMAGE_COUNT } from '@/shared/ai/types';
import { useSettings } from '@/modules/settings/context/SettingsContext';
import { useHistory } from '@/modules/history/context/HistoryContext';
import { generateWithEngine } from '@/shared/ai';
import { postProcessImage } from '@/shared/utils/imageProcessor';
import { downloadDataURL, downloadAsZip } from '@/shared/utils/file';

interface GeneratorContextType {
  state: GenerationState;
  dispatch: React.Dispatch<GenerationAction>;
  setProductImage: (image: string | null) => void;
  setDefaultEngine: (engine: AIEngine) => void;
  updateImageConfig: (id: number, updates: Partial<ImageConfig>) => void;
  startGeneration: () => Promise<void>;
  pauseGeneration: () => void;
  resumeGeneration: () => void;
  regenerateImage: (id: number, engine?: AIEngine) => Promise<void>;
  reset: () => void;
  downloadImage: (id: number) => void;
  downloadAll: () => void;
  loadConfig: (config: Partial<GenerationConfig>) => void;
  getConfigForSave: () => Partial<GenerationConfig>;
}

const GeneratorContext = createContext<GeneratorContextType | null>(null);

export function GeneratorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(generationReducer, {
    config: {
      productImage: null,
      originalProductImage: null,
      defaultEngine: 'doubao',
      images: Array.from({ length: DEFAULT_IMAGE_COUNT }, (_, i) => ({
        id: i + 1,
        prompt: '',
        referenceImages: [],
        status: 'pending' as const,
      })),
    },
    isGenerating: false,
    isPaused: false,
    currentImageIndex: 0,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const { getApiKeyForEngine } = useSettings();
  const { saveToHistory } = useHistory();
  
  const setProductImage = useCallback((image: string | null) => {
    dispatch({ type: 'SET_PRODUCT_IMAGE', payload: image });
  }, []);
  
  const setDefaultEngine = useCallback((engine: AIEngine) => {
    dispatch({ type: 'SET_DEFAULT_ENGINE', payload: engine });
  }, []);
  
  const updateImageConfig = useCallback((id: number, updates: Partial<ImageConfig>) => {
    dispatch({ type: 'UPDATE_IMAGE_CONFIG', payload: { id, updates } });
  }, []);
  
  const generateSingleImage = useCallback(async (
    imageConfig: ImageConfig,
    engine: AIEngine,
    productImage: string
  ) => {
    const apiKey = getApiKeyForEngine(engine) || 'mock-key';
    const result = await generateWithEngine(engine, {
      prompt: imageConfig.prompt,
      productImage,
      referenceImages: imageConfig.referenceImages,
      apiKey,
    }, apiKey);
    
    if (!result.success || !result.image) {
      throw new Error(result.error || '生成失败');
    }
    
    const processedImage = await postProcessImage(result.image);
    return processedImage;
  }, [getApiKeyForEngine]);
  
  const startGeneration = useCallback(async () => {
    if (!state.config.productImage) {
      alert('请先上传产品图');
      return;
    }
    
    dispatch({ type: 'START_GENERATION' });
    abortControllerRef.current = new AbortController();
    
    let hasGeneratedImages = false;
    const generatedImages: { id: number; prompt: string; engine: AIEngine; generatedImage: string }[] = [];
    
    try {
      for (let i = 0; i < state.config.images.length; i++) {
        if (abortControllerRef.current.signal.aborted || state.isPaused) {
          break;
        }
        
        dispatch({ type: 'SET_CURRENT_IMAGE', payload: i });
        dispatch({ type: 'SET_IMAGE_STATUS', payload: { id: i + 1, status: 'generating' } });
        
        const imageConfig = state.config.images[i];
        const engine = imageConfig.engine || state.config.defaultEngine;
        
        try {
          const generatedImage = await generateSingleImage(
            imageConfig,
            engine,
            state.config.productImage
          );
          dispatch({ type: 'SET_GENERATED_IMAGE', payload: { id: i + 1, image: generatedImage } });
          hasGeneratedImages = true;
          generatedImages.push({
            id: i + 1,
            prompt: imageConfig.prompt,
            engine,
            generatedImage,
          });
        } catch (error) {
          dispatch({
            type: 'SET_IMAGE_STATUS',
            payload: {
              id: i + 1,
              status: 'failed',
              error: error instanceof Error ? error.message : '生成失败',
            },
          });
        }
      }
      
      // 保存到历史记录（至少有一张生成成功的图）
      if (hasGeneratedImages) {
        const historyData = {
          productImage: state.config.productImage,
          defaultEngine: state.config.defaultEngine,
          images: generatedImages,
        };
        saveToHistory(`生成结果 ${new Date().toLocaleString()}`, historyData);
      }
    } finally {
      dispatch({ type: 'PAUSE_GENERATION' });
    }
  }, [state.config, state.isPaused, generateSingleImage, saveToHistory]);
  
  const pauseGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    dispatch({ type: 'PAUSE_GENERATION' });
  }, []);
  
  const resumeGeneration = useCallback(() => {
    dispatch({ type: 'RESUME_GENERATION' });
    startGeneration();
  }, [startGeneration]);
  
  const regenerateImage = useCallback(async (id: number, engine?: AIEngine) => {
    const imageConfig = state.config.images.find(img => img.id === id);
    if (!imageConfig || !state.config.productImage) return;
    
    const targetEngine = engine || imageConfig.engine || state.config.defaultEngine;
    
    dispatch({ type: 'SET_IMAGE_STATUS', payload: { id, status: 'generating' } });
    
    try {
      const generatedImage = await generateSingleImage(
        { ...imageConfig, engine: targetEngine },
        targetEngine,
        state.config.productImage
      );
      dispatch({ type: 'SET_GENERATED_IMAGE', payload: { id, image: generatedImage } });
    } catch (error) {
      dispatch({
        type: 'SET_IMAGE_STATUS',
        payload: {
          id,
          status: 'failed',
          error: error instanceof Error ? error.message : '生成失败',
        },
      });
    }
  }, [state.config, generateSingleImage]);
  
  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    dispatch({ type: 'RESET' });
  }, []);
  
  const downloadImage = useCallback((id: number) => {
    const imageConfig = state.config.images.find(img => img.id === id);
    if (imageConfig?.generatedImage) {
      downloadDataURL(imageConfig.generatedImage, `amazon-product-${id}.jpg`);
    }
  }, [state.config.images]);
  
  const downloadAll = useCallback(async () => {
    const urls = state.config.images.filter(img => img.generatedImage).map(img => img.generatedImage!);
    await downloadAsZip(urls, 'amazon-product-images');
  }, [state.config.images]);
  
  const loadConfig = useCallback((config: Partial<GenerationConfig>) => {
    dispatch({ type: 'LOAD_CONFIG', payload: config });
  }, []);
  
  const getConfigForSave = useCallback((): Partial<GenerationConfig> => {
    return {
      defaultEngine: state.config.defaultEngine,
      images: state.config.images.map(img => ({
        id: img.id,
        prompt: img.prompt,
        engine: img.engine,
      })),
    };
  }, [state.config]);
  
  return (
    <GeneratorContext.Provider
      value={{
        state,
        dispatch,
        setProductImage,
        setDefaultEngine,
        updateImageConfig,
        startGeneration,
        pauseGeneration,
        resumeGeneration,
        regenerateImage,
        reset,
        downloadImage,
        downloadAll,
        loadConfig,
        getConfigForSave,
      }}
    >
      {children}
    </GeneratorContext.Provider>
  );
}

export function useGenerator(): GeneratorContextType {
  const context = useContext(GeneratorContext);
  if (!context) {
    throw new Error('useGenerator must be used within GeneratorProvider');
  }
  return context;
}
