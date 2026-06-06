import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  createCheckout(@CurrentUser('id') userId: string, @Body('plan') plan: string) {
    return this.paymentsService.createCheckoutSession(userId, plan);
  }

  @Post('webhook')
  handleWebhook(@Body() event: any) {
    return this.paymentsService.handleWebhook(event);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getHistory(@CurrentUser('id') userId: string) {
    return this.paymentsService.getPaymentsHistory(userId);
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  requestRefund(
    @CurrentUser('id') userId: string,
    @Body('paymentId') paymentId: string,
    @Body('reason') reason: string,
  ) {
    return this.paymentsService.requestRefund(userId, paymentId, reason);
  }
}
