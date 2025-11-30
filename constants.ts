import { CategoryOption } from './types';

export const CATEGORIES: CategoryOption[] = [
  { id: 'AnUong', label: 'Ăn uống' },
  { id: 'SinhHoat', label: 'Sinh hoạt' },
  { id: 'NhaCua', label: 'Nhà cửa' },
  { id: 'DiLai', label: 'Đi lại & Xăng xe' },
  { id: 'GiaiTri', label: 'Giải trí' },
  { id: 'MuaSam', label: 'Mua sắm' },
  { id: 'Khac', label: 'Khác' },
];

export const VIETIN_BLUE = '#0054A6';
export const ALERT_RED = '#EF4444';
export const SUCCESS_GREEN = '#10B981';

export const CURRENCY_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};