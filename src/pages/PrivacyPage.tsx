import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Mail, Globe, Database, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';

export const PrivacyPage: React.FC = () => {
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
            <Lock className="w-3.5 h-3.5 text-[#e8622c]" />
            <span>LEGAL & DATA PROTECTION COMPLIANCE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-mono">
            Last Updated: August 25, 2026 • Effective Immediately for RankLancr.lol
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 leading-relaxed text-xs sm:text-sm text-slate-700">
          <p>
            Welcome to <strong>RankLancr</strong> (operated at <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 border border-slate-300">https://ranklancr.lol</code>). We are committed to protecting your personal information and your right to privacy.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, participate in skill challenges, purchase brand sponsorships, or use our Outbid Spotlight advertising services.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h2 className="text-base sm:text-lg font-black text-black font-mono uppercase flex items-center gap-2">
            <Database className="w-4 h-4 text-[#e8622c]" />
            <span>1. Information We Collect</span>
          </h2>
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              <strong>A. Personal Information Provided by You:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Account & Identity Data:</strong> Full name, email address, profile photo, and headline provided during registration or via Google OAuth.</li>
              <li><strong>Project Submissions:</strong> Project repository URLs, demo links, descriptions, and timestamps submitted for challenge evaluations.</li>
              <li><strong>Company & Sponsor Details:</strong> Brand name, company logo URL, and destination website link provided when sponsoring a challenge.</li>
            </ul>

            <p className="pt-2">
              <strong>B. Payment & Financial Data (Paddle Tokenization):</strong>
            </p>
            <p className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs">
              <strong>Merchant of Record & Zero Card Storage:</strong> All payment transactions (challenge entry fees, sponsorships, spotlight bids) are processed securely through our Merchant of Record <strong>Paddle.com</strong> (Paddle Payments) under PCI-DSS Level 1 compliance. <strong>RankLancr never stores, views, or logs your raw credit card numbers or banking credentials.</strong>
            </p>

            <p className="pt-2">
              <strong>C. Automated Anti-Fraud Telemetry:</strong>
            </p>
            <p className="text-slate-600">
              To enforce vote fairness and rate-limiting on challenges, our servers record anonymized IP hashes, browser fingerprints, and timestamps. These are used solely for anti-collusion detection and are never sold to advertisers.
            </p>
          </div>
        </div>

        {/* Section 2: How We Use Your Information */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <h2 className="text-base sm:text-lg font-black text-black font-mono uppercase flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>2. How We Use Your Information</span>
          </h2>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 leading-relaxed">
            <li>To operate, maintain, and publish skill challenge leaderboards and Top Developer rail placements.</li>
            <li>To process your $5.00 entry fee payments and deliver digital submission access.</li>
            <li>To verify voter integrity and prevent bot manipulation using rate-limiting algorithms.</li>
            <li>To display verified brand sponsor logos on challenge arenas and promotional rails.</li>
            <li>To respond to customer support inquiries and dispute resolutions within 24-48 hours.</li>
          </ul>
        </div>

        {/* Section 3: Third-Party Service Providers */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h2 className="text-base sm:text-lg font-black text-black font-mono uppercase flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-600" />
            <span>3. Third-Party Service Providers</span>
          </h2>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>We only share data with vetted infrastructure providers essential to our platform operations:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono">
              <div className="p-3 bg-slate-50 border border-slate-200">
                <strong>Lemon Squeezy Inc.</strong>
                <div className="text-[11px] text-slate-500 mt-1">Merchant of Record & Payments</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200">
                <strong>Supabase & PostgreSQL</strong>
                <div className="text-[11px] text-slate-500 mt-1">Encrypted Database Storage</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200">
                <strong>Google Identity</strong>
                <div className="text-[11px] text-slate-500 mt-1">OAuth 2.0 Authentication</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Data Retention & User Rights (GDPR / CCPA) */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <h2 className="text-base sm:text-lg font-black text-black font-mono uppercase flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <span>4. Your Privacy Rights (GDPR & CCPA)</span>
          </h2>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>Depending on your location, you hold the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
              <li><strong>Right to Access:</strong> You may request a copy of the personal information we hold on your account.</li>
              <li><strong>Right to Rectification:</strong> You can update your display name, title, and bio directly in your profile settings.</li>
              <li><strong>Right to Deletion (Right to be Forgotten):</strong> You may request full deletion of your profile, submissions, and account records by emailing <code className="bg-slate-100 px-1 font-mono">ranklanrc@gmail.com</code>.</li>
            </ul>
          </div>
        </div>

        {/* Section 5: Contact Our Privacy Team */}
        <div className="bg-orange-50 border-2 border-black p-6 shadow-[4px_4px_0px_0px_#e8622c] space-y-2">
          <h2 className="text-base font-black text-black font-mono uppercase flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#e8622c]" />
            <span>5. Contact Our Privacy & Data Protection Officer</span>
          </h2>
          <p className="text-xs text-slate-700">
            For privacy inquiries, data deletion requests, or compliance questions:
          </p>
          <div className="font-mono text-xs font-bold text-black pt-1">
            Official Email: <a href="mailto:ranklanrc@gmail.com" className="text-[#e8622c] underline">ranklanrc@gmail.com</a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
