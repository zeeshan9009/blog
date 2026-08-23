import { Routes, Route } from "react-router-dom";
import { TalentProvider } from "./context/TalentContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PixelpushLanding from "./pages/PixelpushLanding";
import DevelopersPage from "./pages/DevelopersPage";

export default function App() {
  return (
    <AuthProvider>
      <TalentProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<PixelpushLanding />} />

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

