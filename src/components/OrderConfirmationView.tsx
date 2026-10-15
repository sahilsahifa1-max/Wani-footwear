import React from 'react';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  Store,
  Truck,
  MapPin,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Order } from '../types/index.ts';
import { ShoeSilhouette } from './ShoeSilhouette.tsx';
import { STORE_INFO } from '../config/storeInfo.ts';

interface OrderConfirmationViewProps {
  order: Order;
  onContinueShopping: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onContinueShopping,
  onTrackOrder
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 rounded-full bg-[#171717] text-[#F5F000] flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-[#171717] font-semibold bg-[#F5F000] px-3 py-1 rounded-full inline-block">
          Order Verified & Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-zinc-900">
          Thank You, {order.customer.fullName}
        </h1>
        <p className="text-sm text-zinc-600 max-w-lg mx-auto">
          Your order has been recorded in our store ledger. Owner Bilal Ahmed Wani and our Kanelwan team are preparing your footwear.
        </p>
      </div>

      {/* Main Order Receipt Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Receipt Header Strip */}
        <div className="bg-[#171717] text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#F5F000] uppercase tracking-wider">
              Official Wani Footwear Receipt
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight mt-1">
              {order.id}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Key details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block font-mono">Date Placed</span>
              <span className="font-semibold text-zinc-900 mt-0.5 block">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            <div>
              <span className="text-zinc-400 block font-mono">Fulfilment</span>
              <span className="font-semibold text-zinc-900 mt-0.5 block capitalize">
                {order.fulfilmentType.replace('-', ' ')}
              </span>
            </div>

            <div>
              <span className="text-zinc-400 block font-mono">Payment Mode</span>
              <span className="font-semibold text-zinc-900 mt-0.5 block">
                {order.paymentMethod === 'online-upi-card' ? 'Online UPI/Card' : 'Pay on Delivery / Pickup'}
              </span>
            </div>

            <div>
              <span className="text-zinc-400 block font-mono">Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono inline-block mt-0.5">
                {order.status}
              </span>
            </div>
          </div>

          {/* Customer & Destination Summary */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-zinc-900 uppercase tracking-wider block mb-1">
                Customer Information
              </span>
              <p className="font-semibold">{order.customer.fullName}</p>
              <p className="font-mono text-zinc-600">Phone: {order.customer.phone}</p>
              {order.customer.email && <p className="text-zinc-500">Email: {order.customer.email}</p>}
            </div>

            <div>
              <span className="font-bold text-zinc-900 uppercase tracking-wider block mb-1">
                {order.fulfilmentType === 'store-pickup' ? 'Pickup Store' : 'Delivery Address'}
              </span>
              {order.fulfilmentType === 'store-pickup' ? (
                <div>
                  <p className="font-semibold">Wani Footwear</p>
                  <p className="text-zinc-600">Main Market Kanelwan, Jammu & Kashmir (192124)</p>
                  <p className="text-[#171717] font-semibold mt-1">Open 8:00 AM – 8:00 PM</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold">{order.customer.address}</p>
                  <p className="text-zinc-600">{order.customer.locality}, {order.customer.state} - {order.customer.pincode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Items Ordered
            </h3>
            <div className="divide-y divide-zinc-100 border-y border-zinc-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                            const fallback = (e.currentTarget.parentElement as HTMLElement)?.querySelector('.receipt-fallback');
                            if (fallback) (fallback as HTMLElement).style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full ${item.product.images && item.product.images.length > 0 ? 'receipt-fallback hidden' : 'block'}`}>
                        <ShoeSilhouette category={item.product.category} accentColor="#F5F000" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 font-display">{item.product.name}</h4>
                      <div className="text-xs text-zinc-500 font-mono">
                        Size: {item.selectedSize} · Color: {item.selectedColor} · Qty: {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-bold font-mono tabular-nums text-zinc-900">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-2 text-xs text-zinc-600 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({order.discountCode})</span>
                <span className="font-mono tabular-nums">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Fulfilment Fee</span>
              <span className="font-mono tabular-nums">
                {order.fulfilmentFee === 0 ? 'FREE' : `₹${order.fulfilmentFee}`}
              </span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>GST 12% (Footwear standard, included)</span>
              <span className="font-mono tabular-nums">₹{order.taxAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-zinc-900 pt-2 border-t border-zinc-200">
              <span>Total Paid / Payable</span>
              <span className="font-mono tabular-nums text-xl text-[#171717]">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            type="button"
            onClick={onContinueShopping}
            className="px-6 py-3 bg-zinc-900 text-[#F5F000] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition-colors cursor-pointer font-display"
          >
            Continue Shopping
          </button>

          <button
            type="button"
            onClick={() => onTrackOrder(order.id)}
            className="px-6 py-3 bg-white border border-zinc-300 text-zinc-800 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer font-display flex items-center gap-1.5"
          >
            <span>Live Order Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
