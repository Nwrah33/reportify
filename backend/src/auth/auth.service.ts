import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../common/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('البريد الإلكتروني مسجل مسبقاً');
    }

    const passwordHash = await bcryptjs.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
      },
    });

    // Create free subscription
    await this.prisma.subscription.create({
      data: { userId: user.id },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    this.mailService.sendWelcome(user.email, user.name || 'مستخدم').catch(e => {
      this.logger.warn(`فشل إرسال البريد الترحيبي: ${e.message}`);
    });

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const isValid = await bcryptjs.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async googleLogin(profile: any) {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new BadRequestException('البريد الإلكتروني مطلوب من Google');

    let user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: profile.displayName,
          googleId: profile.id,
          emailVerified: true,
          avatar: profile.photos?.[0]?.value,
        },
      });
      await this.prisma.subscription.create({ data: { userId: user.id } });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.id, emailVerified: true },
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async appleLogin(appleUser: { appleUserId: string; email?: string; name?: string }) {
    let user = appleUser.email
      ? await this.prisma.user.findUnique({ where: { email: appleUser.email } })
      : null;

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { appleUserId: appleUser.appleUserId } });
    }

    if (!user) {
      const email = appleUser.email || `apple_${appleUser.appleUserId}@privaterelay.appleid.com`;
      user = await this.prisma.user.create({
        data: {
          email,
          appleUserId: appleUser.appleUserId,
          name: appleUser.name || 'Apple User',
          emailVerified: true,
        },
      });
      await this.prisma.subscription.create({ data: { userId: user.id } });
    } else if (!user.appleUserId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { appleUserId: appleUser.appleUserId, emailVerified: true },
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshToken(userId: string, email: string) {
    return this.generateTokens(userId, email);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        _count: { select: { projects: true } },
      },
    });
    if (!user) throw new UnauthorizedException('المستخدم غير موجود');
    return this.sanitizeUser(user);
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: 'إذا كان البريد موجوداً، سيتم إرسال رابط إعادة التعيين' };
    }

    const resetToken = uuidv4();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry: new Date(Date.now() + 3600000) },
    });

    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    this.mailService.sendPasswordReset(email, resetLink).catch(e => {
      this.logger.warn(`فشل إرسال بريد إعادة التعيين: ${e.message}`);
    });

    return { message: 'إذا كان البريد موجوداً، سيتم إرسال رابط إعادة التعيين' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gte: new Date() } },
    });

    if (!user) throw new BadRequestException('الرابط غير صالح أو منتهي الصلاحية');

    const passwordHash = await bcryptjs.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    });

    return { message: 'تم إعادة تعيين كلمة المرور بنجاح' };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, refreshToken, resetToken, resetTokenExpiry, ...safeUser } = user;
    return safeUser;
  }
}
