<div align="center">

# ⚖️ Mera Vakil — LawFront

**AI-Powered Legal Services Platform**

[![Netlify Status (Staging)](https://api.netlify.com/api/v1/badges/0ca8b2b6-5c90-4ccf-8d14-9ca7ffc64628/deploy-status?branch=staging)](https://app.netlify.com/sites/intellicrafts/deploys?branch=staging)
&nbsp;&nbsp;![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)
&nbsp;&nbsp;![Redux](https://img.shields.io/badge/Redux_Toolkit-2.8-764ABC?logo=redux&logoColor=white)
&nbsp;&nbsp;![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
&nbsp;&nbsp;![License](https://img.shields.io/badge/License-Private-red)

A modern React frontend for the **Mera Vakil** legal-tech platform — connecting users with AI-driven legal assistance, verified lawyers, document review, and a pay-per-use wallet system.

</div>

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Legal Assistant** | Multi-model chatbot (Bakilat, Nyaaya, Munshi, Adalat) with streaming responses, voice input, and text-to-speech |
| 👨‍⚖️ **Find a Lawyer** | Browse, filter, and book consultations with verified lawyers |
| 📄 **Document Review** | Upload documents for AI-powered legal analysis |
| 💰 **Wallet System** | Pay-per-use credits with earned/promotional balance, transaction history, and fund management |
| 📊 **Lawyer Dashboard** | Full admin panel for lawyers — appointments, clients, cases, documents, and analytics |
| 🔐 **Authentication** | Email/password + Google OAuth with role-based access (Client vs Lawyer) |
| 🌗 **Dark Mode** | System-aware theme with smooth transitions and persistent preference |
| 📱 **Responsive Design** | Optimized for all screen sizes with dedicated mobile navigation |

---

## 🏗️ Project Architecture

```
src/
├── api/                    # Centralized API service & token management
├── assets/                 # Static assets (images, icons)
├── components/
│   ├── common/             # Reusable UI (Avatar, Button, InputField, FloatingThemeToggle)
│   ├── layout/             # Global layout (Navbar, Footer, Sidebar, MobileSidebar, ScrollToTop)
│   ├── features/           # Feature components (Hero/Chatbot, PracticeAreas, TaskAutomation)
│   ├── Wallet/             # Wallet UI (WalletLayout, Balance, Transactions, Modals)
│   ├── Lawyer/             # Lawyer admin panel
│   ├── LawyerAdmin/        # Lawyer sub-pages (Appointments, Clients, Cases, Documents)
│   └── Auth/               # Profile management
├── context/                # React contexts (Auth, Toast, Theme)
├── hooks/                  # Custom hooks (useDarkMode, useDebounce)
├── pages/
│   ├── Auth/               # Login, Signup, ForgotPassword
│   ├── General/            # LandingPage, Pricing, Contact
│   └── Legal/              # FindLawyer, DocumentReview
├── redux/                  # Redux Toolkit slices (theme, sidebar, chat, wallet)
├── services/               # Business logic services (chatbot, wallet)
├── styles/                 # Global CSS (dark mode, sidebar, mobile sidebar)
└── utils/                  # Utilities (theme, formatting)
```

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | React 19, React Router 6 |
| **State** | Redux Toolkit, React Context |
| **Styling** | Tailwind CSS 3.4, Custom CSS, Framer Motion |
| **HTTP** | Axios |
| **Auth** | Google OAuth 2.0 (`@react-oauth/google`) |
| **Charts** | Recharts |
| **Maps** | React Leaflet |
| **Icons** | Lucide React, React Icons, Heroicons |
| **Build** | Create React App (react-scripts 5) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Intellicrafts/LawFront.git

# 2. Navigate into the project
cd LawFront

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

The app will be available at **http://localhost:3000**.

### Environment Variables

Create a `.env` file in the project root:

```env
# Backend API
REACT_APP_API_URL=http://localhost:8000

# Wallet Microservice
REACT_APP_WALLET_API_URL=http://localhost:8000

# Google OAuth
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Runs the dev server on port 3000 |
| `npm run start:alt` | Runs the dev server on port 3001 |
| `npm run build` | Creates an optimized production build |
| `npm test` | Runs the test suite |

---

## 🗺️ Routes Overview

| Route | Component | Access |
|---|---|---|
| `/` | Landing Page | Public |
| `/chatbot` | AI Legal Assistant | Public |
| `/legal-consoltation` | Find a Lawyer | 🔒 Auth |
| `/legal-documents-review` | Document Review | Public |
| `/task-automation` | Task Dashboard | Public |
| `/wallet` | Wallet | 🔒 Auth |
| `/pricing` | Service Rates | Public |
| `/contact` | Contact Us | Public |
| `/auth` | Login | Guest only |
| `/signup` | Sign Up | Guest only |
| `/forgot-password` | Password Reset | Public |
| `/profile` | User Profile | 🔒 Auth |
| `/lawyer-admin/*` | Lawyer Dashboard | 🔒 Auth (Lawyers) |
| `/privacy-policy` | Privacy Policy | Public |
| `/terms-of-service` | Terms of Service | Public |

---

## 🔗 Backend Services

| Service | Default URL | Purpose |
|---|---|---|
| **BakilApp API** | `http://localhost:8000` | Core backend — auth, lawyers, chatbot, documents |
| **Kuberdhan (Wallet)** | `http://localhost:8000` | Wallet microservice — balances, transactions, payments |

---

## 🤝 Contributing

1. Create a feature branch from `staging`
2. Make your changes
3. Run `npm run build` to verify no compilation errors
4. Open a Pull Request against `staging`

---

<div align="center">

**Built with ❤️ by [Intellicrafts](https://github.com/Intellicrafts)**

</div>
