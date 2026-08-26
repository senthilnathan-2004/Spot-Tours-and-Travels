# Spot Tours & Travels — Modern Travel Agency Web Application

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![CSS3](https://img.shields.io/badge/Vanilla_CSS-Modern_Tokens-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

A high-performance, modern, and fully responsive web application built for **Spot Tours & Travels** — Coimbatore's premier travel agency and tour operator. Designed to showcase custom domestic holidays, international getaways, honeymoon packages, flight/train ticketing, and tourist cab rental services.

---

## Key Features

### Curated Tour Packages Catalog (`/packages`, `/package/:id`)
- **Multi-Faceted Dynamic Filters**: Filter tour packages by keyword search, geographic region (*South India, North India, International, Spiritual*), trip duration, travel theme, and price brackets.
- **Detailed Package Itinerary**: Day-by-day sightseeing breakdown, inclusions & exclusions list, hotel details, photo galleries, and pricing per person.
- **Direct Booking & WhatsApp Enquiries**: One-click booking submission connected directly with WhatsApp fallback messaging and dedicated booking confirmation pages.

### Interactive Destination Explorer (`/destinations`)
- **Category Filter Tabs**: Explore destinations across *Hill Stations, Beaches, Heritage, International, and Honeymoon* getaways.
- **Quick Travel Insights**: Immediate display of best travel months, ideal trip duration, and starting price estimates.
- **Interactive Destination Modal**: View comprehensive itineraries, must-visit spots, and local travel advice without navigating away.

### Traveler Reviews & Rating Hub (`/reviews`)
- **Verified Reviews & Star Rating**: Highlighted Google 4.7★ score with verified traveler feedback.
- **Category-wise Filter**: Filter reviews by family trips, honeymoons, pilgrimage, and group vacations.
- **Interactive "Share Your Experience" Form**: Built-in full-width form for travelers to publish instant feedback.

### About Us & Travel Specialists (`/about`)
- **Company Story & Credentials**: Highlight safety records, commercial transport permits, and transparent pricing.
- **Meet Our Tour Specialists**: Meet the Coimbatore-based itinerary planners and booking managers.

### Office Details & Contact (`/contact`)
- **Interactive Office Info**: Office address near SBI Bank, Palakkad Main Road, Kuniyamuthur, Coimbatore.
- **Direct Contact**: Instant calling, WhatsApp chat, and 24/7 travel support.
- **Interactive Google Map**: Embedded interactive map with exact coordinates and Plus Code.

### Responsive & Mobile-First Design
- **Single-Line Action Buttons**: Engineered to prevent awkward button text breaks on mobile screens.
- **Balanced Heights & Modern Glassmorphism**: Clean layouts, card alignments, and modern CSS tokens.
- **Smooth Micro-Animations**: Scroll-triggered reveals and transitions powered by lightweight `IntersectionObserver`.

---

## Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/gym-project14-main.git
   cd gym-project14-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with Hot Module Replacement (HMR). |
| `npm run build` | Builds the app for production into the `dist` folder. |
| `npm run preview` | Locally preview the production build. |
| `npm run lint` | Runs ESLint to check for code quality and syntax errors. |

---

## Project Structure

```text
gym-project14-main/
├── index.html              # HTML entry point with meta tags & Google Fonts
├── package.json            # Project dependencies and npm scripts
├── vite.config.js          # Vite build configuration
├── src/
│   ├── main.jsx            # Application root mount
│   ├── App.jsx             # Route definitions & scroll-to-top controller
│   ├── index.css           # Global design system, typography & CSS variables
│   ├── assets/             # Images, brand logos, and static assets
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx      # Navigation header with mobile hamburger drawer
│   │   ├── Footer.jsx      # Global footer with quick links & working hours
│   │   ├── Hero.jsx        # Landing hero banner with quick booking stats
│   │   ├── AnimatedSection.jsx # IntersectionObserver scroll reveal component
│   │   ├── Services.jsx    # Travel services cards
│   │   ├── Reviews.jsx     # Testimonial carousel
│   │   └── ...
│   ├── pages/              # Application views / routes
│   │   ├── HomePage.jsx    # Main landing page
│   │   ├── PackagesPage.jsx# All tour packages with filter sidebar
│   │   ├── PackageDetailPage.jsx # Individual tour package details & itinerary
│   │   ├── DestinationsPage.jsx  # Interactive destinations catalog & modal
│   │   ├── AboutPage.jsx   # Agency story, credentials & team specialists
│   │   ├── ReviewsPage.jsx # Review stats, reviews grid & submission form
│   │   ├── BlogPage.jsx    # Travel guides and blog listing
│   │   ├── BlogDetailPage.jsx # Travel article reading view
│   │   ├── ContactPage.jsx # Office details, enquiry form & Google Map
│   │   └── BookingConfirmationPage.jsx # Confirmation summary & receipt
│   └── data/
│       └── travelData.js   # Centralized data store for packages, places & info
```

---

## Page Routes

| Route | Page Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Homepage with hero banner, packages carousel & services. |
| `/packages` | `PackagesPage` | Comprehensive tour packages catalog with live filtering. |
| `/package/:id` | `PackageDetailPage` | Full day-wise package itinerary, inclusions & booking. |
| `/destinations` | `DestinationsPage` | Destinations categorized by theme with preview modals. |
| `/about` | `AboutPage` | About the agency, credentials, and team specialists. |
| `/reviews` | `ReviewsPage` | Verified traveler ratings & interactive review submission. |
| `/blog` | `BlogPage` | Travel tips, guides, and sightseeing articles. |
| `/blog/:slug` | `BlogDetailPage` | Individual blog post reader with related travel tips. |
| `/contact` | `ContactPage` | Contact info, inquiry form, and Google Map. |
| `/booking-confirmation` | `BookingConfirmationPage` | Instant booking receipt & WhatsApp confirmation. |

---

## Design System & Color Palette

The project utilizes a modern and curated color system defined in `src/index.css`:

- **Primary Brand Red**: `#D83A56` — High-energy CTA buttons, highlights, and accents.
- **Secondary Ocean Blue**: `#0E7490` — Subheaders, trust badges, and category tags.
- **Deep Slate (Dark Text)**: `#0F172A` — Primary headings and dark elements.
- **Warm Gold Accent**: `#F59E0B` — Star ratings and featured indicators.
- **Surface & Cards**: `#FFFFFF` with `#E2E8F0` border and soft shadow elevation.
- **Typography**: 
  - **Headings**: `'Oswald', sans-serif`
  - **Body**: `'Outfit', sans-serif`

---

## Agency Information

- **Company**: Spot Tours & Travels
- **Location**: 8/95, Palakkad - Coimbatore Rd, near SBI Bank, Pulakadu, Kuniyamuthur, Coimbatore, Tamil Nadu 641008
- **Phone / Enquiries**: `+91 95005 51404` / `095005 51404`
- **WhatsApp**: `+91 95005 51404`
- **Google Rating**: 4.7 ★ (34+ Verified Reviews)

---

## License

This project is licensed under the [MIT License](LICENSE).
