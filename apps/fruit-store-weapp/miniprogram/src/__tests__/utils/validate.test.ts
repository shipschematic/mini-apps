import {
  isPhone,
  isPositiveInteger,
  validateReservationForm,
} from '../../utils/validate';

describe('validate utils', () => {
  describe('isPhone', () => {
    it('should return true for valid Chinese phone numbers', () => {
      expect(isPhone('13812345678')).toBe(true);
      expect(isPhone('15912345678')).toBe(true);
      expect(isPhone('18812345678')).toBe(true);
      expect(isPhone('19912345678')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isPhone('12345678901')).toBe(false);
      expect(isPhone('1381234567')).toBe(false);
      expect(isPhone('138123456789')).toBe(false);
      expect(isPhone('00012345678')).toBe(false);
      expect(isPhone('')).toBe(false);
      expect(isPhone('abc')).toBe(false);
    });

    it('should return false for numbers starting with 1 but not 3-9', () => {
      expect(isPhone('12012345678')).toBe(false);
      expect(isPhone('12112345678')).toBe(false);
      expect(isPhone('12212345678')).toBe(false);
    });
  });

  describe('isPositiveInteger', () => {
    it('should return true for positive integers', () => {
      expect(isPositiveInteger(1)).toBe(true);
      expect(isPositiveInteger(10)).toBe(true);
      expect(isPositiveInteger(100)).toBe(true);
    });

    it('should return false for zero', () => {
      expect(isPositiveInteger(0)).toBe(false);
    });

    it('should return false for negative numbers', () => {
      expect(isPositiveInteger(-1)).toBe(false);
      expect(isPositiveInteger(-100)).toBe(false);
    });

    it('should return false for non-integer numbers', () => {
      expect(isPositiveInteger(1.5)).toBe(false);
      expect(isPositiveInteger(0.1)).toBe(false);
      expect(isPositiveInteger(-1.5)).toBe(false);
    });

    it('should return false for non-number types', () => {
      expect(isPositiveInteger(NaN)).toBe(false);
      expect(isPositiveInteger(Infinity)).toBe(false);
    });
  });

  describe('validateReservationForm', () => {
    it('should return valid for correct form data', () => {
      const form = {
        phone: '13812345678',
        appointmentDate: '2024-12-25',
        peopleCount: 2,
      };

      const result = validateReservationForm(form);

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    describe('phone validation', () => {
      it('should return error when phone is empty', () => {
        const form = {
          phone: '',
          appointmentDate: '2024-12-25',
          peopleCount: 2,
        };

        const result = validateReservationForm(form);

        expect(result.isValid).toBe(false);
        expect(result.errors.phone).toBe('请输入手机号');
      });

      it('should return error when phone format is invalid', () => {
        const form = {
          phone: '12345',
          appointmentDate: '2024-12-25',
          peopleCount: 2,
        };

        const result = validateReservationForm(form);

        expect(result.isValid).toBe(false);
        expect(result.errors.phone).toBe('手机号格式不正确');
      });
    });

    describe('appointmentDate validation', () => {
      it('should return error when appointmentDate is empty', () => {
        const form = {
          phone: '13812345678',
          appointmentDate: '',
          peopleCount: 2,
        };

        const result = validateReservationForm(form);

        expect(result.isValid).toBe(false);
        expect(result.errors.appointmentDate).toBe('请选择预约时间');
      });
    });

    describe('peopleCount validation', () => {
      it('should return error when peopleCount is not a positive integer', () => {
        const form = {
          phone: '13812345678',
          appointmentDate: '2024-12-25',
          peopleCount: 0,
        };

        const result = validateReservationForm(form);

        expect(result.isValid).toBe(false);
        expect(result.errors.peopleCount).toBe('请输入正确的用餐人数');
      });

      it('should return error when peopleCount is negative', () => {
        const form = {
          phone: '13812345678',
          appointmentDate: '2024-12-25',
          peopleCount: -1,
        };

        const result = validateReservationForm(form);

        expect(result.isValid).toBe(false);
        expect(result.errors.peopleCount).toBe('请输入正确的用餐人数');
      });
    });

    it('should return multiple errors when multiple fields are invalid', () => {
      const form = {
        phone: '',
        appointmentDate: '',
        peopleCount: -1,
      };

      const result = validateReservationForm(form);

      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(3);
    });
  });
});