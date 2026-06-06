import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getUserSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });
    if (!subscription) throw new NotFoundException('الاشتراك غير موجود');
    return subscription;
  }

  async cancelSubscription(userId: string) {
    return this.prisma.subscription.update({
      where: { userId },
      data: { status: 'CANCELLED', autoRenew: false },
    });
  }

  async reactivateSubscription(userId: string) {
    return this.prisma.subscription.update({
      where: { userId },
      data: { status: 'ACTIVE', autoRenew: true },
    });
  }

  async getUsage(userId: string) {
    const [subscription, projectCount, storageUsed] = await Promise.all([
      this.getUserSubscription(userId),
      this.prisma.project.count({ where: { userId } }),
      this.prisma.projectFile.aggregate({
        where: { project: { userId } },
        _sum: { fileSize: true },
      }),
    ]);

    const limits: Record<string, any> = {
      FREE: { projects: 5, storage: 100 * 1024 * 1024, exports: 3, aiGenerations: 5 },
      MONTHLY: { projects: 100, storage: 5 * 1024 * 1024 * 1024, exports: 100, aiGenerations: 200 },
      YEARLY: { projects: -1, storage: 20 * 1024 * 1024 * 1024, exports: -1, aiGenerations: -1 },
    };

    const planLimits = limits[subscription.plan] || limits.FREE;

    return {
      subscription,
      usage: {
        projects: { used: projectCount, limit: planLimits.projects },
        storage: { used: storageUsed._sum.fileSize || 0, limit: planLimits.storage },
        aiGenerations: { limit: planLimits.aiGenerations },
      },
    };
  }

  async getPlans() {
    return [
      { id: 'free', name: 'مجاني', nameEn: 'Free', price: 0, currency: 'SAR', period: 'month', features: ['5 مشاريع', '3 تصديرات', '5 مرات ذكاء اصطناعي', 'قوالب أساسية'] },
      { id: 'monthly', name: 'شهري', nameEn: 'Monthly', price: 99, currency: 'SAR', period: 'month', features: ['100 مشروع', '100 تصدير', '200 مرة ذكاء اصطناعي', 'جميع القوالب', 'رفع ملفات', 'تصدير PDF و DOCX'] },
      { id: 'yearly', name: 'سنوي', nameEn: 'Yearly', price: 499, currency: 'SAR', period: 'year', features: ['مشاريع غير محدودة', 'تصدير غير محدود', 'ذكاء اصطناعي غير محدود', 'جميع القوالب المميزة', 'رفع وتحليل ملفات', 'جميع صيغ التصدير', 'دعم فني优先'] },
    ];
  }
}
