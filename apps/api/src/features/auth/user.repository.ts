import { Injectable, Inject } from '@nestjs/common';
import { DB_PROVIDER, DbProvider } from '../../database/db.provider';

export interface UserRow {
  id: string;
  email: string;
  password?: string;
  created_at: Date;
}

export interface User extends Omit<UserRow, 'created_at'> {
  createdAt: Date;
}


@Injectable()
export class UserRepository {
  constructor(
    @Inject(DB_PROVIDER) private readonly dbService: DbProvider,
  ) { }

  private get db() {
    return this.dbService.pool;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await this.db.query<UserRow>(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    if (rows[0]) {
      const { created_at, ...user } = rows[0];
      return {
        ...user,
        createdAt: created_at,
      };
    }
    return null;
  }


  async findById(id: string): Promise<User | null> {
    const { rows } = await this.db.query<UserRow>(
      'SELECT * FROM users WHERE id = $1 LIMIT 1',
      [id]
    );

    if (rows[0]) {
      const { created_at, ...user } = rows[0];
      return {
        ...user,
        createdAt: created_at,
      };
    }
    return null;
  }


  async create(data: { email: string; password: string }): Promise<User | null> {
    const { rows } = await this.db.query<UserRow>(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [data.email, data.password]
    );

    if (rows[0]) {
      const { created_at, ...user } = rows[0];
      return {
        ...user,
        createdAt: created_at,
      };
    }
    return null;
  }

}
