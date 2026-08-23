import React, { useState } from 'react';
import { X, Briefcase, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTalent } from '../../context/TalentContext';
import { useAuth } from '../../context/AuthContext';
import type { Professional, Service } from '../../types/talent';
import toast from 'react-hot-toast';

interface HireRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional;
  service?: Service;
}

export const HireRequestModal: React.FC<HireRequestModalProps> = ({
  isOpen,
  onClose,
  professional,
  service
}) => {
  const { sendServiceRequest } = useTalent();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(service ? `$${service.startingPrice * 5}` : `$${professional.hourlyRate * 20}`);
  const [deadline, setDeadline] = useState(service ? service.deliveryTime || '7 days' : '14 days');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      sendServiceRequest({
        serviceId: service?.id,
        serviceTitle: service?.title || `Hire ${professional.title}`,
        providerId: professional.id,
        providerName: professional.name,
        buyerId: user?.id || `buyer-${Date.now()}`,
        buyerName: name,
        buyerEmail: email,
        projectDescription: description,
        budget,
        deadline
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-black text-white p-5 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#e8622c] text-white">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-orange-400 font-bold uppercase block">
                DIRECT CLIENT HIRE REQUEST // 0% FEE
              </span>
              <h3 className="text-base font-black text-white">
                Hire {professional.name}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-white border border-white/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 border-2 border-black flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-black text-black">Hire Request Sent!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Your project scope and budget details have been delivered directly to <strong>{professional.name}</strong>.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer"
              >
                [ DONE ]
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Selected Target Summary */}
              <div className="p-3 bg-orange-50/60 border border-[#e8622c]/40 flex items-center gap-3">
                <img
                  src={professional.avatar}
                  alt={professional.name}
                  className="w-10 h-10 border border-black object-cover bg-orange-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-black truncate">{service ? service.title : professional.title}</div>
                  <div className="text-[10px] font-mono text-slate-500">
                    Provider: {professional.name} • {service ? `$${service.startingPrice} starting` : `$${professional.hourlyRate}/hr`}
                  </div>
                </div>
              </div>

              {/* Sender Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold font-mono uppercase text-black mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    className="w-full p-2 bg-slate-50 border-2 border-black text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold font-mono uppercase text-black mb-1">Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full p-2 bg-slate-50 border-2 border-black text-xs font-medium"
                  />
                </div>
              </div>

              {/* Project Scope Description */}
              <div>
                <label className="block text-[11px] font-bold font-mono uppercase text-black mb-1">Project Description & Requirements</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe your technical requirements, deliverables, goals, and existing stack..."
                  required
                  className="w-full p-2 bg-slate-50 border-2 border-black text-xs font-medium"
                />
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold font-mono uppercase text-black mb-1">Estimated Budget</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="$500 - $1,500"
                      required
                      className="w-full p-2 bg-slate-50 border-2 border-black text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold font-mono uppercase text-black mb-1">Target Deadline</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. 7 days"
                    required
                    className="w-full p-2 bg-slate-50 border-2 border-black text-xs font-bold"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                {isSubmitting ? (
                  <span>SENDING HIRE REQUEST...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>[ SEND HIRE REQUEST (0% COMMISSION) ]</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>NO MIDDLEMAN FEES • DIRECT COMMUNICATION</span>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
