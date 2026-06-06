import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatCurrency(amount: number, currency = 'SAR') {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function truncate(str: string, length = 100) {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function getFileIcon(fileType: string) {
  if (fileType.includes('pdf')) return 'file-text';
  if (fileType.includes('word')) return 'file-text';
  if (fileType.includes('excel')) return 'file-spreadsheet';
  if (fileType.includes('powerpoint')) return 'file-slides';
  if (fileType.includes('image')) return 'image';
  return 'file';
}
