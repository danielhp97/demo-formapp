// ══════════════════════════════════════════════════════
// DATA.JS — All athlete data, questions, and history
// Swap this file to demo a different athlete.
// ══════════════════════════════════════════════════════

const ATHLETE = {
  name: 'Vital',
  initials: 'V',
  season: '2025/26',
};

// ── Attribute definitions ──
// Order matters: Resilience → Discipline → Game IQ → Influence → Intensity → Focus
// Colours match the original Portuguese model palette.
const ATTRS = [
  { key:'resilience', icon:'🏔️', name:'Resilience',  namePt:'Resiliência',          color:'var(--resilience)' },
  { key:'discipline', icon:'🔑', name:'Discipline',   namePt:'Disciplina',           color:'var(--discipline)' },
  { key:'gameiq',     icon:'🧠', name:'Game IQ',      namePt:'Inteligência de Jogo', color:'var(--gameiq)' },
  { key:'influence',  icon:'🤝', name:'Influence',    namePt:'Influência',           color:'var(--influence)' },
  { key:'intensity',  icon:'⚡', name:'Intensity',    namePt:'Intensidade',          color:'var(--intensity)' },
  { key:'focus',      icon:'🎯', name:'Focus',        namePt:'Foco',                 color:'var(--focus)' },
];

// ── Level thresholds (v4 Section 6.2) ──
// Fixed per season. Do not change mid-season.
const LEVELS = [
  { name:'Explorer',   icon:'🌱', threshold:0 },
  { name:'Analyst',    icon:'🔍', threshold:300 },
  { name:'Specialist', icon:'🧬', threshold:600 },
  { name:'Elite',      icon:'🏆', threshold:1000 },
];

// ══════════════════════════════════════════════════════
// HISTORICAL SESSIONS
// Session 6 = real CSV data. Sessions 1–5 = fabricated
// progression toward real scores.
// ══════════════════════════════════════════════════════

const SESSIONS = [
  {
    id: 1,
    date: '15 Sep 2025',
    month: 'Sep',
    type: 'self',
    scores: { resilience:69, discipline:63, gameiq:75, influence:56, intensity:69, focus:56 },
  },
  {
    id: 2,
    date: '18 Oct 2025',
    month: 'Oct',
    type: 'self',
    scores: { resilience:75, discipline:69, gameiq:81, influence:63, intensity:75, focus:63 },
  },
  {
    id: 3,
    date: '22 Nov 2025',
    month: 'Nov',
    type: 'self',
    scores: { resilience:75, discipline:75, gameiq:81, influence:63, intensity:81, focus:69 },
  },
  {
    id: 4,
    date: '14 Dec 2025',
    month: 'Dec',
    type: 'self',
    scores: { resilience:81, discipline:75, gameiq:88, influence:69, intensity:81, focus:69 },
  },
  {
    id: 5,
    date: '18 Jan 2026',
    month: 'Jan',
    type: 'self',
    scores: { resilience:81, discipline:81, gameiq:88, influence:69, intensity:88, focus:75 },
  },
  {
    // SESSION 6 — REAL DATA from Auto_avaliação_VitalTable_1.csv
    id: 6,
    date: '15 Feb 2026',
    month: 'Feb',
    type: 'self',
    scores: { resilience:88, discipline:81, gameiq:94, influence:75, intensity:88, focus:75 },
  },
];

// ── Scout evaluation — REAL DATA ──
// Real scout evaluation data
const SCOUT_EVAL = {
  date: 'Season 2025/26',
  label: 'Scout Evaluation',
  note: 'External evaluation · All 6 attributes',
  scores: { resilience:100, discipline:100, gameiq:97, influence:100, intensity:100, focus:88 },
};

// Helper: compute total from a scores object (equal weights default)
function totalScore(scores) {
  const keys = ATTRS.map(a => a.key);
  const sum = keys.reduce((acc, k) => acc + (scores[k] || 0), 0);
  return Math.round(sum / keys.length);
}

// Current session = last in array
function currentSession() { return SESSIONS[SESSIONS.length - 1]; }
function previousSession() { return SESSIONS.length > 1 ? SESSIONS[SESSIONS.length - 2] : null; }

