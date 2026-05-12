import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
