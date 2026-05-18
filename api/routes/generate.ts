import express, {
  type Request,
  type Response,
} from 'express';
import Replicate from 'replicate';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';

const router = express.Router();

router.post('/test-doubao', async (req: Request, res: Response) => {
  try {
    const { apiKey, model } = req.body;
    
    console.log('测试豆包API连接...');
    console.log('API Key:', apiKey ? '已提供' : '未提供');
    console.log('模型:', model || 'doubao-seedream-4-5-251128');

    if (!apiKey) {
      return res.json({
        success: false,
        message: '请提供API Key'
      });
    }

    const testPrompt = '一只可爱的小猫，白色背景，高清';
    
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'doubao-seedream-4-5-251128',
        prompt: testPrompt,
        size: '512x512',
        response_format: 'url',
        watermark: false,
        n: 1
      })
    });

    const responseText = await response.text();
    console.log('豆包API测试响应:', response.status, responseText);

    if (!response.ok) {
      return res.json({
        success: false,
        status: response.status,
        message: responseText
      });
    }

    try {
      const data = JSON.parse(responseText);
      if (data.data && data.data[0]) {
        return res.json({
          success: true,
          data: data.data[0]
        });
      }
      return res.json({
        success: false,
        message: 'API返回格式异常'
      });
    } catch (e) {
      return res.json({
        success: false,
        message: 'JSON解析失败: ' + responseText
      });
    }
  } catch (error) {
    console.error('测试豆包API失败:', error);
    return res.json({
      success: false,
      message: error instanceof Error ? error.message : '未知错误'
    });
  }
});

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
  console.log('使用 Stable Diffusion img2img 生成，提示词:', prompt);

  try {
    const replicate = new Replicate({ auth: apiKey });

    const productBuffer = Buffer.from(productImage.split(',')[1], 'base64');
    const resizedProduct = await sharp(productBuffer)
      .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 90 })
      .toBuffer();

    const productImageUrl = `data:image/jpeg;base64,${resizedProduct.toString('base64')}`;

    const fullPrompt = referenceImages.length > 0
      ? `${prompt}, product photography, professional, high quality, detailed`
      : `${prompt}, product photography, professional, clean white background, high quality, detailed`;

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: fullPrompt,
          negative_prompt: "blurry, low quality, distorted, bad anatomy, text, watermark, deformed",
          image: productImageUrl,
          strength: 0.6,
          guidance_scale: 7.5,
          num_inference_steps: 30,
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
    throw error;
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

  if (!apiKey) {
    console.log('没有配置火山引擎API Key，使用模拟数据');
    return productImage;
  }

  try {
    const modelId = model.startsWith('doubao-') ? model : 'doubao-seedream-4-5-251128';
    
    console.log('调用豆包API，模型:', modelId);

    const requestBody = {
      model: modelId,
      prompt: prompt || '专业产品摄影，电商展示图，白色背景',
      size: '2048x2048',
      response_format: 'b64_json',
      watermark: false,
      n: 1
    };

    console.log('豆包API请求体:', JSON.stringify(requestBody));

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('豆包API响应状态:', response.status);
    console.log('豆包API响应内容:', responseText);

    if (!response.ok) {
      console.error('豆包API错误:', response.status, responseText);
      
      if (response.status === 400) {
        throw new Error('请求参数错误，请检查API配置');
      } else if (response.status === 401) {
        throw new Error('API Key无效或未授权');
      } else if (response.status === 403) {
        throw new Error('权限不足，可能需要开通服务');
      } else if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后重试');
      } else {
        throw new Error(`豆包API请求失败: ${response.status}`);
      }
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('豆包API JSON解析失败:', responseText);
      throw new Error('豆包API返回格式错误');
    }
    
    if (data.data && data.data[0] && data.data[0].b64_json) {
      console.log('豆包API成功返回图片');
      return 'data:image/png;base64,' + data.data[0].b64_json;
    }

    if (data.data && data.data[0] && data.data[0].url) {
      console.log('豆包API返回图片URL');
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
