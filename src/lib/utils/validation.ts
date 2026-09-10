export function isValidIranianPhone(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}
