import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Headers,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import type { User } from 'generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // =======================
  // Public: login user
  // =======================
  @Public()
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Unauthorized');

    // generate tokens using service
    const { accessToken, refreshToken } = this.authService.login(user);

    // set refresh token in HttpOnly cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Number(process.env.JWT_REFRESH_EXPIRES_IN),
    });

    // return only access token
    return { accessToken };
  }

  @Public()
  @Post('refresh-token')
  async refreshTokens(@Headers('refresh_token') refresh_token: string) {
    return this.authService.refreshTokens(refresh_token);
  }

  // =======================
  // Protected: get profile
  // =======================
  @Get('profile')
  getProfile(@Request() req): User {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return req.user as User;
  }
}
