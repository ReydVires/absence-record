import { z } from 'zod';

export const CreateAttendanceSchema = z.object({
  userId: z.string().uuid(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  note: z.string().optional(),
  date: z.string().datetime(),
});

export type CreateAttendanceDto = z.infer<typeof CreateAttendanceSchema>;

export const AttendanceResponseSchema = CreateAttendanceSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type AttendanceResponse = z.infer<typeof AttendanceResponseSchema>;
