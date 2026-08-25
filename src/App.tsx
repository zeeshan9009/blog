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
import TermsPage from "./pages/TermsPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const isDashboardSubdomain = typeof window !== 'undefined' && window.location.hostname.startsWith('dashboard.');

  return (
    <AuthProvider>
      <TalentProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Main Landing Page (or Direct Dashboard on dashboard. subdomain) */}
          <Route path="/" element={isDashboardSubdomain ? <DashboardPage /> : <PixelpushLanding />} />

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

          {/* Challenge Arena */}
          <Route path="/arena" element={<ChallengeArenaPage />} />
          <Route path="/challenges" element={<ChallengeArenaPage />} />
          <Route path="/challenge/:id" element={<ChallengeArenaPage />} />

          {/* Legal & Rules */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/rules" element={<TermsPage />} />

          {/* Fallback */}
          <Route path="*" element={<PixelpushLanding />} />
        </Routes>
      </TalentProvider>
    </AuthProvider>
  );
}
