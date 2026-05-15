import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginRequest, AuthResponse, ApiResponse, RefreshTokenRequest } from '@absence-record/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    return this.authService.refreshTokens(refreshDto);
  }

  @Post('register')
  async register(@Body() registerDto: LoginRequest) {
    return this.authService.register(registerDto);
  }
}
