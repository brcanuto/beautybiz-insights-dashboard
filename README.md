# BeautyBiz Insights Dashboard

An AI-inspired analytics dashboard for beauty and wellness businesses.  
It pulls data from the [Fake Store API](https://fakestoreapi.com/) and
treats products and carts as **services** and **appointments**.

The dashboard showcases:

- API integration and data transformation
- Business-focused KPIs
- Trend and category visualizations
- Loading and error states
- A small “AI-style” insights panel

---

## Demo

- **Live URL:** https://beautybiz.netlify.app/
- **Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Recharts

---

## Features

### Key metrics (KPIs)

- Total revenue  
- Total appointments  
- Average order value  
- Top-performing category  

### Revenue trend chart

- Line chart of total revenue per day  
- Responsive layout  
- Dark-theme styling and tooltips  

### Category breakdown

- Bar chart of revenue by category  
- Hover highlight with tooltip  
- Category names normalized for display (e.g. `"men's clothing"` → `Men's Clothing`)

### Date range filter

- Custom date range picker using native `<input type="date">`
- Prevents invalid ranges (from > to)
- Uses a default range that matches the Fake Store API’s historical data

### Robust UI states

- Skeleton loading components for KPIs
- Error state with a Retry button
- Graceful empty states when there isn’t enough data to chart

### “AI-style” insights panel

- “Generate Insights” button simulates an AI analysis step
- Rule-based insights such as:
  - Revenue trending up or down over the selected period
  - Top-performing category summary
  - Suggestions based on booking volume vs average order value

---

## How It Works

The app integrates with the public [Fake Store API](https://fakestoreapi.com/):

- `GET /products` are treated as **services** with `price`, `title`, and `category`
- `GET /carts` are treated as **appointments / orders** with `date` and `products[]`

Analytics logic:

1. Fetches products and carts in parallel.
2. Normalizes incoming data (categories, titles, descriptions).
3. Joins carts with products to compute revenue per order.
4. Filters orders to the selected date range.
5. Aggregates into:

   ```ts
   type AnalyticsData = {
     kpis: {
       totalRevenue: number;
       totalAppointments: number;
       avgOrderValue: number;
     };
     series: {
       date: string;    // YYYY-MM-DD
       revenue: number;
     }[];
     byCategory: {
       category: string;
       revenue: number;
     }[];
   };
