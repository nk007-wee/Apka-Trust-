# Aapka Trust — Donation PWA

Yeh ek ready-made donation app hai jo aap apne phone ke home screen pe
"install" kar sakte hain (PWA = Progressive Web App), bina Play Store ke.

---

## Is folder mein kya hai

```
donation-pwa/
├── public/
│   ├── index.html        ← main HTML file, Razorpay script yahan load hota hai
│   ├── manifest.json      ← app ka naam/icon/color (PWA banata hai)
│   └── service-worker.js  ← app ko installable banata hai
├── src/
│   ├── App.jsx            ← poora donation app ka UI/code
│   ├── index.js           ← entry point
│   └── index.css          ← basic styles
├── backend-example/
│   ├── server.js          ← payment process karne wala server
│   └── package.json
└── package.json           ← frontend dependencies
```

---

## STEP 1 — Trust aur Razorpay account (zaroori, pehle yeh karo)

1. Apna trust register karo (pehle discuss kiya gaya process)
2. Trust ke naam se bank account khulwao
3. [razorpay.com](https://razorpay.com) pe jao, account banao
4. Trust documents (registration certificate, PAN, bank details) submit karo KYC ke liye
5. Approval milne ke baad, Dashboard mein **Settings → API Keys** se apni
   **Key ID** aur **Key Secret** copy karo

Yeh approval mein kuch din lag sakte hain — isliye yeh sabse pehle shuru karo.

---

## STEP 2 — Code mein apni details daalo

**File: `src/App.jsx`**
- Line dhoondo: `key: "REPLACE_WITH_YOUR_RAZORPAY_KEY_ID"`
- Apni Razorpay **Key ID** yahan paste karo
- `TRUST_NAME` variable mein apne trust ka real naam likho

**File: `backend-example/.env` (yeh file naye se banao)**
```
RAZORPAY_KEY_ID=apki_key_id_yahan
RAZORPAY_KEY_SECRET=apki_secret_key_yahan
```
⚠️ Secret key kabhi bhi frontend code (`App.jsx`) mein mat daalo — sirf
backend ke `.env` file mein.

---

## STEP 3 — Backend deploy karo (Render.com — free hai)

1. [render.com](https://render.com) pe account banao
2. "New Web Service" pe click karo
3. `backend-example` folder ko GitHub pe upload karke connect karo
   (ya seedha files upload karne ka option dekho)
4. Environment Variables mein apni `RAZORPAY_KEY_ID` aur
   `RAZORPAY_KEY_SECRET` add karo
5. Deploy hone ke baad ek URL milega, jaise `https://aapka-trust-api.onrender.com`

---

## STEP 4 — Frontend deploy karo (Vercel — free hai)

1. [github.com](https://github.com) pe account banao (agar nahi hai)
2. Naya repository banao, is poori `donation-pwa` folder (backend-example
   chhod kar) ko usmein upload karo
3. [vercel.com](https://vercel.com) pe jao, "Add New Project"
4. Apna GitHub repository select karo, "Deploy" dabao
5. 2 minute mein aapko ek live link milega — jaise `aapkatrust.vercel.app`

**Zaroori:** `src/App.jsx` mein `/api/create-order` aur `/api/verify-payment`
calls ko apne Render backend ke poore URL se replace karo, jaise:
```js
fetch("https://aapka-trust-api.onrender.com/api/create-order", ...)
```

---

## STEP 5 — Phone pe "app" jaisa install karo

1. Live link (`aapkatrust.vercel.app`) Chrome (Android) ya Safari (iPhone) mein kholo
2. Android: address bar ke menu (⋮) mein "Add to Home Screen" dabao
3. iPhone: Share button → "Add to Home Screen"
4. Ab app ka icon home screen pe aa jayega, normal app jaisa khulega

---

## STEP 6 — Apna domain (optional, professional feel ke liye)

Vercel ka free link (`xyz.vercel.app`) bhi theek chalega, lekin agar aap
chahein:
1. Namecheap ya GoDaddy se domain lo (e.g. `aapkatrust.org`) — ₹500-1500/year
2. Vercel project ke "Settings → Domains" mein apna domain add karo
3. Domain provider ke DNS settings mein Vercel ke diye instructions follow karo

---

## Important reminders

- **80G certificate** lena na bhoolen — isse donors tax benefit le sakte
  hain aur zyada log donate karne ke liye motivated hote hain
- Saara donation data (kaun kitna diya) apne paas record rakhna zaroori
  hai — `server.js` mein jahan `// TODO: save this donation` likha hai,
  wahan database connect karna hoga (e.g. free tier MongoDB Atlas)
- Test mode mein pehle try karo — Razorpay dashboard mein "Test Mode"
  toggle hota hai jisse real paisa kharch kiye bina sab test ho jata hai
