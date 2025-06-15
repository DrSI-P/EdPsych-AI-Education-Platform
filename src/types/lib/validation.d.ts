declare module '@/lib/validation' {
  export function validateAndSanitizeUser(userData: unknown): unknown;
  export function validateAndSanitizeProfile(profileData: unknown): unknown;
  export function sanitizeInput(input: string): string;
  export function validateUKPostcode(postcode: string): boolean;
  export function validateUKPhoneNumber(phone: string): boolean;
  export function validateUKYearGroup(yearGroup: string): boolean;
  export function validateEmailEnhanced(email: string): boolean;
}
