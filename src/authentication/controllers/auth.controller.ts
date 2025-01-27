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
import { GoogleAuthService } from '@/authentication/services/google-auth.service';

import { LocalAuthGuard } from '@/authentication/guards/local-auth.guard';
import { GoogleOAuthGuard } from '@/authentication/guards/google-auth.guard';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';

import { getRedirectUrl } from '@/common/utils';
import { cookieOptions } from '@/common/constants';
import { User } from '@/models/user/schema/user.schema';
import { SignupDto } from '../dto/signup.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly localAuthService: LocalAuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Get('/google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {}

  @Get('/google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const authResult = await this.googleAuthService.googleLogin(req);
      res.cookie('access_token', authResult.access_token, cookieOptions);
      const redirectUrl = getRedirectUrl(authResult.isAdmin);
      return res.redirect(redirectUrl);
    } catch (error) {
      const message = encodeURIComponent(error.message);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=${message}`);
    }
  }

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
}
