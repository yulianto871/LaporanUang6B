export interface Transaction {
  id: string;
  nama: string;
  kategori: string;
  jumlah: number;
  tanggal: string;
  keterangan: string;
}

export interface RekapData {
  nama: string;
  total: number;
  categories: {
    [key: string]: number;
  };
}

export interface SortConfig<T> {
  key: keyof T | 'total' | string;
  direction: 'ascending' | 'descending';
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryLightest: string,
  primaryDark: string;
  secondary: string;
  secondaryHover: string;
  background: string;
  surface: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

export type Font = 'Inter' | 'Poppins' | 'Roboto Slab';

export type Semester = 'all' | '1' | '2';