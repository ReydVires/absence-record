import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import type { LoginRequest, AuthResponse, ApiResponse } from '@absence-record/shared';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) { }

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

    const payload = { email: user.email, sub: user.id };

    return {
      data: {
        accessToken: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
        },
      },
      statusCode: 200,
      message: 'success',
    };
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
    });
  }
}
