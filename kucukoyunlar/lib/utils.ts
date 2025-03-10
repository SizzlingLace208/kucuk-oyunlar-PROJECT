// Basitleştirilmiş sınıf birleştirme fonksiyonu
export function cn(...inputs: string[]): string {
  return inputs.filter(Boolean).join(' ');
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