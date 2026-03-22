import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { Request, Response } from 'express';

import { LocalAuthService } from '@/authentication/services/local-auth.service';

import { LocalAuthGuard } from '@/authentication/guards/local-auth.guard';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';

import { getRedirectUrl } from '@/common/utils';
import { cookieOptions } from '@/common/constants';
import { User } from '@/models/user/schema/user.schema';
import { SignupDto } from '../dto/signup.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly localAuthService: LocalAuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signIn(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const { access_token, redirectUrl } =
      await this.localAuthService.login(user);

    res.cookie('access_token', access_token, cookieOptions);

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Authentication successful', redirectUrl });
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.localAuthService.signup(signupDto);
  }

  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: false,
      secure: false,
      // sameSite: 'strict',
      path: '/',
    });
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: Request) {
    const user = req.user as User;
    if (!user) throw new UnauthorizedException('Unauthorized!');
    return { user };
  }

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Get('/csrf-token')
  getCsrfToken(@Req() req: Request) {
    return { csrfToken: req.csrfToken() };
  }
}
