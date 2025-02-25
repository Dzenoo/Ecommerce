import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '@/models/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BlockedDomainsService } from '@/common/services/blocked-domains.service';

import { SignupDto } from '../dto/signup.dto';
import { getRedirectUrl } from '@/common/utils';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class LocalAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly blockedDomainsService: BlockedDomainsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email, '+password');

    if (!user) {
      throw new NotFoundException(
        'User not found. Please check your email and password.',
      );
    }

    if (user.isGoogleAccount && user.password === null) {
      throw new NotFoundException(
        'Your account is registered via Google. Please log in with Google.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Entered password is not valid!');
    }

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user._doc._id.toString(),
      role: user._doc.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    const redirectUrl = getRedirectUrl(payload.role);

    return { access_token, redirectUrl };
  }

  async signup(body: SignupDto) {
    const emailDomain = body.email.split('@')[1].toLowerCase();

    if (this.blockedDomainsService.isDomainBlocked(emailDomain)) {
      throw new NotAcceptableException(
        'Please use a legitimate email address.',
      );
    }

    const existingUser = await this.userService.findOneByEmail(body.email);
    if (existingUser) {
      throw new ConflictException(`An account with this email already exists.`);
    }

    const newUser = await this.userService.createOne(body);

    if (!newUser) {
      throw new InternalServerErrorException(
        'Cannot register account, please try again',
      );
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Signup successful!',
    };
  }
}
