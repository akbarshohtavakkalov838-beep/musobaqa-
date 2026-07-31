/* ===========================================================
   data.js — umumiy ma'lumotlar (index.html va admin.html ikkalasi
   ham shu faylni ulaydi)
   =========================================================== */

const COLORS = ['#2563EB','#7c3aed','#db2777','#059669','#ea580c','#0891b2','#4f46e5','#c026d3','#16a34a','#e11d48'];

const NAMES = ["Diyorbek Aliyev","Sarvinoz Karimova","Jasur Tursunov","Malika Yusupova","Otabek Rashidov",
  "Nilufar Xolmatova","Sardor Nazarov","Gulnoza Ergasheva","Bekzod Sultonov","Madina Yoqubova",
  "Sherzod Qodirov","Zarina Abdullayeva"];

const TOTAL_DAYS = 30;
const CUR_DAY = 16;          // hozirgi kun (demo uchun). Real loyihada bu kunni o'zingiz o'zgartirasiz.

/* ---------- Demo ma'lumot yaratish (birinchi marta ochilganda) ---------- */
function seedData(){
  return NAMES.map((name,i)=>{
    const attendance = Array.from({length:TOTAL_DAYS},(_,d)=> d < CUR_DAY ? (Math.random() > 0.22 ? 1 : 0) : 0);
    const presentDays = attendance.reduce((a,b)=>a+b,0);
    const points = presentDays * (6 + Math.floor(Math.random()*5)) + Math.floor(Math.random()*10);
    return { id:i+1, name, points, attendance, color: COLORS[i % COLORS.length] };
  });
}

/* ---------- localStorage bilan ishlash ---------- */
function loadData(){
  const raw = localStorage.getItem('mb_demo_students');
  if(raw){ try{ return JSON.parse(raw); }catch(e){} }
  const seeded = seedData();
  localStorage.setItem('mb_demo_students', JSON.stringify(seeded));
  return seeded;
}
function saveData(d){ localStorage.setItem('mb_demo_students', JSON.stringify(d)); }

/* ---------- Yordamchi funksiyalar ---------- */
function initials(name){
  return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
}
function sortedStudents(students){
  return [...students].sort((a,b)=>b.points-a.points);
}
