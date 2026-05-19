import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { AIEngine } from '@/shared/ai/types';
import { ApiKeysConfig, SettingsContextType } from '../types';

const SettingsContext = createContext<SettingsContextType | null>(null);

const STORAGE_KEY = 'amazon_v2_api_keys';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeysConfig>(STORAGE_KEY, {});
  
  const updateApiKeys = useCallback((keys: Partial<ApiKeysConfig>) => {
    setApiKeys({ ...apiKeys, ...keys });
  }, [apiKeys, setApiKeys]);
  
  const getApiKeyForEngine = useCallback((engine: AIEngine): string | undefined => {
    switch (engine) {
      case 'doubao':
      case 'jimeng':
        return apiKeys.volcanoApiKey;
      case 'stable-diffusion':
        return apiKeys.replicateApiKey;
      case 'dalle':
        return apiKeys.openaiApiKey;
      case 'gemini':
        return apiKeys.googleApiKey;
      case 'tongyi':
        return apiKeys.aliApiKey;
      case 'wenxin':
        return apiKeys.baiduApiKey;
      case 'hunyuan':
        return apiKeys.tencentApiKey;
      default:
        return undefined;
    }
  }, [apiKeys]);
  
  return (
    <SettingsContext.Provider value={{ apiKeys, updateApiKeys, getApiKeyForEngine }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
