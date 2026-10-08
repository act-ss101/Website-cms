/**
 * ContactPage — Contact form and information
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call an API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-gold text-sm font-medium mb-3">GET IN TOUCH</div>
            <h1 className="font-display text-5xl md:text-6xl text-cream font-semibold mb-6">Contact Us</h1>
            <p className="text-cream/70 text-lg max-w-2xl">We'd love to hear from you. Reach out for membership inquiries, reservations, or any questions.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="font-display text-2xl text-forest mb-6">Send a Message</h2>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="font-display text-xl text-forest mb-2">Message Sent!</h3>
                  <p className="text-warm-gray">Thank you for reaching out. We'll respond within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-forest mb-1">Full Name</label>
                      <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-forest text-sm" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest mb-1">Email</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-forest text-sm" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-forest mb-1">Phone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-forest text-sm" placeholder="+66 XX XXX XXXX" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-forest mb-1">Subject</label>
                      <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-forest text-sm">
                        <option value="">Select a subject</option>
                        <option value="membership">Membership Inquiry</option>
                        <option value="booking">Tee Time Booking</option>
                        <option value="dining">Dining Reservation</option>
                        <option value="events">Event Inquiry</option>
                        <option value="general">General Question</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest mb-1">Message</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-forest text-sm resize-none" placeholder="How can we help you?" />
                  </div>
                  <button type="submit" className="w-full md:w-auto px-8 py-3 bg-forest text-cream font-medium rounded-xl hover:bg-forest-light transition-colors flex items-center justify-center gap-2">
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl text-forest mb-6">Direct Contact</h2>
              <div className="space-y-6">
                <ContactInfo icon={<Phone size={20} />} title="Phone" lines={['+66 2 123 4567 (Main)', '+66 2 123 4568 (Reservations)', '+66 2 123 4569 (Membership)']} />
                <ContactInfo icon={<Mail size={20} />} title="Email" lines={['info@krungthepkreetha.co.th', 'membership@krungthepkreetha.co.th', 'reservations@krungthepkreetha.co.th']} />
                <ContactInfo icon={<MapPin size={20} />} title="Address" lines={['123 Krungthep Kreetha Road', 'Suan Luang, Bangkok 10250', 'Thailand']} />
                <ContactInfo icon={<Clock size={20} />} title="Office Hours" lines={['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday - Sunday: 8:00 AM - 4:00 PM']} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactInfo({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-medium text-forest mb-1">{title}</h4>
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-warm-gray">{line}</p>
        ))}
      </div>
    </div>
  );
}
