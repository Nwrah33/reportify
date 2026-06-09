import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AiService } from '../ai/ai.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async findAll(userId: string, query: QueryProjectsDto) {
    const where: any = { userId };
    const { search, status, projectType, isFavorite, dateFrom, dateTo, sortBy, sortOrder, page = 1, limit = 20 } = query;
    if (!userId) return { data: [], total: 0, page, limit, totalPages: 0 };

    if (status) where.status = status;
    if (projectType) where.projectType = projectType;
    if (isFavorite !== undefined) where.isFavorite = isFavorite;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const orderBy: any = {};
    const validSortFields = ['title', 'createdAt', 'updatedAt', 'projectType', 'status'];
    const field = (sortBy && validSortFields.includes(sortBy)) ? sortBy : 'updatedAt';
    orderBy[field] = sortOrder === 'asc' ? 'asc' : 'desc';

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          template: { select: { id: true, name: true, nameAr: true, thumbnailUrl: true } },
          _count: { select: { projectFiles: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects.map(this.parseProjectJson),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;
    const project = await this.prisma.project.findFirst({
      where,
      include: { template: true, projectFiles: true },
    });
    if (!project) throw new NotFoundException('المشروع غير موجود');
    return this.parseProjectJson(project);
  }

  async findBySharedLink(sharedLink: string) {
    const project = await this.prisma.project.findUnique({
      where: { sharedLink },
      include: { template: { select: { name: true, nameAr: true } } },
    });
    if (!project) throw new NotFoundException('المشروع غير موجود');
    return this.parseProjectJson(project);
  }

  async create(userId: string | undefined, dto: CreateProjectDto) {
    if (!userId) userId = await this.getAnonymousUserId();
    const data: any = {
      userId,
      title: dto.title,
      description: dto.description || '',
      projectType: dto.projectType || 'REPORT',
      content: dto.content ? JSON.stringify(dto.content) : '{}',
      settings: dto.settings ? JSON.stringify(dto.settings) : '{}',
      sharedLink: uuidv4(),
    };

    if (dto.templateId) {
      const template = await this.prisma.template.findUnique({ where: { id: dto.templateId } });
      if (template) {
        data.templateId = dto.templateId;
        if (template.templateData) data.content = template.templateData;
        if (template.colors || template.fonts) {
          const existing = data.settings ? JSON.parse(data.settings) : {};
          existing.colors = template.colors ? JSON.parse(template.colors) : undefined;
          existing.fonts = template.fonts ? JSON.parse(template.fonts) : undefined;
          data.settings = JSON.stringify(existing);
        }
      }
    }

    const project = await this.prisma.project.create({ data });

    if (dto.prompt) {
      try {
        const aiContent = await this.aiService.generateContent(dto.prompt, data.projectType, null);
        const aiContentStr = JSON.stringify(aiContent);
        await this.prisma.project.update({
          where: { id: project.id },
          data: {
            generatedContent: aiContentStr,
            wordCount: aiContentStr.split(/\s+/).length,
          },
        });
      } catch {}
    }

    await this.logActivity(userId, 'CREATE_PROJECT', { projectId: project.id, title: project.title });
    return this.findById(project.id, userId);
  }

  async createWithAi(userId: string | undefined, dto: CreateProjectDto) {
    if (!dto.prompt) throw new BadRequestException('الوصف مطلوب لإنشاء المشروع بالذكاء الاصطناعي');
    if (!userId) userId = await this.getAnonymousUserId();

    const projectType = dto.projectType || 'REPORT';
    let aiContent: any;
    let aiContentStr = '{}';
    try {
      aiContent = await this.aiService.generateContent(dto.prompt, projectType, null);
      aiContentStr = JSON.stringify(aiContent);
    } catch {
      aiContent = { sections: [{ type: 'text', content: dto.prompt }], title: dto.title || 'مشروع جديد' };
      aiContentStr = JSON.stringify(aiContent);
    }

    const project = await this.prisma.project.create({
      data: {
        userId,
        title: dto.title || aiContent.title || 'مشروع جديد',
        description: dto.description || aiContent.executiveSummary || aiContent.about || '',
        projectType,
        content: dto.content ? JSON.stringify(dto.content) : '{}',
        generatedContent: aiContentStr,
        settings: dto.settings ? JSON.stringify(dto.settings) : '{}',
        sharedLink: uuidv4(),
        wordCount: aiContentStr.split(/\s+/).length,
      },
    });

    await this.logActivity(userId, 'CREATE_PROJECT_AI', { projectId: project.id, title: project.title });
    return this.findById(project.id, userId);
  }

  async update(id: string, userId: string, dto: UpdateProjectDto) {
    await this.findById(id, userId);

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.content !== undefined) updateData.content = JSON.stringify(dto.content);
    if (dto.settings !== undefined) updateData.settings = JSON.stringify(dto.settings);
    if (dto.generatedContent !== undefined) {
      const str = JSON.stringify(dto.generatedContent);
      updateData.generatedContent = str;
      updateData.wordCount = str.split(/\s+/).length;
    }

    updateData.status = 'COMPLETED';

    const project = await this.prisma.project.update({ where: { id }, data: updateData });
    return this.parseProjectJson(project);
  }

  async saveContent(id: string, userId: string, content: any) {
    await this.findById(id, userId);
    const contentStr = JSON.stringify(content);
    const project = await this.prisma.project.update({
      where: { id },
      data: { content: contentStr, wordCount: contentStr.split(/\s+/).length },
    });
    return this.parseProjectJson(project);
  }

  async remove(id: string, userId: string) {
    await this.findById(id, userId);
    await this.prisma.project.delete({ where: { id } });
    await this.logActivity(userId, 'DELETE_PROJECT', { projectId: id });
    return { message: 'تم حذف المشروع' };
  }

  async batchRemove(ids: string[], userId: string) {
    const result = await this.prisma.project.deleteMany({
      where: { id: { in: ids }, userId },
    });
    await this.logActivity(userId, 'BATCH_DELETE_PROJECTS', { count: result.count });
    return { message: `تم حذف ${result.count} مشروع` };
  }

  async toggleFavorite(id: string, userId: string) {
    const project = await this.findById(id, userId);
    const raw = await this.prisma.project.update({
      where: { id },
      data: { isFavorite: !project.isFavorite },
    });
    return this.parseProjectJson(raw);
  }

  async duplicate(id: string, userId: string) {
    const original = await this.prisma.project.findFirst({ where: { id, userId } });
    if (!original) throw new NotFoundException('المشروع غير موجود');

    const { id: _, userId: __, createdAt: ___, updatedAt: ____, sharedLink: _____, ...data } = original;
    const project = await this.prisma.project.create({
      data: { ...data, title: `${data.title} (نسخة)`, userId, sharedLink: uuidv4() },
    });
    await this.logActivity(userId, 'DUPLICATE_PROJECT', { originalId: id, newId: project.id });
    return this.parseProjectJson(project);
  }

  async getStats(userId: string) {
    const [total, byType, byStatus] = await Promise.all([
      this.prisma.project.count({ where: { userId } }),
      this.prisma.project.groupBy({ by: ['projectType'], where: { userId }, _count: true }),
      this.prisma.project.groupBy({ by: ['status'], where: { userId }, _count: true }),
    ]);
    return { total, byType, byStatus };
  }

  async getRecentProjects(userId: string, limit = 5) {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        template: { select: { id: true, name: true, nameAr: true, thumbnailUrl: true } },
        _count: { select: { projectFiles: true } },
      },
    });
    return projects.map(this.parseProjectJson);
  }

  async getFavorites(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId, isFavorite: true },
      orderBy: { updatedAt: 'desc' },
      include: { template: { select: { id: true, name: true, nameAr: true, thumbnailUrl: true } } },
    });
    return projects.map(this.parseProjectJson);
  }

  async getTemplateRecommendations(userId: string, projectType?: string) {
    const userProjects = await this.prisma.project.findMany({
      where: { userId },
      select: { projectType: true, templateId: true },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    const usedTypes = userProjects.map(p => p.projectType);
    const usedTemplateIds = userProjects.filter(p => p.templateId).map(p => p.templateId as string);

    const [recommendations, popularByType] = await Promise.all([
      this.prisma.template.findMany({
        where: {
          isActive: true, isPublished: true,
          ...(projectType ? { category: projectType } : {}),
          id: { notIn: usedTemplateIds },
        },
        orderBy: { downloadsCount: 'desc' },
        take: 6,
      }),
      this.prisma.template.findMany({
        where: { isActive: true, isPublished: true, category: { in: usedTypes } },
        orderBy: { downloadsCount: 'desc' },
        take: 6,
      }),
    ]);

    return { recommendations, popularInUsedCategories: popularByType };
  }

  private parseProjectJson(project: any) {
    if (!project) return project;
    try {
      if (typeof project.content === 'string') project.content = JSON.parse(project.content);
    } catch {}
    try {
      if (typeof project.generatedContent === 'string') project.generatedContent = JSON.parse(project.generatedContent);
    } catch {}
    try {
      if (typeof project.settings === 'string') project.settings = JSON.parse(project.settings);
    } catch {}
    if (project.template) {
      try {
        if (typeof project.template.templateData === 'string') project.template.templateData = JSON.parse(project.template.templateData);
      } catch {}
      try {
        if (typeof project.template.colors === 'string') project.template.colors = JSON.parse(project.template.colors);
      } catch {}
      try {
        if (typeof project.template.fonts === 'string') project.template.fonts = JSON.parse(project.template.fonts);
      } catch {}
    }
    return project;
  }

  private async logActivity(userId: string, action: string, details?: any) {
    try {
      await this.prisma.activityLog.create({
        data: { userId, action, details: details ? JSON.stringify(details) : undefined },
      });
    } catch {}
  }

  private async getAnonymousUserId(): Promise<string> {
    const GUEST_EMAIL = 'guest@reportify.app';
    let guest = await this.prisma.user.findUnique({ where: { email: GUEST_EMAIL } });
    if (!guest) {
      guest = await this.prisma.user.create({
        data: {
          email: GUEST_EMAIL,
          name: 'زائر',
          role: 'USER',
          emailVerified: true,
        },
      });
    }
    return guest.id;
  }
}
