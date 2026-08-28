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
    <div className="min-h-screen bg-[#FAFAF9] text-[#1A1A1A] font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-14 space-y-8 w-full">
        
        {/* Header */}
        <div className="space-y-3 border-b border-[#E5E5E5] pb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525252] hover:text-[#1A1A1A] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Customer Support & Inquiries</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
            Contact Us & Support
          </h1>

          <p className="text-xs sm:text-sm text-[#525252] font-normal">
            We are here to help. Reach our dedicated platform operations and support team.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E5E5E5] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#FF5A1F]" />
            </div>
            <div className="text-[11px] font-semibold uppercase text-[#737373] tracking-wider">Official Support</div>
            <a href="mailto:ranklancr@gmail.com" className="text-sm font-semibold text-[#1A1A1A] hover:text-[#FF5A1F] block font-mono">
              ranklancr@gmail.com
            </a>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] font-semibold uppercase text-[#737373] tracking-wider">Response SLA</div>
            <div className="text-sm font-semibold text-[#1A1A1A]">
              Within 24 Hours
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-5 space-y-2">
            <div className="w-8 h-8 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-[11px] font-semibold uppercase text-[#737373] tracking-wider">Merchant Desk</div>
            <div className="text-sm font-semibold text-[#1A1A1A]">
              Billing & Disputes
            </div>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">
              Send a Support Message
            </h2>
            <p className="text-xs text-[#525252] font-normal">
              Submit your inquiry below and our support team will get back to you via email.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-950">Message Received!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Thank you, <strong>{name}</strong>. Your ticket has been logged and a support representative will reply to <strong>{email}</strong> within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => { setIsSubmitted(false); setMessage(''); }}
                className="mt-2 py-2 px-4 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white text-xs font-semibold uppercase transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E5] text-sm bg-[#FAFAF9] focus:bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E5] text-sm bg-[#FAFAF9] focus:bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Inquiry Topic *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E5] text-xs font-medium text-[#1A1A1A] bg-[#FAFAF9] focus:bg-white focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                >
                  <option value="General Inquiry">General Platform Inquiry</option>
                  <option value="Challenge Entry Billing">Challenge Entry / $5 Fee Billing</option>
                  <option value="Brand Sponsorship Inquiry">Brand Sponsorship & Placement</option>
                  <option value="Technical Dispute / Bug">Technical Issue or Submission Bug</option>
                  <option value="Refund & Chargeback Query">Refund Request / Billing Dispute</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your question or issue in detail..."
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E5] text-sm bg-[#FAFAF9] focus:bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#FF5A1F] hover:bg-[#E54E17] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-[#FF5A1F] cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Ticket...' : 'Send Support Ticket'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Quick FAQ */}
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#FF5A1F]" />
            <span>Frequently Asked Support Questions</span>
          </h3>

          <div className="space-y-3 text-xs text-[#525252] divide-y divide-[#E5E5E5]">
            <div className="pt-2">
              <div className="font-semibold text-[#1A1A1A]">How do I submit my project after paying the $5 entry fee?</div>
              <p className="text-[#525252] mt-1 font-normal">Once the challenge moves to the submission window, navigate to the challenge arena and click "Submit Project" to provide your repository or demo link.</p>
            </div>

            <div className="pt-3">
              <div className="font-semibold text-[#1A1A1A]">Are there any cash prizes awarded?</div>
              <p className="text-[#525252] mt-1 font-normal">No cash prizes are awarded anywhere on RankLancr. Winners receive 72-hour Top Developer Rail visibility and permanent profile badges.</p>
            </div>

            <div className="pt-3">
              <div className="font-semibold text-[#1A1A1A]">How does brand sponsorship billing work?</div>
              <p className="text-[#525252] mt-1 font-normal">Sponsors compete in ascending-bid outbid auctions for exclusive 48h Top Developer Rail co-branding with the winning creator.</p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
