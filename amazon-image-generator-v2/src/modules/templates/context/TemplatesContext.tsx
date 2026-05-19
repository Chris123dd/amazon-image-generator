import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Template } from '../types';

interface TemplatesContextType {
  templates: Template[];
  saveTemplate: (name: string, config: any) => void;
  loadTemplate: (templateId: string) => any;
  deleteTemplate: (templateId: string) => void;
  exportTemplate: (templateId: string) => void;
  importTemplate: (file: File) => Promise<void>;
}

const TemplatesContext = createContext<TemplatesContextType | null>(null);
const STORAGE_KEY = 'amazon_v2_templates';

export function TemplatesProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useLocalStorage<Template[]>(STORAGE_KEY, []);
  
  const saveTemplate = useCallback((name: string, config: any) => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      defaultEngine: config.defaultEngine,
      imageConfigs: config.images.map((img: any) => ({
        prompt: img.prompt,
        engine: img.engine,
      })),
    };
    setTemplates([...templates, newTemplate]);
  }, [templates, setTemplates]);
  
  const loadTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;
    
    return {
      defaultEngine: template.defaultEngine,
      images: template.imageConfigs.map((img, idx) => ({
        id: idx + 1,
        prompt: img.prompt,
        engine: img.engine,
        referenceImages: [],
        status: 'pending' as const,
      })),
    };
  }, [templates]);
  
  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  }, [templates, setTemplates]);
  
  const exportTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [templates]);
  
  const importTemplate = useCallback(async (file: File) => {
    const text = await file.text();
    const template = JSON.parse(text) as Template;
    template.id = Date.now().toString();
    template.createdAt = Date.now();
    setTemplates([...templates, template]);
  }, [templates, setTemplates]);
  
  return (
    <TemplatesContext.Provider value={{ templates, saveTemplate, loadTemplate, deleteTemplate, exportTemplate, importTemplate }}>
      {children}
    </TemplatesContext.Provider>
  );
}

export function useTemplates(): TemplatesContextType {
  const context = useContext(TemplatesContext);
  if (!context) {
    throw new Error('useTemplates must be used within TemplatesProvider');
  }
  return context;
}
