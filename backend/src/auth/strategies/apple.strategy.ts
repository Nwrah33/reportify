import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('APPLE_CLIENT_ID'),
      teamID: configService.get('APPLE_TEAM_ID'),
      keyID: configService.get('APPLE_KEY_ID'),
      privateKeyLocation: configService.get('APPLE_PRIVATE_KEY'),
      callbackURL: `${configService.get('FRONTEND_URL')}/api/auth/apple/callback`,
      scope: ['name', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, idToken: string, profile: any) {
    return { appleUserId: profile.id, email: profile.email, name: profile.name };
  }
}
