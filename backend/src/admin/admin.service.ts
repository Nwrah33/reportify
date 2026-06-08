import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [users, projects, templates, payments, subscriptions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.project.count(),
      this.prisma.template.count({ where: { isPublished: true } }),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'completed' } }),
      this.prisma.subscription.groupBy({ by: ['plan'], _count: true }),
    ]);

    return {
      totalUsers: users,
      totalProjects: projects,
      totalTemplates: templates,
      totalRevenue: payments._sum.amount || 0,
      subscriptions: subscriptions.reduce((acc: any, s: any) => ({ ...acc, [s.plan]: s._count }), {}),
    };
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { subscription: true, _count: { select: { projects: true } } },
      }),
      this.prisma.user.count(),
    ]);
    return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async toggleUserStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('المستخدم غير موجود');
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
  }

  async getTemplates(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [templates, total] = await Promise.all([
      this.prisma.template.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.template.count(),
    ]);
    return { data: templates, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPayments(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      this.prisma.payment.count(),
    ]);
    return { data: payments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getContactMessages(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      this.prisma.contactMessage.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contactMessage.count(),
    ]);
    return { data: messages, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markMessageRead(messageId: string) {
    return this.prisma.contactMessage.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }
}
