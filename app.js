// ══════════════════════════════════════════════════════
// APP.JS — Navigation, events, init
// ══════════════════════════════════════════════════════

// ── Navigation ──

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');
  document.querySelector('.main').scrollTo(0, 0);
}

// ── Assessment navigation ──

function nextQ() {
  if (state.currentQ < QUESTIONS.length - 1) { state.currentQ++; renderQ(); }
  else submitAssessment();
}

function prevQ() {
  if (state.currentQ > 0) { state.currentQ--; renderQ(); }
}

// Reset assessment on nav click
document.getElementById('nav-assessment').addEventListener('click', () => {
  state.currentQ = 0;
  state.answers = new Array(24).fill(null);
  document.getElementById('q-card').style.display = '';
  document.getElementById('q-nav').style.display = '';
  document.getElementById('assess-progress').style.display = '';
  document.getElementById('score-preview').style.display = 'none';
  document.getElementById('profile-card-wrap').style.display = 'none';
  initAssessProgress();
  renderQ();
});

// ── Tasks ──

function toggleTask(el, e) {
  e.stopPropagation();
  const wasDone = el.classList.contains('done');
  el.classList.toggle('done');
  el.parentElement.querySelector('.task-title').classList.toggle('done');

  if (!wasDone) {
    const ptsText = el.parentElement.querySelector('.task-pts')?.textContent || '';
    const ptsMatch = ptsText.match(/\+(\d+)/);
    const pts = ptsMatch ? parseInt(ptsMatch[1]) : 30;
    addPoints(pts);
    renderAll();
    showToast(`✓ Task done · +${pts} pts (would be +${pts * 2} with 2x)`);
  }
}

function filterTasks(attr, chipEl) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');
  document.querySelectorAll('#page-tasks .task-item').forEach(item => {
    item.style.display = (attr === 'all' || item.dataset.attr === attr) ? 'flex' : 'none';
  });
}

// ── Notifications ──

function openNotifPanel() {
  document.getElementById('notif-panel-drawer').classList.add('open');
  document.getElementById('notif-overlay').classList.add('open');
  const dot = document.getElementById('notif-dot');
  if (dot) dot.style.display = 'none';
}

function closeNotifPanel() {
  document.getElementById('notif-panel-drawer').classList.remove('open');
  document.getElementById('notif-overlay').classList.remove('open');
}

// ── Modals ──

function openPurchaseModal() { document.getElementById('modal-overlay').classList.add('open'); }
function closePurchaseModal() { document.getElementById('modal-overlay').classList.remove('open'); }
function confirmPurchase() {
  closePurchaseModal();
  showToast('✓ Request submitted · you will be notified when the report is ready');
}

// ── Share (v4 Section 14.5) ──

function shareCard() {
  if (navigator.share) {
    navigator.share({ title: 'My Mental Ratio', text: `My Mental Ratio score: ${totalScore(currentSession().scores)}/100`, url: window.location.href });
  } else {
    showToast('Share not available on desktop — use download');
  }
}

// ── Toast ──

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Dashboard
  renderAll();

  // Assessment
  initAssessProgress();
  renderQ();

  // History — assessments
  renderHistoryCharts();
  renderSessionCards();
  renderComparison();

  // History — tasks
  renderPointsChart();
  renderPointsLog();
  renderCompletedTasks();
});
