import { Routes, Route } from "react-router-dom";
import { TalentProvider } from "./context/TalentContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Pages
import PixelpushLanding from "./pages/PixelpushLanding";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import PromotedRankingPage from "./pages/PromotedRankingPage";
import { ChallengeArenaPage } from "./pages/ChallengeArenaPage";
import { ChallengeSubmissionPage } from "./pages/ChallengeSubmissionPage";
import { PublicVotingPage } from "./pages/PublicVotingPage";
import TermsPage from "./pages/TermsPage";
import AdminPage from "./pages/AdminPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import ContactPage from "./pages/ContactPage";
import PricingPage from "./pages/PricingPage";
import WelcomePage from "./pages/WelcomePage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const isDashboardSubdomain = typeof window !== 'undefined' && window.location.hostname.startsWith('dashboard.');

  return (
    <AuthProvider>
      <TalentProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Main Landing Page (or Direct Dashboard on dashboard. subdomain) */}
          <Route path="/" element={isDashboardSubdomain ? <DashboardPage /> : <PixelpushLanding />} />

          {/* Post-Checkout Welcome Confirmation */}
          <Route path="/welcome" element={<WelcomePage />} />

          {/* Dedicated Full Page Sign In & Register */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Admin Command Console */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Onboarding Role Selection */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Provider Profile Creator */}
          <Route path="/create-profile" element={<CreateProfilePage />} />

          {/* Unified Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/requests" element={<DashboardPage />} />
          <Route path="/dashboard/my-requests" element={<DashboardPage />} />
          <Route path="/dashboard/contacts" element={<DashboardPage />} />

          {/* Settings & Role Management */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Dedicated Outbid Spotlight Leaderboard */}
          <Route path="/spotlight" element={<PromotedRankingPage />} />
          <Route path="/promote" element={<PromotedRankingPage />} />
          <Route path="/promoted" element={<PromotedRankingPage />} />
          <Route path="/promoted-ranking" element={<PromotedRankingPage />} />
          <Route path="/boost" element={<PromotedRankingPage />} />

          {/* Challenge Arena, Direct Submission & Public Voting Routes */}
          <Route path="/arena" element={<ChallengeArenaPage />} />
          <Route path="/challenges" element={<ChallengeArenaPage />} />
          <Route path="/challenges/:slug/submit" element={<ChallengeSubmissionPage />} />
          <Route path="/challenges/:slug/vote" element={<PublicVotingPage />} />
          <Route path="/challenges/:slug" element={<ChallengeArenaPage />} />
          <Route path="/challenge/:id/submit" element={<ChallengeSubmissionPage />} />
          <Route path="/challenge/:id/vote" element={<PublicVotingPage />} />
          <Route path="/challenge/:id" element={<ChallengeArenaPage />} />

          {/* Pricing & Fees */}
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/fees" element={<PricingPage />} />

          {/* Legal & Payment Gateway Compliance */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/rules" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/refunds" element={<RefundPolicyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />

          {/* Customer Support & Company Info */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<ContactPage />} />

          {/* Fallback */}
          <Route path="*" element={<PixelpushLanding />} />
        </Routes>
      </TalentProvider>
    </AuthProvider>
  );
}
