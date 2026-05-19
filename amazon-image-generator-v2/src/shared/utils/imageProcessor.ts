import { IMAGE_SIZE, IMAGE_QUALITY, MAX_FILE_SIZE } from '../ai/types';

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

export function canvasToDataURL(canvas: HTMLCanvasElement, quality: number = IMAGE_QUALITY, format: string = 'image/jpeg'): string {
  return canvas.toDataURL(format, quality);
}

export function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function makeSquareWithPadding(imageData: string): Promise<string> {
  const img = await loadImage(imageData);
  const maxSize = Math.max(img.width, img.height);
  
  const canvas = document.createElement('canvas');
  canvas.width = maxSize;
  canvas.height = maxSize;
  
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, maxSize, maxSize);
  
  const x = (maxSize - img.width) / 2;
  const y = (maxSize - img.height) / 2;
  ctx.drawImage(img, x, y);
  
  return canvasToDataURL(canvas);
}

export async function resizeToStandard(imageData: string): Promise<string> {
  const img = await loadImage(imageData);
  
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
  
  const scale = Math.min(IMAGE_SIZE / img.width, IMAGE_SIZE / img.height);
  const x = (IMAGE_SIZE - img.width * scale) / 2;
  const y = (IMAGE_SIZE - img.height * scale) / 2;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  
  return canvasToDataURL(canvas);
}

export async function removeWatermark(imageData: string): Promise<string> {
  const img = await loadImage(imageData);
  const canvas = imageToCanvas(img);
  const ctx = canvas.getContext('2d')!;
  
  const w = canvas.width;
  const h = canvas.height;
  const watermarkHeight = Math.floor(h * 0.08);
  const watermarkWidth = Math.floor(w * 0.25);
  
  const top = h - watermarkHeight;
  const left = w - watermarkWidth;
  
  const imageDataObj = ctx.getImageData(left, top, watermarkWidth, watermarkHeight);
  const data = imageDataObj.data;
  
  for (let y = 0; y < watermarkHeight; y++) {
    for (let x = 0; x < watermarkWidth; x++) {
      const i = (y * watermarkWidth + x) * 4;
      const sourceY = Math.max(0, top - watermarkHeight + y);
      const sourceX = Math.max(0, left - watermarkWidth + x);
      const sourceI = (sourceY * w + sourceX) * 4;
      
      data[i] = data[sourceI];
      data[i + 1] = data[sourceI + 1];
      data[i + 2] = data[sourceI + 2];
      data[i + 3] = 255;
    }
  }
  
  ctx.putImageData(imageDataObj, left, top);
  return canvasToDataURL(canvas);
}

export async function compressToSize(imageData: string): Promise<string> {
  const img = await loadImage(imageData);
  
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;
  
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
  
  const scale = Math.min(IMAGE_SIZE / img.width, IMAGE_SIZE / img.height);
  const x = (IMAGE_SIZE - img.width * scale) / 2;
  const y = (IMAGE_SIZE - img.height * scale) / 2;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  
  let quality = 0.9;
  let result = canvasToDataURL(canvas, quality);
  
  while (result.length > MAX_FILE_SIZE && quality > 0.1) {
    quality -= 0.1;
    result = canvasToDataURL(canvas, quality);
  }
  
  return result;
}

export async function postProcessImage(imageData: string): Promise<string> {
  let result = imageData;
  
  result = await resizeToStandard(result);
  
  result = await compressToSize(result);
  
  return result;
}