// ══════════════════════════════════════════════════════
// SELF-ASSESSMENT QUESTIONS (v4 Section 5.2)
// 24 questions, 4 per attribute, in order.
// Attribute labels are HIDDEN during the questionnaire.
// ══════════════════════════════════════════════════════

const QUESTIONS = [
  // Resilience
  { attr:'Resilience', color:'var(--resilience)', text:'How do you think you reacted to difficulties this past season — injuries, adapting to change, failures on the pitch?' },
  { attr:'Resilience', color:'var(--resilience)', text:'Did you demonstrate the ability to be persistent and successful even in hostile contexts — team, family, environment?' },
  { attr:'Resilience', color:'var(--resilience)', text:'Were you able to maintain composure on the pitch in all circumstances?' },
  { attr:'Resilience', color:'var(--resilience)', text:'Did you show the ability to manage stress in highly competitive situations and maintain good performance?' },
  // Discipline
  { attr:'Discipline', color:'var(--discipline)', text:'Did you give your maximum in training and games — were you determined on the pitch?' },
  { attr:'Discipline', color:'var(--discipline)', text:'Were you able to set goals and work consistently to achieve them?' },
  { attr:'Discipline', color:'var(--discipline)', text:'Were you able to maintain a positive attitude and respect the decisions of the coach and referee?' },
  { attr:'Discipline', color:'var(--discipline)', text:'Were you able to use your opponents\' weaknesses to your advantage?' },
  // Game IQ
  { attr:'Game IQ', color:'var(--gameiq)', text:'Were you able to avoid warnings — red and yellow cards, conflicts?' },
  { attr:'Game IQ', color:'var(--gameiq)', text:'Were you able to motivate teammates and demonstrate leadership qualities — were you assertive?' },
  { attr:'Game IQ', color:'var(--gameiq)', text:'Were you able to grow as a player in new situations — adapting quickly when moved to a different position?' },
  { attr:'Game IQ', color:'var(--gameiq)', text:'Were you able to play fairly, not harming opponents on purpose?' },
  // Influence
  { attr:'Influence', color:'var(--influence)', text:'When training or playing, could you forget everything around you and bring energy and grit to everything you did?' },
  { attr:'Influence', color:'var(--influence)', text:'Were you able to play for the team — seeing changes imposed during a game as a challenge rather than a personal attack?' },
  { attr:'Influence', color:'var(--influence)', text:'Did you show the ability to read the game, predict behaviours and use that advantage on the pitch?' },
  { attr:'Influence', color:'var(--influence)', text:'Did you impose intensity on the pitch and take risks?' },
  // Intensity
  { attr:'Intensity', color:'var(--intensity)', text:'Did you always give your best in training and games, regardless of circumstances?' },
  { attr:'Intensity', color:'var(--intensity)', text:'Were you able to be creative in the game and surprise your opponents?' },
  { attr:'Intensity', color:'var(--intensity)', text:'Are you proud to be a footballer — were you happy in your sport this season?' },
  { attr:'Intensity', color:'var(--intensity)', text:'Were you able to make decisions and solve problems quickly?' },
  // Focus
  { attr:'Focus', color:'var(--focus)', text:'Were you able to control your emotions and stay present — not letting past negatives influence you or becoming anxious about the future?' },
  { attr:'Focus', color:'var(--focus)', text:'Did you master positive internal narrative — the way you speak to yourself?' },
  { attr:'Focus', color:'var(--focus)', text:'Were you able to implement a mental routine that allowed you to control performance anxiety?' },
  { attr:'Focus', color:'var(--focus)', text:'Were you aware of your abilities and limitations, and tried to improve every day?' },
];

const ANSWER_LABELS = ['Rarely / never', 'Sometimes', 'Most of the time', 'Consistently'];

// ══════════════════════════════════════════════════════
// INSIGHT CONTENT (placeholder — specialist writes real ones)
// ══════════════════════════════════════════════════════

