# 🌳 Project Structure

```text
src/
│
├── app/ 🧠 (Core System)
│   ├── router.tsx                   → App routing
│   ├── store.ts                     → Redux store
│   ├── auth-guards.tsx              → Auth protection
│   ├── role-guard.tsx               → Role-based access
│   ├── RequireServicePermission.tsx → Permission control
│   ├── hooks.ts                     → Typed hooks
│   └── service-permission.ts        → Permission helpers
│
├── features/ 🚀 (Business Logic)
│
│   ├── auth/ 🔐
│   │   ├── components/ → Auth UI (login, OTP, inputs)
│   │   ├── pages/      → Auth screens
│   │   └── services/   → Auth API
│
│   ├── dashboard/ 📊
│   │   ├── components/
│   │   │   ├── analytics/ → KPI, charts
│   │   │   └── ...
│   │   ├── pages/
│   │   └── hooks/
│
│   ├── orders/ 📦
│   │   ├── components/ → Order UI
│   │   ├── pages/
│   │   └── services/
│
│   ├── delivery/ 🚚
│   │   ├── components/ → Delivery UI
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   │       └── deliveryStatusUi.ts
│
│   ├── products/ 🛍️
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│
│   ├── services/ 🧰
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│
│   ├── settings/ ⚙️
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│
│   ├── customers/ 👥
│   │   └── components/
│
│   └── controllers/ 🎮
│       └── components/
│
├── shared/ ♻️ (Reusable Layer)
│   ├── api/         → Base API setup
│   ├── types/       → Global types
│   ├── ui/          → Buttons, inputs, badges
│   ├── components/  → Shared UI (modals, layout)
│   ├── hooks/       → Global hooks
│   └── utils/       → Helpers
│
└── assets/ 🎨 (Static Files)
    ├── images/
    └── icons/
```

---

# 🧠 How to Read This

* 🧠 `app/` → controls the whole system
* 🚀 `features/` → where real work happens
* ♻️ `shared/` → reusable across app
* 🎨 `assets/` → static files

---

# ⚡ Quick Rule

👉 If it's **feature-specific** → `features/`
👉 If it's **used everywhere** → `shared/`
👉 If it's **core logic** → `app/`

---
