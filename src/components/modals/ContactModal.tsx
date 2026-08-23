import React, { useState } from 'react';
import { X, Send, Mail, User, DollarSign, CheckCircle2 } from 'lucide-react';
import { useTalent } from '../../context/TalentContext';
import type { Professional } from '../../types/talent';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, professional }) => {
  const { sendInquiry } = useTalent();
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('$1,000 - $3,000');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !professional) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !subject || !message) return;

    sendInquiry({
      professionalId: professional.id,
      professionalName: professional.name,
      clientName,
      clientEmail,
      subject,
      message,
      budget
    });

    setIsSent(true);
  };

  const handleClose = () => {
    setIsSent(false);
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={professional.avatar}
              alt={professional.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
            />
            <div>
              <h3 className="text-xl font-bold text-white">Contact {professional.name}</h3>
              <p className="text-slate-300 text-xs">{professional.title} • {professional.location}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isSent ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-slate-900">Message Sent!</h4>
              <p className="text-slate-600 text-sm mt-2">
                Your inquiry has been delivered directly to <span className="font-semibold text-slate-900">{professional.name}</span>. They typically respond within a few hours.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Your Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Project Consultation"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Approx. Budget</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option>&lt; $1,000</option>
                    <option>$1,000 - $3,000</option>
                    <option>$3,000 - $10,000</option>
                    <option>$10,000+</option>
                    <option>Hourly / Negotiable</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Project Details & Requirements</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your project goals, scope, timeline, and any specific technologies needed..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send Direct Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
