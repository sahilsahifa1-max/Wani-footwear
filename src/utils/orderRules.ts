import type { OrderStatus } from '../types/index.ts';

/**
 * Validate standard 10-digit Indian mobile numbers (e.g., 9419012345, 7006123456)
 */
export function isValidIndianPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
  // Allows optional +91 prefix followed by 10 digits starting with 6, 7, 8, or 9
  return /^(91)?[6789]\d{9}$/.test(cleaned);
}

/**
 * Validate standard 6-digit Indian PIN code (e.g., 192124 for Kanelwan)
 */
export function isValidIndianPincode(pincode: string): boolean {
  if (!pincode) return false;
  const cleaned = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

/**
 * Generate a distinctive, sequential or pseudo-random order ID (e.g. WF-2026-7842)
 */
export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `WF-${year}-${randomSuffix}`;
}

/**
 * Valid allowed transitions for order lifecycle
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Processing', 'Cancelled'],
  Processing: ['Ready for pickup', 'Shipped', 'Cancelled'],
  'Ready for pickup': ['Delivered', 'Cancelled'],
  Shipped: ['Delivered', 'Cancelled'],
  Delivered: ['Refunded'],
  Cancelled: [],
  Refunded: []
};

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[from] || [];
  return allowed.includes(to);
}
