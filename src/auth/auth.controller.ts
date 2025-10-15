import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
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
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Unauthorized');
    return this.authService.login(user);
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
