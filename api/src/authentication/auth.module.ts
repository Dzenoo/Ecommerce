import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/models/user/user.module';

import { AuthController } from './controllers/auth.controller';

import { GoogleAuthService } from './services/google-auth.service';
import { LocalAuthService } from './services/local-auth.service';
import { BlockedDomainsService } from '@/common/services/blocked-domains.service';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h', algorithm: 'HS256' },
      }),
    }),
    PassportModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleAuthService,
    GoogleStrategy,
    LocalAuthService,
    LocalStrategy,
    JwtStrategy,
    BlockedDomainsService,
  ],
})
export class AuthModule {}
