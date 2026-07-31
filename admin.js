/* ===========================================================
   admin.js — admin.html (admin panel) uchun
   Firebase'ga ulanadi: ball/davomat o'zgarishi bulutga yoziladi
   va barcha qurilmalarda (reyting sahifasida) darhol ko'rinadi.
   =========================================================== */

const ADMIN_PASSWORD = "akbarshoh20";   // <-- parolni shu yerdan o'zgartirasiz

let students = [];
let openRowId = null;
let panelUnlocked = false;

/* ---------- Kirish (login) ---------- */
function checkPwd(){
  const val = document.getElementById('pwd').value;
  if(val === ADMIN_PASSWORD){
    sessionStorage.setItem('mb_admin_ok','1');
    unlockPanel();
  } else {
    document.getElementById('gateErr').style.display='block';
  }
}

function unlockPanel(){
  panelUnlocked = true;
  document.getElementById('gate').style.display='none';
  document.getElementById('adminPanel').style.display='block';
  fillDaySelect();
  renderAdmin();
}

function logout(){
  sessionStorage.removeItem('mb_admin_ok');
  location.reload();
}

if(sessionStorage.getItem('mb_admin_ok') === '1'){
  panelUnlocked = true;
}

/* ---------- Firebase'dan real vaqtda tinglash ---------- */
studentsRef.on('value', snapshot => {
  const data = snapshot.val();
  if(!data || data.length === 0){
    studentsRef.set(seedData());
    return;
  }
  students = data;
  if(panelUnlocked){
    document.getElementById('gate').style.display='none';
    document.getElementById('adminPanel').style.display='block';
    if(!document.getElementById('daySelect').innerHTML) fillDaySelect();
    renderAdmin();
  }
});

/* ---------- Kunlar ro'yxatini to'ldirish ---------- */
function fillDaySelect(){
  const sel = document.getElementById('daySelect');
  sel.innerHTML = Array.from({length:TOTAL_DAYS},(_,d)=>
    `<option value="${d}" ${d===CUR_DAY-1?'selected':''}>${d+1}-kun</option>`
  ).join('');
}

/* ---------- To'liq kalendar hujayrasi (admin uchun bosilanadigan) ---------- */
function adminCalCell(studentId, day, val){
  const cls = val ? 'present' : '';
  return `<div class="cal-cell ${cls}" onclick="toggleAttendance(${studentId},${day});event.stopPropagation()" title="${day+1}-kun">${day+1}</div>`;
}

/* ---------- Admin ro'yxatini chizish ---------- */
function renderAdmin(){
  const day = parseInt(document.getElementById('daySelect').value);
  const listEl = document.getElementById('adminList');

  if(students.length === 0){
    listEl.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-2);font-size:14px">
      Hozircha o'quvchi yo'q. Yuqoridan birinchi o'quvchini qo'shing.</div>`;
    return;
  }

  listEl.innerHTML = sortedStudents(students).map(s=>{
    const present = s.attendance[day] === 1;
    const isOpen = openRowId === s.id;
    return `
    <div class="row-wrap">
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
        <button class="cal-btn ${isOpen?'open':''}" onclick="toggleCal(${s.id})">📅</button>
        <button class="del-btn" onclick="confirmRemove(${s.id},'${s.name.replace(/'/g,"\\'")}')">🗑</button>
      </div>
      <div class="cal-panel ${isOpen?'open':''}">
        <div class="cal-grid">
          ${s.attendance.map((v,d)=>adminCalCell(s.id,d,v)).join('')}
        </div>
        <div class="cal-legend">
          <span><i style="background:var(--green)"></i>Keldi (bosib o'zgartiring)</span>
          <span><i style="background:#fff;border:1.5px solid var(--border)"></i>Kelmadi</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleCal(id){
  openRowId = (openRowId === id) ? null : id;
  renderAdmin();
}

/* ---------- Ball qo'shish / ayirish (darhol ko'rinadi, so'ng bulutga yoziladi) ---------- */
function changePoints(id, delta){
  students = students.map(s => s.id===id ? {...s, points: Math.max(0, s.points + delta)} : s);
  saveData(students);
  renderAdmin();
}

/* ---------- Davomatni belgilash ---------- */
function toggleAttendance(id, day){
  students = students.map(s=>{
    if(s.id !== id) return s;
    const attendance = [...s.attendance];
    attendance[day] = attendance[day] ? 0 : 1;
    return {...s, attendance};
  });
  saveData(students);
  renderAdmin();
}

/* ---------- O'quvchi qo'shish ---------- */
function addNewStudent(){
  const input = document.getElementById('newStudentName');
  const name = input.value.trim();
  if(!name){
    input.focus();
    return;
  }
  students = addStudent(students, name);
  input.value = '';
  renderAdmin();
}

/* ---------- O'quvchini o'chirish (tasdiqlash bilan) ---------- */
function confirmRemove(id, name){
  const ok = confirm(`"${name}" ni ro'yxatdan o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`);
  if(ok){
    students = removeStudent(students, id);
    if(openRowId === id) openRowId = null;
    renderAdmin();
  }
}

/* ---------- Zaxira olish ---------- */
function handleExport(){
  exportData(students);
}

/* ---------- Zaxiradan tiklash ---------- */
function handleImport(event){
  const file = event.target.files[0];
  if(!file) return;
  const ok = confirm("Zaxiradan tiklasangiz, hozirgi barcha ma'lumot fayldagi bilan almashtiriladi. Davom etasizmi?");
  if(!ok){ event.target.value = ''; return; }
  importDataFromFile(file, (data, err) => {
    if(err){
      alert(err);
    } else {
      students = data;
      openRowId = null;
      renderAdmin();
      alert("Zaxiradan muvaffaqiyatli tiklandi.");
    }
    event.target.value = '';
  });
}
