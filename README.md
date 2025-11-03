# 💼 React Invoice Generator

A sleek, easy-to-use **invoice generator** built with **React** and **@react-pdf/renderer**.
Create, customize, and download professional invoices in seconds — all from your browser.

---

## ✨ Highlights

* 🧾 **Instant PDF Generation** – Download print-ready A4 invoices with logo, QR, and signature.
* 🧮 **Auto Calculations** – Subtotal, tax, received amount, and balance handled automatically.
* 🎨 **Modern Design** – Clean layout styled with Tailwind CSS.
* ⚙️ **Customizable** – Replace fonts, colors, and assets easily.
* 🇮🇳 **INR Support** – Built-in currency formatter and number-to-words conversion for Indian users.

---

## 🧰 Built With

* **React.js** – Frontend framework
* **Tailwind CSS** – Utility-first styling
* **@react-pdf/renderer** – PDF generation engine
* **Lucide React** – Icons
* **Intl.NumberFormat** – Currency formatting

---

## ⚙️ Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/react-invoice-generator.git
   cd react-invoice-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the app**

   ```bash
   npm run dev
   ```

   Access at: [http://localhost:5173](http://localhost:5173)

---

## 🧾 How It Works

1. Enter **client and business details**.
2. Add **invoice items** (description, quantity, rate).
3. Specify **amount received** and notes.
4. Click **Download PDF** – your invoice is ready!

---

## 📂 Directory Overview

```
src/
├── assets/
│   ├── logo.png
│   ├── qr-code.jpg
│   ├── signature.png
│   └── fonts/
│       ├── NotoSans-Regular.ttf
│       └── NotoSans-Italic.ttf
├── components/
│   └── InvoiceGenerator.jsx
└── App.js
```

---

## 🧑‍🎨 Customization Tips

* **Change Fonts:** Replace the `.ttf` files under `src/assets/fonts/`.
* **Edit Logo/QR:** Swap image files with your own brand assets.
* **Styling:** Modify `StyleSheet.create()` inside the component to tweak PDF design.

---



## 🪪 License

Released under the **MIT License**.
You’re free to use, modify, and distribute with attribution.

---

⭐ **Star this repo** if you find it helpful!
