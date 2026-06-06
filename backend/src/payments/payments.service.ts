import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createCheckoutSession(userId: string, plan: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('المستخدم غير موجود');

    const prices: Record<string, number> = {
      monthly: 99,
      yearly: 499,
    };

    const amount = prices[plan];
    if (!amount) throw new BadRequestException('الباقة غير صالحة');

    // In production, create Stripe/Moyasar checkout session here
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount,
        currency: 'SAR',
        status: 'pending',
        paymentGateway: 'stripe',
        description: `اشتراك ${plan === 'monthly' ? 'شهري' : 'سنوي'} - ${amount} ريال`,
      },
    });

    return {
      paymentId: payment.id,
      amount,
      currency: 'SAR',
      checkoutUrl: `https://checkout.stripe.com/pay/${payment.id}`, // Replace with actual checkout URL
    };
  }

  async handleWebhook(event: any) {
    // Process Stripe/Moyasar webhook events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await this.completePayment(session.id, session.payment_intent);
    }
    return { received: true };
  }

  async completePayment(paymentId: string, gatewayPaymentId: string) {
    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'completed',
        gatewayPaymentId,
        invoiceUrl: `https://invoice.stripe.com/${paymentId}`,
      },
    });

    // Update subscription
    if (payment.description?.includes('شهري')) {
      await this.prisma.subscription.update({
        where: { userId: payment.userId },
        data: {
          plan: 'MONTHLY',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          stripeSubscriptionId: gatewayPaymentId,
        },
      });
    } else if (payment.description?.includes('سنوي')) {
      await this.prisma.subscription.update({
        where: { userId: payment.userId },
        data: {
          plan: 'YEARLY',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          stripeSubscriptionId: gatewayPaymentId,
        },
      });
    }

    return payment;
  }

  async getPaymentsHistory(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async requestRefund(userId: string, paymentId: string, reason: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, userId },
    });
    if (!payment) throw new BadRequestException('الدفعة غير موجودة');
    if (payment.status !== 'completed') throw new BadRequestException('لا يمكن استرداد دفعة غير مكتملة');

    return this.prisma.refund.create({
      data: { userId, paymentId, amount: payment.amount, reason },
    });
  }
}
