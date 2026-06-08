import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('test')
  @UseGuards(JwtAuthGuard)
  async test(@CurrentUser() user: any) {
    const result = await this.mailService.sendWelcome(user.email, user.name || 'User');
    return { success: result.success };
  }
}
