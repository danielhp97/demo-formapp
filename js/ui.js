// ══════════════════════════════════════════════════════
// UI.JS — All rendering functions
// ══════════════════════════════════════════════════════

// ── Dashboard: ratio hero ──

function renderRatioHero() {
  const session = currentSession();
  const prev = previousSession();
  const score = totalScore(session.scores);
  const dashOffset = 213.6 - (213.6 * score / 100);
  const delta = prev ? score - totalScore(prev.scores) : null;
  const deltaHtml = delta !== null
    ? `<div class="ratio-badge">${delta >= 0 ? '↑' : '↓'} ${delta >= 0 ? '+' : ''}${delta} from last assessment</div>`
    : '<div class="ratio-badge">Session 1</div>';

  document.getElementById('ratio-hero').innerHTML = `
    <div class="ratio-ring">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r="34" fill="none" stroke="#eee8e0" stroke-width="6"/>
        <circle cx="42" cy="42" r="34" fill="none" stroke="#b5623e" stroke-width="6"
          stroke-dasharray="213.6" stroke-dashoffset="${dashOffset}" stroke-linecap="round"/>
      </svg>
      <div class="ratio-ring-label"><div class="ratio-number">${score}</div><div class="ratio-denom">/100</div></div>
    </div>
    <div class="ratio-info">
      <h3>Mental Ratio Score</h3>
      <p>Weighted average of your 6 mental performance attributes</p>
      ${deltaHtml}
    </div>`;
}

// ── Unlock track bars ──

function renderUnlockTracks() {
  const lvl = getCurrentLevel();
  const progress = getLevelProgress();
  const pipCount = 10;
  const filled = Math.round(progress * pipCount);

  ['dash', 'task'].forEach(prefix => {
    const track = document.getElementById(prefix + '-unlock-track');
    const label = document.getElementById(prefix + '-unlock-label');
    const badge = document.getElementById(prefix + '-level-badge');
    if (!track) return;

    track.innerHTML = '';
    for (let i = 0; i < pipCount; i++) {
      const pip = document.createElement('div');
      pip.className = 'unlock-pip' + (i < filled ? ' filled' : '');
      track.appendChild(pip);
    }
    if (label) {
      const next = getNextThreshold();
      const nextName = LEVELS[Math.min(lvl + 1, LEVELS.length - 1)].name;
      label.textContent = `${state.seasonPoints} / ${next} pts toward ${nextName}`;
    }
    if (badge) badge.textContent = `Level ${lvl + 1} — ${LEVELS[lvl].name}`;
  });

  // Tier badges on dashboard
  for (let i = 0; i < LEVELS.length; i++) {
    const el = document.getElementById('tier-' + i);
    if (!el) continue;
    el.className = 'tier-badge';
    if (i < lvl) el.classList.add('unlocked');
    if (i === lvl) el.classList.add('current');
  }
}

// ── Points cards ──

