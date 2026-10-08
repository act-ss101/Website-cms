/**
 * Validation Service
 * Centralized validation rules for forms and data.
 */

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// ─── Email Validation ──────────────────────────────────────────────────────────
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Password Validation ───────────────────────────────────────────────────────
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 6) errors.push('Password must be at least 6 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
  return { valid: errors.length === 0, errors };
}

// ─── Slug Validation ───────────────────────────────────────────────────────────
export function validateSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// ─── Booking Validation ────────────────────────────────────────────────────────
export function validateBooking(data: { date: string; time: string; holes: number; guests: string[] }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.date) errors.date = 'Date is required';
  else {
    const bookingDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) errors.date = 'Cannot book in the past';
  }

  if (!data.time) errors.time = 'Time is required';

  if (data.holes !== 9 && data.holes !== 18) errors.holes = 'Must be 9 or 18 holes';

  if (data.guests.length > 5) errors.guests = 'Maximum 5 guests allowed';

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── CMS Page Validation ───────────────────────────────────────────────────────
export function validateCMSPage(data: { slug: string; title: Record<string, string>; content: Record<string, any> }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.slug) errors.slug = 'Slug is required';
  else if (!validateSlug(data.slug)) errors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';

  if (!data.title.en && !data.title.th && !data.title.ja) errors.title = 'At least one language title is required';

  if (!data.content || Object.keys(data.content).length === 0) errors.content = 'Content is required';

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Member Registration Validation ────────────────────────────────────────────
export function validateRegistration(data: { email: string; password: string; name: string }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email) errors.email = 'Email is required';
  else if (!validateEmail(data.email)) errors.email = 'Invalid email format';

  if (!data.password) errors.password = 'Password is required';
  else {
    const pwResult = validatePassword(data.password);
    if (!pwResult.valid) errors.password = pwResult.errors[0];
  }

  if (!data.name) errors.name = 'Name is required';
  else if (data.name.length < 2) errors.name = 'Name must be at least 2 characters';

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Generic Required Fields ───────────────────────────────────────────────────
export function validateRequired(data: Record<string, any>, fields: string[]): ValidationResult {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors[field] = `${field} is required`;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
