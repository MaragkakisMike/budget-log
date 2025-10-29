# 💰 BudgetLog — Modern Budget Tracking App (Expo + NativeWind)

**BudgetLog** is a cross-platform budgeting demo built with **React Native Expo**, designed to showcase a clean, scalable architecture and polished UI.  
Originally created as an internal tool for two users to easily track and visualize expenses — it now serves as a **portfolio-ready demonstration of modern mobile app standards.**

---

## 🛠 Tech Stack

- ⚡ **Expo** — instant mobile development + OTA updates
- 🎨 **NativeWind (Tailwind CSS)** — rapid, responsive UI styling
- 🔒 **TypeScript** — strict typing, safer DX
- ✅ **ESLint + Prettier** — code quality + consistent formatting

---

## ✅ Core Features

- Track expenses, incomes, and transfers
- Clean UI suitable for **internal use or presentation**
- Fully responsive across iOS + Android
- Architecture ready for expansion (authentication, charts, cloud sync, etc.)

> Note: This build is **local-only**. There is **no authentication** and **no multi-user or server sync**. These can be added as integrations.

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/budget-log.git
cd budget-log
npm install   # or yarn install
npm start     # or yarn start
```

Then scan the QR code using the **Expo Go** app.

---

## 📄 Project Purpose

This app was initially created as a **personal utility for managing shared budgeting**, but it evolved into a **demo-quality showcase** with professional stack choices and UI decisions.

It demonstrates:

- scalable project structure
- production-grade Expo configuration
- Tailwind-based UI with clean component patterns
- readiness for real deployment or SaaS extension

---

## 🧩 Tech Decisions / Notes

- Uses **Expo Router** for file-based navigation
- Includes a **SafeArea-aware layout wrapper**
- Tailwind scanning configured for:
  ```js
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"];
  ```

---

## 📌 Status

This is an **active demo / portfolio project** with strong foundations.  
Authentication, analytics, and persistence layers are planned but intentionally excluded to keep this version lightweight for demonstration.