function renderPtsCards() {
  const next = getNextThreshold();
  const pct = Math.min((state.seasonPoints / next) * 100, 100);
  const remaining = Math.max(next - state.seasonPoints, 0);
  const html = `
    <div class="pts-icon">⚡</div>
    <div class="pts-info"><div class="pts-label">Season Points</div><div class="pts-val">${state.seasonPoints} pts</div>
      <div class="pts-bar-bg"><div class="pts-bar" style="width:${pct}%"></div></div></div>
    <div style="text-align:right"><div style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:.8px">Next level</div>
    <div style="font-family:'Fraunces',serif;font-weight:700;font-size:14px">${remaining} pts</div></div>`;
  ['pts-card-tasks', 'pts-card-history'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
}

// ── Attribute grid ──

function renderAttrGrid() {
  const grid = document.getElementById('attr-grid');
  const scores = currentSession().scores;
  grid.innerHTML = '';
  ATTRS.forEach(a => {
    const score = scores[a.key];
    const unlocked = isAttrUnlocked(a.key);
    const card = document.createElement('div');
    card.className = 'attr-card';
    card.onclick = () => openInsight(a.key);
    card.innerHTML = `
      <span class="attr-icon">${a.icon}</span>
      <div class="attr-name">${a.name}</div>
      <div class="attr-score" style="color:${a.color}">${score}</div>
      <div class="attr-bar-bg"><div class="attr-bar" style="width:${score}%;background:${a.color}"></div></div>
      ${unlocked
        ? '<div class="attr-locked"><span style="font-size:10px;color:var(--teal)">✦ Insight available</span></div>'
        : '<div class="attr-locked"><span style="font-size:11px">🔒</span><span class="attr-locked-label">Earn more pts to unlock</span></div>'}`;
    grid.appendChild(card);
  });
}

// ── Insight panel ──

function openInsight(key) {
  const a = ATTRS.find(x => x.key === key);
  const selfScore = currentSession().scores[key];
  const scoutScore = SCOUT_EVAL.scores[key];
  const unlocked = isAttrUnlocked(key);
  const panel = document.getElementById('insight-panel');
  document.getElementById('insight-title').textContent = `${a.icon} ${a.name}`;
  const body = document.getElementById('insight-body');

  const scoreCompare = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
      <div><div style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px">Self</div>
        <div style="font-family:'Fraunces',serif;font-weight:900;font-size:28px;color:${a.color}">${selfScore}</div></div>
      <div style="font-size:16px;color:var(--muted2)">vs</div>
      <div><div style="font-size:10px;color:var(--muted2);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px">Scout</div>
        <div style="font-family:'Fraunces',serif;font-weight:900;font-size:28px;color:${a.color}">${scoutScore}</div></div>
    </div>`;

  if (unlocked) {
    const content = INSIGHTS[key];
    body.innerHTML = `${scoreCompare}
      <div class="insight-section">
        <div class="insight-section-title"><span style="color:var(--teal)">▲</span> Strengths</div>
        <div class="insight-text">${content.strengths}</div>
      </div>
      <div class="insight-section">
        <div class="insight-section-title"><span style="color:var(--rose)">▼</span> Areas to develop</div>
        <div class="insight-text">${content.develop}</div>
      </div>`;
  } else {
    body.innerHTML = `<div class="insight-locked">
      <div class="insight-locked-icon">🔒</div>
      ${scoreCompare}
      <div class="insight-locked-text">The written breakdown for <strong>${a.name}</strong> is not yet unlocked. Earn more season points to reach the next level.</div>
    </div>`;
  }

  const grid = document.getElementById('attr-grid');
  grid.parentNode.insertBefore(panel, grid);
  panel.classList.add('open');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeInsight() {
  document.getElementById('insight-panel').classList.remove('open');
}

// ══════════════════════════════════════════════════════
// ASSESSMENT HISTORY — charts + session cards
// ══════════════════════════════════════════════════════

function renderHistoryCharts() {
  const container = document.getElementById('history-charts');
  if (!container) return;

  const n = SESSIONS.length;
  const W = 420, H = 120, padL = 30, padR = 10;
  const usable = W - padL - padR;
  const gap = n > 1 ? usable / (n - 1) : 0;

  // ── Score trend ──
  const totals = SESSIONS.map(s => totalScore(s.scores));
  const maxScore = 100;
  const yScale = (v) => 10 + (1 - v / maxScore) * (H - 30);

  let scoreLine = SESSIONS.map((s, i) => `${padL + i * gap},${yScale(totals[i])}`).join(' ');
  let scoreFill = scoreLine + ` ${padL + (n - 1) * gap},${H - 10} ${padL},${H - 10}`;
  let scoreDots = SESSIONS.map((s, i) => {
    const x = padL + i * gap, y = yScale(totals[i]);
    const isLast = i === n - 1;
    return `<circle cx="${x}" cy="${y}" r="${isLast ? 5 : 4}" fill="#b5623e"${isLast ? ' stroke="#faf7f4" stroke-width="2"' : ''}/>`;
  }).join('');
  let scoreLabels = SESSIONS.map((s, i) =>
    `<text x="${padL + i * gap}" y="${H + 2}" class="axis-label" text-anchor="middle">${s.month}</text>`
  ).join('');

  const scoreChart = `
    <div class="chart-wrap">
      <div class="chart-title">Mental Ratio Score</div>
      <div class="chart-sub">Self-assessment trend · ${n} sessions</div>
      <svg class="chart" height="${H + 10}" viewBox="0 0 ${W} ${H + 10}">
        <line x1="${padL}" y1="${yScale(100)}" x2="${W - padR}" y2="${yScale(100)}" stroke="#eee8e0" stroke-width="1"/>
        <line x1="${padL}" y1="${yScale(50)}" x2="${W - padR}" y2="${yScale(50)}" stroke="#eee8e0" stroke-width="1"/>
        <text x="0" y="${yScale(100) + 3}" class="axis-label">100</text>
        <text x="0" y="${yScale(50) + 3}" class="axis-label">50</text>
        <polygon points="${scoreFill}" fill="rgba(181,98,62,0.08)"/>
        <polyline points="${scoreLine}" fill="none" stroke="#b5623e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${scoreDots}
        ${scoreLabels}
      </svg>
    </div>`;

  // ── Attribute trend ──
  const attrColors = ATTRS.map(a => {
    const map = { 'var(--resilience)':'#3d8b7a', 'var(--discipline)':'#b5623e', 'var(--gameiq)':'#6b9e78',
      'var(--influence)':'#b09070', 'var(--intensity)':'#c47a7a', 'var(--focus)':'#7e6fa0' };
    return map[a.color] || '#888';
  });

  const attrLines = ATTRS.map((a, ai) => {
    const points = SESSIONS.map((s, i) => `${padL + i * gap},${yScale(s.scores[a.key])}`).join(' ');
    return `<polyline points="${points}" fill="none" stroke="${attrColors[ai]}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('');

  const legend = ATTRS.map((a, i) =>
    `<div class="legend-item"><div class="legend-dot" style="background:${attrColors[i]}"></div>${a.name}</div>`
  ).join('');

  const attrChart = `
    <div class="chart-wrap">
      <div class="chart-title">Attribute Trends</div>
      <div class="chart-sub">All 6 attributes across sessions</div>
      <svg class="chart" height="${H + 10}" viewBox="0 0 ${W} ${H + 10}">
        <line x1="${padL}" y1="${yScale(100)}" x2="${W - padR}" y2="${yScale(100)}" stroke="#eee8e0" stroke-width="1"/>
        <line x1="${padL}" y1="${yScale(50)}" x2="${W - padR}" y2="${yScale(50)}" stroke="#eee8e0" stroke-width="1"/>
        <text x="0" y="${yScale(100) + 3}" class="axis-label">100</text>
        <text x="0" y="${yScale(50) + 3}" class="axis-label">50</text>
        ${attrLines}
        ${scoreLabels}
      </svg>
      <div class="chart-legend">${legend}</div>
    </div>`;

  container.innerHTML = scoreChart + attrChart;
}

function renderSessionCards() {
  const container = document.getElementById('session-cards');
  if (!container) return;

  // Self-assessment sessions (newest first)
  const cards = [...SESSIONS].reverse().map(s => {
    const score = totalScore(s.scores);
    const bars = ATTRS.map(a => {
      const v = s.scores[a.key];
      return `<div class="hist-mini-row"><div class="hist-mini-label">${a.name}</div>
        <div class="hist-mini-bg"><div class="hist-mini-bar" style="width:${v}%;background:${a.color}"></div></div>
        <div class="hist-mini-val" style="color:${a.color}">${v}</div></div>`;
    }).join('');
    return `<div class="hist-item">
      <div class="hist-item-top"><div><div style="font-family:'Fraunces',serif;font-weight:700;font-size:13px">Session ${s.id}</div>
        <div class="hist-item-date">${s.date}</div></div><div class="hist-item-score">${score}</div></div>
      <div class="hist-mini-bars">${bars}</div></div>`;
  }).join('');

  // Scout evaluation card
  const scoutBars = ATTRS.map(a => {
    const v = SCOUT_EVAL.scores[a.key];
    const label = a.key === 'focus' ? 'Focus (JM)' : a.name;
    return `<div class="hist-mini-row"><div class="hist-mini-label">${label}</div>
      <div class="hist-mini-bg"><div class="hist-mini-bar" style="width:${v}%;background:${a.color}"></div></div>
      <div class="hist-mini-val" style="color:${a.color}">${v}</div></div>`;
  }).join('');
  const scoutTotal = totalScore(SCOUT_EVAL.scores);

  const scoutCard = `<div class="section-label">Scout Evaluation</div>
    <div class="hist-item">
      <div class="hist-item-top"><div><div style="font-family:'Fraunces',serif;font-weight:700;font-size:13px">${SCOUT_EVAL.label}</div>
        <div class="hist-item-date">${SCOUT_EVAL.note}</div></div><div class="hist-item-score">${scoutTotal}</div></div>
      <div class="hist-mini-bars">${scoutBars}</div></div>`;

  container.innerHTML = cards + scoutCard;
}

// ── Self vs Scout comparison ──

function renderComparison() {
  const section = document.getElementById('compare-section');
  if (!section) return;
  const self = currentSession().scores;
  section.innerHTML = ATTRS.map(a => {
    const sv = self[a.key], ev = SCOUT_EVAL.scores[a.key];
    return `<div class="compare-row">
      <div class="compare-label">${a.name}</div>
      <div class="compare-bars">
        <div class="compare-bar-row"><div class="compare-type">Self</div>
          <div class="compare-bar-bg"><div class="compare-bar" style="width:${sv}%;background:${a.color}"></div></div>
          <div class="compare-val" style="color:${a.color}">${sv}</div></div>
        <div class="compare-bar-row"><div class="compare-type">Scout</div>
          <div class="compare-bar-bg"><div class="compare-bar" style="width:${ev}%;background:${a.color};opacity:0.5"></div></div>
          <div class="compare-val" style="color:${a.color};opacity:0.6">${ev}</div></div>
      </div></div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════
// TASK HISTORY — points chart + log
// ══════════════════════════════════════════════════════

function renderPointsChart() {
  const container = document.getElementById('points-chart');
  if (!container) return;

  // Build cumulative points by month
  const months = ['Sep','Oct','Nov','Dec','Jan','Feb'];
  const monthPts = months.map(() => 0);
  POINTS_LOG.forEach(e => {
    const d = e.date;
    if (d.includes('Sep')) monthPts[0] += e.pts;
    else if (d.includes('Oct')) monthPts[1] += e.pts;
    else if (d.includes('Nov')) monthPts[2] += e.pts;
    else if (d.includes('Dec')) monthPts[3] += e.pts;
    else if (d.includes('Jan')) monthPts[4] += e.pts;
    else if (d.includes('Feb')) monthPts[5] += e.pts;
  });
  // Cumulative
  const cumulative = [];
  let running = 0;
  monthPts.forEach(p => { running += p; cumulative.push(running); });

  const W = 420, H = 120, padL = 35, padR = 10;
  const usable = W - padL - padR;
  const gap = usable / (months.length - 1);
  const maxPts = Math.max(1000, ...cumulative);
  const yScale = (v) => 10 + (1 - v / maxPts) * (H - 30);

  const line = cumulative.map((v, i) => `${padL + i * gap},${yScale(v)}`).join(' ');
  const fill = line + ` ${padL + (months.length - 1) * gap},${H - 10} ${padL},${H - 10}`;
  const dots = cumulative.map((v, i) => {
    const isLast = i === months.length - 1;
    return `<circle cx="${padL + i * gap}" cy="${yScale(v)}" r="${isLast ? 5 : 4}" fill="#b5623e"${isLast ? ' stroke="#faf7f4" stroke-width="2"' : ''}/>`;
  }).join('');
  const labels = months.map((m, i) =>
    `<text x="${padL + i * gap}" y="${H + 2}" class="axis-label" text-anchor="middle">${m}</text>`
  ).join('');

  container.innerHTML = `
    <div class="chart-wrap">
      <div class="chart-title">Season Points</div>
      <div class="chart-sub">Cumulative points earned over time</div>
      <svg class="chart" height="${H + 10}" viewBox="0 0 ${W} ${H + 10}">
        <line x1="${padL}" y1="${yScale(1000)}" x2="${W - padR}" y2="${yScale(1000)}" stroke="#eee8e0" stroke-width="1"/>
        <line x1="${padL}" y1="${yScale(500)}" x2="${W - padR}" y2="${yScale(500)}" stroke="#eee8e0" stroke-width="1"/>
        <text x="0" y="${yScale(1000) + 3}" class="axis-label">1000</text>
        <text x="0" y="${yScale(500) + 3}" class="axis-label">500</text>
        <polygon points="${fill}" fill="rgba(181,98,62,0.08)"/>
        <polyline points="${line}" fill="none" stroke="#b5623e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${dots}
        ${labels}
      </svg>
    </div>`;
}

function renderPointsLog() {
  const container = document.getElementById('points-log-list');
  if (!container) return;
  container.innerHTML = POINTS_LOG.map(e => {
    const bgColor = e.icon === '📋' ? 'rgba(181,98,62,0.1)' :
      e.icon === '🏆' ? 'rgba(176,144,112,0.1)' : 'rgba(61,139,122,0.1)';
    return `<div class="pts-hist-item">
      <div class="pts-hist-icon" style="background:${bgColor}">${e.icon}</div>
      <div class="pts-hist-info"><div class="pts-hist-label">${e.label}</div>
        <div class="pts-hist-date">${e.date} · ${e.attr}</div></div>
      <div class="pts-hist-val">+${e.pts}</div></div>`;
  }).join('');
}

function renderCompletedTasks() {
  const container = document.getElementById('completed-tasks-list');
  if (!container) return;
  container.innerHTML = TASKS_COMPLETED.map(t =>
    `<div class="task-item" data-attr="${t.attr}"><div class="task-check done"></div>
      <div class="task-body"><div class="task-title done">${t.title}</div>
      <div class="task-meta"><span class="t-tag tag-${t.attr}">${ATTRS.find(a=>a.key===t.attr)?.name||t.attr}</span>
        <span class="task-type">${t.date}</span><span class="task-pts">+${t.pts} pts</span></div></div></div>`
  ).join('');
}

// ══════════════════════════════════════════════════════
// ASSESSMENT FLOW UI
// ══════════════════════════════════════════════════════

function initAssessProgress() {
  const bar = document.getElementById('assess-progress');
  bar.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const pip = document.createElement('div');
    pip.className = 'progress-pip';
    bar.appendChild(pip);
  }
}

function renderQ() {
  const q = QUESTIONS[state.currentQ];
  document.getElementById('q-text').textContent = q.text;
  document.getElementById('assess-sub').textContent = `Question ${state.currentQ + 1} of ${QUESTIONS.length}`;
  document.querySelectorAll('.progress-pip').forEach((p, i) => p.classList.toggle('done', i <= state.currentQ));

  const grid = document.getElementById('answer-grid');
  grid.innerHTML = '';
  [1, 2, 3, 4].forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn' + (state.answers[state.currentQ] === val ? ' selected' : '');
    btn.innerHTML = `<span class="ans-num">${val}</span><span class="ans-label">${ANSWER_LABELS[val - 1]}</span>`;
    btn.onclick = () => selectAnswer(val);
    grid.appendChild(btn);
  });

  document.getElementById('btn-next').disabled = (state.answers[state.currentQ] === null);
  document.getElementById('btn-back').style.display = state.currentQ > 0 ? 'block' : 'none';
  document.getElementById('btn-next').textContent = state.currentQ === QUESTIONS.length - 1 ? 'Submit' : 'Next →';
}

function selectAnswer(val) {
  state.answers[state.currentQ] = val;
  document.querySelectorAll('.answer-btn').forEach((b, i) => b.classList.toggle('selected', i + 1 === val));
  document.getElementById('btn-next').disabled = false;
}

function submitAssessment() {
  const attrKeys = ATTRS.map(a => a.key);
  const attrScores = attrKeys.map((_, i) => {
    const group = state.answers.slice(i * 4, i * 4 + 4);
    const avg = group.reduce((a, b) => a + (b || 0), 0) / 4;
    return Math.round((avg / 4) * 100);
  });
  const score = Math.round(attrScores.reduce((a, b) => a + b, 0) / attrScores.length);

  // Hide question UI
  document.getElementById('q-card').style.display = 'none';
  document.getElementById('q-nav').style.display = 'none';
  document.getElementById('assess-progress').style.display = 'none';
  document.getElementById('assess-sub').textContent = 'Completed';

  // Show results
  document.getElementById('score-result').textContent = score;
  document.getElementById('score-breakdown').innerHTML = ATTRS.map((a, i) => {
    const s = attrScores[i];
    return `<div class="score-row"><div class="score-row-label">${a.name}</div>
      <div class="score-row-bar-bg"><div class="score-row-bar" style="width:${s}%;background:${a.color}"></div></div>
      <div class="score-row-val" style="color:${a.color}">${s}</div></div>`;
  }).join('');
  document.getElementById('score-preview').style.display = 'flex';

  // Render profile card (v4 Section 14)
  renderProfileCard(score, attrScores);

  // Award points
  addPoints(20);
  renderAll();
  showToast('✓ Submitted · +20 season points earned');
}

// ── Mental Profile Card (v4 Section 14) ──

function renderProfileCard(score, attrScores) {
  const card = document.getElementById('profile-card');
  const colors = ['#3d8b7a','#b5623e','#6b9e78','#b09070','#c47a7a','#7e6fa0'];
  card.innerHTML = `
    <div class="profile-card-header">
      <div><div class="profile-card-name">${ATHLETE.name}</div><div class="profile-card-season">Season ${ATHLETE.season}</div></div>
      <div class="profile-card-score"><div class="profile-card-score-num">${score}</div><div class="profile-card-score-label">Mental Ratio</div></div>
    </div>
    <div class="profile-card-attrs">
      ${ATTRS.map((a, i) => `<div class="pc-attr">
        <div class="pc-attr-icon">${a.icon}</div>
        <div class="pc-attr-name">${a.name}</div>
        <div class="pc-attr-bar-bg"><div class="pc-attr-bar" style="width:${attrScores[i]}%;background:${colors[i]}"></div></div>
        <div class="pc-attr-val" style="color:${colors[i]}">${attrScores[i]}</div>
      </div>`).join('')}
    </div>
    <div class="profile-card-footer">
      <div class="profile-card-brand">Mental Ratio</div>
      <div class="profile-card-date">mentalratio.com</div>
    </div>`;
  document.getElementById('profile-card-wrap').style.display = 'block';
}

// ── Render all (called after state changes) ──

function renderAll() {
  renderRatioHero();
  renderUnlockTracks();
  renderAttrGrid();
  renderPtsCards();
}
