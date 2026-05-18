import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../auth/user.repository';
import { CreateUserDto, UpdateUserDto, ApiResponse } from '@absence-record/shared';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<ApiResponse<any>> {
    const users = await this.userRepository.findAll();
    return {
      statusCode: 200,
      message: 'success',
      data: { users },
    };
  }

  async create(data: CreateUserDto): Promise<ApiResponse<any>> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    return {
      statusCode: 201,
      message: 'User created successfully',
      data: user,
    };
  }

  async update(id: string, data: UpdateUserDto): Promise<ApiResponse<any>> {
    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    // Check email conflict if changing email
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updatedUser = await this.userRepository.update(id, {
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return {
      statusCode: 200,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  async delete(id: string): Promise<ApiResponse<any>> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }

    return {
      statusCode: 200,
      message: 'User deleted successfully',
      data: null,
    };
  }
}
