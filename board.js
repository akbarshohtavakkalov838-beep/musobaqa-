/* ===========================================================
   board.js — index.html (reyting sahifasi) uchun
   =========================================================== */

let students = loadData();

function renderBoard(){
  const rs = sortedStudents(students);
  const top3 = rs.slice(0,3);
  const medalIcon = ['🏆','🥈','🥉'];

  const podiumEl = document.getElementById('podium');
  podiumEl.innerHTML = top3.map((s,i)=>`
    <div class="p-card rank-${i+1}">
      ${i===0?'<div class="crown">👑</div>':''}
      <div class="p-avatar" style="background:${s.color}">
        ${initials(s.name)}
        <div class="rank-badge">${medalIcon[i]}</div>
      </div>
      <div class="p-name">${s.name}</div>
      <div class="p-points">${s.points} <span>ball</span></div>
    </div>
  `).join('');

  const listEl = document.getElementById('list');
  listEl.innerHTML = rs.map((s,i)=>{
    const presentDays = s.attendance.reduce((a,b)=>a+b,0);
    const pct = Math.round(presentDays / CUR_DAY * 100);
    const dots = s.attendance.slice(0,CUR_DAY).map(v=>`<div class="dot ${v?'on':''}"></div>`).join('');
    return `
    <div class="row">
      <div class="r-rank">${i+1}</div>
      <div class="r-avatar" style="background:${s.color}">${initials(s.name)}</div>
      <div class="r-name"><b>${s.name}</b><span>${presentDays}/${CUR_DAY} kun qatnashdi</span></div>
      <div class="r-dots">${dots}</div>
      <div class="r-att">${pct}%</div>
      <div class="r-points">${s.points} ball</div>
    </div>`;
  }).join('');

  const off = 195 - (195 * CUR_DAY/TOTAL_DAYS);
  document.getElementById('dayRingProgress').style.strokeDashoffset = off;
  document.getElementById('curDay').textContent = CUR_DAY;
}

renderBoard();
