# PFCU Website

## Project Overview

The **Pentecostal Fellowship of Caritas University (PFCU)** website is a modern, comprehensive platform designed to manage the fellowship's online presence. It serves as a hub for students and members to access sermons, events, leadership profiles, and giving channels. The platform also includes a robust Admin Panel for content and settings management.

Built with **React (TypeScript)** and **Supabase**, the project emphasizes performance, type safety, and a premium "FAANG-quality" user experience with glassmorphism design elements.

## ✨ Key Features

### 🌍 User-Facing Features

1.  **Home Page**
    - Immersive Hero section with animated backgrounds.
    - "About Us" and "Our Values" bento-grid showcase.
    - Leadership profiles with role details.
    - Featured events and testimonies slider.

2.  **Sermons Library**
    - Modern audio player with progress tracking.
    - Search and filter sermons by preacher, series, or date.
    - Downloadable sermon resources.

3.  **Events & Departments**
    - Upcoming events calendar with detailed views.
    - "Department Focus" cards with hover effects.
    - Direct "Join Department" integration.

4.  **Giving & Donations**
    - **Bank Transfer**: Dynamic display of official account details.
    - **Cash / Offering Box**: Instructions for in-person giving.
    - Copy-to-clipboard functionality for account numbers.
    - *Note: Online Payment (Gateway) integration has been streamlined to focus on direct bank/cash methods.*

5.  **Contact & Location**
    - Interactive Google Maps integration.
    - Direct contact forms and social media links.

### 🛡️ Admin Features

1.  **Dashboard Overview**
    - Real-time statistics (Donations, Events, Sermons).
    - Recent activity feed.

2.  **Content Management**
    - **Sermons**: Upload audio, cover images, and manage metadata.
    - **Events**: Create, edit, and feature upcoming events.
    - **Departments**: Manage unit leaders and descriptions.

3.  **Settings & Configuration**
    - **Bank Details**: Update official bank name, account number, and name.
    - **Cash Instructions**: Edit instructions for in-person giving.
    - **Admin Users**: Manage admin access and roles.

4.  **Donations Tracking**
    - View and filter donation records.
    - Export donation reports.

---

## 🛠️ Technology Stack

### Frontend
-   **Framework**: React 18 (Vite)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, Vanilla CSS (Variables)
-   **UI Library**: shadcn/ui (Radix UI)
-   **Animations**: Framer Motion
-   **Routing**: React Router DOM (with code splitting)
-   **Forms**: React Hook Form + Zod

### Backend (Supabase)
-   **Database**: PostgreSQL
-   **Auth**: Supabase Authentication (RLS protected)
-   **Storage**: Supabase Storage (Audio/Images)
-   **Realtime**: Row Level Security (RLS) policies

### Integrations
-   **Google Maps API**: Location services.

---

## 📂 Project Structure

```bash
src/
├── components/          # Reusable UI components
│   ├── admin/           # Admin layout & features (Settings, Dashboard)
│   ├── giving/          # Giving page specific components
│   ├── layout/          # Navbar, Footer, MainLayout
│   └── ui/              # shadcn/ui primitives (Button, Card, etc.)
│
├── pages/               # Route endpoints (Home, Giving, Admin, etc.)
├── hooks/               # Custom hooks (useAuth, useDonations, etc.)
├── lib/                 # Utilities (supabase client, storage helpers)
└── types/               # TypeScript interfaces (Database types)
```

---

## 🚀 Setup Instructions

### Prerequisites
-   Node.js (v18 or higher)
-   npm or yarn
-   Supabase project (for backend)

### 1. Clone the Repository
```bash
git clone https://github.com/emmanuelrichard01/pfcu-website-main.git
cd pfcu-website-main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 🔐 Database Schema (Supabase)

Key tables used in the application:
-   `site_settings`: Stores dynamic configuration (Bank details, Cash instructions).
-   `donations`: Records of reported transfers.
-   `sermons`: Audio files and metadata.
-   `events`: Event schedules and details.
-   `leaders`: Leadership team profiles.

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
