/* ===========================================================
   board.js — index.html (reyting sahifasi) uchun
   Firebase'ga ulanib, ma'lumot o'zgarishini REAL VAQTDA kuzatadi —
   boshqa qurilmadan ball qo'shilsa, bu sahifa avtomatik yangilanadi.
   =========================================================== */

let students = [];
let openRowId = null;
let firstLoad = true;

studentsRef.on('value', snapshot => {
  const data = snapshot.val();
  if(!data || data.length === 0){
    studentsRef.set(seedData());   // baza bo'sh bo'lsa, boshlang'ich ro'yxatni yozamiz
    return;
  }
  students = data;
  renderBoard();
});

function attendanceCell(day, val){
  if(day >= CUR_DAY) return `<div class="cal-cell future" title="${day+1}-kun">${day+1}</div>`;
  if(val) return `<div class="cal-cell present" title="${day+1}-kun: keldi">${day+1}</div>`;
  return `<div class="cal-cell absent" title="${day+1}-kun: kelmadi">${day+1}</div>`;
}

function renderBoard(){
  const rs = sortedStudents(students);
  const top3 = rs.slice(0,3);
  const medalIcon = ['🏆','🥈','🥉'];

  const podiumEl = document.getElementById('podium');
  podiumEl.innerHTML = top3.map((s,i)=>`
    <div class="p-card rank-${i+1}">
      ${i===0?'<div class="crown">👑</div>':''}
      <div class="p-avatar ${i===0?'energy-wrap':''}" style="background:${s.color}">
        ${i===0?`
          <div class="energy-ring"></div>
          <span class="spark" style="top:-16px;left:50%;transform:translateX(-50%);animation-delay:0s">⚡</span>
          <span class="spark" style="right:-16px;top:50%;transform:translateY(-50%);animation-delay:.5s">⚡</span>
          <span class="spark" style="bottom:-16px;left:50%;transform:translateX(-50%);animation-delay:1s">⚡</span>
          <span class="spark" style="left:-16px;top:50%;transform:translateY(-50%);animation-delay:1.5s">⚡</span>
        `:''}
        ${initials(s.name)}
        <div class="rank-badge">${medalIcon[i]}</div>
      </div>
      <div class="p-name">${s.name}</div>
      <div class="p-points">${s.points} <span>ball</span></div>
    </div>
  `).join('');

  const listEl = document.getElementById('list');
  listEl.innerHTML = rs.map((s,i)=>{
    const presentDays = s.attendance.slice(0,CUR_DAY).reduce((a,b)=>a+b,0);
    const pct = CUR_DAY > 0 ? Math.round(presentDays / CUR_DAY * 100) : 0;
    const dots = s.attendance.slice(0,CUR_DAY).map(v=>`<div class="dot ${v?'on':''}"></div>`).join('');
    const isOpen = openRowId === s.id;
    return `
    <div class="row-wrap">
      <div class="row" onclick="toggleCal(${s.id})">
        <div class="r-rank">${i+1}</div>
        <div class="r-avatar" style="background:${s.color}">${initials(s.name)}</div>
        <div class="r-name"><b>${s.name}</b><span>${presentDays}/${CUR_DAY} kun qatnashdi</span></div>
        <div class="r-dots">${dots}</div>
        <div class="r-att">${pct}%</div>
        <div class="r-points">${s.points} ball</div>
        <div class="cal-btn ${isOpen?'open':''}">📅</div>
      </div>
      <div class="cal-panel ${isOpen?'open':''}">
        <div class="cal-grid">
          ${s.attendance.map((v,d)=>attendanceCell(d,v)).join('')}
        </div>
        <div class="cal-legend">
          <span><i style="background:var(--green)"></i>Keldi</span>
          <span><i style="background:#fca5a5"></i>Kelmadi</span>
          <span><i style="background:#e2e8f0"></i>Hali kelmagan kun</span>
        </div>
      </div>
    </div>`;
  }).join('');

  const off = 195 - (195 * CUR_DAY/TOTAL_DAYS);
  document.getElementById('dayRingProgress').style.strokeDashoffset = off;
  document.getElementById('curDay').textContent = CUR_DAY;

  if(firstLoad && top3.length && top3[0].points > 0) fireConfettiOnce();
  firstLoad = false;
}

function toggleCal(id){
  openRowId = (openRowId === id) ? null : id;
  renderBoard();
}

/* ---------- 1-o'rin uchun konfetti (har sessiyada bir marta) ---------- */
function fireConfettiOnce(){
  if(sessionStorage.getItem('mb_confetti_shown')) return;
  sessionStorage.setItem('mb_confetti_shown','1');
  fireConfetti();
}

function fireConfetti(){
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const colors = ['#2563EB','#f59e0b','#16a34a','#db2777','#7c3aed','#3b82f6'];

  const particles = Array.from({length:140},() => ({
    x: canvas.width/2 + (Math.random()-0.5) * Math.min(600, canvas.width*0.8),
    y: -20 - Math.random()*100,
    vx: (Math.random()-0.5) * 6,
    vy: Math.random()*2 + 2,
    size: Math.random()*6 + 5,
    color: colors[Math.floor(Math.random()*colors.length)],
    rotation: Math.random()*360,
    vr: (Math.random()-0.5) * 12
  }));

  let frame = 0;
  function tick(){
    frame++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
      ctx.restore();
    });
    if(frame < 210){
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }
  tick();
}

window.addEventListener('resize', () => {
  const c = document.querySelector('canvas');
  if(c){ c.width = window.innerWidth; c.height = window.innerHeight; }
});
