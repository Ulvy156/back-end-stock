import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import type { User } from 'generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // =======================
  // Public: register user
  // =======================
  @Public()
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(name, email, password);
  }

  // =======================
  // Public: login user
  // =======================
  @Public()
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('refresh-token')
  async refreshTokens(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.refreshTokens(req.headers.refresh_token);
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
