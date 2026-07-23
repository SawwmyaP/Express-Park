# ExpressPark 🏎️

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-UI-0055FF?style=for-the-badge&logo=framer)

**ExpressPark** is a next-generation "Mobility Operating System" custom-built for the SRM KTR Campus. It transcends generic parking dashboards by offering a deeply spatial, calm, and intelligent UI designed to orchestrate the flow of thousands of vehicles daily.

## ✨ Features

- **Spatial Campus Mapping:** Powered by `react-leaflet` and Carto, featuring full GeoJSON coordinate integration of the SRM KTR Campus (Tech Park, UB, Main Gates).
- **Intelligent Routing:** Dynamically plots optimal paths between entry gates and parking zones with estimated time and distance metrics.
- **Digital Garage & Multi-Step Booking:** An interactive wizard for students and faculty to register vehicles and generate encrypted QR Gate Passes.
- **Security Command Center (RBAC):** Role-based access unlocks the `/workspace` for campus security—featuring a Live Traffic Stream and a Global Reservations Ledger.
- **YOLO Vision Integration (Prep):** Architecture designed to intake hardware flags from YOLO cameras to highlight "Messy Vehicles" parsing incorrect parking alignments.
- **Timetable OCR Surge Prediction:** Endpoints utilizing `tesseract.js` to parse student timetables and preemptively warn them about high-traffic surge hours based on their class schedules.
- **Seamless i18n:** Built-in localization supporting English (EN), Tamil (TA), and Hindi (HI) utilizing `next-intl`.

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 (with bespoke OKLCH Deep Charcoal theming)
- **Animations:** Framer Motion
- **Map Engine:** React Leaflet + GeoJSON
- **Backend & Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React

## 🎨 Design Philosophy

ExpressPark rigidly adheres to a **"Spatial, Calm, Editorial"** design language:
- **No visual clutter:** We abandoned aggressive gradients and generic card grids.
- **Deep Charcoal Theming:** The interface sits atop a massive, dark Carto map, utilizing frosted glass panels and subtle emerald accents for live data.
- **Micro-interactions:** Every state change (from uploading a timetable to generating a QR code) is smoothed over with physics-based Framer Motion springs.

---
*Built for the future of campus mobility by [Soumya Pathak](https://github.com/SawwmyaP).*
