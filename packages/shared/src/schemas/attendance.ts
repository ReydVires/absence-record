import { z } from 'zod';

export const CreateAttendanceSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  note: z.string().optional(),
  imageName: z.string().optional(),
  date: z.string().datetime(),
});

export type CreateAttendanceDto = z.infer<typeof CreateAttendanceSchema>;

export const AttendanceResponseSchema = CreateAttendanceSchema.extend({
  id: z.string().uuid(),
  checkOutTime: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  userEmail: z.string().email().optional(),
});

export type AttendanceResponse = z.infer<typeof AttendanceResponseSchema>;

export const CheckOutRequestSchema = z.object({
  checkOutTime: z.string().datetime(),
});

export type CheckOutRequest = z.infer<typeof CheckOutRequestSchema>;

