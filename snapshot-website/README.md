# SNAPSHOT — Premium Reel Maker Booking Website

A complete, production-quality **React + Vite** website for SNAPSHOT, a premium event photography and Reel Maker booking service.

---

## 🚀 Quick Start

```bash
# 1. Enter the project directory
cd snapshot-website

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
snapshot-website/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Transparent → sticky navbar + mobile overlay
│   │   ├── Hero.jsx            # Full-screen cinematic hero with parallax
│   │   ├── EventTicker.jsx     # Orange horizontal scrolling ticker
│   │   ├── EventGallery.jsx    # Masonry-style event category grid
│   │   ├── Services.jsx        # Service cards with hover zoom
│   │   ├── VideoGallery.jsx    # 9:16 vertical video grid + modal
│   │   ├── HowItWorks.jsx      # 4-step editorial process
│   │   ├── Pricing.jsx         # 3-tier pricing + add-ons
│   │   ├── BookingForm.jsx     # Full booking form with EmailJS
│   │   ├── WhySnapshot.jsx     # Features on light background
│   │   ├── FAQ.jsx             # Animated accordion FAQ
│   │   ├── Footer.jsx          # Bold footer with CTA strip
│   │   ├── CustomCursor.jsx    # Desktop-only custom cursor
│   │   └── LoadingScreen.jsx   # Animated loading screen
│   ├── pages/
│   │   ├── Home.jsx            # Main landing page
│   │   ├── ServicesPage.jsx    # Services route
│   │   ├── PortfolioPage.jsx   # Portfolio/Our Work route
│   │   └── ContactPage.jsx     # Contact/booking route
│   ├── data/
│   │   ├── pricing.js          # ⭐ CENTRALIZED PRICING CONFIG
│   │   ├── services.js         # Services data
│   │   ├── events.js           # Event categories data
│   │   └── faqs.js             # FAQ data
│   ├── styles/
│   │   └── global.css          # Global styles + animations
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## ⚙️ Configuration

### 💰 Update Prices
Edit **`src/data/pricing.js`** — this is the single source of truth for all package prices, names, and features.

### 📧 Connect EmailJS
1. Create a free account at [emailjs.com](https://emailjs.com)
2. Create a **Service**, **Template**, and get your **Public Key**
3. Edit `src/components/BookingForm.jsx` and update:
   ```js
   const EMAILJS_SERVICE_ID  = 'your_service_id'
   const EMAILJS_TEMPLATE_ID = 'your_template_id'
   const EMAILJS_PUBLIC_KEY  = 'your_public_key'
   ```

**EmailJS Template variables** (use these in your template):
- `{{from_name}}` – Client's name
- `{{phone}}` – Phone number
- `{{reply_to}}` – Email
- `{{event_type}}` – Type of event
- `{{event_date}}` – Event date
- `{{location}}` – Event location
- `{{package}}` – Selected package
- `{{requirements}}` – Additional requirements

### 🎥 Replace Sample Videos
Edit `src/components/VideoGallery.jsx` and replace the `videos` array with your real video URLs and thumbnails.

### 🖼️ Replace Images
All images currently use Unsplash URLs. Replace image URLs in:
- `src/data/events.js`
- `src/data/services.js`
- `src/components/Hero.jsx`

---

## 🛠️ Build & Deploy

### Build for production
```bash
npm run build
```

### Preview production build locally
```bash
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or connect your GitHub repo at vercel.com for auto-deployments
```

### Deploy to GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build"
# "deploy": "gh-pages -d dist"

# Add to vite.config.js: base: '/your-repo-name/'

npm run deploy
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary BG | `#0A0A0A` |
| Secondary BG | `#151515` |
| Light BG | `#F4F1EC` |
| Accent | `#FF351F` |
| Primary Text | `#FFFFFF` |
| Secondary Text | `#A0A0A0` |
| Serif Font | Playfair Display |
| Sans Font | Inter |

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (single column, touch-first)
- **Tablet**: 640px – 1024px (2-column grids)
- **Desktop**: > 1024px (full multi-column layouts)

---

## 🧰 Tech Stack

- **React 18** + **Vite 5**
- **Framer Motion 11** — animations
- **React Router 6** — routing
- **Tailwind CSS 3** — utility classes
- **Lucide React** — icons
- **EmailJS** — form submissions
- **Google Fonts** — Playfair Display + Inter

---

© 2026 SNAPSHOT. Built with ❤️ for premium event storytelling.
