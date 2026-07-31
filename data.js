/* ===========================================================
   data.js — umumiy ma'lumotlar (index.html va admin.html ikkalasi
   ham shu faylni ulaydi)

   ESLATMA: Endi o'quvchi qo'shish/o'chirish ADMIN PANELDAN
   qilinadi (kodni tahrirlashning hojati yo'q). Pastdagi NAMES
   faqat birinchi marta sahifa ochilganda boshlang'ich ro'yxat
   sifatida ishlatiladi.
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
const STORAGE_KEY = 'mb_students_v3';

function loadData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){ try{ return JSON.parse(raw); }catch(e){} }
  const seeded = seedData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}
function saveData(d){ localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

/* ---------- O'quvchi qo'shish / o'chirish ---------- */
function addStudent(students, name){
  const cleanName = name.trim();
  if(!cleanName) return students;
  const id = students.length ? Math.max(...students.map(s=>s.id)) + 1 : 1;
  const color = COLORS[(id-1) % COLORS.length];
  const attendance = Array.from({length:TOTAL_DAYS},()=>0);
  students.push({ id, name: cleanName, points:0, attendance, color });
  saveData(students);
  return students;
}
function removeStudent(students, id){
  const idx = students.findIndex(s=>s.id===id);
  if(idx > -1) students.splice(idx,1);
  saveData(students);
  return students;
}

/* ---------- Zaxira olish (JSON fayl yuklab olish) ---------- */
function exportData(students){
  const blob = new Blob([JSON.stringify(students,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = `mockbaza-zaxira-${today}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ---------- Zaxiradan tiklash (JSON fayl yuklash) ---------- */
function importDataFromFile(file, callback){
  const reader = new FileReader();
  reader.onload = e => {
    try{
      const data = JSON.parse(e.target.result);
      if(!Array.isArray(data)) throw new Error('bad format');
      saveData(data);
      callback(data, null);
    }catch(err){
      callback(null, "Fayl formati noto'g'ri. Faqat shu tizimdan yuklab olingan zaxira faylini tanlang.");
    }
  };
  reader.onerror = () => callback(null, "Faylni o'qib bo'lmadi.");
  reader.readAsText(file);
}

/* ---------- Yordamchi funksiyalar ---------- */
function initials(name){
  return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
}
function sortedStudents(students){
  return [...students].sort((a,b)=>b.points-a.points);
}
