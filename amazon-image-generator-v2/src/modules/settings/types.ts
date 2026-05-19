import { AIEngine } from '@/shared/ai/types';

export interface ApiKeysConfig {
  volcanoApiKey?: string;
  doubaoModelId?: string;
  replicateApiKey?: string;
  openaiApiKey?: string;
  googleApiKey?: string;
  aliApiKey?: string;
  baiduApiKey?: string;
  tencentApiKey?: string;
}

export interface SettingsContextType {
  apiKeys: ApiKeysConfig;
  updateApiKeys: (keys: Partial<ApiKeysConfig>) => void;
  getApiKeyForEngine: (engine: AIEngine) => string | undefined;
}
