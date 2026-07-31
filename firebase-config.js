/* ===========================================================
   firebase-config.js — Firebase loyihangiz sozlamalari

   BU FAYLGA O'Z FIREBASE CONFIG'INGIZNI JOYLASHTIRING:
   1. https://console.firebase.google.com ga kiring
   2. Yangi loyiha yarating (masalan "mockbaza-reyting")
   3. Chap menyudan "Build" -> "Realtime Database" -> "Create Database"
      -> "Start in test mode" ni tanlang
   4. Loyiha sozlamalari (⚙️ Project settings) -> pastda "Your apps"
      -> "</>" (Web) belgisini bosib yangi web-app qo'shing
   5. Sizga ko'rsatilgan "firebaseConfig" obyektini pastdagi bilan
      to'liq almashtiring
   =========================================================== */

const firebaseConfig = {
  apiKey: "SIZNING_API_KEYINGIZ",
  authDomain: "loyiha-nomi.firebaseapp.com",
  databaseURL: "https://loyiha-nomi-default-rtdb.firebaseio.com",
  projectId: "loyiha-nomi",
  storageBucket: "loyiha-nomi.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxx"
};

firebase.initializeApp(firebaseConfig);
const studentsRef = firebase.database().ref('students');

/* Sozlanmagan bo'lsa, sahifa yuqorisida ogohlantirish chiqadi */
if(firebaseConfig.apiKey === "SIZNING_API_KEYINGIZ"){
  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.createElement('div');
    banner.style.cssText = 'background:#fee2e2;color:#dc2626;padding:12px 20px;text-align:center;font-weight:700;font-size:13px';
    banner.textContent = "⚠️ Firebase hali sozlanmagan — firebase-config.js faylida o'z ma'lumotlaringizni kiriting.";
    document.body.prepend(banner);
  });
}
