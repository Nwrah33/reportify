import { IsString, IsOptional, IsInt, Min, Max, IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExportOptionsDto {
  @IsOptional()
  @IsString()
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal';

  @IsOptional()
  @IsString()
  orientation?: 'portrait' | 'landscape';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  marginTop?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  marginBottom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  marginLeft?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  marginRight?: number;

  @IsOptional()
  @IsBoolean()
  printBackground?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(100)
  quality?: number;

  @IsOptional()
  @IsBoolean()
  watermark?: boolean;

  @IsOptional()
  @IsString()
  watermarkText?: string;

  @IsOptional()
  @IsString({ each: true })
  pages?: string;
}

export class BatchExportDto {
  @IsString({ each: true })
  projectIds: string[];

  @IsString()
  format: string;

  @IsOptional()
  @IsObject()
  options?: ExportOptionsDto;
}
