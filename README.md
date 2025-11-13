# BeautyBiz Insights Dashboard

An AI-inspired analytics dashboard for beauty and wellness businesses.  
It pulls data from the [Fake Store API](https://fakestoreapi.com/) and
treats products and orders as **services** and **appointments** to simulate
a GlossGenius-style business analytics experience.

The dashboard showcases:
- API integration & data transformation
- Business-focused KPIs
- Trend and category visualizations
- Loading & error states
- A small “AI-style” insights panel

---

## Demo

- **Live URL:** (add Netlify link here)
- **Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Recharts, Axios

---

## Features

- 📊 **Key Metrics (KPIs)**  
  - Total revenue  
  - Total appointments  
  - Average order value  
  - Top-performing service category

- 📈 **Revenue Trend Chart**  
  - Line chart showing revenue over time  
  - Responsive and mobile-friendly

- 🧩 **Category Breakdown**  
  - Revenue grouped by service category

- 🎛️ **Filters**  
  - Date range selector (e.g. last 7 days, last 30 days, all time)

- 🧱 **Robust UI States**  
  - Skeleton loading components  
  - Error state with retry CTA

- 🤖 **“AI-style” Insights Panel**  
  - A “Generate Insights” button that simulates AI analysis  
  - Simple rule-based insights such as:
    - Revenue growth vs previous period  
    - Top-performing category  
    - Suggestions based on booking volume & order value

---

## How It Works

The app integrates with the public [Fake Store API](https://fakestoreapi.com/):

- `/products` are treated as **services** (e.g. hair, nails, skin).
- `/carts` are treated as **appointments / orders**.
- The dashboard:
  - Joins carts with products to compute revenue.
  - Aggregates metrics by date and category.
  - Transforms this into chart-friendly data structures.

---

## Tech Stack

- **Frontend:** React (Vite) + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **HTTP:** Axios
- **Build Tooling:** Vite

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/<your-username>/beautybiz-insights-dashboard.git
cd beautybiz-insights-dashboard
npm install
