import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidIndianPhone,
  isValidIndianPincode,
  generateOrderId,
  canTransitionOrderStatus
} from './orderRules.ts';

test('Indian phone validation: recognizes valid mobile formats', () => {
  assert.equal(isValidIndianPhone('9419012345'), true);
  assert.equal(isValidIndianPhone('+91 94190 12345'), true);
  assert.equal(isValidIndianPhone('7006123456'), true);
  assert.equal(isValidIndianPhone('8899001122'), true);

  // Invalid cases
  assert.equal(isValidIndianPhone('1234567890'), false); // starts with 1
  assert.equal(isValidIndianPhone('94190'), false); // too short
  assert.equal(isValidIndianPhone(''), false);
});

test('Indian pincode validation: Kanelwan 192124 and standard 6 digits', () => {
  assert.equal(isValidIndianPincode('192124'), true); // Kanelwan
  assert.equal(isValidIndianPincode('190001'), true); // Srinagar
  assert.equal(isValidIndianPincode('092124'), false); // cannot start with 0
  assert.equal(isValidIndianPincode('19212'), false); // 5 digits
  assert.equal(isValidIndianPincode('1921244'), false); // 7 digits
  assert.equal(isValidIndianPincode('abc123'), false);
});

test('Order ID generation follows WF-YEAR-XXXX pattern', () => {
  const id = generateOrderId();
  const year = new Date().getFullYear();
  assert.match(id, new RegExp(`^WF-${year}-\\d{4}$`));
});

test('Order status state machine transitions', () => {
  assert.equal(canTransitionOrderStatus('Pending', 'Confirmed'), true);
  assert.equal(canTransitionOrderStatus('Confirmed', 'Processing'), true);
  assert.equal(canTransitionOrderStatus('Processing', 'Ready for pickup'), true);
  assert.equal(canTransitionOrderStatus('Ready for pickup', 'Delivered'), true);
  assert.equal(canTransitionOrderStatus('Delivered', 'Cancelled'), false); // Cannot cancel after delivery
});
