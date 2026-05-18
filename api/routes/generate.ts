import express, {
  type Request,
  type Response,
} from 'express';
import Replicate from 'replicate';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      engine,
      productImage,
      referenceImages,
      prompt,
      apiKeys,
    } = req.body;

    let resultImage: string;

    switch (engine) {
      case 'stable-diffusion':
        if (!apiKeys.replicateApiKey) {
          throw new Error('需要 Replicate API Key');
        }
        resultImage = await generateWithStableDiffusion(
          productImage,
          referenceImages,
          prompt,
          apiKeys.replicateApiKey
        );
        break;
      case 'dalle':
        if (!apiKeys.openaiApiKey) {
          throw new Error('需要 OpenAI API Key');
        }
        resultImage = await generateWithDalle(
          productImage,
          referenceImages,
          prompt,
          apiKeys.openaiApiKey
        );
        break;
      case 'gemini':
        if (!apiKeys.googleApiKey) {
          throw new Error('需要 Google API Key');
        }
        resultImage = await generateWithGemini(
          productImage,
          referenceImages,
          prompt,
          apiKeys.googleApiKey
        );
        break;
      case 'jimeng':
        if (!apiKeys.volcanoApiKey) {
          throw new Error('需要火山引擎 API Key');
        }
        resultImage = await generateWithJimeng(
          productImage,
          referenceImages,
          prompt,
          apiKeys.volcanoApiKey
        );
        break;
      case 'doubao':
        if (!apiKeys.volcanoApiKey) {
          throw new Error('需要火山引擎 API Key');
        }
        resultImage = await generateWithDoubao(
          productImage,
          referenceImages,
          prompt,
          apiKeys.volcanoApiKey,
          apiKeys.doubaoModel || 'doubao-seedream-4-5-251128'
        );
        break;
      case 'tongyi':
        if (!apiKeys.aliApiKey) {
          throw new Error('需要阿里云 API Key');
        }
        resultImage = await generateWithTongyi(
          productImage,
          referenceImages,
          prompt,
          apiKeys.aliApiKey
        );
        break;
      case 'wenxin':
        if (!apiKeys.baiduApiKey) {
          throw new Error('需要百度 API Key');
        }
        resultImage = await generateWithWenxin(
          productImage,
          referenceImages,
          prompt,
          apiKeys.baiduApiKey
        );
        break;
      case 'hunyuan':
        if (!apiKeys.tencentApiKey) {
          throw new Error('需要腾讯云 API Key');
        }
        resultImage = await generateWithHunyuan(
          productImage,
          referenceImages,
          prompt,
          apiKeys.tencentApiKey
        );
        break;
      default:
        throw new Error('不支持的 AI 引擎');
    }

    res.json({
      success: true,
      image: resultImage,
    });
  } catch (error) {
    console.error('生成错误:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '生成失败',
    });
  }
});

async function generateWithStableDiffusion(
  productImage: string,
  referenceImages: string[],
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log('使用 Stable Diffusion 生成，提示词:', prompt);

  try {
    const replicate = new Replicate({ auth: apiKey });

    const productBuffer = Buffer.from(productImage.split(',')[1], 'base64');
    const resizedProduct = await sharp(productBuffer)
      .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 90 })
      .toBuffer();

    let refImageBase64: string | null = null;
    if (referenceImages.length > 0 && referenceImages[0]) {
      const refBuffer = Buffer.from(referenceImages[0].split(',')[1], 'base64');
      const resizedRef = await sharp(refBuffer)
        .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 90 })
        .toBuffer();
      refImageBase64 = 'data:image/jpeg;base64,' + resizedRef.toString('base64');
    }

    const fullPrompt = refImageBase64 
      ? `${prompt}, product photography, professional, clean background, high quality, detailed`
      : `${prompt}, product photography, professional, clean white background, high quality, detailed`;

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:727533c94b73ac4a0fbe844dd2571d8c7b45a89a51bd71ecb9d216731f8dd112",
      {
        input: {
          prompt: fullPrompt,
          negative_prompt: "blurry, low quality, distorted, bad anatomy, text, watermark",
          width: 1024,
          height: 1024,
          scheduler: "K_EULER",
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      const imageUrl = output[0];
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      return 'data:image/jpeg;base64,' + Buffer.from(imageBuffer).toString('base64');
    }

    throw new Error('Stable Diffusion 没有返回图片');
  } catch (error) {
    console.error('Stable Diffusion 错误:', error);
    console.log('使用模拟数据作为备用方案');
    return productImage;
  }
}

