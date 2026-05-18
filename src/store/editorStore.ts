import { create } from 'zustand';
import {
  GenerationConfig,
  ImageConfig,
  AIEngine,
  Template,
  ApiKeysConfig,
  HistoryItem,
  GeneratedImage,
} from '../types';

const INITIAL_IMAGES: ImageConfig[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  referenceImages: [],
  prompt: '',
  generatedImage: null,
  status: 'pending',
}));

const getStoredApiKeys = (): ApiKeysConfig => {
  try {
    const stored = localStorage.getItem('amazon_api_keys');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

interface EditorState {
  config: GenerationConfig;
  templates: Template[];
  apiKeys: ApiKeysConfig;
  history: HistoryItem[];

  // Actions
  setProductImage: (image: string | null) => void;
  setAIEngine: (engine: AIEngine) => void;
  updateImageConfig: (id: number, updates: Partial<ImageConfig>) => void;
  setGeneratedImage: (id: number, image: string | null) => void;
  setImageStatus: (id: number, status: ImageConfig['status']) => void;
  resetAll: () => void;

  // API keys
  setApiKeys: (keys: Partial<ApiKeysConfig>) => void;

  // Template actions
  loadTemplates: () => void;
  saveTemplate: (name: string) => void;
  loadTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;

  // History actions
  loadHistory: () => void;
  saveToHistory: (name: string) => void;
  deleteHistoryItem: (historyId: string) => void;
  clearAllHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  config: {
    productImage: null,
    aiEngine: 'mock',
    images: INITIAL_IMAGES,
  },
  templates: [],
  apiKeys: getStoredApiKeys(),
  history: [],

  setProductImage: (image) =>
    set((state) => ({ config: { ...state.config, productImage: image } })),

  setAIEngine: (engine) =>
    set((state) => ({ config: { ...state.config, aiEngine: engine } })),

  updateImageConfig: (id, updates) =>
    set((state) => ({
      config: {
        ...state.config,
        images: state.config.images.map((img) =>
          img.id === id ? { ...img, ...updates } : img
        ),
      },
    })),

  setGeneratedImage: (id, image) =>
    set((state) => ({
      config: {
        ...state.config,
        images: state.config.images.map((img) =>
          img.id === id ? { ...img, generatedImage: image } : img
        ),
      },
    })),

  setImageStatus: (id, status) =>
    set((state) => ({
      config: {
        ...state.config,
        images: state.config.images.map((img) =>
          img.id === id ? { ...img, status } : img
        ),
      },
    })),

  resetAll: () =>
    set({
      config: {
        productImage: null,
        aiEngine: 'mock',
        images: INITIAL_IMAGES,
      },
    }),

  setApiKeys: (keys) => {
    const newKeys = { ...get().apiKeys, ...keys };
    set({ apiKeys: newKeys });
    localStorage.setItem('amazon_api_keys', JSON.stringify(newKeys));
  },

  loadTemplates: () => {
    try {
      const saved = localStorage.getItem('amazon_templates');
      if (saved) {
        set({ templates: JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load templates', e);
    }
  },

  saveTemplate: (name) => {
    const { config, templates } = get();
    const newTemplate: Template = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      imageConfigs: config.images.map((img) => ({
        referenceImages: img.referenceImages,
        prompt: img.prompt,
      })),
    };
    const updatedTemplates = [...templates, newTemplate];
    set({ templates: updatedTemplates });
    localStorage.setItem('amazon_templates', JSON.stringify(updatedTemplates));
  },

  loadTemplate: (templateId) => {
    const { templates } = get();
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      set((state) => ({
        config: {
          ...state.config,
          images: state.config.images.map((img, idx) => ({
            ...img,
            referenceImages: template.imageConfigs[idx]?.referenceImages || [],
            prompt: template.imageConfigs[idx]?.prompt || '',
            status: 'pending',
            generatedImage: null,
          })),
        },
      }));
    }
  },

  deleteTemplate: (templateId) => {
    const { templates } = get();
    const updatedTemplates = templates.filter((t) => t.id !== templateId);
    set({ templates: updatedTemplates });
    localStorage.setItem('amazon_templates', JSON.stringify(updatedTemplates));
  },

  loadHistory: () => {
    try {
      const saved = localStorage.getItem('amazon_history');
      if (saved) {
        set({ history: JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  },

  saveToHistory: (name) => {
    const { config, history } = get();
    if (!config.productImage) return;

    const generatedImages: GeneratedImage[] = config.images
      .filter((img) => img.generatedImage)
      .map((img) => ({
        referenceImages: img.referenceImages,
        prompt: img.prompt,
        generatedImage: img.generatedImage!,
        status: img.status,
      }));

    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      name: name || `历史记录 ${new Date().toLocaleString()}`,
      createdAt: Date.now(),
      productImage: config.productImage,
      aiEngine: config.aiEngine,
      generatedImages,
    };

    const updatedHistory = [newHistoryItem, ...history];
    set({ history: updatedHistory });
    localStorage.setItem('amazon_history', JSON.stringify(updatedHistory));
  },

  deleteHistoryItem: (historyId) => {
    const { history } = get();
    const updatedHistory = history.filter((h) => h.id !== historyId);
    set({ history: updatedHistory });
    localStorage.setItem('amazon_history', JSON.stringify(updatedHistory));
  },

  clearAllHistory: () => {
    set({ history: [] });
    localStorage.removeItem('amazon_history');
  },
}));
