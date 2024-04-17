import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { Request, Response } from 'express';
import { clearCookie, setCookie } from 'src/utils/useCookie';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ---------- Login ---------- //

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    setCookie(refreshToken, res);

    return { accessToken, refreshToken };
  }

  // ---------- Register ---------- //

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: AuthRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);

    setCookie(refreshToken, res);

    return { accessToken, refreshToken };
  }

  // ---------- Logout ---------- //

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      domain: 'localhost',
      secure: true,
      sameSite: 'lax',
    });
    clearCookie(res);
  }

  // ---------- Refresh Tokens ---------- //

  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(req);

    setCookie(refreshToken, res);

    return { accessToken, refreshToken };
  }
}
