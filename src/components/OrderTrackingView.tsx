import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, PackageCheck, Truck, Store, MapPin, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types/index.ts';
import { STORE_INFO } from '../config/storeInfo.ts';

interface OrderTrackingViewProps {
  orders: Order[];
  initialOrderId?: string;
  onExploreMore: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  initialOrderId = '',
  onExploreMore
}) => {
  const [searchOrderId, setSearchOrderId] = useState(initialOrderId);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    initialOrderId ? orders.find((o) => o.id === initialOrderId) || null : null
  );
  const [searched, setSearched] = useState(Boolean(initialOrderId));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanId = searchOrderId.trim().toUpperCase();
    const cleanPhone = searchPhone.replace(/[\s\-\+]/g, '');

    const found = orders.find((o) => {
      const matchId = o.id.toUpperCase() === cleanId;
      if (!matchId) return false;
      if (cleanPhone) {
        return o.customer.phone.replace(/[\s\-\+]/g, '').includes(cleanPhone);
      }
      return true;
    });

    setSearchedOrder(found || null);
  };

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Confirmed', label: 'Order Confirmed', desc: 'Verified and queued in Kanelwan store' },
    { status: 'Processing', label: 'Packaging & Sizing Check', desc: 'Inspected by Bilal Ahmed Wani & team' },
    {
      status: searchedOrder?.fulfilmentType === 'store-pickup' ? 'Ready for pickup' : 'Shipped',
      label: searchedOrder?.fulfilmentType === 'store-pickup' ? 'Ready for Pickup' : 'Dispatched',
      desc: searchedOrder?.fulfilmentType === 'store-pickup' ? 'Waiting at Kanelwan Store (8 AM–8 PM)' : 'In transit'
    },
    { status: 'Delivered', label: 'Fulfilled / Delivered', desc: 'Received by customer' }
  ];

  const getStepStatus = (stepStatus: OrderStatus) => {
    if (!searchedOrder) return 'upcoming';
    const statusOrder: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Ready for pickup', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(searchedOrder.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex + 1 === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in duration-300">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-[#171717] font-semibold bg-[#F5F000] px-3 py-1 rounded-full inline-block">
          Live Store Tracker
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-zinc-900">
          Track Your Footwear Order
        </h1>
        <p className="text-sm text-zinc-600 max-w-md mx-auto">
          Enter your Order ID (e.g. VF-2026-XXXX) to track preparation, pickup, or delivery status.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/90 shadow-sm mb-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
              Order ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. VF-2026-8812"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 font-mono text-sm uppercase focus:bg-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="10-digit mobile"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 font-mono text-sm focus:bg-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#171717] hover:bg-black text-[#F5F000] font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 font-display"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </div>
        </form>

        {/* Quick demo order ID link if orders exist */}
        {orders.length > 0 && !searchedOrder && (
          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <span>Recent orders in this session:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchOrderId(o.id);
                  setSearchedOrder(o);
                  setSearched(true);
                }}
                className="text-[#171717] font-bold underline hover:text-black cursor-pointer"
              >
                {o.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results View */}
      {searched && (
        <>
          {searchedOrder ? (
            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm space-y-8 p-6 sm:p-8 animate-in fade-in">
              {/* Order Info Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200">
                <div>
                  <span className="text-xs font-mono text-zinc-500 uppercase">Order ID</span>
                  <div className="text-2xl font-bold font-mono text-zinc-900">{searchedOrder.id}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                    Status: {searchedOrder.status}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    Total: ₹{searchedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Visual Stepper */}
              <div className="py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                  {steps.map((st, i) => {
                    const status = getStepStatus(st.status);
                    const isCompleted = status === 'completed';
                    const isCurrent = status === 'current';

                    return (
                      <div key={st.label} className="relative flex flex-col items-center text-center space-y-2">
                        {/* Circle */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors z-10 ${
                            isCompleted
                              ? 'bg-[#171717] text-[#F5F000]'
                              : isCurrent
                              ? 'bg-[#F5F000] text-[#171717] ring-4 ring-yellow-200'
                              : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                        </div>

                        <div className="text-xs font-bold text-zinc-900 font-display">{st.label}</div>
                        <div className="text-[11px] text-zinc-500 max-w-[150px]">{st.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fulfilment note */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 flex items-start gap-3">
                <Store className="w-5 h-5 text-[#171717] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-zinc-900 block">Kanelwan Hub Update:</span>
                  <p>
                    {searchedOrder.fulfilmentType === 'store-pickup'
                      ? 'Your footwear is prepared at Wani Footwear, Main Market Kanelwan. You can visit any time between 8:00 AM and 8:00 PM.'
                      : 'Your shipment is coordinated from our Kanelwan facility. Inquiries: +91 94190 28419.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold font-display text-zinc-900">
                No Order Found for "{searchOrderId}"
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Please double-check your Order ID. If you placed the order recently, please allow a moment for store syncing.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
