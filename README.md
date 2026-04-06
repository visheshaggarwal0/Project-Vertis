  <h1>VERTIS CRM ⚡</h1>
  <p><strong>Enterprise Operational Intelligence & High-Performance CRM</strong></p>
  <p>
    <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-6.2-purple?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind 4" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  </p>
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5ac53f15-e23c-42ff-8978-4e3a0a5c9756" />
  <img width="1920" height="1080" alt="Screenshot (46)" src="https://github.com/user-attachments/assets/67bc31a2-3fe1-48d1-9d79-f8c5046febb7" />
  <img width="1920" height="1080" alt="Screenshot (48)" src="https://github.com/user-attachments/assets/2a372adc-4eec-4899-8353-9b14802a36de" />
  <img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/8acf24b7-d539-43df-9692-a2baceff5a71" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3c832be9-c407-4a29-bd47-d41cd5ee60a2" />
</div>

<br />

**VERTIS** is a high-performance, minimalist CRM and Operational Hub designed specifically for high-stakes corporate environments. Built with a focus on **architectural honesty**, **minimalist aesthetics**, and powerful **role-based intelligence**, VERTIS provides a seamless, distraction-free experience for everyone from Junior Associates to the CEO.

---

## ✨ Key Features

### 🛡️ Role-Based Access Control (RBAC) & Intelligence
VERTIS implements a strict 6-level hierarchy (L0 to L5) that dynamically shapes the UI and user permissions:
- **L0-L1 (Executives / IT Admins):** Global overview, full data visibility, revenue tracking, and strategic insights.
- **L2 (COO / Directors):** Operational hub focusing on cross-departmental efficiency and resource allocation.
- **L3 (Department Heads):** Granular control over departmental workloads and team performance metrics.
- **L4-L5 (Associates):** Personal command center for task execution and objective tracking.

### 📋 Intelligent Task Management
- **Hierarchical Assignment:** Tasks can only be delegated by users of equal or higher level within their authorized scope.
- **Drag-and-Drop Kanban Board:** Visualize workflow and manage task stages seamlessly with `@dnd-kit`.
- **Integrated Calendar:** Time-based perspectives for deadlines using `react-calendar`.
- **Real-time Collaboration:** Embedded threading for task comments and fluid employee-to-employee chats.

### 🤝 Relationship Management Pipeline
- **Contact & Lead Tracking:** End-to-end management of external clients and internal organizational networks.
- **Direct Communication:** Integrated `tel:` and `mailto:` links for immediate action.
- **Interactive Dashboards:** Advanced bento-grid layout with rich data visualization and charts powered by `recharts`.
- **AI Integration:** Enhanced platform capabilities utilizing `@google/genai` for smart, embedded insights.

### 🎨 Design & Experience
- **Minimalist "Swiss" Aesthetic:** Clean lines, bold typography, and an intuitive focus on negative space.
- **Adaptive Dark Mode:** A true-black, eye-soothing dark theme tailored for deep focus and long sessions.
- **Dynamic Bento Layout:** A fully responsive, modular dashboard that redistributes content dynamically based on user role and screen estate.
- **Silky Smooth Animations:** Micro-interactions and fluid page transitions powered by `motion` (Framer Motion).

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite 6 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **State Management** | React Context API (Store Pattern) |
| **Drag & Drop UI** | `@dnd-kit` |
| **Charts & Data Viz** | Recharts |
| **Animation** | Motion (`framer-motion` API) |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/project-vertis.git
   cd project-vertis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Rename `.env.example` to `.env` and fill in necessary variables (e.g., Supabase Keys, API endpoints).
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🔒 Security & Access

- **Default Accounts:** Any initial seeded accounts use the default password (`vertis_crm`).
- **Access Control Validation:** Strict frontend/middleware validation of departmental boundaries and hierarchical permissions for all data mutation and viewing operations ensures no unauthorized access occurs.

---

## 📂 Project Structure

```text
src/
├── components/      # Reusable UI components & Pages (AdminCenter, Kanban, Dashboard, etc.)
├── lib/             # Utility functions, API helpers, and formatting tools
├── types.ts         # Centralized TypeScript definitions and interfaces
├── mockData.ts      # Seed data for initial state and rapid prototyping
├── StoreContext.tsx # Global state management using Context API
└── App.tsx          # Main application root and layout routing
```

---

<div align="center">
  <i>VERTIS - Intelligence in Motion.</i>
</div>
