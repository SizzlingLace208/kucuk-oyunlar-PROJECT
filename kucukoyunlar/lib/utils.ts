import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Tarihi formatlar
 * @param dateString ISO tarih formatında string
 * @returns Formatlanmış tarih (örn: 15 Mart 2024)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  };
  
  return date.toLocaleDateString('tr-TR', options);
} 