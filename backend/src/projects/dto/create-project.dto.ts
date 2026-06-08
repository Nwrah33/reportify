import { IsString, IsOptional, IsObject, MinLength, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsObject()
  content?: any;

  @IsOptional()
  @IsObject()
  settings?: any;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  prompt?: string;
}
