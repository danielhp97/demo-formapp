// ══════════════════════════════════════════════════════
// STATE.JS — Mutable state + progression logic
// ══════════════════════════════════════════════════════

const state = {
  seasonPoints: TOTAL_SEASON_POINTS,  // from data.js
  currentQ: 0,
  answers: new Array(24).fill(null),
};

// ── Level helpers ──

function getCurrentLevel() {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (state.seasonPoints >= LEVELS[i].threshold) return i;
  }
  return 0;
}

function getNextThreshold() {
  const lvl = getCurrentLevel();
  return lvl < LEVELS.length - 1
    ? LEVELS[lvl + 1].threshold
    : LEVELS[LEVELS.length - 1].threshold;
}

function getLevelProgress() {
  const lvl = getCurrentLevel();
  const curr = LEVELS[lvl].threshold;
  const next = getNextThreshold();
  if (curr === next) return 1;
  return (state.seasonPoints - curr) / (next - curr);
}

// ── Insight unlock logic (v4 Section 6.3) ──
// Explorer: none. Analyst: top 2. Specialist: top 4. Elite: all 6.

function isAttrUnlocked(key) {
  const lvl = getCurrentLevel();
  if (lvl >= 3) return true;
  const current = currentSession().scores;
  const sorted = ATTRS.map(a => ({ key: a.key, score: current[a.key] }))
    .sort((a, b) => b.score - a.score);
  if (lvl >= 2) return sorted.slice(0, 4).some(a => a.key === key);
  if (lvl >= 1) return sorted.slice(0, 2).some(a => a.key === key);
  return false;
}

// ── Points mutation ──

function addPoints(pts) {
  state.seasonPoints += pts;
}