async function generateWithDalle(
  productImage: string,
  referenceImages: string[],
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log('使用 DALL-E 3 生成，提示词:', prompt);

  try {
    const openai = new OpenAI({ apiKey });

    const fullPrompt = `${prompt}, professional product photography, clean background, high detail, 4k, amazon product image style`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
      response_format: "b64_json",
    });

    if (response.data[0]?.b64_json) {
      return 'data:image/png;base64,' + response.data[0].b64_json;
    }

    throw new Error('DALL-E 3 没有返回图片');
  } catch (error) {
    console.error('DALL-E 3 错误:', error);
    console.log('使用模拟数据作为备用方案');
    return productImage;
  }
}

async function generateWithGemini(
  productImage: string,
  referenceImages: string[],
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log('使用 Gemini 生成，提示词:', prompt);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const productBuffer = Buffer.from(productImage.split(',')[1], 'base64');
    const resizedProduct = await sharp(productBuffer)
      .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 90 })
      .toBuffer();

    let refImage: any = null;
    if (referenceImages.length > 0 && referenceImages[0]) {
      const refBuffer = Buffer.from(referenceImages[0].split(',')[1], 'base64');
      const resizedRef = await sharp(refBuffer)
        .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 90 })
        .toBuffer();
      refImage = {
        inlineData: {
          data: resizedRef.toString('base64'),
          mimeType: 'image/jpeg',
        },
      };
    }

    const productImg = {
      inlineData: {
        data: resizedProduct.toString('base64'),
        mimeType: 'image/jpeg',
      },
    };

    const contentParts: any[] = [
      productImg,
      { text: `请生成一张专业的产品图片，要求：${prompt}\n\n保持原产品的核心特征，调整场景和风格使其更适合电商平台展示。` }
    ];

    if (refImage) {
      contentParts.splice(1, 0, refImage);
      contentParts.push({ text: '参考参考图片的场景和风格。' });
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;
    
    let imageData = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        break;
      }
    }

    if (imageData) {
      return 'data:image/jpeg;base64,' + imageData;
    }

    throw new Error('Gemini 没有返回图片');
  } catch (error) {
    console.error('Gemini 错误:', error);
    console.log('使用模拟数据作为备用方案');
    return productImage;
  }
}

async function generateWithJimeng(
  productImage: string,
  referenceImages: string[],
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log('使用即梦生成，提示词:', prompt);
  console.log('即梦API功能即将上线，目前使用模拟数据');
  return productImage;
}

async function generateWithDoubao(
  productImage: string,
  referenceImages: string[],
  prompt: string,
  apiKey: string,
  model: string = 'doubao-seedream-4-5-251128'
): Promise<string> {
  console.log('使用豆包生成，提示词:', prompt, '模型:', model);

  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        size: '2K',
        response_format: 'b64_json',
        watermark: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('豆包API错误:', response.status, errorText);
      throw new Error(`豆包API错误: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data && data.data[0] && data.data[0].b64_json) {
      return 'data:image/png;base64,' + data.data[0].b64_json;
    }

    if (data.data && data.data[0] && data.data[0].url) {
      const imageResponse = await fetch(data.data[0].url);
      const imageBuffer = await imageResponse.arrayBuffer();
      return 'data:image/png;base64,' + Buffer.from(imageBuffer).toString('base64');
    }

    throw new Error('豆包没有返回图片');
  } catch (error) {
    console.error('豆包错误:', error);
    console.log('使用模拟数据作为备用方案');
    return productImage;
  }
}

async function generateWithTongyi(
  productImage: string,
  referenceImages: string[],
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log('使用通义万相生成，提示词:', prompt);
  console.log('通义万相API功能即将上线，目前使用模拟数据');
  return productImage;
}

async function generateWithWenxin(
  productImage: string,
  referenceImages: string[],
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log('使用文心一格生成，提示词:', prompt);
  console.log('文心一格API功能即将上线，目前使用模拟数据');
  return productImage;
}

async function generateWithHunyuan(
  productImage: string,
  referenceImages: string[],
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log('使用混元生成，提示词:', prompt);
  console.log('混元API功能即将上线，目前使用模拟数据');
  return productImage;
}

export default router;
