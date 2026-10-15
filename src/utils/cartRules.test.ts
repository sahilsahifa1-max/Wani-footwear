import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotals, validateCoupon, calculateFulfilmentFee } from './cartRules.ts';
import type { CartItem } from '../types/index.ts';

const mockProduct = {
  id: 'vf-101',
  name: 'Vani Velocity Pro Runner',
  slug: 'vani-velocity-pro-runner',
  tagline: 'Precision engineered running silhouette',
  description: 'Breathable lightweight runner with high rebound sole.',
  price: 1899,
  audience: 'men' as const,
  category: 'running' as const,
  footwearType: 'Athletic Running Shoe',
  sizes: ['UK 7', 'UK 8', 'UK 9'],
  colors: [{ name: 'Electric Yellow / Black', hex: '#F5F000' }],
  inStock: true,
  stockCount: 15,
  images: []
};

const mockItem: CartItem = {
  id: 'cart-1',
  productId: 'vf-101',
  product: mockProduct,
  selectedSize: 'UK 8',
  selectedColor: 'Electric Yellow / Black',
  quantity: 2
};

test('Cart calculations: computes subtotal and items correctly', () => {
  const result = calculateCartTotals([mockItem], 'store-pickup');
  assert.equal(result.itemCount, 2);
  assert.equal(result.subtotal, 3798); // 1899 * 2
  assert.equal(result.fulfilmentFee, 0); // Store pickup is free
  assert.equal(result.totalAmount, 3798);
  assert.equal(result.taxAmount, Math.round(3798 * 0.12));
});

test('Coupon validation: applies VANI10 10% discount above ₹999', () => {
  const validResult = validateCoupon('VANI10', 2000);
  assert.equal(validResult.valid, true);
  assert.equal(validResult.discountAmount, 200);

  const belowMin = validateCoupon('VANI10', 800);
  assert.equal(belowMin.valid, false);
  assert.equal(belowMin.discountAmount, 0);

  const invalid = validateCoupon('INVALID_CODE', 2000);
  assert.equal(invalid.valid, false);
});

test('Fulfilment fee calculations: free store pickup and threshold logic', () => {
  assert.equal(calculateFulfilmentFee('store-pickup', 500), 0);
  // Local delivery: ₹49 under 999, free above 999
  assert.equal(calculateFulfilmentFee('local-delivery', 500), 49);
  assert.equal(calculateFulfilmentFee('local-delivery', 1200), 0);
  // Pan-India shipping: ₹99 under 1499, free above 1499
  assert.equal(calculateFulfilmentFee('pan-india-shipping', 800), 99);
  assert.equal(calculateFulfilmentFee('pan-india-shipping', 1500), 0);
});

test('Cart calculations with discount and shipping', () => {
  // 1 item of 1899 with VANI10 discount (10% = 190)
  // Subtotal = 1899, Discount = 190, Taxable = 1709
  // Pan-India shipping above 1499 is free (0)
  const result = calculateCartTotals([{ ...mockItem, quantity: 1 }], 'pan-india-shipping', 'VANI10');
  assert.equal(result.subtotal, 1899);
  assert.equal(result.discountAmount, 190);
  assert.equal(result.fulfilmentFee, 0);
  assert.equal(result.totalAmount, 1709);
});
