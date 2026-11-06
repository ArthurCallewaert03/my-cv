# Arthur Callewaert — Personal Hub & Projects

Welcome to Arthur Callewaert's personal project repository. This monorepo hosts Arthur's personal CV/portfolio website, interactive links hub, and the **TapKit** NFC/QR mobile application.

---

## 📁 Repository Overview

```
my-cv/
├── index.html                  # Arthur Callewaert's personal CV & NFC landing page
├── arthur-callewaert.vcf       # Downloadable vCard 3.0 contact file
├── cv3_30_sept.pdf             # Curated CV / Resume PDF
├── Arthur Callewaert 336213.jpg  # Profile portrait photo
├── assets/                     # Networking QR codes (SVG & PNG)
├── CONTEXT.md                  # Comprehensive context documentation for the CV landing page
├── README.md                   # This repository guide
├── my-links/                   # Standalone "Link-in-bio" personal directory
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── config.js
│   ├── README.md
│   └── CONTEXT.md
└── tapkit/                     # TapKit: Native NFC & QR mobile toolkit (React Native / Expo)
    ├── App.tsx
    ├── src/
    ├── android/
    ├── tests/
    ├── README.md
    └── CONTEXT.md
```

---

## 🌟 Projects

### 1. Personal CV & NFC Landing Page (Root)
- **Live Deployment:** [https://arthurcallewaert03.github.io/my-cv/](https://arthurcallewaert03.github.io/my-cv/)
- **Technology:** Pure HTML5, CSS3, and vanilla JavaScript in a single self-contained `index.html` file (no build step, no dependencies).
- **Features:**
  - Sticky nav with quick sections: Work, About, Contact.
  - Interactive career journey bar (Engineering → Data Science → Business & AI).
  - Featured projects (Regulatory Watch, Everest Analytics Data Challenge award winner).
  - One-tap "Save Contact" via `arthur-callewaert.vcf`.
  - Downloadable CV PDF (`cv3_30_sept.pdf`).
  - Integrated networking QR code linking back to the site for physical NFC business cards.

### 2. My Links (`my-links/`)
- **Live Deployment:** [https://arthurcallewaert03.github.io/my-links/](https://arthurcallewaert03.github.io/my-links/)
- **Technology:** HTML, CSS, and modular JavaScript (`config.js`).
- **Features:**
  - Minimalist, mobile-first personal link directory.
  - Direct links to Arthur's CV, LinkedIn, GitHub, Instagram, and project portfolio.
  - Configurable Instagram profile integration via `config.js`.

### 3. TapKit (`tapkit/`)
- **Technology:** React Native (Expo SDK 55), TypeScript, `react-native-nfc-manager`, `expo-camera`.
- **Features:**
  - **Safe NFC Reader Mode:** Inspects NFC tags without Android OS auto-executing links (`https://`) or phone numbers (`tel:`).
  - **Batch Scanning Mode:** Scan multiple tags in sequence with zero modal interruptions; all tags are automatically saved to the persistent Library.
  - **Interactive Tag Popup:** Displays Tag UID, capacity (bytes), writable/read-only status, and decoded record payloads with opt-in confirmation buttons for web links and phone calls.
  - **NDEF Creator & Writer:** Write Text, URL, Phone, Email, SMS, Contact/vCard, Wi-Fi, and custom MIME records with write verification.
  - **QR Scanner & Generator:** Camera scanner with image import support and high-resolution PNG sharing.
  - **Persistent Library:** Saved scan history in `AsyncStorage` surviving app restarts, with export and clear options.

---

## 🚀 Running Locally

### Root CV Page & My Links
Run any static HTTP server from the project directory:

```bash
# Preview Root CV
python -m http.server 8000
# Open http://localhost:8000/

# Preview My Links
cd my-links
python -m http.server 8080
# Open http://localhost:8080/
```

### TapKit Mobile App
Navigate into the `tapkit` directory:

```bash
cd tapkit
npm install

# Run TypeScript checks and unit tests
npm run typecheck
npm test

# Run Web preview
npm run web

# Run on connected Android device via ADB
npm run android
```

---

## 📄 License & Attribution

Designed and developed by **Arthur Callewaert**. All rights reserved.
