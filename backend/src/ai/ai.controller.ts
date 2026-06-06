import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate')
  async generateContent(
    @Body('prompt') prompt: string,
    @Body('projectType') projectType: string,
    @Body('templateData') templateData: any,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiService.generateContent(prompt, projectType, templateData);
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
  async enhanceText(@Body('text') text: string, @Body('style') style: string) {
    return this.aiService.enhanceText(text, style);
  }

  @Post('summarize')
  async summarize(@Body('text') text: string, @Body('maxLength') maxLength: number) {
    return this.aiService.summarize(text, maxLength);
  }
}
