import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names with conflict resolution.
 * Uses clsx for conditional joining and twMerge to resolve conflicting utilities.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
