# FlashQ — Campus Stationery & Document Print Pre-ordering / Pickup Mobile App

FlashQ is a production-ready React Native (Expo) mobile application with a Firebase backend, built to match the complete HTML prototype with 100% UI fidelity, color palette, custom gradients, SVG iconography, dynamic pickup slot scheduling, and real-time order tracking.

---

## 🌟 Key Features

### 🎓 Student Features
1. **Authentication & Accounts**: Sign Up with College Email & Roll Number, Log In, Password Reset, and profile editing.
2. **Stationery Store**: Search items, filter by categories (Notebooks, Pens, Stationery, Tools), view live stock badges (In Stock, Low Stock, Out of Stock).
3. **Smart Wishlist & Waitlists**: Saved out-of-stock items with automatic "Back in Stock" notification triggers.
4. **Pre-order Cart & Smart Checkout**: Interactive quantity controls, store open/closed status checks, and 10-minute dynamic pickup slot scheduling.
5. **Emergency Pickup Slots**: Auto-calculation of 25% surcharge for booking full slots.
6. **Print Document Uploader**: PDF file uploader, page count estimator, copies/color/paper size/side toggles, price breakdown, and slot booking.
7. **Live Order Tracking**: Timeline status tracker step indicator (`Accepted` -> `Preparing` -> `Ready For Pickup` -> `Collected` for stationery; `Placed` -> `Printing` -> `Ready` -> `Collected` for print jobs).
8. **In-App Notifications**: Toast alerts & system notifications feed.

### 🛡️ Admin Desk Console
1. **Analytics Dashboard**: Daily order volume, print requests, total revenue, low stock count, store open/closed toggle, and recent order/print previews.
2. **Inventory Management**: Inline price & stock editor, new product creation, back-in-stock notification triggers, and CSV Export/Import support.
3. **Order & Print Queue Management**: Single & bulk status step advancement for orders and print requests.
4. **Pickup Verification**: Student roll number search & one-tap collection verification.
5. **Insights & Reports**: Top selling products bar chart & peak pickup hours.
6. **Store Settings**: Slot capacity configuration & per-page print pricing controls (B/W & Color).

---

## 📁 Project Structure

```
flashq/
├── README.md                 # Complete setup instructions & documentation
├── package.json              # Dependencies and scripts
├── app.json                  # Expo project metadata
├── babel.config.js           # Babel preset configuration
├── .gitignore                # Git ignore rules
├── App.js                    # Main App entry point & navigation router
└── src/
    ├── theme/                # Theme colors, spacing, and shadow tokens
    │   └── theme.js
    ├── config/               # Firebase initialization & SDK setup
    │   └── firebase.js
    ├── context/              # Global state management
    │   ├── AuthContext.js    # Firebase Auth & user sessions
    │   └── AppContext.js     # Cart, products, orders, print queue & settings
    ├── components/           # Reusable UI components matching exact prototype styles
    │   ├── LogoSVG.js        # SVG FlashQ gradient logo
    │   ├── Icons.js          # SVG icon library (Home, Print, Cart, Bell, User, etc.)
    │   ├── Button.js         # Styled primary, accent, outline, success & danger buttons
    │   ├── Card.js           # Standard & tinted card containers
    │   ├── Chip.js           # Status & tag chips
    │   ├── Input.js          # Text inputs, password toggles & hints
    │   ├── SlotPicker.js     # 10-minute dynamic pickup slot grid
    │   ├── NavigationBar.js  # Top Header RoleBar & Signature raised bottom tab bar
    │   └── Toast.js          # Notification toast overlay
    ├── utils/
    │   ├── slotHelper.js     # Slot calculation & emergency fee helper
    │   └── csvHelper.js      # CSV import & export parser
    └── screens/
        ├── SplashScreen.js   # Animated splash with loading progress
        ├── OnboardingScreen.js # 3-slide carousel
        ├── student/          # All 9 student screens
        └── admin/            # All 10 admin screens
```

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your mobile device (optional for mobile testing)

### 1. Install Dependencies
Navigate to the project root directory and run:
```bash
npm install
```

### 2. Start Local Development Server
To launch the Expo development server:
```bash
npm start
```
- Press `w` to open in **Web Browser**
- Press `a` to open in **Android Emulator**
- Press `i` to open in **iOS Simulator**
- Scan the QR code using **Expo Go** on physical mobile devices.

---

## 🔑 Demo Accounts

### Student Login
- **Roll Number**: `23B81A0501`
- **Password**: `pass123`

### Admin Login
- **Email**: `admin@college.edu`
- **Password**: `admin123`

---

## 🔥 Firebase Configuration Setup

To connect to your own live Firebase project:
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password), **Firestore Database**, and **Storage**.
3. Create a `.env` file in the project root with your credentials:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🐙 Git & GitHub Integration

To push to GitHub:
```bash
git add .
git commit -m "Initial commit: FlashQ production-ready React Native app with Firebase"
git remote add origin https://github.com/your-username/flashq.git
git branch -M main
git push -u origin main
```
