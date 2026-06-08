import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: configService.get('OPENAI_API_KEY'),
    });
  }

  async generateContent(prompt: string, projectType: string, templateData?: any, tone?: string, language?: string, additionalInstructions?: string) {
    if (!prompt) throw new BadRequestException('الوصف مطلوب');

    const systemPrompt = this.getSystemPrompt(projectType, tone, language);
    const instructions = additionalInstructions ? `\nتعليمات إضافية: ${additionalInstructions}` : '';

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt + instructions },
        { role: 'user', content: prompt },
        ...(templateData ? [{ role: 'assistant', content: `استخدم هذه البيانات كمرجع: ${JSON.stringify(templateData)}` } as const] : []),
      ],
      temperature: tone === 'creative' ? 0.8 : tone === 'professional' ? 0.4 : 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new BadRequestException('فشل في إنشاء المحتوى');

    try {
      return JSON.parse(content);
    } catch {
      return { sections: [{ type: 'text', content }] };
    }
  }

  async generateImage(prompt: string, style?: string, size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024') {
    if (!prompt) throw new BadRequestException('الوصف مطلوب');

    const stylePrompt = style ? ` بأسلوب ${style}` : '';

    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: `${prompt}${stylePrompt}`,
      n: 1,
      size,
      quality: 'hd',
    });

    const data = response.data?.[0];
    return {
      url: data?.url,
      revisedPrompt: data?.revised_prompt,
    };
  }

  async analyzeFile(fileContent: string, fileType: string, outputType: string) {
    const systemPrompt = `You are an expert document analyzer. Analyze the provided ${fileType} content and convert it into a professional ${outputType}. Return the result as structured JSON data in Arabic.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: fileContent },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new BadRequestException('فشل في تحليل الملف');

    try {
      return JSON.parse(content);
    } catch {
      return { summary: content, sections: [{ type: 'text', content }] };
    }
  }

  async enhanceText(text: string, style: string = 'professional', tone?: string) {
    const toneInstruction = tone ? `بنبرة ${tone}` : '';
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `قم بتحسين النص التالي بأسلوب ${style} ${toneInstruction}. حسن الوضوح والنبرة والاحترافية. أعد النص المحسن فقط.` },
        { role: 'user', content: text },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || text;
  }

  async summarize(text: string, maxLength: number = 500) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `لخص النص التالي في ${maxLength} حرف أو أقل. أعد الملخص فقط باللغة العربية.` },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || text;
  }

  async rewriteText(text: string, tone: string = 'professional', targetAudience?: string) {
    const audienceInstruction = targetAudience ? ` للجمهور المستهدف: ${targetAudience}` : '';
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `أعد صياغة النص التالي بنبرة ${tone}${audienceInstruction}. حافظ على المعنى ولكن حسن الأسلوب. أعد النص المعاد صياغته فقط.` },
        { role: 'user', content: text },
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || text;
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage?: string) {
    const source = sourceLanguage ? `من ${sourceLanguage}` : '';
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `ترجم النص التالي ${source} إلى ${targetLanguage}. أعد الترجمة فقط.` },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || text;
  }

  async generateKeywords(text: string, maxKeywords: number = 10) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `استخرج ${maxKeywords} كلمة مفتاحية من النص التالي. أعد النتيجة كمصفوفة JSON من الكلمات المفتاحية باللغة العربية.` },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return [];

    try {
      return JSON.parse(content);
    } catch {
      return content.split(',').map(k => k.trim());
    }
  }

  async checkGrammar(text: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت مدقق لغوي محترف. قم بتحليل النص التالي وحدد الأخطاء الإملائية والنحوية والأسلوبية. أعد النتيجة كـ JSON مع: hasErrors (boolean), errors (array of {type, word, suggestion, location}), suggestions (array of improvement suggestions), overallScore (number 1-100).',
        },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new BadRequestException('فشل في تدقيق النص');

    try {
      return JSON.parse(content);
    } catch {
      return { hasErrors: false, errors: [], suggestions: [content], overallScore: 100 };
    }
  }

  async getSuggestions(projectId: string, type: string, projectData: any) {
    switch (type) {
      case 'content': {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'أنت مستشار محتوى محترف. بناءً على بيانات المشروع التالية، قدم 5 اقتراحات لتحسين المحتوى. أعد النتيجة كمصفوفة JSON من الاقتراحات مع type (improvement/addition/restructure) و title و description.',
            },
            { role: 'user', content: JSON.stringify(projectData) },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        });
        const content = completion.choices[0]?.message?.content || '[]';
        try { return JSON.parse(content); } catch { return []; }
      }

      case 'design': {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'أنت مصمم محترف. بناءً على نوع المشروع التالي، قدم 3 اقتراحات تصميمية (ألوان، خطوط، تخطيط). أعد النتيجة كـ JSON مع suggestedColors (array), suggestedFonts (array), layoutSuggestions (array).',
            },
            { role: 'user', content: JSON.stringify(projectData) },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });
        const content = completion.choices[0]?.message?.content || '{}';
        try { return JSON.parse(content); } catch { return []; }
      }

      case 'template': {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'أنت خبير في القوالب. بناءً على وصف المشروع، اقترح أفضل 3 أنواع قوالب مناسبة. أعد النتيجة كمصفوفة JSON من الاقتراحات مع name و reason. استخدم العربية.',
            },
            { role: 'user', content: JSON.stringify(projectData) },
          ],
          temperature: 0.5,
          max_tokens: 1000,
        });
        const content = completion.choices[0]?.message?.content || '[]';
        try { return JSON.parse(content); } catch { return []; }
      }

      case 'keywords': {
        const text = typeof projectData === 'string' ? projectData : JSON.stringify(projectData);
        return this.generateKeywords(text);
      }

      default:
        throw new BadRequestException('نوع الاقتراح غير مدعوم');
    }
  }

  private getSystemPrompt(projectType: string, tone?: string, language?: string): string {
    const lang = language === 'en' ? 'English' : 'Arabic';
    const toneInstruction = tone ? `بأسلوب ${tone}` : '';

    const prompts: Record<string, string> = {
      report: `أنت كاتب تقارير محترف ${toneInstruction}. أنشئ تقريراً مفصلاً ومنظماً بتنسيق JSON مع الحقول التالية: title, executiveSummary, introduction, content (مصفوفة من الأقسام مع type و title و text), conclusion, recommendations. استخدم اللغة ${lang}.`,
      brochure: `أنت مصمم بروشورات محترف ${toneInstruction}. أنشئ بروشوراً بتنسيق JSON مع: title, tagline, aboutUs, services (مصفوفة), features (مصفوفة), contactInfo, callToAction. استخدم اللغة ${lang}.`,
      presentation: `أنت مقدم عروض محترف ${toneInstruction}. أنشئ عرضاً تقديمياً بتنسيق JSON مع: title, slides (مصفوفة من الشرائح تحتوي slideNumber, title, content, bulletPoints). استخدم اللغة ${lang}.`,
      flyer: `أنت مصمم فلايرات محترف ${toneInstruction}. أنشئ فلايراً بتنسيق JSON مع: headline, subHeadline, body, features (مصفوفة), callToAction, contactInfo. استخدم اللغة ${lang}.`,
      cv: `أنت كاتب سير ذاتية محترف ${toneInstruction}. أنشئ سيرة ذاتية بتنسيق JSON مع: personalInfo, professionalSummary, experience (مصفوفة), education (مصفوفة), skills (مصفوفة), certifications (مصفوفة), languages (مصفوفة). استخدم اللغة ${lang}.`,
      portfolio: `أنت منشئ بورتفوليو محترف ${toneInstruction}. أنشئ بورتفوليو بتنسيق JSON مع: header, about, projects (مصفوفة مع title, description, technologies), skills, contact. استخدم اللغة ${lang}.`,
      company_profile: `أنت كاتب ملفات شركات محترف ${toneInstruction}. أنشئ ملف شركة بتنسيق JSON مع: companyName, overview, mission, vision, values (مصفوفة), services (مصفوفة), team (مصفوفة), contactInfo. استخدم اللغة ${lang}.`,
      summary: `أنت كاتب ملخصات محترف ${toneInstruction}. أنشئ ملخصاً بتنسيق JSON مع: title, summary, keyPoints (مصفوفة), conclusion. استخدم اللغة ${lang}.`,
      academic_report: `أنت كاتب تقارير أكاديمية محترف ${toneInstruction}. أنشئ تقريراً أكاديمياً بتنسيق JSON مع: title, abstract, introduction, methodology, results, discussion, conclusion, references (مصفوفة). استخدم اللغة ${lang}.`,
      marketing_plan: `أنت مخطط تسويق محترف ${toneInstruction}. أنشئ خطة تسويقية بتنسيق JSON مع: campaignName, objectives (مصفوفة), targetAudience, channels (مصفوفة), budget, timeline, kpis (مصفوفة). استخدم اللغة ${lang}.`,
    };

    return prompts[projectType] || prompts.report;
  }
}
