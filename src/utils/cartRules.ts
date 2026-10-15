import type { CartItem, FulfilmentType } from '../types/index.ts';

export interface CouponResult {
  valid: boolean;
  code: string;
  discountAmount: number;
  message: string;
}

export const VALID_COUPONS: Record<string, { type: 'percent' | 'fixed'; value: number; minSpend: number; description: string }> = {
  VANI10: {
    type: 'percent',
    value: 10,
    minSpend: 999,
    description: '10% off on orders above ₹999'
  },
  KASHMIR: {
    type: 'fixed',
    value: 200,
    minSpend: 1499,
    description: 'Flat ₹200 off on orders above ₹1,499'
  },
  WELCOME100: {
    type: 'fixed',
    value: 100,
    minSpend: 500,
    description: '₹100 off on your first order above ₹500'
  }
};

export function validateCoupon(code: string, subtotal: number): CouponResult {
  const normalized = (code || '').trim().toUpperCase();
  if (!normalized) {
    return { valid: false, code: '', discountAmount: 0, message: 'Please enter a coupon code.' };
  }

  const promo = VALID_COUPONS[normalized];
  if (!promo) {
    return { valid: false, code: normalized, discountAmount: 0, message: 'Invalid coupon code.' };
  }

  if (subtotal < promo.minSpend) {
    return {
      valid: false,
      code: normalized,
      discountAmount: 0,
      message: `Coupon requires a minimum order of ₹${promo.minSpend.toLocaleString('en-IN')}.`
    };
  }

  let discount = 0;
  if (promo.type === 'percent') {
    discount = Math.round((subtotal * promo.value) / 100);
  } else {
    discount = promo.value;
  }

  return {
    valid: true,
    code: normalized,
    discountAmount: Math.min(discount, subtotal),
    message: `${promo.description} applied!`
  };
}

export function calculateFulfilmentFee(type: FulfilmentType, subtotal: number): number {
  switch (type) {
    case 'store-pickup':
      return 0;
    case 'local-delivery':
      return subtotal >= 999 ? 0 : 49;
    case 'pan-india-shipping':
      return subtotal >= 1499 ? 0 : 99;
    default:
      return 0;
  }
}

export interface CartCalculationResult {
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  fulfilmentFee: number;
  taxAmount: number; // 12% GST included or broken down
  totalAmount: number;
}

export function calculateCartTotals(
  items: CartItem[],
  fulfilmentType: FulfilmentType = 'store-pickup',
  couponCode?: string
): CartCalculationResult {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  let discountAmount = 0;
  let validCode: string | undefined = undefined;

  if (couponCode) {
    const couponValidation = validateCoupon(couponCode, subtotal);
    if (couponValidation.valid) {
      discountAmount = couponValidation.discountAmount;
      validCode = couponValidation.code;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const fulfilmentFee = calculateFulfilmentFee(fulfilmentType, taxableAmount);
  // GST in Indian Footwear (standard 12%)
  const taxAmount = Math.round(taxableAmount * 0.12);
  const totalAmount = taxableAmount + fulfilmentFee;

  return {
    itemCount,
    subtotal,
    discountAmount,
    discountCode: validCode,
    fulfilmentFee,
    taxAmount,
    totalAmount
  };
}
