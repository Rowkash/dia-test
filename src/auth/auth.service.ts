import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { hash, verify } from 'argon2';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { Request } from 'express';
import { SessionsService } from 'src/sessions/sessions.service';
import { v4 as uuidv4 } from 'uuid';
import { DeepPartial } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sessionsService: SessionsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ---------- Register ---------- //

  async register(dto: AuthRegisterDto) {
    const candidate = await this.userService.findOneByEmail(dto.email);

    if (candidate) throw new BadRequestException('Email already exist');

    const hashPass = await hash(dto.password);
    const user = await this.userService.create({ ...dto, password: hashPass });
    const { accessToken, refreshToken } = this.generateTokens(user);
    await this.sessionsService.create({ user, hash: refreshToken });
    return { accessToken, refreshToken };
  }

  // ---------- Login ---------- //

  async login(dto: AuthLoginDto) {
    const user = await this.validateUser(dto);
    if (!user) return;
    const { accessToken, refreshToken } = this.generateTokens(user);

    const session = await this.sessionsService.findOneByUser(user.id);

    if (session) {
      await this.sessionsService.updateSessionHash(session.id, refreshToken);
    } else {
      await this.sessionsService.create({ user, hash: refreshToken });
    }

    return { accessToken, refreshToken };
  }

  // ---------- Logout ---------- //

  async logout(req: Request) {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token is missing');
    const session = await this.sessionsService.findOneByHash(refreshToken);
    if (!session) throw new UnauthorizedException();

    await this.sessionsService.remove(session.id);
  }

  // ---------- Refresh Tokens ---------- //

  async refreshTokens(req: Request) {
    const { refreshToken: hash } = req.cookies;
    const session = await this.sessionsService.findOneByHash(hash);
    if (!hash && !session) throw new UnauthorizedException();
    const currentTime = new Date();
    if (session.expiresIn < currentTime)
      throw new UnauthorizedException('Refresh token has expired');
    const { accessToken, refreshToken } = this.generateTokens(session.user);
    await this.sessionsService.updateSessionHash(session.id, refreshToken);
    return { accessToken, refreshToken };
  }

  // ---------- Generate Tokens ---------- //

  private generateTokens(user: DeepPartial<UserEntity>) {
    const data = { id: user.id, role: user.role.title };
    const accessSecret = this.configService.get('AUTH_JWT_SECRET');

    const accessToken = this.jwtService.sign(data, {
      secret: accessSecret,
      expiresIn: '15min',
    });

    const refreshToken = uuidv4();

    return { accessToken, refreshToken };
  }

  // ---------- Validate User ---------- //

  private async validateUser(dto: AuthLoginDto) {
    const user = await this.userService.findOneByEmail(dto.email);
    if (user) {
      const passEquals = await verify(user.password, dto.password);
      if (passEquals) return user;
    }

    throw new UnauthorizedException({ message: 'Wrong email or password' });
  }
}
