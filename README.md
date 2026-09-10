# VeriPass® — Product Identity Infrastructure

> **If it exists, it should have an identity.** Give every physical product a permanent, verifiable place on the internet.

VeriPass is an enterprise-grade digital passport and product authenticity platform designed for luxury goods, fine jewelry, electronics, and global physical brands. It connects physical items to tamper-proof digital ledgers with QR, encrypted NFC, and high-performance developer APIs.

---

## 🌟 Key Platform Features

- **Digital Product Passports:** Immutable digital records containing specs, provenance, warranty, ownership history, and certification.
- **One URL Architecture:** Instant zero-app scanning via smart QR codes and NFC chips (`veripass.com/p/{ID}`).
- **Global Reach & Real-Time Tracking:** Interactive global scan analytics, country breakdown, and suspicious activity detection.
- **Developer Infrastructure:** RESTful APIs, webhooks, and comprehensive SDKs to generate passports and issue digital IDs in milliseconds (`POST /v1/products`).
- **Multi-Step Enterprise Onboarding:** Streamlined onboarding wizard with organization profiling, industry classification, and 256-bit encryption.
- **Anti-Counterfeit Protection:** Real-time anomaly detection, scan verification count, and cryptographic certificates.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) + Custom Square & Glassmorphism Design Tokens
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Media:** HTML5 Video streaming (`map.mp4`), SVG vectors, and responsive assets.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd seo-rank-tracker
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
```

To test and preview the production build locally:

```bash
npm run preview
```

---

## 🗂️ Project Structure

```text
seo-rank-tracker/
├── public/                  # Static assets (map.mp4, mobile.png, icons)
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Main navigation & modal trigger
│   │   ├── Hero.tsx               # Hero banner with digital passport card
│   │   ├── OneUrl.tsx             # Single URL product access section
│   │   ├── HowItWorks.tsx         # 3-step verification architecture
│   │   ├── LifetimeData.tsx       # Lifetime provenance & spec records
│   │   ├── GlobalReach.tsx        # Video background & real-time global stats
│   │   ├── DevInfrastructure.tsx  # Interactive API terminal & dev tools
│   │   ├── CtaBanner.tsx          # Brand CTA banner & social footer
│   │   ├── AuthPage.tsx           # Multi-step signup & signin wizard
│   │   └── Footer.tsx             # Legal links, copyright & sitemap
│   ├── App.tsx                    # Root routing & authentication state
│   ├── index.css                  # Global Tailwind 4 styles & tokens
│   └── main.tsx                   # React root entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── LICENSE.md
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE.md](LICENSE.md) file for details.

© 2026 VeriPass Technologies. All Rights Reserved.
