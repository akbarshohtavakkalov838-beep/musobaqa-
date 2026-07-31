/* ===========================================================
   admin.js — admin.html (admin panel) uchun
   =========================================================== */

const ADMIN_PASSWORD = "akbarshoh20";   // <-- parolni shu yerdan o'zgartirasiz

let students = loadData();

/* ---------- Kirish (login) ---------- */
function checkPwd(){
  const val = document.getElementById('pwd').value;
  if(val === ADMIN_PASSWORD){
    sessionStorage.setItem('mb_admin_ok','1');
    document.getElementById('gate').style.display='none';
    document.getElementById('adminPanel').style.display='block';
    fillDaySelect();
    renderAdmin();
  } else {
    document.getElementById('gateErr').style.display='block';
  }
}

function logout(){
  sessionStorage.removeItem('mb_admin_ok');
  location.reload();
}

/* Sahifa ochilganda, avval kirgan bo'lsa qayta parol so'ramaydi
   (faqat shu brauzer sessiyasi davomida) */
if(sessionStorage.getItem('mb_admin_ok') === '1'){
  document.getElementById('gate').style.display='none';
  document.getElementById('adminPanel').style.display='block';
  fillDaySelect();
  renderAdmin();
}

/* ---------- Kunlar ro'yxatini to'ldirish ---------- */
function fillDaySelect(){
  const sel = document.getElementById('daySelect');
  sel.innerHTML = Array.from({length:TOTAL_DAYS},(_,d)=>
    `<option value="${d}" ${d===CUR_DAY-1?'selected':''}>${d+1}-kun</option>`
  ).join('');
}

/* ---------- Admin ro'yxatini chizish ---------- */
function renderAdmin(){
  const day = parseInt(document.getElementById('daySelect').value);
  const listEl = document.getElementById('adminList');
  listEl.innerHTML = sortedStudents(students).map(s=>{
    const present = s.attendance[day] === 1;
    return `
    <div class="a-row">
      <div class="r-avatar" style="background:${s.color}">${initials(s.name)}</div>
      <div class="a-name">${s.name}</div>
      <div class="hint">${s.points} ball</div>
      <div class="pt-controls">
        <button class="pt-btn" onclick="changePoints(${s.id},-5)">−</button>
        <div class="pt-val">${s.points}</div>
        <button class="pt-btn" onclick="changePoints(${s.id},5)">+</button>
      </div>
      <button class="att-toggle ${present?'present':''}" onclick="toggleAttendance(${s.id},${day})">${present?'✓':''}</button>
    </div>`;
  }).join('');
}

/* ---------- Ball qo'shish / ayirish ---------- */
function changePoints(id, delta){
  const s = students.find(x=>x.id===id);
  s.points = Math.max(0, s.points + delta);
  saveData(students);
  renderAdmin();
}

/* ---------- Davomatni belgilash ---------- */
function toggleAttendance(id, day){
  const s = students.find(x=>x.id===id);
  s.attendance[day] = s.attendance[day] ? 0 : 1;
  saveData(students);
  renderAdmin();
}
