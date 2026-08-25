import { Routes, Route } from "react-router-dom";
import { TalentProvider } from "./context/TalentContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Pages
import PixelpushLanding from "./pages/PixelpushLanding";
import DevelopersPage from "./pages/DevelopersPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import FindServicesPage from "./pages/FindServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import PromotedRankingPage from "./pages/PromotedRankingPage";
import { ChallengeArenaPage } from "./pages/ChallengeArenaPage";
import TermsPage from "./pages/TermsPage";

export default function App() {
  return (
    <AuthProvider>
      <TalentProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<PixelpushLanding />} />

          {/* Dedicated Full Page Sign In & Register */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          {/* Onboarding Role Selection */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* 7-Step Provider Profile & Services Creator */}
          <Route path="/create-profile" element={<CreateProfilePage />} />

          {/* Find Services & Marketplace */}
          <Route path="/find-services" element={<FindServicesPage />} />
          <Route path="/services" element={<FindServicesPage />} />
          <Route path="/service/:serviceId" element={<ServiceDetailPage />} />

          {/* Unified Dashboard (Buyer, Provider, Dual) */}
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

          {/* Dedicated Developers & Ranking Directory */}
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/talent" element={<DevelopersPage />} />
          <Route path="/ranking" element={<DevelopersPage />} />
          <Route path="/search" element={<FindServicesPage />} />
          <Route path="/profile/:id" element={<DevelopersPage />} />

          {/* Legal & Auction Rules */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/rules" element={<TermsPage />} />

          {/* Fallback */}
          <Route path="*" element={<PixelpushLanding />} />
        </Routes>
      </TalentProvider>
    </AuthProvider>
  );
}
