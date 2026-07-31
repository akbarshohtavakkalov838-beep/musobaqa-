/* ===========================================================
   data.js — umumiy ma'lumotlar (index.html va admin.html ikkalasi
   ham shu faylni ulaydi)

   O'QUVCHILARNI SHU YERDA QO'SHASIZ / O'ZGARTIRASIZ:
   Pastdagi NAMES ro'yxatiga o'quvchi ismini qo'shing yoki
   olib tashlang (har biri qo'shtirnoq va vergul bilan).
   =========================================================== */

const COLORS = ['#2563EB','#7c3aed','#db2777','#059669','#ea580c','#0891b2','#4f46e5','#c026d3','#16a34a','#e11d48'];

const NAMES = [
  "Abdulboriy",
  "Abdulaziz",
  "Oyatillo",
  "Muhammadali",
  "Muhammadyaxyo",
  "Muhammmadamir",
  "Muhammadrizo",
  "Malika",
  "Muslima",
  "Zulxumor",
  "Biloldin",
  "Nuriddin",
  "Abdulloh",
  "Ubaydullo",
  "Mushtariy"
];

const TOTAL_DAYS = 30;
const CUR_DAY = 1;          // marafonning hozirgi kuni. Har kuni shu raqamni +1 qilib yangilaysiz.

/* ---------- Boshlang'ich ma'lumot: hammasi 0 ball, davomat yo'q ---------- */
function seedData(){
  return NAMES.map((name,i)=>{
    const attendance = Array.from({length:TOTAL_DAYS},()=>0);
    return { id:i+1, name, points:0, attendance, color: COLORS[i % COLORS.length] };
  });
}

/* ---------- localStorage bilan ishlash ---------- */
const STORAGE_KEY = 'mb_students_v3';   // ismlar ro'yxati o'zgargani uchun yangi kalit — eski ma'lumot bilan aralashmaydi

function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){ try{ return JSON.parse(raw); }catch(e){} }
  const seeded = seedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}
function saveData(d){ localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

/* ---------- Yordamchi funksiyalar ---------- */
function initials(name){
  return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
}
function sortedStudents(students){
  return [...students].sort((a,b)=>b.points-a.points);
}
