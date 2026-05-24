import { Transform } from 'class-transformer';
import { normalizeEmail } from '../utils/normalize-email';

export const NormalizeEmail = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? normalizeEmail(value) : value,
  );

export const TrimPassword = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));
