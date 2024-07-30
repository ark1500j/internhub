
export function GenerateNumericOTP(length: number = 6): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};


import { format, parseISO } from 'date-fns';

// Function to get ordinal suffix for a day
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th'; // covers 11th - 20th
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// Function to format date to "23rd July, 2024"
export function formatDateToCustomString(isoString: string): string {
  const date = parseISO(isoString);
  const day = format(date, 'd');
  const dayWithSuffix = `${day}${getOrdinalSuffix(parseInt(day))}`;
  const formattedDate = format(date, `MMMM yyyy`);
  
  return `${dayWithSuffix} ${formattedDate}`;
}