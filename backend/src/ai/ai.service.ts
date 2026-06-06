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

  async generateContent(prompt: string, projectType: string, templateData?: any) {
    if (!prompt) throw new BadRequestException('الوصف مطلوب');

    const systemPrompt = this.getSystemPrompt(projectType);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
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

  async analyzeFile(fileContent: string, fileType: string, outputType: string) {
    const systemPrompt = `You are an expert document analyzer. Analyze the provided ${fileType} content and convert it into a professional ${outputType}. Return the result as structured JSON data.`;

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

  async enhanceText(text: string, style: string = 'professional') {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `Enhance the following text with a ${style} style. Improve clarity, tone, and professionalism. Return only the enhanced text.` },
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
        { role: 'system', content: `Summarize the following text in ${maxLength} characters or less. Return only the summary.` },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || text;
  }

  private getSystemPrompt(projectType: string): string {
    const prompts: Record<string, string> = {
      report: 'You are a professional report writer. Create a detailed, well-structured report in JSON format with sections: title, executiveSummary, introduction, content (array of sections with type and text), conclusion, recommendations. Use Arabic language.',
      brochure: 'You are a professional brochure designer. Create a brochure in JSON format with sections: title, tagline, aboutUs, services (array), features (array), contactInfo, callToAction. Use Arabic language.',
      presentation: 'You are a professional presentation creator. Create slides in JSON format with sections: title, slides (array of objects with slideNumber, title, content, bulletPoints). Use Arabic language.',
      flyer: 'You are a professional flyer designer. Create a flyer in JSON format with sections: headline, subHeadline, body, features (array), callToAction, contactInfo. Use Arabic language.',
      cv: 'You are a professional CV writer. Create a CV in JSON format with sections: personalInfo, professionalSummary, experience (array), education (array), skills (array), certifications (array), languages (array). Use Arabic language.',
      portfolio: 'You are a professional portfolio creator. Create a portfolio in JSON format with sections: header, about, projects (array with title, description, technologies), skills, contact. Use Arabic language.',
    };
    return prompts[projectType] || prompts.report;
  }
}
