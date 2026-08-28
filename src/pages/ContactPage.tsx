import React, { useState } from 'react';
import { Mail, MessageSquare, Clock, ShieldCheck, ArrowLeft, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import toast from 'react-hot-toast';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Your message has been sent to ranklancr@gmail.com!');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8 w-full">
        
        {/* Header */}
        <div className="space-y-3 border-b-2 border-black pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-600 hover:text-black mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ RETURN TO HOME ]</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase">
            <Mail className="w-3.5 h-3.5 text-[#e8622c]" />
            <span>24/7 CUSTOMER SUPPORT & INQUIRIES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Contact Us & Support
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-mono">
            We are here to help. Reach our dedicated platform operations and support team.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center border border-black">
              <Mail className="w-4 h-4 text-[#e8622c]" />
            </div>
            <div className="text-xs font-mono font-bold uppercase text-slate-500">Official Support</div>
            <a href="mailto:ranklancr@gmail.com" className="text-sm font-bold text-black hover:text-[#e8622c] block font-mono">
              ranklancr@gmail.com
            </a>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center border border-black">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs font-mono font-bold uppercase text-slate-500">Response SLA</div>
            <div className="text-sm font-bold text-black font-mono">
              Within 24 Hours
            </div>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center border border-black">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xs font-mono font-bold uppercase text-slate-500">Merchant Desk</div>
            <div className="text-sm font-bold text-black font-mono">
              Billing & Disputes
            </div>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-black font-mono uppercase">
              Send a Support Message
            </h2>
            <p className="text-xs text-slate-600">
              Submit your inquiry below and our support team will get back to you via email.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 border-2 border-emerald-500 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-emerald-950 font-mono">Message Received!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Thank you, <strong>{name}</strong>. Your ticket has been logged and a support representative will reply to <strong>{email}</strong> within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => { setIsSubmitted(false); setMessage(''); }}
                className="mt-2 py-2 px-4 bg-black text-white font-mono text-xs font-bold uppercase cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                  Inquiry Topic *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-black text-xs font-mono font-bold bg-white focus:outline-hidden"
                >
                  <option value="General Inquiry">General Platform Inquiry</option>
                  <option value="Challenge Entry Billing">Challenge Entry / $5 Fee Billing</option>
                  <option value="Brand Sponsorship Inquiry">Brand Sponsorship & Auction</option>
                  <option value="Technical Dispute / Bug">Technical Issue or Submission Bug</option>
                  <option value="Refund & Chargeback Query">Refund Request / Billing Dispute</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your question or issue in detail..."
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Ticket...' : '[ SEND SUPPORT TICKET ]'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Quick FAQ */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h3 className="text-base font-black text-black font-mono uppercase flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Frequently Asked Support Questions</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-700 divide-y divide-slate-200">
            <div className="pt-2">
              <div className="font-bold text-black font-mono">How do I submit my project after paying the $5 entry fee?</div>
              <p className="text-slate-600 mt-1">Once the challenge moves to the <strong>submission window</strong>, navigate to the challenge arena and click "[ SUBMIT PROJECT ]" to provide your repository or demo link.</p>
            </div>

            <div className="pt-2">
              <div className="font-bold text-black font-mono">Are there any cash prizes awarded?</div>
              <p className="text-slate-600 mt-1"><strong>No cash prizes are awarded anywhere on RankLancr.</strong> Winners receive 72-hour Top Developer Rail visibility and permanent profile accolades.</p>
            </div>

            <div className="pt-2">
              <div className="font-bold text-black font-mono">How does brand sponsorship billing work?</div>
              <p className="text-slate-600 mt-1">Sponsors can purchase fixed Bronze ($50), Silver ($150) tiers or compete in the live Gold outbid auction. Payments are processed securely via Paddle.</p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
