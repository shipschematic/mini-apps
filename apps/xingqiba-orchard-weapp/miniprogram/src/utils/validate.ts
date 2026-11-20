export const isPhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone);
};

export const isPositiveInteger = (num: number): boolean => {
  return Number.isInteger(num) && num > 0;
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateReservationForm = (form: {
  phone: string;
  appointmentDate: string;
  peopleCount: number;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!form.phone) {
    errors.phone = '请输入手机号';
  } else if (!isPhone(form.phone)) {
    errors.phone = '手机号格式不正确';
  }

  if (!form.appointmentDate) {
    errors.appointmentDate = '请选择预约时间';
  }

  if (!isPositiveInteger(form.peopleCount)) {
    errors.peopleCount = '请输入正确的用餐人数';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
