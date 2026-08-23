import { Routes, Route } from "react-router-dom";
import { TalentProvider } from "./context/TalentContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PixelpushLanding from "./pages/PixelpushLanding";
import DevelopersPage from "./pages/DevelopersPage";
import AuthPage from "./pages/AuthPage";

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

          {/* Dedicated Developers & Ranking Marketplace Directory */}
          <Route path="/developers" element={<DevelopersPage />} />
          <Route path="/talent" element={<DevelopersPage />} />
          <Route path="/ranking" element={<DevelopersPage />} />
          <Route path="/search" element={<DevelopersPage />} />

          {/* Fallback */}
          <Route path="*" element={<PixelpushLanding />} />
        </Routes>
      </TalentProvider>
    </AuthProvider>
  );
}

