import { Routes, Route } from "react-router-dom";
import { TalentProvider } from "./context/TalentContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import PixelpushLanding from "./pages/PixelpushLanding";

export default function App() {
  return (
    <AuthProvider>
      <TalentProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Dedicated Landing Page */}
          <Route path="/" element={<PixelpushLanding />} />
          <Route path="*" element={<PixelpushLanding />} />
        </Routes>
      </TalentProvider>
    </AuthProvider>
  );
}

