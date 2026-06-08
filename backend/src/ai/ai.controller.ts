import { Controller, Post, Body, UseGuards, ValidationPipe, StreamableFile } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GenerateContentDto, GenerateImageDto, SuggestDto, RewriteDto, TranslateDto } from './dto/generate-content.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate')
  async generateContent(
    @Body(ValidationPipe) body: GenerateContentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiService.generateContent(
      body.prompt,
      body.projectType,
      body.templateData,
      body.tone,
      body.language,
      body.additionalInstructions,
    );
  }

  @Post('generate-image')
  async generateImage(
    @Body(ValidationPipe) body: GenerateImageDto,
  ) {
    return this.aiService.generateImage(body.prompt, body.style, body.size);
  }

  @Post('analyze')
  async analyzeFile(
    @Body('content') content: string,
    @Body('fileType') fileType: string,
    @Body('outputType') outputType: string,
  ) {
    return this.aiService.analyzeFile(content, fileType, outputType);
  }

  @Post('enhance')
  async enhanceText(
    @Body('text') text: string,
    @Body('style') style: string,
    @Body('tone') tone: string,
  ) {
    return this.aiService.enhanceText(text, style, tone);
  }

  @Post('summarize')
  async summarize(
    @Body('text') text: string,
    @Body('maxLength') maxLength: number,
  ) {
    return this.aiService.summarize(text, maxLength);
  }

  @Post('rewrite')
  async rewriteText(
    @Body(ValidationPipe) body: RewriteDto,
  ) {
    return this.aiService.rewriteText(body.text, body.tone, body.targetAudience);
  }

  @Post('translate')
  async translateText(
    @Body(ValidationPipe) body: TranslateDto,
  ) {
    return this.aiService.translateText(body.text, body.targetLanguage, body.sourceLanguage);
  }

  @Post('keywords')
  async generateKeywords(
    @Body('text') text: string,
    @Body('maxKeywords') maxKeywords: number,
  ) {
    return this.aiService.generateKeywords(text, maxKeywords);
  }

  @Post('grammar')
  async checkGrammar(
    @Body('text') text: string,
  ) {
    return this.aiService.checkGrammar(text);
  }

  @Post('suggestions')
  async getSuggestions(
    @Body(ValidationPipe) body: SuggestDto,
  ) {
    return this.aiService.getSuggestions(body.projectId, body.type || 'content', {});
  }
}
