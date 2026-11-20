import { post } from './request';
import { ApiResponse, ReservationForm } from '../types';

export const submitReservation = async (formData: ReservationForm): Promise<ApiResponse<{ reservationId: string }>> => {
  return {
    code: 0,
    message: 'success',
    data: { reservationId: `res_${Date.now()}` },
    success: true,
  };
};

export const reservationApi = {
  async submitReservation(formData: ReservationForm): Promise<{ reservationId: string } | null> {
    try {
      const res = await submitReservation(formData);
      return res.data;
    } catch {
      return null;
    }
  },
};