const INSIGHTS = {
  resilience: {
    strengths: 'Consistent ability to recover from setbacks and maintain composure under hostile conditions. Your response to difficulties during the season has been above average, showing marked improvement from early season.',
    develop: 'While overall strong, there may be room to build persistence in the most extreme pressure moments — extended hostile environments or cumulative setbacks.',
  },
  discipline: {
    strengths: 'Strong determination in training and games. Goal-setting habits are consistent and you maintain a positive attitude toward coaching decisions.',
    develop: 'Using opponents\' weaknesses to your advantage scored slightly lower — this suggests potential to be more tactically opportunistic.',
  },
  gameiq: {
    strengths: 'Excellent tactical awareness and adaptability. Your highest attribute across the season — demonstrating strong leadership, fair play, and ability to grow in new contexts.',
    develop: 'Conflict avoidance (warnings, cards) was your lowest Game IQ question. Managing confrontational moments more proactively could be a focus area.',
  },
  influence: {
    strengths: 'You show good capacity to read the game and predict behaviours. Willingness to take risks on the pitch is a positive signal.',
    develop: 'Playing for the team and seeing imposed changes as challenges (not personal attacks) scored lower. Building your team-first mentality when under tactical changes could significantly improve this attribute.',
  },
  intensity: {
    strengths: 'Consistent effort regardless of circumstances. Decision-making speed and pride in the sport are clear assets. Strong upward trend through the season.',
    develop: 'Creativity and ability to surprise opponents scored slightly below your other Intensity markers — pushing yourself into more inventive play could raise this further.',
  },
  focus: {
    strengths: 'Self-awareness of abilities and limitations is strong, with a genuine drive to improve daily.',
    develop: 'Emotional control and positive self-talk are areas with clear room for growth. Implementing a consistent mental routine to manage performance anxiety will be key for your development.',
  },
};

// ══════════════════════════════════════════════════════
// TASK DEFINITIONS
// ══════════════════════════════════════════════════════

const TASKS_PENDING = [
  // Personalised (weighted toward 2 lowest: influence + focus)
  { title:'Lead the warm-up session at next training',                attr:'influence', pts:50, type:'On-field',      personalised:true },
  { title:'10-min mindfulness breathing before next game',            attr:'focus',     pts:40, type:'In-app',        personalised:true },
  { title:'Voice a tactical opinion to your coach this week',         attr:'influence', pts:40, type:'On-field',      personalised:true },
  { title:'Practise positive self-talk for 5 minutes daily — 3 days', attr:'focus',    pts:45, type:'External habit', personalised:true },
  // All attributes
  { title:'Reflect on last week\'s most difficult moment',            attr:'resilience', pts:40, type:'Reflective' },
  { title:'Sleep 8h for 3 nights in a row',                           attr:'discipline', pts:50, type:'External habit' },
  { title:'Watch 20 min of match footage — identify 3 tactical patterns', attr:'gameiq', pts:35, type:'External' },
  { title:'Set a personal sprint record in next training session',    attr:'intensity',  pts:40, type:'On-field' },
  { title:'Play chess for 20 minutes',                                attr:'focus',      pts:25, type:'External' },
  { title:'Set 3 concrete goals for this week and write them down',   attr:'discipline', pts:30, type:'Reflective' },
];

const TASKS_COMPLETED = [
  { title:'Pre-game breathing exercise',          attr:'focus',      pts:40, date:'10 Feb 2026' },
  { title:'Sleep 8h for 3 nights in a row',       attr:'discipline', pts:50, date:'6 Feb 2026' },
  { title:'Lead warm-up session at training',      attr:'influence', pts:50, date:'30 Jan 2026' },
  { title:'Chess — 20 min session',               attr:'gameiq',     pts:25, date:'25 Jan 2026' },
  { title:'Voice tactical opinion to coach',       attr:'intensity',  pts:40, date:'20 Jan 2026' },
  { title:'Reflect on most difficult moment',      attr:'resilience', pts:40, date:'14 Jan 2026' },
  { title:'Set weekly goals — written',            attr:'discipline', pts:30, date:'7 Jan 2026' },
  { title:'Match footage review — 3 patterns',    attr:'gameiq',     pts:35, date:'18 Dec 2025' },
  { title:'5-min daily self-talk — 3 days',       attr:'focus',      pts:45, date:'10 Dec 2025' },
  { title:'Cold shower routine — 5 days',         attr:'discipline', pts:60, date:'1 Dec 2025' },
  { title:'Pre-game breathing exercise',          attr:'focus',      pts:40, date:'22 Nov 2025' },
  { title:'Lead warm-up at training',              attr:'influence', pts:50, date:'15 Nov 2025' },
  { title:'Sprint challenge — personal record',   attr:'intensity',  pts:40, date:'2 Nov 2025' },
  { title:'Reflect on difficult match',            attr:'resilience', pts:40, date:'20 Oct 2025' },
  { title:'Chess — 20 min session',               attr:'gameiq',     pts:25, date:'10 Oct 2025' },
];

