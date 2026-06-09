import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);
  private readonly exportsDir: string;
  private readonly templatesDir: string;
  private templatesCache = new Map<string, HandlebarsTemplateDelegate>();

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const cwd = process.cwd();
    this.exportsDir = path.resolve(cwd, 'exports');
    if (!fsSync.existsSync(this.exportsDir)) {
      fsSync.mkdirSync(this.exportsDir, { recursive: true });
    }
    const srcDir = path.resolve(cwd, 'src/export/templates');
    const distDir = path.resolve(cwd, 'dist/export/templates');
    this.templatesDir = fsSync.existsSync(srcDir) ? srcDir : distDir;
  }

  async exportProject(projectId: string, userId: string, format: string, options?: any) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
      include: { template: true },
    });

    if (!project) throw new BadRequestException('المشروع غير موجود');

    const formats = ['pdf', 'docx', 'pptx', 'png', 'jpg'];
    if (!formats.includes(format)) throw new BadRequestException('صيغة التصدير غير مدعومة');

    const fileName = `${project.title?.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}-${uuid().slice(0, 8)}.${format}`;
    const outputPath = path.join(this.exportsDir, fileName);

    const rawContent = project.generatedContent || project.content || {};
    let content = rawContent;
    if (typeof rawContent === 'string') {
      try { content = JSON.parse(rawContent); } catch { content = {}; }
    }

    try {
      switch (format) {
        case 'pdf':
          await this.generatePdf(project, content, outputPath, options);
          break;
        case 'docx':
          await this.generateDocx(project, content, outputPath, options);
          break;
        case 'pptx':
          await this.generatePptx(project, content, outputPath, options);
          break;
        case 'png':
        case 'jpg':
          await this.generateImage(project, content, outputPath, format, options);
          break;
      }
    } catch (error) {
      this.logger.error(`Export failed: ${error.message}`);
      throw new BadRequestException(`فشل التصدير: ${error.message}`);
    }

    const fileStats = await fs.stat(outputPath).catch(() => ({ size: 0 }));

    await this.prisma.project.update({
      where: { id: projectId },
      data: {
        fileUrl: `/api/export/download/${fileName}`,
        status: 'COMPLETED',
        fileSize: fileStats.size || undefined,
      },
    });

    await this.createExportRecord(userId, projectId, format, fileStats.size || 0, fileName);

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'EXPORT_PROJECT',
        details: JSON.stringify({ projectId, title: project.title, format, fileName }),
      },
    }).catch(() => {});

    return {
      format,
      fileName,
      downloadUrl: `/api/export/download/${fileName}`,
      projectId: project.id,
      title: project.title,
      fileSize: fileStats.size,
    };
  }

  async batchExport(projectIds: string[], userId: string, format: string, options?: any) {
    const results: any[] = [];
    const errors: any[] = [];

    for (const projectId of projectIds) {
      try {
        const result = await this.exportProject(projectId, userId, format, options);
        results.push(result);
      } catch (error) {
        errors.push({ projectId, error: error.message });
      }
    }

    return {
      total: projectIds.length,
      successCount: results.length,
      errorCount: errors.length,
      exports: results,
      errors,
    };
  }

  private async createExportRecord(userId: string, projectId: string, format: string, fileSize: number, fileName: string) {
    try {
      await this.prisma.exportRecord.create({
        data: {
          id: uuid(),
          userId,
          projectId,
          format: format.toUpperCase(),
          fileSize,
          fileName,
          createdAt: new Date(),
        },
      });
    } catch (e) {
      this.logger.warn(`Failed to create export record: ${e.message}`);
    }
  }

  private async loadTemplate(type: string): Promise<HandlebarsTemplateDelegate> {
    if (this.templatesCache.has(type)) return this.templatesCache.get(type)!;

    const templateMap: Record<string, string> = {
      REPORT: 'report',
      BROCHURE: 'brochure',
      PRESENTATION: 'presentation',
      FLYER: 'flyer',
      COMPANY_PROFILE: 'company-profile',
      CV: 'cv',
      PORTFOLIO: 'portfolio',
      SUMMARY: 'summary',
      ACADEMIC_REPORT: 'report',
      MARKETING_PLAN: 'report',
    };

    const templateName = templateMap[type] || 'report';
    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);

    try {
      const source = await fs.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(source);
      this.templatesCache.set(type, template);
      return template;
    } catch {
      const fallbackPath = path.join(this.templatesDir, 'report.hbs');
      const source = await fs.readFile(fallbackPath, 'utf-8');
      const template = Handlebars.compile(source);
      this.templatesCache.set(type, template);
      return template;
    }
  }

  private async readCss(name: string): Promise<string> {
    try {
      return await fs.readFile(path.join(this.templatesDir, 'styles', `${name}.css`), 'utf-8');
    } catch {
      return '';
    }
  }

  private contentToHtml(content: any): string {
    if (!content) return '';
    if (typeof content === 'string') return content.replace(/\n/g, '<br>');

    let html = '';
    if (content.title) html += `<h1>${content.title}</h1>`;
    if (content.executiveSummary) html += `<div class="summary"><h2>ملخص تنفيذي</h2><p>${content.executiveSummary}</p></div>`;
    if (content.introduction) html += `<div class="intro"><h2>مقدمة</h2><p>${content.introduction}</p></div>`;

    if (content.sections) {
      for (const section of content.sections) {
        if (section.title) html += `<h2>${section.title}</h2>`;
        if (section.content) html += `<p>${section.content.replace(/\n/g, '<br>')}</p>`;
        if (section.type === 'list' && section.items) {
          html += '<ul>';
          for (const item of section.items) html += `<li>${item}</li>`;
          html += '</ul>';
        }
        if (section.bulletPoints) {
          html += '<ul>';
          for (const point of section.bulletPoints) html += `<li>${point}</li>`;
          html += '</ul>';
        }
      }
    }

    if (content.conclusion) html += `<div class="conclusion"><h2>الخاتمة</h2><p>${content.conclusion}</p></div>`;
    if (content.recommendations && Array.isArray(content.recommendations)) {
      html += '<div class="recommendations"><h2>التوصيات</h2><ul>';
      for (const rec of content.recommendations) html += `<li>${rec}</li>`;
      html += '</ul></div>';
    }

    if (content.body) html += `<p>${content.body.replace(/\n/g, '<br>')}</p>`;
    if (content.text) html += `<p>${content.text.replace(/\n/g, '<br>')}</p>`;
    return html;
  }

  private async generatePdf(project: any, content: any, outputPath: string, options?: any) {
    const css = await this.readCss('report');
    const template = await this.loadTemplate(project.projectType);
    const html = template({
      title: project.title,
      description: project.description,
      projectType: project.projectType,
      date: new Date().toLocaleDateString('ar-SA'),
      contentHtml: this.contentToHtml(content),
      css,
      sections: content.sections || [],
      slides: content.slides || [],
      personal: content.personalInfo || content.personal || {},
      skills: content.skills || [],
      summary: content.summary || content.executiveSummary || '',
      experience: content.experience || [],
      education: content.education || [],
      about: content.about || content.aboutUs || '',
      projects: content.projects || [],
      overview: content.overview || '',
      mission: content.mission || '',
      vision: content.vision || '',
      details: content.details || '',
      tagline: content.tagline || '',
      services: content.services || [],
      features: content.features || [],
      contactInfo: content.contactInfo || {},
      callToAction: content.callToAction || '',
    });

    try {
      const puppeteer = await import('puppeteer-core');
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
          || (process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/chromium'),
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfOptions: any = {
        path: outputPath,
        format: options?.pageSize || 'A4',
        printBackground: options?.printBackground !== false,
      };

      if (options?.orientation) pdfOptions.orientation = options.orientation;
      if (options?.marginTop || options?.marginBottom || options?.marginRight || options?.marginLeft) {
        pdfOptions.margin = {};
        if (options.marginTop) pdfOptions.margin.top = `${options.marginTop}px`;
        if (options.marginBottom) pdfOptions.margin.bottom = `${options.marginBottom}px`;
        if (options.marginRight) pdfOptions.margin.right = `${options.marginRight}px`;
        if (options.marginLeft) pdfOptions.margin.left = `${options.marginLeft}px`;
      }

      if (options?.pages) {
        pdfOptions.pageRanges = options.pages;
      }

      await page.pdf(pdfOptions);
      await browser.close();
    } catch {
      await fs.writeFile(outputPath.replace(/\.pdf$/, '.html'), html, 'utf-8');
      throw new Error('تعذر إنشاء PDF بسبب عدم توفر متصفح. تم إنشاء ملف HTML كبديل.');
    }
  }

  private async generateDocx(project: any, content: any, outputPath: string, options?: any) {
    const {
      Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
      Table, TableRow, TableCell, WidthType, BorderStyle,
    } = await import('docx');

    const children: any[] = [];

    children.push(
      new Paragraph({
        children: [new TextRun({ text: project.title, bold: true, size: 36, font: 'Cairo' })],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 400 },
      }),
    );

    if (project.description) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: project.description, size: 22, font: 'Cairo', color: '475569' })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 400 },
        }),
      );
    }

    if (content.executiveSummary) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'ملخص تنفيذي', bold: true, size: 28, font: 'Cairo', color: '1E3A5F' })],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: content.executiveSummary, size: 22, font: 'Cairo' })],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
        }),
      );
    }

    if (content.sections) {
      for (const section of content.sections) {
        if (section.title) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: section.title, bold: true, size: 28, font: 'Cairo', color: '1E3A5F' })],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 400, after: 200 },
            }),
          );
        }
        if (section.content) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: section.content, size: 22, font: 'Cairo' })],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 200 },
            }),
          );
        }
        if (section.bulletPoints) {
          for (const point of section.bulletPoints) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: `• ${point}`, size: 22, font: 'Cairo' })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
              }),
            );
          }
        }
      }
    }

    if (content.recommendations && Array.isArray(content.recommendations)) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'التوصيات', bold: true, size: 28, font: 'Cairo', color: '1E3A5F' })],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 400, after: 200 },
        }),
      );
      for (const rec of content.recommendations) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `• ${rec}`, size: 22, font: 'Cairo' })],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 100 },
          }),
        );
      }
    }

    const doc = new Document({
      sections: [{ properties: { rtl: true } as any, children }],
    });

    const buffer = await Packer.toBuffer(doc);
    await fs.writeFile(outputPath, buffer);
  }

  private async generatePptx(project: any, content: any, outputPath: string, options?: any) {
    const pptxgen = await import('pptxgenjs');
    const pptx = new pptxgen.default();

    (pptx as any).rtl = true;
    pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 7.5 });
    pptx.layout = 'CUSTOM';

    const primaryColor = '1E3A5F';
    const accentColor = '2563EB';

    const slide1 = pptx.addSlide();
    slide1.background = { color: primaryColor };
    slide1.addText(project.title, { x: 1, y: 2.5, w: 8, h: 1.5, fontSize: 36, color: 'FFFFFF', fontFace: 'Cairo', align: 'center', bold: true, rtl: true } as any);
    if (project.description) {
      slide1.addText(project.description, { x: 1, y: 4, w: 8, h: 1, fontSize: 18, color: 'CCCCCC', fontFace: 'Cairo', align: 'center', rtl: true } as any);
    }

    if (content.sections) {
      for (const section of content.sections) {
        const slide = pptx.addSlide();
        slide.background = { color: 'FFFFFF' };
        slide.addText(section.title || '', { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, color: primaryColor, fontFace: 'Cairo', bold: true, rtl: true } as any);
        slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 2, h: 0.06, fill: { color: accentColor } });
        if (section.content) {
          slide.addText(section.content, { x: 0.5, y: 1.5, w: 9, h: 5, fontSize: 18, color: '333333', fontFace: 'Cairo', rtl: true, valign: 'top' } as any);
        }
      }
    }

    if (content.executiveSummary) {
      const slide = pptx.addSlide();
      slide.background = { color: 'FFFFFF' };
      slide.addText('ملخص تنفيذي', { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 28, color: primaryColor, fontFace: 'Cairo', bold: true, rtl: true } as any);
      slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 2, h: 0.06, fill: { color: accentColor } });
      slide.addText(content.executiveSummary, { x: 0.5, y: 1.5, w: 9, h: 5, fontSize: 18, color: '333333', fontFace: 'Cairo', rtl: true, valign: 'top' } as any);
    }

    await pptx.writeFile({ fileName: outputPath });
  }

  private async generateImage(project: any, content: any, outputPath: string, format: string, options?: any) {
    const css = await this.readCss('report');
    const template = await this.loadTemplate(project.projectType);
    const html = template({
      title: project.title,
      description: project.description,
      projectType: project.projectType,
      date: new Date().toLocaleDateString('ar-SA'),
      contentHtml: this.contentToHtml(content),
      css,
    });

    try {
      const puppeteer = await import('puppeteer-core');
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
          || (process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/chromium'),
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.setViewport({ width: options?.width || 1200, height: options?.height || 1600 });

      await page.screenshot({
        path: outputPath,
        fullPage: true,
        type: format === 'png' ? 'png' : 'jpeg',
        quality: format === 'jpg' ? (options?.quality || 90) : undefined,
      });
      await browser.close();
    } catch {
      await fs.writeFile(outputPath.replace(/\.(png|jpg|jpeg)$/, '.html'), html, 'utf-8');
      throw new Error('تعذر إنشاء صورة بسبب عدم توفر متصفح. تم إنشاء ملف HTML كبديل.');
    }
  }

  async getExportHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    try {
      const [records, total] = await Promise.all([
        this.prisma.project.findMany({
          where: { userId, status: 'COMPLETED', fileUrl: { not: null } },
          select: {
            id: true,
            title: true,
            projectType: true,
            updatedAt: true,
            fileUrl: true,
            fileSize: true,
          },
          orderBy: { updatedAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.project.count({
          where: { userId, status: 'COMPLETED', fileUrl: { not: null } },
        }),
      ]);

      return {
        data: records,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch {
      return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    }
  }

  async getExportStats(userId: string) {
    const exports = await this.prisma.project.findMany({
      where: { userId, status: 'COMPLETED', fileUrl: { not: null } },
      select: { fileUrl: true, fileSize: true, projectType: true, updatedAt: true },
    });

    const byFormat: Record<string, number> = {};
    let totalSize = 0;

    for (const exp of exports) {
      const ext = exp.fileUrl?.split('.').pop() || 'unknown';
      byFormat[ext] = (byFormat[ext] || 0) + 1;
      totalSize += exp.fileSize || 0;
    }

    return {
      totalExports: exports.length,
      totalSize,
      byFormat,
      lastExport: exports[0]?.updatedAt || null,
    };
  }

  async downloadFile(fileName: string, res: any) {
    const filePath = path.resolve(process.cwd(), 'exports', fileName);
    if (!fsSync.existsSync(filePath)) throw new BadRequestException('الملف غير موجود');

    const mimeMap: Record<string, string> = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      png: 'image/png',
      jpg: 'image/jpeg',
    };
    const ext = fileName.split('.').pop() || '';
    const mimeType = mimeMap[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    const stream = fsSync.createReadStream(filePath);
    stream.pipe(res);
  }
}
