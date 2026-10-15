import React, { useState } from 'react';
import {
  ShieldCheck,
  Store,
  Truck,
  CreditCard,
  Banknote,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { CartItem, FulfilmentType, PaymentMethod, Order, OrderCustomer } from '../types/index.ts';
import { calculateCartTotals } from '../utils/cartRules.ts';
import { isValidIndianPhone, isValidIndianPincode, generateOrderId } from '../utils/orderRules.ts';
import { ShoeSilhouette } from './ShoeSilhouette.tsx';
import { STORE_INFO } from '../config/storeInfo.ts';

interface CheckoutViewProps {
  items: CartItem[];
  fulfilmentType: FulfilmentType;
  couponCode: string;
  onBackToCart: () => void;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  fulfilmentType: initialFulfilment,
  couponCode,
  onBackToCart,
  onOrderComplete
}) => {
  const [fulfilmentType, setFulfilmentType] = useState<FulfilmentType>(initialFulfilment);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay-at-store');

  const [form, setForm] = useState<OrderCustomer>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    locality: '',
    city: 'Kanelwan',
    state: 'Jammu & Kashmir',
    pincode: '192124',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totals = calculateCartTotals(items, fulfilmentType, couponCode);

  const handleInputChange = (field: keyof OrderCustomer, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full legal name.';
    }

    if (!isValidIndianPhone(form.phone)) {
      errs.phone = 'Please provide a valid 10-digit Indian mobile number.';
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please provide a valid email format.';
    }

    if (fulfilmentType !== 'store-pickup') {
      if (!form.address?.trim() || form.address.trim().length < 5) {
        errs.address = 'Please provide your street or house address.';
      }
      if (!form.locality?.trim()) {
        errs.locality = 'Please enter your town or locality.';
      }
      if (!isValidIndianPincode(form.pincode || '')) {
        errs.pincode = 'Please enter a valid 6-digit postal PIN code.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Realistic processing latency simulation
    setTimeout(() => {
      const orderId = generateOrderId();
      const orderDate = new Date().toISOString();

      const newOrder: Order = {
        id: orderId,
        createdAt: orderDate,
        customer: form,
        items,
        fulfilmentType,
        fulfilmentFee: totals.fulfilmentFee,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        discountCode: totals.discountCode,
        taxAmount: totals.taxAmount,
        totalAmount: totals.totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'online-upi-card' ? 'Paid' : 'Pay on Pickup/Delivery',
        status: 'Confirmed',
        timeline: [
          {
            status: 'Confirmed',
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            note: 'Order placed and verified by Wani Footwear system.'
          }
        ]
      };

      setIsSubmitting(false);
      onOrderComplete(newOrder);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <button
        type="button"
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-500 hover:text-black mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Shopping Bag</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-zinc-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Complete your order with Wani Footwear, Kanelwan, Jammu & Kashmir.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Fulfilment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#171717] text-[#F5F000] font-mono text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-lg font-bold font-display text-zinc-900">
                Choose Fulfilment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFulfilmentType('store-pickup');
                  setPaymentMethod('pay-at-store');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  fulfilmentType === 'store-pickup'
                    ? 'border-[#171717] bg-zinc-900 text-white ring-2 ring-black'
                    : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                }`}
              >
                <Store className="w-5 h-5 text-[#F5F000] mb-2" />
                <div className="text-sm font-bold">Store Pickup</div>
                <div className="text-xs text-zinc-400 font-mono mt-1">Kanelwan Store (FREE)</div>
                <div className="text-[11px] text-[#F5F000] mt-2">Ready in 2 hours</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFulfilmentType('local-delivery');
                  if (paymentMethod === 'pay-at-store') setPaymentMethod('cod');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  fulfilmentType === 'local-delivery'
                    ? 'border-[#171717] bg-zinc-900 text-white ring-2 ring-black'
                    : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                }`}
              >
                <Truck className="w-5 h-5 text-[#F5F000] mb-2" />
                <div className="text-sm font-bold">Local Delivery</div>
                <div className="text-xs text-zinc-400 font-mono mt-1">Across Kashmir Valley</div>
                <div className="text-[11px] text-[#F5F000] mt-2">
                  {totals.subtotal >= 999 ? 'FREE Delivery' : '₹49 fee'}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFulfilmentType('pan-india-shipping');
                  if (paymentMethod === 'pay-at-store') setPaymentMethod('cod');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  fulfilmentType === 'pan-india-shipping'
                    ? 'border-[#171717] bg-zinc-900 text-white ring-2 ring-black'
                    : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                }`}
              >
                <Truck className="w-5 h-5 text-[#F5F000] mb-2" />
                <div className="text-sm font-bold">Pan-India Courier</div>
                <div className="text-xs text-zinc-400 font-mono mt-1">Express Delivery</div>
                <div className="text-[11px] text-[#F5F000] mt-2">
                  {totals.subtotal >= 1499 ? 'FREE Shipping' : '₹99 fee'}
                </div>
              </button>
            </div>

            {fulfilmentType === 'store-pickup' && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Pickup Location:</span>
                <span>Wani Footwear, Main Market, Kanelwan, Jammu & Kashmir (Open 8:00 AM – 8:00 PM Daily).</span>
                <span className="block text-amber-700">Owner Bilal Ahmed Wani will pack and reserve your pair upon confirmation.</span>
              </div>
            )}
          </div>

          {/* Step 2: Customer Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#171717] text-[#F5F000] font-mono text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-lg font-bold font-display text-zinc-900">
                Customer Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Ahmad"
                  value={form.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                    errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                  Mobile Number (India) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9419012345"
                  value={form.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono ${
                    errors.phone ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                  Email Address (Optional, for digital invoice)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                    errors.email ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Address fields only for delivery */}
            {fulfilmentType !== 'store-pickup' && (
              <div className="pt-4 border-t border-zinc-100 space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                  Delivery Address
                </h3>

                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                    Street Address / House No. *
                  </label>
                  <input
                    type="text"
                    placeholder="House, street, or landmark"
                    value={form.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                      errors.address ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                    }`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                      Locality / Town *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kanelwan / Anantnag"
                      value={form.locality}
                      onChange={(e) => handleInputChange('locality', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                        errors.locality ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                      }`}
                    />
                    {errors.locality && <p className="text-xs text-red-500 mt-1">{errors.locality}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="192124"
                      value={form.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono ${
                        errors.pincode ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                      }`}
                    />
                    {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                Order Notes / Sizing Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Special notes for Bilal Ahmed Wani or delivery driver..."
                value={form.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:bg-white"
              />
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#171717] text-[#F5F000] font-mono text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-lg font-bold font-display text-zinc-900">
                Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {fulfilmentType === 'store-pickup' ? (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pay-at-store')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'pay-at-store'
                      ? 'border-[#171717] bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#F5F000] mb-2" />
                  <div className="text-sm font-bold">Pay at Store Pickup</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Pay in cash or UPI when picking up</div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#171717] bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#F5F000] mb-2" />
                  <div className="text-sm font-bold">Cash on Delivery (COD)</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Pay upon inspection at doorstep</div>
                </button>
              )}

              <button
                type="button"
                onClick={() => setPaymentMethod('online-upi-card')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'online-upi-card'
                    ? 'border-[#171717] bg-zinc-900 text-white'
                    : 'border-zinc-200 bg-zinc-50 text-zinc-800'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#F5F000] mb-2" />
                <div className="text-sm font-bold">Online UPI / Card / NetBanking</div>
                <div className="text-xs text-zinc-400 mt-0.5">Instant gateway verification</div>
              </button>
            </div>

            {paymentMethod === 'online-upi-card' && (
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Official 256-bit encrypted gateway integration. Supports Google Pay, PhonePe, Paytm, and RuPay/Visa cards.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Column (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/90 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-display text-zinc-900 pb-3 border-b border-zinc-100">
            Order Summary ({totals.itemCount} items)
          </h2>

          {/* Items preview */}
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-zinc-100 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                        const fallback = (e.currentTarget.parentElement as HTMLElement)?.querySelector('.checkout-fallback');
                        if (fallback) (fallback as HTMLElement).style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full ${item.product.images && item.product.images.length > 0 ? 'checkout-fallback hidden' : 'block'}`}>
                    <ShoeSilhouette category={item.product.category} accentColor="#F5F000" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900 truncate font-display">{item.product.name}</h4>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    Qty: {item.quantity} · Size: {item.selectedSize}
                  </div>
                </div>
                <div className="text-xs font-bold font-mono tabular-nums text-zinc-900">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-2 pt-3 border-t border-zinc-100 text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums font-semibold">₹{totals.subtotal.toLocaleString('en-IN')}</span>
            </div>

            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon ({totals.discountCode})</span>
                <span className="font-mono tabular-nums">-₹{totals.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Fulfilment Fee</span>
              <span className="font-mono tabular-nums font-semibold">
                {totals.fulfilmentFee === 0 ? 'FREE' : `₹${totals.fulfilmentFee}`}
              </span>
            </div>

            <div className="flex justify-between text-zinc-400">
              <span>Included Footwear GST (12%)</span>
              <span className="font-mono tabular-nums">₹{totals.taxAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-zinc-900 pt-3 border-t border-zinc-200">
              <span>Final Total</span>
              <span className="font-mono tabular-nums text-2xl text-[#171717]">
                ₹{totals.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] ${
              isSubmitting
                ? 'bg-zinc-400 text-white cursor-wait'
                : 'bg-[#171717] hover:bg-black text-[#F5F000]'
            }`}
          >
            {isSubmitting ? (
              <span>Verifying and Confirming Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#F5F000]" />
                <span>Confirm Order — ₹{totals.totalAmount.toLocaleString('en-IN')}</span>
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-zinc-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed order directly from Wani Footwear Kanelwan</span>
          </div>
        </div>
      </form>
    </div>
  );
};