// ══════════════════════════════════════════════════════
// POINTS LOG (chronological, newest first)
// ══════════════════════════════════════════════════════

const POINTS_LOG = [
  { label:'Self-Assessment submitted',    attr:'Assessment',  pts:20, date:'15 Feb 2026', icon:'📋' },
  { label:'Pre-game breathing exercise',  attr:'Focus',       pts:40, date:'10 Feb 2026', icon:'✓' },
  { label:'Sleep 8h for 3 nights',        attr:'Discipline',  pts:50, date:'6 Feb 2026',  icon:'✓' },
  { label:'Lead warm-up session',         attr:'Influence',   pts:50, date:'30 Jan 2026', icon:'✓' },
  { label:'Chess — 20 min session',       attr:'Game IQ',     pts:25, date:'25 Jan 2026', icon:'✓' },
  { label:'Self-Assessment submitted',    attr:'Assessment',  pts:20, date:'18 Jan 2026', icon:'📋' },
  { label:'Voice tactical opinion',       attr:'Intensity',   pts:40, date:'20 Jan 2026', icon:'✓' },
  { label:'Reflect on difficult moment',  attr:'Resilience',  pts:40, date:'14 Jan 2026', icon:'✓' },
  { label:'Set weekly goals — written',   attr:'Discipline',  pts:30, date:'7 Jan 2026',  icon:'✓' },
  { label:'Level up bonus — Explorer',    attr:'Milestone',   pts:50, date:'2 Jan 2026',  icon:'🏆' },
  { label:'Self-Assessment submitted',    attr:'Assessment',  pts:20, date:'14 Dec 2025', icon:'📋' },
  { label:'Match footage review',         attr:'Game IQ',     pts:35, date:'18 Dec 2025', icon:'✓' },
  { label:'5-min daily self-talk',        attr:'Focus',       pts:45, date:'10 Dec 2025', icon:'✓' },
  { label:'Cold shower routine — 5 days', attr:'Discipline',  pts:60, date:'1 Dec 2025',  icon:'✓' },
  { label:'Self-Assessment submitted',    attr:'Assessment',  pts:20, date:'22 Nov 2025', icon:'📋' },
  { label:'Pre-game breathing exercise',  attr:'Focus',       pts:40, date:'22 Nov 2025', icon:'✓' },
  { label:'Lead warm-up at training',     attr:'Influence',   pts:50, date:'15 Nov 2025', icon:'✓' },
  { label:'Sprint challenge — PR',        attr:'Intensity',   pts:40, date:'2 Nov 2025',  icon:'✓' },
  { label:'Self-Assessment submitted',    attr:'Assessment',  pts:20, date:'18 Oct 2025', icon:'📋' },
  { label:'Reflect on difficult match',   attr:'Resilience',  pts:40, date:'20 Oct 2025', icon:'✓' },
  { label:'Chess — 20 min session',       attr:'Game IQ',     pts:25, date:'10 Oct 2025', icon:'✓' },
  { label:'Self-Assessment submitted',    attr:'Assessment',  pts:20, date:'15 Sep 2025', icon:'📋' },
];

// Compute total earned from log
const TOTAL_SEASON_POINTS = POINTS_LOG.reduce((sum, e) => sum + e.pts, 0);

