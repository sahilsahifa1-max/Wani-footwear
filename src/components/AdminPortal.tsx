import React, { useState } from 'react';
import {
  X,
  Package,
  ShoppingCart,
  Settings,
  Plus,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types/index.ts';
import { canTransitionOrderStatus } from '../utils/orderRules.ts';
import { STORE_INFO } from '../config/storeInfo.ts';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onUpdateProduct,
  onAddProduct,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'store'>('orders');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  if (!isOpen) return null;

  const handleToggleStock = (product: Product) => {
    onUpdateProduct({
      ...product,
      inStock: !product.inStock,
      stockCount: !product.inStock ? 15 : 0
    });
  };

  const handlePriceChange = (product: Product, newPrice: number) => {
    if (newPrice > 0) {
      onUpdateProduct({
        ...product,
        price: newPrice
      });
    }
  };

  const handleStatusChange = (orderId: string, current: OrderStatus, next: OrderStatus) => {
    if (canTransitionOrderStatus(current, next)) {
      onUpdateOrderStatus(orderId, next);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#F7F7F2] rounded-3xl overflow-hidden shadow-2xl border border-zinc-300 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#171717] text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#F5F000] text-[#171717] font-bold text-xs flex items-center justify-center font-display">
              VF
            </span>
            <div>
              <h2 id="admin-title" className="text-lg font-bold font-display text-white">
                Vani Footwear — Store Management Portal
              </h2>
              <div className="text-xs text-zinc-400 font-mono">
                Store Owner: Bilal Ahmed Vani · Kanewan, J&K
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-white border-b border-zinc-200 flex items-center gap-6 text-xs font-semibold uppercase tracking-wider font-display">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders' ? 'border-[#171717] text-[#171717] font-bold' : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-[#F5F000] fill-black" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'inventory' ? 'border-[#171717] text-[#171717] font-bold' : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            <Package className="w-4 h-4 text-[#F5F000] fill-black" />
            <span>Product Inventory ({products.length} Styles)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'store' ? 'border-[#171717] text-[#171717] font-bold' : 'border-transparent text-zinc-500 hover:text-black'
            }`}
          >
            <Settings className="w-4 h-4 text-[#F5F000] fill-black" />
            <span>Store Settings & Hours</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-zinc-500">
                  Real-Time Orders Feed
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Update customer statuses directly
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-2xl border border-zinc-200">
                  <p className="text-sm text-zinc-500">No orders placed in this session yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                  {orders.map((order) => (
                    <div key={order.id} className="p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold font-mono text-zinc-900">{order.id}</span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                              {order.fulfilmentType.replace('-', ' ')}
                            </span>
                            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                              {order.status}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">
                            Customer: <strong className="text-zinc-800">{order.customer.fullName}</strong> · Phone: {order.customer.phone}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-bold font-mono text-zinc-900 tabular-nums">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-zinc-400 font-mono">
                            {order.items.length} footwear pair(s)
                          </div>
                        </div>
                      </div>

                      {/* Status advancement buttons */}
                      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-zinc-500 font-mono">Update status:</span>
                        {(['Confirmed', 'Processing', 'Ready for pickup', 'Shipped', 'Delivered'] as OrderStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(order.id, order.status, st)}
                            className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-colors cursor-pointer ${
                              order.status === st
                                ? 'bg-[#171717] text-[#F5F000]'
                                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INVENTORY & PRICING */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-zinc-500">
                  Live Footwear Inventory Control
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  Toggle stock status or modify price in INR
                </span>
              </div>

              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                {products.map((p) => (
                  <div key={p.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-[240px]">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-zinc-900 font-display">{p.name}</h4>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 uppercase">
                          {p.audience}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">
                        Sizes: {p.sizes.join(', ')} · Stock: {p.stockCount} pairs
                      </div>
                    </div>

                    {/* Price edit */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-500">₹</span>
                      <input
                        type="number"
                        defaultValue={p.price}
                        onBlur={(e) => handlePriceChange(p, Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono font-bold"
                        title="Edit price"
                      />
                    </div>

                    {/* Stock availability toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleStock(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                        p.inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STORE SETTINGS */}
          {activeTab === 'store' && (
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-6">
              <h3 className="text-base font-bold font-display text-zinc-900">
                Kanewan Store Identity & Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-zinc-50 rounded-xl">
                  <span className="text-zinc-400 block">Owner Name</span>
                  <span className="font-bold text-zinc-900 text-sm mt-1 block">{STORE_INFO.ownerName}</span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl">
                  <span className="text-zinc-400 block">Location</span>
                  <span className="font-bold text-zinc-900 text-sm mt-1 block">{STORE_INFO.location.displayLocation}</span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl">
                  <span className="text-zinc-400 block">Opening Timings</span>
                  <span className="font-bold text-zinc-900 text-sm mt-1 block">{STORE_INFO.hours.display}</span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl">
                  <span className="text-zinc-400 block">Helpline & WhatsApp</span>
                  <span className="font-bold text-zinc-900 text-sm mt-1 block">{STORE_INFO.contact.displayPhone}</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1 font-sans">
                <span className="font-bold block">About Page Image Configuration:</span>
                <p>
                  To change photos on the About Us page, add your image URLs into <code className="font-mono text-zinc-900 bg-white/70 px-1 rounded">src/config/aboutImages.ts</code> for <code className="font-mono">ownerPortrait</code>, <code className="font-mono">storefront</code>, and <code className="font-mono">interior</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
