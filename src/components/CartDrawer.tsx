import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Truck, Store } from 'lucide-react';
import { CartItem, FulfilmentType } from '../types/index.ts';
import { calculateCartTotals, validateCoupon, VALID_COUPONS } from '../utils/cartRules.ts';
import { ShoeSilhouette } from './ShoeSilhouette.tsx';
import { STORE_INFO } from '../config/storeInfo.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  fulfilmentType: FulfilmentType;
  onSelectFulfilment: (type: FulfilmentType) => void;
  couponCode: string;
  onApplyCoupon: (code: string) => void;
  onClearCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  fulfilmentType,
  onSelectFulfilment,
  couponCode,
  onApplyCoupon,
  onClearCoupon
}) => {
  const [couponInput, setCouponInput] = useState(couponCode || '');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const totals = calculateCartTotals(items, fulfilmentType, couponCode);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const res = validateCoupon(couponInput, totals.subtotal);
    if (res.valid) {
      onApplyCoupon(res.code);
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F7F2] shadow-2xl flex flex-col border-l border-zinc-200">
          {/* Header */}
          <div className="p-6 bg-white border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#171717]" />
              <h2 id="cart-title" className="text-xl font-bold font-display text-zinc-900">
                Shopping Bag
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#171717] text-[#F5F000] font-mono tabular-nums font-bold">
                {totals.itemCount}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-display text-zinc-800">
                  Your shopping bag is empty
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Discover high-quality footwear crafted for every step at Vani Footwear Kanewan.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-[#171717] text-[#F5F000] rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer font-display"
                >
                  Explore Footwear
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex gap-4 items-center"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-zinc-100 p-2 flex items-center justify-center shrink-0">
                    <ShoeSilhouette
                      category={item.product.category}
                      accentColor={item.product.colors.find((c) => c.name === item.selectedColor)?.hex || '#F5F000'}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 truncate font-display">
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-zinc-500 font-mono mt-0.5 space-x-2">
                      <span>Size: <strong className="text-zinc-800">{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span>Color: <strong className="text-zinc-800">{item.selectedColor}</strong></span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-zinc-600 hover:bg-zinc-200"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-0.5 text-xs font-mono font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs font-bold text-zinc-600 hover:bg-zinc-200"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-bold font-mono text-[#171717] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Actions */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-zinc-200 space-y-4">
              {/* Fulfilment Method Choice */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block">
                  Fulfilment Method
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectFulfilment('store-pickup')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      fulfilmentType === 'store-pickup'
                        ? 'border-[#171717] bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-[#F5F000]" />
                      <span className="text-xs font-bold">Store Pickup</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Kanewan (FREE)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectFulfilment('local-delivery')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      fulfilmentType === 'local-delivery'
                        ? 'border-[#171717] bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#F5F000]" />
                      <span className="text-xs font-bold">Local Delivery</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {totals.subtotal >= 999 ? 'FREE over ₹999' : '₹49 in J&K'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Coupon: VANI10 or KASHMIR"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono uppercase focus:bg-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {couponCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 font-mono px-1">
                    <span>Applied: {couponCode}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClearCoupon();
                        setCouponInput('');
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-red-500 font-mono px-1">{couponError}</p>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({totals.discountCode})</span>
                    <span className="font-mono tabular-nums">-₹{totals.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Fulfilment ({fulfilmentType === 'store-pickup' ? 'Kanewan Pickup' : 'Delivery'})</span>
                  <span className="font-mono tabular-nums">
                    {totals.fulfilmentFee === 0 ? 'FREE' : `₹${totals.fulfilmentFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-zinc-400">
                  <span>Estimated GST (12% Included)</span>
                  <span className="font-mono tabular-nums">₹{totals.taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total Payable</span>
                  <span className="font-mono tabular-nums text-xl text-[#171717]">
                    ₹{totals.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-[#171717] hover:bg-black text-[#F5F000] rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
