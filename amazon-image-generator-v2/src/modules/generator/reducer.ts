import { GenerationState, GenerationAction, ImageConfig } from './types';
import { DEFAULT_IMAGE_COUNT } from '@/shared/ai/types';

const createInitialImages = (): ImageConfig[] =>
  Array.from({ length: DEFAULT_IMAGE_COUNT }, (_, i) => ({
    id: i + 1,
    prompt: '',
    referenceImages: [],
    status: 'pending' as const,
  }));

const initialState: GenerationState = {
  config: {
    productImage: null,
    originalProductImage: null,
    defaultEngine: 'doubao',
    images: createInitialImages(),
  },
  isGenerating: false,
  isPaused: false,
  currentImageIndex: 0,
};

export function generationReducer(state: GenerationState, action: GenerationAction): GenerationState {
  switch (action.type) {
    case 'SET_PRODUCT_IMAGE':
      return {
        ...state,
        config: { ...state.config, productImage: action.payload, originalProductImage: action.payload },
      };
      
    case 'SET_DEFAULT_ENGINE':
      return {
        ...state,
        config: { ...state.config, defaultEngine: action.payload },
      };
      
    case 'UPDATE_IMAGE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          images: state.config.images.map(img =>
            img.id === action.payload.id ? { ...img, ...action.payload.updates } : img
          ),
        },
      };
      
    case 'START_GENERATION':
      return {
        ...state,
        isGenerating: true,
        isPaused: false,
        currentImageIndex: 0,
        config: {
          ...state.config,
          images: state.config.images.map(img => ({
            ...img,
            status: 'pending' as const,
            generatedImage: undefined,
            error: undefined,
          })),
        },
      };
      
    case 'PAUSE_GENERATION':
      return { ...state, isPaused: true };
      
    case 'RESUME_GENERATION':
      return { ...state, isPaused: false };
      
    case 'SET_CURRENT_IMAGE':
      return { ...state, currentImageIndex: action.payload };
      
    case 'SET_IMAGE_STATUS':
      return {
        ...state,
        config: {
          ...state.config,
          images: state.config.images.map(img =>
            img.id === action.payload.id
              ? { ...img, status: action.payload.status, error: action.payload.error }
              : img
          ),
        },
      };
      
    case 'SET_GENERATED_IMAGE':
      return {
        ...state,
        config: {
          ...state.config,
          images: state.config.images.map(img =>
            img.id === action.payload.id
              ? { ...img, generatedImage: action.payload.image, status: 'completed' as const }
              : img
          ),
        },
      };
      
    case 'RESET':
      return {
        ...initialState,
        config: {
          ...initialState.config,
          defaultEngine: state.config.defaultEngine,
        },
      };
      
    case 'LOAD_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
          images: action.payload.images || state.config.images,
        },
      };
      
    default:
      return state;
  }
}
