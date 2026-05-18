import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import type { LoginRequest, AuthResponse, ApiResponse, RefreshTokenRequest } from '@absence-record/shared';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  private get refreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET') || 'super-refresh-secret';
  }

  private generateTokens(userId: string, email: string, role: string) {
    const payload = { email, sub: userId, role };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '12h' }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.refreshSecret,
        expiresIn: '3d',
      }),
    };
  }


  async login(loginDto: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      data: {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      statusCode: 200,
      message: 'success',
    };
  }

  async refreshTokens(dto: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.refreshSecret,
      });

      // Issue new tokens
      const tokens = this.generateTokens(payload.sub, payload.email, payload.role);

      return {
        data: {
          ...tokens,
          user: {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
          },
        },
        statusCode: 200,
        message: 'success',
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // Helper for initial setup/seeding if needed
  async register(registerDto: LoginRequest) {
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      role: 'employee',
    });
  }
}
