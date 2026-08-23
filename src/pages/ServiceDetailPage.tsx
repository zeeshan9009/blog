import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  ArrowLeft,
  Heart,
  MessageSquare,
  Flame
} from 'lucide-react';
import { useTalent } from '../context/TalentContext';
import { HireRequestModal } from '../components/modals/HireRequestModal';
import { ContactModal } from '../components/modals/ContactModal';

export const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { services, professionals, savedProfessionals, toggleSaveProfessional } = useTalent();

  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Find target service
  const service = useMemo(() => {
    return services.find(s => s.id === serviceId) || services[0];
  }, [services, serviceId]);

  // Find provider profile
  const provider = useMemo(() => {
    return professionals.find(p => p.id === service?.providerId) || professionals[0];
  }, [professionals, service]);

  const isSaved = savedProfessionals.includes(provider.id);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="text-center bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-black text-black">Service Not Found</h2>
          <button
            onClick={() => navigate('/find-services')}
            className="mt-4 px-4 py-2 bg-black text-white font-mono text-xs font-bold"
          >
            [ BROWSE ALL SERVICES ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white pb-20">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 p-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-300 font-mono text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ BACK ]</span>
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black flex items-center justify-center text-white">
              <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-[#e8622c] ml-0.5" />
            </div>
            <span className="text-lg font-black tracking-tight text-black">
              ProRank<span className="text-[#e8622c]">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveProfessional(provider.id)}
              className={`p-2 border transition cursor-pointer ${
                isSaved ? 'bg-red-50 border-red-500 text-red-500' : 'bg-white border-slate-300 hover:border-black'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
            </button>

            <button
              onClick={() => setHireModalOpen(true)}
              className="px-4 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer shadow-[2px_2px_0px_0px_#e8622c]"
            >
              [ HIRE NOW ]
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
          <Link to="/find-services" className="hover:text-black">Services</Link>
          <span>/</span>
          <span className="text-[#e8622c] font-bold">{service.category}</span>
          <span>/</span>
          <span className="truncate max-w-xs">{service.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Service Details & Provider Showcase (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Badge */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {service.isPromoted && (
                  <span className="px-2.5 py-0.5 bg-[#e8622c] text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>SPONSORED SERVICE</span>
                  </span>
                )}
                <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold">
                  {service.category}
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-mono text-[10px] font-bold">
                  0% PLATFORM FEE
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight leading-tight">
                {service.title}
              </h1>

              {/* Provider Quick Info Header */}
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-10 h-10 border-2 border-black object-cover bg-orange-100 shrink-0"
                />
                <div>
                  <div className="font-bold text-sm text-black flex items-center gap-1.5">
                    <span>{provider.name}</span>
                    <ShieldCheck className="w-4 h-4 text-[#e8622c]" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {provider.title} • ⭐ {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
                  </div>
                </div>
              </div>
            </div>

            {/* Service Cover Preview */}
            <div className="aspect-[16/9] bg-slate-900 border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
              <img
                src={service.image || provider.gigImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/90 text-white font-mono text-xs font-bold border border-white/20">
                PRO SCORE: <span className="text-[#e8622c]">{provider.score}/100</span>
              </div>
            </div>

            {/* Service Description */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <h3 className="text-sm font-bold font-mono text-black uppercase tracking-wider">
                Service Description & Deliverables
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {service.description}
              </p>

              {/* Skills Tags */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold font-mono text-black uppercase mb-2">
                  Technologies & Skills Included
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {service.skills.map(s => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-300 font-mono text-xs font-bold text-black"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Work & Experience */}
            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <h3 className="text-sm font-bold font-mono text-black uppercase tracking-wider">
                About the Service Provider
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {provider.bio}
              </p>

              {provider.experience && provider.experience.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold font-mono text-black uppercase">Verified Experience</h4>
                  {provider.experience.map((exp, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-bold text-black">{exp.role}</div>
                      <div className="text-[11px] font-mono text-[#e8622c]">{exp.company} • {exp.period}</div>
                      <p className="text-slate-600 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Pricing Box & Direct Hire Card (4 Cols) */}
          <div className="lg:col-span-4 sticky top-20 space-y-5">
            
            {/* Pricing Box */}
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <span className="font-mono text-xs font-bold text-slate-500 uppercase">OFFER PRICING</span>
                <span className="px-2 py-0.5 bg-orange-100 text-[#e8622c] font-mono text-xs font-bold uppercase">
                  {service.priceType.replace('_', ' ')}
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-black">
                  ${service.startingPrice}
                  <span className="text-xs text-slate-500 font-normal font-mono ml-1">USD</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-600 font-bold mt-0.5">
                  0% COMMISSION • DIRECT CONTRACT
                </div>
              </div>

              <div className="space-y-2.5 py-2 border-y border-slate-200 text-xs font-mono text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#e8622c]" />
                    <span>Delivery Time</span>
                  </span>
                  <span className="font-bold text-black">{service.deliveryTime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>ProRank Score</span>
                  <span className="font-bold text-black">{provider.score}/100</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="font-bold text-black">{provider.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setHireModalOpen(true)}
                  className="w-full py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>[ SEND HIRE REQUEST ]</span>
                </button>

                <button
                  onClick={() => setContactModalOpen(true)}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 border-2 border-black font-mono text-xs font-bold text-black transition cursor-pointer"
                >
                  [ ASK A QUESTION ]
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 text-center text-[10px] font-mono text-slate-500">
                <span>🔒 SECURE INQUIRY • NO SUBSCRIPTION LOCK-IN</span>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Hire Modal */}
      {hireModalOpen && (
        <HireRequestModal
          isOpen={hireModalOpen}
          onClose={() => setHireModalOpen(false)}
          professional={provider}
          service={service}
        />
      )}

      {/* Contact Modal */}
      {contactModalOpen && (
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          professional={provider}
        />
      )}

    </div>
  );
};

export default ServiceDetailPage;
