import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage, checkStorageAvailable } from '@/shared/hooks/useLocalStorage';
import { HistoryItem } from '../types';

interface HistoryContextType {
  history: HistoryItem[];
  saveToHistory: (name: string, data: any) => void;
  deleteHistoryItem: (id: string) => void;
  clearAllHistory: () => void;
  loadHistoryConfig: (id: string) => any;
}

const HistoryContext = createContext<HistoryContextType | null>(null);
const STORAGE_KEY = 'amazon_v2_history';

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(STORAGE_KEY, []);
  
  const saveToHistory = useCallback((name: string, data: any) => {
    if (!checkStorageAvailable()) {
      alert('存储空间不足，请清理历史记录');
      return;
    }
    
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        name,
        createdAt: Date.now(),
        productImage: data.productImage,
        defaultEngine: data.defaultEngine,
        images: data.images.filter((img: any) => img.generatedImage),
        configSnapshot: {
          defaultEngine: data.defaultEngine,
          images: data.images.map((img: any) => ({
            id: img.id,
            prompt: img.prompt,
            engine: img.engine,
          })),
        },
      };
      setHistory([newItem, ...history]);
    } catch (error) {
      alert('保存失败，存储空间可能不足');
    }
  }, [history, setHistory]);
  
  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(history.filter(item => item.id !== id));
  }, [history, setHistory]);
  
  const clearAllHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);
  
  const loadHistoryConfig = useCallback((id: string) => {
    const item = history.find(h => h.id === id);
    if (!item) return null;
    return item.configSnapshot;
  }, [history]);
  
  return (
    <HistoryContext.Provider value={{ history, saveToHistory, deleteHistoryItem, clearAllHistory, loadHistoryConfig }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextType {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
}
