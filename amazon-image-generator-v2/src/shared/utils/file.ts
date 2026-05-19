import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function downloadDataURL(dataURL: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadMultiple(urls: string[], baseName: string): Promise<void> {
  for (let i = 0; i < urls.length; i++) {
    const filename = `${baseName}-${String(i + 1).padStart(2, '0')}.jpg`;
    downloadDataURL(urls[i], filename);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export async function downloadAsZip(urls: string[], baseName: string): Promise<void> {
  const zip = new JSZip();
  
  for (let i = 0; i < urls.length; i++) {
    const filename = `${baseName}-${String(i + 1).padStart(2, '0')}.jpg`;
    const response = await fetch(urls[i]);
    const blob = await response.blob();
    zip.file(filename, blob);
  }
  
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${baseName}.zip`);
}
