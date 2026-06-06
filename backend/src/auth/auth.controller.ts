import { Controller, Post, Get, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(@Body('accessToken') accessToken: string) {
    // In production, verify the Google token server-side
    return this.authService.googleLogin({ 
      id: 'google-id',
      emails: [{ value: 'user@gmail.com' }],
      displayName: 'Google User',
      photos: [{ value: '' }]
    });
  }

  @Post('apple')
  @HttpCode(HttpStatus.OK)
  async appleLogin(@Body() body: { appleUserId: string; email?: string; name?: string }) {
    return this.authService.appleLogin(body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string, @CurrentUser() user: any) {
    return this.authService.refreshToken(user.id, user.email);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('id') userId: string) {
    // In production, add token to blacklist
    return { message: 'تم تسجيل الخروج بنجاح' };
  }
}
