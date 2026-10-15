import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { STORE_INFO } from '../config/storeInfo.ts';

export const ContactView: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    contactInfo: '', // Phone or email
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = 'Please enter your name.';
    }
    if (!form.contactInfo.trim()) {
      errs.contactInfo = 'Please provide a valid phone number or email address.';
    }
    if (!form.subject.trim()) {
      errs.subject = 'Please specify a subject for your inquiry.';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      errs.message = 'Please provide a message of at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setForm({ name: '', contactInfo: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[#171717] bg-[#F5F000] px-3 py-1 rounded-full font-bold">
          Store & Contact Information
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-zinc-900 tracking-tight">
          Visit Wani Footwear
        </h1>
        <p className="text-sm sm:text-base text-zinc-600">
          Located in Main Market Kanelwan, Jammu & Kashmir. Open every day from 8:00 AM to 8:00 PM.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info & Map (6 cols) */}
        <div className="lg:col-span-6 space-y-8">
          {/* Store Info Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/90 shadow-sm space-y-6">
            <h2 className="text-xl font-bold font-display text-zinc-900">
              Kanelwan Store Details
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F5F000] fill-black shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900 block font-display">Store Address</span>
                  <span className="text-zinc-600">{STORE_INFO.location.address}</span>
                  <span className="text-zinc-500 block text-xs">
                    {STORE_INFO.location.locality}, {STORE_INFO.location.region} - {STORE_INFO.location.postalCode}, India
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#F5F000] fill-black shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900 block font-display">Store Hours</span>
                  <span className="text-zinc-600 font-semibold">{STORE_INFO.hours.display}</span>
                  <span className="text-zinc-500 block text-xs">{STORE_INFO.hours.days} (No weekly closing)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#F5F000] fill-black shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900 block font-display">Telephone & WhatsApp</span>
                  <a
                    href={`tel:${STORE_INFO.contact.phone}`}
                    className="text-zinc-900 font-mono font-bold hover:underline block"
                  >
                    {STORE_INFO.contact.displayPhone}
                  </a>
                  <a
                    href={STORE_INFO.contact.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 text-xs font-semibold flex items-center gap-1 mt-0.5 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat with Bilal Ahmed Wani on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#F5F000] fill-black shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900 block font-display">Direct Inquiries</span>
                  <a
                    href={`mailto:${STORE_INFO.contact.email}`}
                    className="text-zinc-700 hover:text-black font-mono text-xs hover:underline block"
                  >
                    {STORE_INFO.contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Directions CTA */}
            <div className="pt-4 border-t border-zinc-100 flex flex-wrap gap-3">
              <a
                href={STORE_INFO.location.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-[#171717] hover:bg-black text-[#F5F000] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors inline-flex items-center gap-2 font-display"
              >
                <span>Get Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${STORE_INFO.contact.phone}`}
                className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors inline-flex items-center gap-2 font-display"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Shop</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="bg-white rounded-3xl overflow-hidden border border-zinc-200/90 shadow-sm">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Kanelwan, Jammu & Kashmir</span>
              <span className="text-emerald-600 font-bold">Open Today 8:00 AM – 8:00 PM</span>
            </div>
            <div className="w-full h-64 bg-zinc-200">
              <iframe
                title="Wani Footwear Kanelwan Location Map"
                src={STORE_INFO.location.embedMapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-zinc-900">
              Send a Message to Bilal Ahmed Wani
            </h2>
            <p className="text-xs text-zinc-500">
              Ask about shoe availability, custom size orders, school bulk orders, or Kanelwan store pickup.
            </p>
          </div>

          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Thank you! Your message has been received by Wani Footwear. We will respond promptly by phone or email.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Tariq Ahmad"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                  errors.name ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                Mobile Number or Email *
              </label>
              <input
                type="text"
                placeholder="e.g. 9419012345 or your.email@example.com"
                value={form.contactInfo}
                onChange={(e) => {
                  setForm({ ...form, contactInfo: e.target.value });
                  if (errors.contactInfo) setErrors({ ...errors, contactInfo: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                  errors.contactInfo ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                }`}
              />
              {errors.contactInfo && <p className="text-xs text-red-500 mt-1">{errors.contactInfo}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                Subject *
              </label>
              <input
                type="text"
                placeholder="e.g. Size availability for Wani Velocity Pro Runner"
                value={form.subject}
                onChange={(e) => {
                  setForm({ ...form, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                  errors.subject ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                }`}
              />
              {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                Your Message *
              </label>
              <textarea
                rows={4}
                placeholder="Write your footwear question or special request here..."
                value={form.message}
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: '' });
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                  errors.message ? 'border-red-500 bg-red-50/30' : 'border-zinc-200 bg-zinc-50 focus:bg-white'
                }`}
              />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSubmitting
                  ? 'bg-zinc-300 text-zinc-500 cursor-wait'
                  : 'bg-[#171717] hover:bg-black text-[#F5F000]'
              }`}
            >
              {isSubmitting ? (
                <span>Delivering Message...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message to Shop</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
