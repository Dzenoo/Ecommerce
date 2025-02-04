import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UserService } from '@/models/user/user.service';

@Injectable()
export class GoogleAuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }

    const { email, firstName, lastName } = req.user;

    let user: any = await this.userService.findOneByEmail(email);
    if (!user) {
      user = await this.googleSignup(email, firstName, lastName);
    }

    if (user) {
      if (!user.isGoogleAccount) {
        throw new UnauthorizedException('Please log in with credentials.');
      }

      // Do the 2FA pending approach

      const payload = { sub: user._id, role: user.role };
      const jwt = await this.jwtService.signAsync(payload);

      return {
        message: 'Login successful',
        access_token: jwt,
        role: payload.role,
      };
    }

    throw new NotFoundException(
      'No account exists with that Google email. Please sign up first.',
    );
  }

  private async googleSignup(
    email: string,
    firstName: string,
    lastName: string,
  ) {
    const existingUser = await this.userService.findOneByEmail(email);
    
    if (existingUser) {
      throw new ConflictException(
        'This email is already registered. Please log in instead.',
      );
    }

    const newUser = await this.userService.createOne({
      email,
      first_name: firstName,
      last_name: lastName,
      isGoogleAccount: true,
      password: null,
    });

    if (!newUser) {
      throw new InternalServerErrorException('Error creating user from Google');
    }

    return newUser;
  }
}
