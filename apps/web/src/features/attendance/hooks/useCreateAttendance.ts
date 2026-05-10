import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { CreateAttendanceDto, AttendanceResponse } from '@shared/index';
import { ATTENDANCE_QUERY_KEY } from './queries';

const createAttendanceRecord = async (record: CreateAttendanceDto): Promise<AttendanceResponse> => {
  const { data } = await apiClient.post('/attendance', record);
  return data;
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttendanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEY });
    },
  });
};
