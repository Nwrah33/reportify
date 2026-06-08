import { IsString, IsOptional, IsEnum, IsObject, MinLength, MaxLength } from 'class-validator';

export class GenerateContentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(3000)
  prompt: string;

  @IsString()
  projectType: string;

  @IsOptional()
  @IsObject()
  templateData?: any;

  @IsOptional()
  @IsString()
  tone?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  additionalInstructions?: string;
}

export class GenerateImageDto {
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  prompt: string;

  @IsOptional()
  @IsString()
  style?: string;

  @IsOptional()
  @IsString()
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}

export class SuggestDto {
  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  type?: 'content' | 'design' | 'template' | 'keywords';
}

export class RewriteDto {
  @IsString()
  @MinLength(10)
  text: string;

  @IsOptional()
  @IsString()
  tone?: 'professional' | 'simple' | 'formal' | 'creative' | 'persuasive';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  targetAudience?: string;
}

export class TranslateDto {
  @IsString()
  @MinLength(3)
  text: string;

  @IsString()
  targetLanguage: string;

  @IsOptional()
  @IsString()
  sourceLanguage?: string;
}
