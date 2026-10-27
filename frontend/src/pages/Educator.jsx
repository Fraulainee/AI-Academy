// Generated from design-source/Educator.dc.html by tools/convert.mjs.
// Re-running the converter regenerates (and overwrites) this file, so edit design-source/ + tools/patches.mjs instead,
// or stop using the converter and edit this file directly.
/* eslint-disable */
import React from 'react';
import DCLogic from '../dc/DCLogic.jsx';
import DcLink from '../dc/DcLink.jsx';
import { css } from '../dc/css.js';
import pageCss from './Educator.css?inline';

const THEME_KEY = 'supervaise-theme';
const THEME_EVENT = 'supervaise-theme-change';
const DARK_VARS =
  '--nv-dark:block;--nv-light:none;--bg:#090A0F;--text:#FFFFFF;--text2:#94A3B8;--text3:#6B7385;--card-bg:rgba(18,20,28,0.72);--card-border:rgba(255,255,255,0.08);--card-shadow:rgba(0,0,0,0.35);--card-shadow-hover:rgba(0,0,0,0.45);--elev:0 8px 24px rgba(0,0,0,0.35);--scrollbar:#1A1D28;--accent:#76B900;--accent-strong:#8FD400;--accent-bright:#B6F23A;--accent-cta-bg:#76B900;--accent-cta-text:#090A0F;--accent-soft-bg:rgba(118,185,0,0.14);--accent-soft-border:rgba(118,185,0,0.3);--accent-soft-text:#B6F23A;--accent-ghost-bg:rgba(118,185,0,0.08);--accent-ghost-border:rgba(118,185,0,0.25);--accent-glow:rgba(118,185,0,0.55);--accent-glow-soft:rgba(118,185,0,0.6);--accent-pulse:rgba(118,185,0,0.55);--accent-pulse-soft:rgba(118,185,0,0.12);--surface2:rgba(255,255,255,0.05);--surface2-border:rgba(255,255,255,0.08);--divider:rgba(255,255,255,0.08);--cyan:#00E5FF;--cyan-text:#67E8F9;--cyan-chip-bg:#00E5FF;--cyan-chip-text:#06202A;--cyan-glow:rgba(0,229,255,0.45);--cyan-soft-bg:rgba(0,229,255,0.07);--cyan-soft-border:rgba(0,229,255,0.22);--indigo:#8B83F0;--indigo-soft-bg:rgba(91,81,216,0.14);--indigo-soft-border:rgba(91,81,216,0.35);--amber:#FFA000;--amber-text:#FFB84D;--amber-soft-bg:rgba(255,160,0,0.14);--amber-soft-border:rgba(255,160,0,0.3);--amber-ghost-bg:rgba(255,160,0,0.08);--amber-ghost-border:rgba(255,160,0,0.25);--amber-pulse:rgba(255,160,0,0.5);--amber-pulse-soft:rgba(255,160,0,0.14);--red-soft-bg:rgba(239,68,68,0.14);--red-border:rgba(239,68,68,0.45);--red-text:#FCA5A5;--neutral-chip-bg:transparent;--neutral-chip-text:#A0A5B5;--neutral-chip-border:rgba(255,255,255,0.15);--mono-chip-bg:rgba(255,255,255,0.06);--mono-chip-text:#A0A5B5;--mono-chip-today-bg:rgba(255,160,0,0.14);--mono-chip-today-text:#FFB84D;--track:rgba(255,255,255,0.08);--footer-text:#6B7385;--footer-bg:rgba(255,255,255,0.04);--footer-border:rgba(255,255,255,0.08);--avatar-ring:rgba(118,185,0,0.6);--toggle-bg:rgba(255,255,255,0.05);--toggle-border:rgba(255,255,255,0.08);--spot1:rgba(118,185,0,0.22);--spot2:rgba(0,229,255,0.14);--spot3:rgba(91,81,216,0.16);';
const LIGHT_VARS =
  '--nv-dark:none;--nv-light:block;--bg:#F8FAFC;--text:#0F172A;--text2:#475569;--text3:#64748B;--card-bg:#FFFFFF;--card-border:#E2E8F0;--card-shadow:rgba(15,23,42,0.06);--card-shadow-hover:rgba(15,23,42,0.1);--elev:0 4px 6px -1px rgba(0,0,0,0.05),0 2px 4px -2px rgba(0,0,0,0.05);--scrollbar:#CBD5E1;--accent:#659B00;--accent-strong:#4F7A00;--accent-bright:#3D5F00;--accent-cta-bg:#4F7A00;--accent-cta-text:#FFFFFF;--accent-soft-bg:rgba(101,155,0,0.12);--accent-soft-border:rgba(101,155,0,0.35);--accent-soft-text:#4F7A00;--accent-ghost-bg:rgba(101,155,0,0.08);--accent-ghost-border:rgba(101,155,0,0.3);--accent-glow:rgba(101,155,0,0.35);--accent-glow-soft:rgba(101,155,0,0.3);--accent-pulse:rgba(101,155,0,0.4);--accent-pulse-soft:rgba(101,155,0,0.1);--surface2:#F1F5F9;--surface2-border:#E2E8F0;--divider:#E2E8F0;--cyan:#0284C7;--cyan-text:#0369A1;--cyan-chip-bg:#0284C7;--cyan-chip-text:#FFFFFF;--cyan-glow:rgba(2,132,199,0.3);--cyan-soft-bg:rgba(2,132,199,0.08);--cyan-soft-border:rgba(2,132,199,0.28);--indigo:#4F46E5;--indigo-soft-bg:rgba(79,70,229,0.08);--indigo-soft-border:rgba(79,70,229,0.25);--amber:#D97706;--amber-text:#B45309;--amber-soft-bg:rgba(217,119,6,0.12);--amber-soft-border:rgba(217,119,6,0.32);--amber-ghost-bg:rgba(217,119,6,0.08);--amber-ghost-border:rgba(217,119,6,0.28);--amber-pulse:rgba(217,119,6,0.35);--amber-pulse-soft:rgba(217,119,6,0.12);--red-soft-bg:#FEF2F2;--red-border:#FECACA;--red-text:#B91C1C;--neutral-chip-bg:#F1F5F9;--neutral-chip-text:#475569;--neutral-chip-border:#E2E8F0;--mono-chip-bg:#F1F5F9;--mono-chip-text:#475569;--mono-chip-today-bg:rgba(217,119,6,0.12);--mono-chip-today-text:#B45309;--track:#E2E8F0;--footer-text:#64748B;--footer-bg:#F1F5F9;--footer-border:#E2E8F0;--avatar-ring:rgba(101,155,0,0.45);--toggle-bg:#F1F5F9;--toggle-border:#E2E8F0;--spot1:rgba(101,155,0,0.10);--spot2:rgba(2,132,199,0.07);--spot3:rgba(79,70,229,0.08);';
function readTheme() {
  try {
    const s = localStorage.getItem(THEME_KEY);
    if (s === 'light' || s === 'dark') return s;
  } catch (e) {}
  return 'light';
}
function saveTheme(t) {
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch (e) {}
  try {
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: t }));
  } catch (e) {}
}
function bindThemeSync(comp) {
  const onStorage = (e) => {
    if (e.key === THEME_KEY && (e.newValue === 'light' || e.newValue === 'dark') && e.newValue !== comp.state.theme)
      comp.setState({ theme: e.newValue });
  };
  const onLocal = (e) => {
    const t = e.detail;
    if ((t === 'light' || t === 'dark') && t !== comp.state.theme) comp.setState({ theme: t });
  };
  try {
    window.addEventListener('storage', onStorage);
    window.addEventListener(THEME_EVENT, onLocal);
  } catch (e) {}
  return () => {
    try {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(THEME_EVENT, onLocal);
    } catch (e) {}
  };
}
function themeVals(dark) {
  return {
    themeVars: dark ? DARK_VARS : LIGHT_VARS,
    lightSegBg: dark ? 'transparent' : '#FFFFFF',
    lightSegFg: dark ? '#94A3B8' : '#0F172A',
    lightSegShadow: dark ? 'none' : '0 1px 2px rgba(15,23,42,0.12)',
    darkSegBg: dark ? 'rgba(118,185,0,0.2)' : 'transparent',
    darkSegFg: dark ? '#B6F23A' : '#64748B',
  };
}

const TABS = [
  {
    key: 'overview',
    icon: '●',
    label: 'Overview',
    title: 'Section A overview',
    sub: 'Generative AI & LLMs with NVIDIA: Week 7 of 20 at a glance',
  },
  {
    key: 'perf',
    icon: '◉',
    label: 'Student Performance',
    title: 'Student performance',
    sub: 'Completion, topic strength and who may need support',
  },
  {
    key: 'grade',
    icon: '✓',
    label: 'Cohort Grading',
    title: 'Cohort grading',
    sub: 'Laboratory 3 Part 1 · graded with the Week 7 laboratory rubric (100 points, 10% of final grade)',
  },
  {
    key: 'dgx',
    icon: '▣',
    label: 'Laboratory Compute',
    title: 'Laboratory compute allocation',
    sub: 'Plan laboratory compute against 128 GB of unified memory',
  },
  {
    key: 'profile',
    icon: '✦',
    label: 'Profile & Credentials',
    title: 'Profile & credentials',
    sub: 'What learners see about the instructor',
  },
];
const RUBRIC = [
  {
    name: 'Concept answers (Q1a, Q1b)',
    pts: 20,
    ex: 'Accurate, clear, mentions differentiability and Q/K/V roles',
    sa: 'Mostly correct, minor gaps',
    nw: 'Incorrect or missing',
  },
  {
    name: 'Hand-computed example',
    pts: 15,
    ex: 'Correct weights and output, work shown',
    sa: 'Right method, arithmetic slip',
    nw: 'Not attempted',
  },
  {
    name: 'Attention implementation',
    pts: 25,
    ex: 'Correct shapes, rows sum to 1, matches built-in function',
    sa: 'Works but no verification',
    nw: 'Wrong shapes or does not run',
  },
  {
    name: 'Experiments (scaling, hard vs soft)',
    pts: 20,
    ex: 'Both done with evidence and correct explanation',
    sa: 'One done well',
    nw: 'Superficial',
  },
  {
    name: 'Notebook 3.1 reproduction and table',
    pts: 10,
    ex: 'All three models, table, thoughtful comparison',
    sa: 'Two models',
    nw: 'Missing',
  },
  { name: 'Visualization and presentation', pts: 5, ex: 'Labelled heat map', sa: 'Unlabelled', nw: 'None' },
  { name: 'Code quality, no Colab or pip, GPU memory freed', pts: 5, ex: 'Clean, freed memory', sa: 'Minor lapses', nw: 'Ignored rules' },
];
const LEVELS = [
  { key: 'ex', label: 'Excellent', f: 1 },
  { key: 'sa', label: 'Satisfactory', f: 0.7 },
  { key: 'nw', label: 'Needs work', f: 0.3 },
];
const ptsFor = (c, li) => (li === null || li === undefined ? 0 : Math.round(c.pts * LEVELS[li].f));
const STUDENTS = [
  {
    id: 'kb',
    name: 'K. Bautista',
    ini: 'KB',
    when: '13 Oct, 20:41 PHT',
    sub: true,
    preset: [0, 0, 0, 1, 0, 0, 0],
    graded: true,
    prog: 34,
    labs: '6/6',
    kc: '6/7',
    prelim: 'Passed',
    status: 'on',
  },
  {
    id: 'lg',
    name: 'L. Garcia',
    ini: 'LG',
    when: '13 Oct, 22:05 PHT',
    sub: true,
    preset: [0, 1, 0, 0, 1, 0, 0],
    graded: true,
    prog: 32,
    labs: '6/6',
    kc: '6/7',
    prelim: 'Passed',
    status: 'on',
  },
  {
    id: 'am',
    name: 'A. Mendoza',
    ini: 'AM',
    when: '14 Oct, 09:12 PHT',
    sub: true,
    preset: null,
    graded: false,
    prog: 33,
    labs: '6/6',
    kc: '6/7',
    prelim: 'Passed',
    status: 'on',
  },
  {
    id: 'pr',
    name: 'P. Reyes',
    ini: 'PR',
    when: '14 Oct, 14:30 PHT',
    sub: true,
    preset: null,
    graded: false,
    prog: 30,
    labs: '6/6',
    kc: '4/7',
    prelim: 'Passed',
    status: 'support',
    flag: 'Knowledge check mean 54%',
  },
  {
    id: 'dv',
    name: 'D. Villanueva',
    ini: 'DV',
    when: '14 Oct, 23:58 PHT',
    sub: true,
    preset: null,
    graded: false,
    prog: 31,
    labs: '5/6',
    kc: '6/7',
    prelim: 'Passed',
    status: 'watch',
    flag: '1 laboratory late',
  },
  {
    id: 'rd',
    name: 'R. Dela Cruz',
    ini: 'RD',
    when: '15 Oct, 07:45 PHT',
    sub: true,
    preset: null,
    graded: false,
    prog: 29,
    labs: '6/6',
    kc: '5/7',
    prelim: 'Retake',
    status: 'watch',
    flag: 'Preliminary exam retake',
  },
  {
    id: 'ms',
    name: 'M. Santos',
    ini: 'MS',
    when: 'Not submitted · due 16 Oct, 11:59 PM PHT',
    sub: false,
    prog: 32,
    labs: '5/6',
    kc: '6/7',
    prelim: 'Passed',
    status: 'on',
  },
  {
    id: 'ja',
    name: 'J. Alcantara',
    ini: 'JA',
    when: 'Not submitted · due 16 Oct, 11:59 PM PHT',
    sub: false,
    prog: 27,
    labs: '4/6',
    kc: '5/7',
    prelim: 'Passed',
    status: 'support',
    flag: '2 laboratories late',
  },
];
const SESSIONS = [
  {
    id: 'l31',
    name: 'Laboratory 3 Part 1: Attention',
    when: 'Week 7 · Laboratory blocks, 15 and 16 October 2026',
    mem: 4,
    groups: 2,
    len: 2,
    reserve: 8,
    extra: '',
    note: 'Small PyTorch notebooks plus notebook 3.1 training runs.',
  },
  {
    id: 'l32',
    name: 'Laboratory 3 Part 2: Transformer',
    when: 'Week 8 · Laboratory blocks',
    mem: 6,
    groups: 2,
    len: 2,
    reserve: 8,
    extra: '',
    note: 'Decoder-block training; heavier per-learner memory.',
  },
  {
    id: 'w9',
    name: 'Week 9 prompt workshop',
    when: 'Week 9 · Whole-class session',
    mem: 1,
    groups: 1,
    len: 2,
    reserve: 24,
    extra: ', plus about 16 GB for one shared Llama-3.1-8B endpoint (fp16)',
    note: 'Learners call one shared chat model, so per-learner memory stays small.',
  },
];
const MEMS = [1, 2, 4, 6, 8],
  GROUPS = [1, 2, 3],
  LENS = [1, 2, 3];
const CAP = 128,
  SEATS = 28;

class Component extends DCLogic {
  constructor(props) {
    super(props);
    const grades = {};
    STUDENTS.forEach((s) => {
      if (s.sub) grades[s.id] = { levels: s.preset ? s.preset.slice() : [null, null, null, null, null, null, null], saved: !!s.graded };
    });
    const plan = {};
    SESSIONS.forEach((s) => {
      plan[s.id] = { mem: s.mem, groups: s.groups, len: s.len, requested: false };
    });
    this.state = {
      theme: readTheme(),
      tab: 'overview',
      filter: 'all',
      qFilter: 'todo',
      sel: 'am',
      grades,
      reminded: {},
      ses: 'l31',
      plan,
      showForm: false,
    };
    this.toggleTheme = this.toggleTheme.bind(this);
  }
  componentDidMount() {
    this._unbindTheme = bindThemeSync(this);
  }
  componentWillUnmount() {
    if (this._unbindTheme) this._unbindTheme();
  }
  toggleTheme() {
    const next = this.state.theme === 'dark' ? 'light' : 'dark';
    this.setState({ theme: next });
    saveTheme(next);
  }
  chip(on) {
    return on
      ? { bg: 'var(--accent-soft-bg)', fg: 'var(--accent-soft-text)', border: 'var(--accent-soft-border)' }
      : { bg: 'var(--surface2)', fg: 'var(--text2)', border: 'var(--surface2-border)' };
  }
  total(id) {
    const g = this.state.grades[id];
    return g ? RUBRIC.reduce((a, c, i) => a + ptsFor(c, g.levels[i]), 0) : 0;
  }
  complete(id) {
    const g = this.state.grades[id];
    return !!g && g.levels.every((l) => l !== null && l !== undefined);
  }
  statusOf(s) {
    if (!s.sub) return { status: 'Not started', sBg: 'var(--surface2)', sFg: 'var(--text3)' };
    if (this.state.grades[s.id].saved)
      return { status: this.total(s.id) + ' pts', sBg: 'var(--accent-soft-bg)', sFg: 'var(--accent-soft-text)' };
    return { status: 'Submitted', sBg: 'var(--amber-soft-bg)', sFg: 'var(--amber-text)' };
  }
  setLevel(ci, li) {
    const grades = Object.assign({}, this.state.grades);
    const g = { levels: grades[this.state.sel].levels.slice(), saved: false };
    g.levels[ci] = li;
    grades[this.state.sel] = g;
    this.setState({ grades });
  }
  nextUngraded() {
    const order = STUDENTS.filter((s) => s.sub && !this.state.grades[s.id].saved && s.id !== this.state.sel);
    if (order.length) this.setState({ sel: order[0].id, qFilter: 'todo' });
  }
  hkVals() {
    const cur = this.state.hkOpen || '';
    const tog = (k) => () => this.setState({ hkOpen: (this.state.hkOpen || '') === k ? '' : k });
    const cls = (k) => (cur === k ? 'hk is-open' : 'hk');
    const ex = (k) => (cur === k ? 'true' : 'false');
    return {
      hkTogS: tog('s'),
      hkTogU: tog('u'),
      hkTogA: tog('a'),
      hkTogT: tog('t'),
      hkClsS: cls('s'),
      hkClsU: cls('u'),
      hkClsA: cls('a'),
      hkClsT: cls('t'),
      hkExS: ex('s'),
      hkExU: ex('u'),
      hkExA: ex('a'),
      hkExT: ex('t'),
      hkScrim: cur ? 'block' : 'none',
      hkClose: () => this.setState({ hkOpen: '' }),
      hkKey: (e) => {
        if (e && e.key === 'Escape') this.setState({ hkOpen: '' });
      },
    };
  }
  renderVals() {
    return { ...this.renderVals0(), ...this.hkVals() };
  }
  renderVals0() {
    const st = this.state,
      dark = st.theme === 'dark';
    const tab = TABS.find((t) => t.key === st.tab);
    const tabs = TABS.map((t) => ({
      icon: t.icon,
      label: t.label,
      go: () => this.setState({ tab: t.key }),
      bg: t.key === st.tab ? 'linear-gradient(90deg,rgba(118,185,0,0.18),rgba(118,185,0,0.03))' : 'transparent',
      fg: t.key === st.tab ? '#B6F23A' : '#9BA3AF',
      shadow: t.key === st.tab ? 'inset 2px 0 0 #8FD400' : 'none',
    }));

    const statusChip = {
      on: ['On track', 'var(--accent-soft-bg)', 'var(--accent-soft-text)', 'var(--accent-soft-border)'],
      watch: ['Watch', 'var(--amber-soft-bg)', 'var(--amber-text)', 'var(--amber-soft-border)'],
      support: ['Needs support', 'var(--red-soft-bg)', 'var(--red-text)', 'var(--red-border)'],
    };
    const roster = STUDENTS.filter((s) => st.filter === 'all' || (st.filter === 'flag' ? s.status !== 'on' : s.status === 'on')).map(
      (s) => {
        const c = statusChip[s.status];
        return {
          name: s.name,
          ini: s.ini,
          prog: s.prog + '%',
          labs: s.labs,
          kc: s.kc,
          prelim: s.prelim,
          prelimColor: s.prelim === 'Passed' ? 'var(--accent-soft-text)' : 'var(--amber-text)',
          status: c[0],
          sBg: c[1],
          sFg: c[2],
          sBorder: c[3],
        };
      }
    );
    const filters = [
      ['all', 'All'],
      ['flag', 'Flagged'],
      ['on', 'On track'],
    ].map(([k, l]) => {
      const c = this.chip(st.filter === k);
      return { label: l, bg: c.bg, fg: c.fg, border: c.border, pick: () => this.setState({ filter: k }) };
    });
    const atRisk = STUDENTS.filter((s) => s.flag).map((s) => ({
      name: s.name,
      flag: s.flag,
      color: s.status === 'support' ? 'var(--red-text)' : 'var(--amber-text)',
    }));

    const qList = STUDENTS.filter(
      (s) => st.qFilter === 'all' || (st.qFilter === 'todo' ? !s.sub || !st.grades[s.id].saved : s.sub && st.grades[s.id].saved)
    );
    const queue = qList.map((s) => {
      const x = this.statusOf(s);
      const on = s.id === st.sel;
      return {
        name: s.name,
        ini: s.ini,
        when: s.sub ? 'Submitted ' + s.when : s.when,
        status: x.status,
        sBg: x.sBg,
        sFg: x.sFg,
        bg: on ? 'var(--accent-ghost-bg)' : 'transparent',
        border: on ? 'var(--accent-soft-border)' : 'transparent',
        pick: () => this.setState({ sel: s.id }),
      };
    });
    const toGrade = STUDENTS.filter((s) => s.sub && !st.grades[s.id].saved).length;
    const qFilters = [
      ['todo', 'Needs action'],
      ['done', 'Graded'],
      ['all', 'All'],
    ].map(([k, l]) => {
      const c = this.chip(st.qFilter === k);
      return { label: l, bg: c.bg, fg: c.fg, border: c.border, pick: () => this.setState({ qFilter: k }) };
    });

    const sel = STUDENTS.find((s) => s.id === st.sel);
    const g = sel.sub ? st.grades[sel.id] : null;
    const rubric = RUBRIC.map((c, ci) => {
      const lv = LEVELS.map((lv, li) => {
        const on = g && g.levels[ci] === li;
        const col =
          li === 0
            ? ['var(--accent-soft-bg)', 'var(--accent-soft-text)', 'var(--accent)']
            : li === 1
              ? ['var(--amber-soft-bg)', 'var(--amber-text)', 'var(--amber)']
              : ['var(--red-soft-bg)', 'var(--red-text)', 'var(--red-border)'];
        return {
          label: lv.label,
          pts: ptsFor(c, li),
          desc: c[lv.key],
          bg: on ? col[0] : 'var(--card-bg)',
          fg: on ? col[1] : 'var(--text2)',
          border: on ? col[2] : 'var(--card-border)',
          pick: () => this.setLevel(ci, li),
        };
      });
      return {
        name: c.name,
        pts: c.pts,
        got: g && g.levels[ci] !== null ? ptsFor(c, g.levels[ci]) : '\u2013',
        l0: lv[0],
        l1: lv[1],
        l2: lv[2],
      };
    });
    const total = sel.sub ? this.total(sel.id) : 0;
    const done = sel.sub && this.complete(sel.id);
    let feedback = 'Choose a level for each criterion to draft feedback.';
    if (done) {
      const strong = RUBRIC.filter((c, i) => g.levels[i] === 0).map((c) => c.name.split(' (')[0].toLowerCase());
      const weak = RUBRIC.filter((c, i) => g.levels[i] > 0).map((c, k) => c);
      feedback =
        (strong.length ? 'Strong performance on ' + strong.slice(0, 3).join(', ') + '. ' : '') +
        (weak.length
          ? 'To improve: ' + weak.map((c) => c.name.split(' (')[0] + ' (target: “' + c.ex.toLowerCase() + '”)').join('; ') + '.'
          : 'Performance is at the excellent level on every criterion.');
    }

    const ses = SESSIONS.find((s) => s.id === st.ses),
      p = st.plan[ses.id];
    const concurrent = Math.ceil(SEATS / p.groups);
    const demand = concurrent * p.mem + ses.reserve;
    const util = demand / CAP;
    const utilColor = util > 1 ? 'var(--red-text)' : util > 0.85 ? 'var(--amber-text)' : 'var(--accent-soft-text)';
    let verdict, why;
    if (util > 1) {
      verdict = 'Over capacity.';
      why = 'Split the cohort into more groups or lower memory per learner.';
    } else if (util > 0.85) {
      verdict = 'Tight fit.';
      why = 'Little headroom remains for a runaway process. Consider one more group.';
    } else {
      verdict = 'Fits comfortably.';
      why = Math.round((1 - util) * 100) + '% headroom left for spikes.';
    }
    const setPlan = (patch) => {
      const plan = Object.assign({}, st.plan);
      plan[ses.id] = Object.assign({}, p, patch, { requested: false });
      this.setState({ plan });
    };
    const opt = (vals, cur, key, fmt) =>
      vals.map((v) => {
        const c = this.chip(v === cur);
        return { label: fmt(v), bg: c.bg, fg: c.fg, border: c.border, pick: () => setPlan({ [key]: v }) };
      });
    const sessions = SESSIONS.map((s) => {
      const pp = st.plan[s.id];
      const on = s.id === st.ses;
      return {
        name: s.name,
        when: s.when,
        status: pp.requested ? 'Queued' : 'Draft',
        sBg: pp.requested ? 'var(--accent-soft-bg)' : 'var(--surface2)',
        sFg: pp.requested ? 'var(--accent-soft-text)' : 'var(--text3)',
        bg: on ? 'var(--accent-ghost-bg)' : 'transparent',
        border: on ? 'var(--accent-soft-border)' : 'transparent',
        pick: () => this.setState({ ses: s.id }),
      };
    });

    return {
      ...themeVals(dark),
      toggleTheme: this.toggleTheme,
      tabs,
      pageTitle: tab.title,
      pageSub: tab.sub,
      tOverview: st.tab === 'overview',
      tPerf: st.tab === 'perf',
      tGrade: st.tab === 'grade',
      tDgx: st.tab === 'dgx',
      tProfile: st.tab === 'profile',
      goGrading: () => this.setState({ tab: 'grade' }),
      goPerf: () => this.setState({ tab: 'perf' }),
      toGradeCount: toGrade,
      atRisk,
      weekBars: [62, 70, 75, 81, 88, 90, 54].map((v, i) => ({
        wk: i + 1,
        h: v + '%',
        color: i === 6 ? 'var(--amber)' : i === 4 ? 'var(--cyan)' : 'var(--accent)',
      })),
      topics: [
        { name: 'Q/K/V roles', pct: '82%', color: 'var(--accent)' },
        { name: 'Hard vs soft attention', pct: '61%', color: 'var(--amber)' },
        { name: 'Scaled dot-product calculation', pct: '47%', color: 'var(--red-text)' },
      ],
      filters,
      roster,
      qFilters,
      queue,
      queueNote: toGrade
        ? toGrade + ' submission(s) waiting · 2 learners have not submitted'
        : 'All submissions graded · 2 learners have not submitted',
      selHasSub: !!sel.sub,
      selNoSub: !sel.sub,
      selName: sel.name,
      selWhen: sel.when,
      rubric,
      total,
      totalColor: total >= 85 ? 'var(--accent-soft-text)' : total >= 70 ? 'var(--amber-text)' : 'var(--text)',
      totalNote: g && g.saved ? 'Saved' : done ? 'Ready to save' : 'In progress',
      feedback,
      saveGrade: () => {
        if (!done) return;
        const grades = Object.assign({}, st.grades);
        grades[sel.id] = { levels: g.levels.slice(), saved: true };
        this.setState({ grades });
      },
      saveLabel: g && g.saved ? '✓ Grade saved' : done ? 'Save grade' : 'Score every criterion',
      nextUngraded: () => this.nextUngraded(),
      remind: () => {
        const r = Object.assign({}, st.reminded);
        r[sel.id] = true;
        this.setState({ reminded: r });
      },
      remindLabel: st.reminded[sel.id] ? '✓ Reminder queued (preview)' : 'Send reminder',
      queuedCount: SESSIONS.filter((s) => st.plan[s.id].requested).length,
      sessions,
      sesName: ses.name,
      sesNote: ses.when + ' · ' + ses.note,
      memOpts: opt(MEMS, p.mem, 'mem', (v) => v + ' GB'),
      grpOpts: opt(GROUPS, p.groups, 'groups', (v) => String(v)),
      lenOpts: opt(LENS, p.len, 'len', (v) => v + ' h'),
      concurrent,
      memPer: p.mem,
      reserve: ses.reserve,
      demand,
      utilPct: Math.min(100, Math.round(util * 100)) + '%',
      utilColor,
      verdict,
      verdictWhy: why,
      groups: p.groups,
      blockLen: p.len,
      totalHours: p.groups * p.len,
      reserveExtra: ses.extra,
      request: () => {
        if (util > 1) return;
        const plan = Object.assign({}, st.plan);
        plan[ses.id] = Object.assign({}, p, { requested: true });
        this.setState({ plan });
      },
      requestLabel: p.requested ? '✓ Request queued (preview)' : util > 1 ? 'Fix capacity to request' : 'Request allocation',
      showForm: st.showForm,
      toggleForm: () => this.setState({ showForm: !st.showForm }),
    };
  }
}

function template(v) {
  return (
    <>
      <div
        style={css(
          `${v.themeVars}background:var(--bg);color:var(--text);transition:background-color .3s ease,color .3s ease;width:100%;min-height:100vh;display:flex;flex-wrap:wrap`
        )}
      >
        <div className="sidebar">
          <div style={{ padding: '8px 10px 22px' }}>
            <div
              style={{
                fontSize: '10.5px',
                fontWeight: '700',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: '#7C857A',
                lineHeight: '1.3',
                marginBottom: '6px',
              }}
            >
              {'Course'}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.3' }}>{'GenAI & LLMs with NVIDIA'}</div>
            <div style={{ width: '28px', height: '3px', borderRadius: '999px', background: '#76B900', marginTop: '10px' }}></div>
          </div>
          <div
            style={{
              margin: '8px 10px 14px',
              padding: '4px 10px',
              borderRadius: '999px',
              alignSelf: 'flex-start',
              fontSize: '10px',
              fontWeight: '800',
              letterSpacing: '.12em',
              color: '#67E8F9',
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.25)',
            }}
          >
            {'FACULTY CONSOLE'}
          </div>
          {(v.tabs || []).map((t, $index) => (
            <React.Fragment key={$index}>
              <button
                type="button"
                className="navlink navbtn"
                onClick={t?.go}
                style={css(`background:${t?.bg};color:${t?.fg};box-shadow:${t?.shadow}`)}
              >
                <span>{t?.icon}</span>
                <span>{t?.label}</span>
              </button>
            </React.Fragment>
          ))}
          <div style={{ flex: '1' }}></div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '12px 0 0', paddingTop: '12px' }}>
            <div className="profilecard" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
              <div
                style={{
                  flex: '0 0 auto',
                  width: '34px',
                  height: '34px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg,#00E5FF,#5B51D8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#FFFFFF',
                }}
              >
                {v.userInitials}
              </div>
              <div style={{ minWidth: '0' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFFFFF', lineHeight: '1.3' }}>{v.userName}</div>
                <div style={{ fontSize: '11.5px', color: '#9BA3AF', lineHeight: '1.4' }}>{'Instructor · Section A'}</div>
              </div>
            </div>
            <DcLink className="navlink" href="Landing.dc.html" onClick={v.signOut} style={{ color: '#7C857A' }}>
              <span>{'⎋'}</span>
              <span>{'Sign out'}</span>
            </DcLink>
          </div>
        </div>
        <div className="main cm" style={{}}>
          <div className="cm-w">
            <div className="utilbar">
              <div className="ctx">
                <span className="ctx-i">{'A.Y. 2026/2027'}</span> <span className="ctx-s" aria-hidden="true"></span>{' '}
                <span className="ctx-i">{'Second Semester'}</span> <span className="ctx-s" aria-hidden="true"></span>{' '}
                <span className="ctx-i ctx-now">{'Week 7 of 20'}</span> <span className="ctx-s" aria-hidden="true"></span>{' '}
                <span className="ctx-i">{'Midterm Term'}</span> <span className="ctx-s" aria-hidden="true"></span>{' '}
                <span className="ctx-i">{'Section A'}</span> <span className="ctx-s" aria-hidden="true"></span>{' '}
                <span className="ctx-i">{'28 learners'}</span>
              </div>
              <div className="hkbar" role="toolbar" aria-label="Course tools" onKeyDown={v.hkKey}>
                <div className="hk-scrim" style={css(`display:${v.hkScrim}`)} onClick={v.hkClose}></div>
                <div className={v.hkClsS}>
                  <button
                    type="button"
                    className="hkbtn"
                    aria-haspopup="true"
                    aria-expanded={v.hkExS}
                    onClick={v.hkTogS}
                    aria-label="Schedule"
                    title="Schedule (S)"
                  >
                    <svg className="hkic" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3.2" y="4.8" width="17.6" height="15.4" rx="2.6" stroke="currentColor" strokeWidth="1.7"></rect>
                      <path d="M3.2 9.4h17.6M8.2 2.9v3.6M15.8 2.9v3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"></path>
                    </svg>
                  </button>
                  <div className="hkpop">
                    <div className="hkpop-h">{'Today · Wednesday, 14 October 2026'}</div>
                    <ul className="hkl">
                      <li>
                        <span className="hkt">{'08:00'}</span>
                        <span className="hkd">
                          <b>{'Lecture 7.1: Attention mechanisms'}</b>
                          <span className="hkm">{'Room CS‑204 · Section A, 28 learners'}</span>
                        </span>
                      </li>
                      <li>
                        <span className="hkt">{'10:30'}</span>
                        <span className="hkd">
                          <b>{'Laboratory 3: Scaled dot‑product attention'}</b>
                          <span className="hkm">{'Computing Laboratory 2 · Attendance to be recorded'}</span>
                        </span>
                      </li>
                      <li>
                        <span className="hkt">{'14:00'}</span>
                        <span className="hkd">
                          <b>{'Consultation hours'}</b>
                          <span className="hkm">{'By appointment · Faculty Room 5'}</span>
                        </span>
                      </li>
                    </ul>
                    <DcLink className="hkpop-f" href="CourseMap.dc.html">
                      {'View the full course schedule'}
                    </DcLink>
                  </div>
                </div>
                <div className={v.hkClsU}>
                  <button type="button" className="hkbtn" aria-haspopup="true" aria-expanded={v.hkExU} onClick={v.hkTogU}>
                    <svg className="hkic" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="8.8" stroke="currentColor" strokeWidth="1.7"></circle>
                      <path
                        d="M12 6.9V12l3.5 2.1"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button>
                  <div className="hkpop">
                    <div className="hkpop-h">{'Grading and submission deadlines'}</div>
                    <ul className="hkl">
                      <li>
                        <span className="hkt">{'16 Oct'}</span>
                        <span className="hkd">
                          <b>{'Laboratory 3 Part 1 submissions close'}</b>
                          <span className="hkm">{'10% of final grade · 11:59 PM PHT · 26 of 28 submitted'}</span>
                        </span>
                      </li>
                      <li>
                        <span className="hkt">{'Week 8'}</span>
                        <span className="hkd">
                          <b>{'Laboratory 3 Part 2: The Transformer'}</b>
                          <span className="hkm">{'Opens for submission · Grading to follow'}</span>
                        </span>
                      </li>
                      <li>
                        <span className="hkt">{'Week 10'}</span>
                        <span className="hkd">
                          <b>{'Midterm examination'}</b>
                          <span className="hkm">{'25% of final grade · Proctored'}</span>
                        </span>
                      </li>
                    </ul>
                    <DcLink className="hkpop-f" href="Certificates.dc.html">
                      {'View all assessments and weights'}
                    </DcLink>
                  </div>
                </div>
                <div className={v.hkClsA}>
                  <button type="button" className="hkbtn" aria-haspopup="true" aria-expanded={v.hkExA} onClick={v.hkTogA}>
                    <svg className="hkic" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M18.3 16.2V10.6a6.3 6.3 0 1 0-12.6 0v5.6l-1.6 2.3h15.8z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      ></path>
                      <path d="M9.9 21.1h4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"></path>
                    </svg>
                    <span className="hkn">{'3'}</span>
                  </button>
                  <div className="hkpop">
                    <div className="hkpop-h">{'Requires faculty action'}</div>
                    <ul className="hkl">
                      <li>
                        <span className="hkt">{'Today'}</span>
                        <span className="hkd">
                          <b>{'4 submissions awaiting grading'}</b>
                          <span className="hkm">{'Laboratory 3 Part 1 · Open the Cohort Grading tab'}</span>
                        </span>
                      </li>
                      <li>
                        <span className="hkt">{'Today'}</span>
                        <span className="hkd">
                          <b>{'2 learners have not submitted'}</b>
                          <span className="hkm">{'Send reminder before 16 October 2026, 11:59 PM PHT'}</span>
                        </span>
                      </li>
                      <li>
                        <span className="hkt">{'Week 7'}</span>
                        <span className="hkd">
                          <b>{'4 learners flagged for follow-up'}</b>
                          <span className="hkm">{'Schedule consultation with learners needing support'}</span>
                        </span>
                      </li>
                    </ul>
                    <DcLink className="hkpop-f" href="#">
                      {'Open the grading queue'}
                    </DcLink>
                  </div>
                </div>
                <div className={v.hkClsT}>
                  <button
                    type="button"
                    className="hkbtn hkbtn-icon"
                    aria-haspopup="true"
                    aria-expanded={v.hkExT}
                    onClick={v.hkTogT}
                    aria-label="Settings"
                    title="Settings"
                  >
                    <svg className="hkic" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="3.1" stroke="currentColor" strokeWidth="1.7"></circle>
                      <path
                        d="M19.3 14.4a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a1.9 1.9 0 0 1-3.8 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.3a1.9 1.9 0 0 1 0-3.8h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5v-.3a1.9 1.9 0 0 1 3.8 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a1.9 1.9 0 0 1 0 3.8h-.2a1.6 1.6 0 0 0-1.5 1z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button>
                  <div className="hkpop">
                    <div className="hkpop-h">{'Settings'}</div>
                    <div className="setrow">
                      <span className="setlab">{'Appearance'}</span>{' '}
                      <button
                        type="button"
                        className="themepill"
                        onClick={v.toggleTheme}
                        aria-label="Switch between light and dark theme"
                        title="Switch between light and dark theme"
                      >
                        <span
                          className="themeseg"
                          style={css(`background:${v.lightSegBg};color:${v.lightSegFg};box-shadow:${v.lightSegShadow}`)}
                        >
                          {'Light'}
                        </span>
                        <span className="themeseg" style={css(`background:${v.darkSegBg};color:${v.darkSegFg}`)}>
                          {'Dark'}
                        </span>
                      </button>
                    </div>
                    <div className="setrow">
                      <span className="setlab">{'Notifications'}</span>
                      <span className="setval">{'Email and in‑app'}</span>
                    </div>
                    <div className="setrow">
                      <span className="setlab">{'Time zone'}</span>
                      <span className="setval">
                        {'Philippine Standard Time'}
                        <br />
                        {'(UTC+8)'}
                      </span>
                    </div>
                    <div className="setrow">
                      <span className="setlab">{'Teaching section'}</span>
                      <span className="setval">{'Section A'}</span>
                    </div>
                    <DcLink className="hkpop-f" href="#">
                      {'Account and privacy settings'}
                    </DcLink>
                  </div>
                </div>
              </div>
            </div>
            <header className="hx hx-blue">
              <div className="hx-body">
                <div className="eyebrow" style={{ marginBottom: 'var(--s2)' }}>
                  {'Faculty console'}
                </div>
                <h1 className="cm-title">{v.pageTitle}</h1>
                <div className="cm-kicker" style={{ margin: '0' }}>
                  {v.pageSub}
                </div>
              </div>
              <div className="hx-ico">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 20V10M12 20V4M19 20v-7"></path>
                </svg>
              </div>
            </header>
            {v.tOverview ? (
              <>
                <div className="sect">
                  <div className="sect-h">
                    <h2 className="sect-t">{'Requires your attention'}</h2>
                    <span className="sect-n">
                      {v.toGradeCount}
                      {' submissions awaiting grading · 4 learners flagged'}
                    </span>
                  </div>
                  <div className="g2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: '18px' }}>
                    <div className="card" style={{ padding: '22px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>{'Learners who may need support'}</div>
                        <span className="demo">{'Demo data'}</span>
                      </div>
                      {(v.atRisk || []).map((s, $index) => (
                        <React.Fragment key={$index}>
                          <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
                            <span style={{ fontWeight: '500' }}>{s?.name}</span>
                            <span style={css(`color:${s?.color};font-weight:500;font-size:14px`)}>{s?.flag}</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="card" style={{ padding: '22px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>{'Grading queue'}</div>
                      <div style={{ fontSize: '15px', color: 'var(--text2)', marginBottom: '14px' }}>
                        {'Laboratory 3 Part 1 has '}
                        {v.toGradeCount}
                        {' submissions awaiting grading. Two learners have not submitted.'}
                      </div>
                      <button type="button" className="solidbtn" onClick={v.goGrading} style={{ padding: '9px 16px', fontSize: '14px' }}>
                        {'Open grading queue'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="sect">
                  <div className="sect-h">
                    <h2 className="sect-t">{'Class performance'}</h2>
                    <span className="sect-n">{'Section A · Week 7 of 20'}</span>
                  </div>
                  <div className="g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '16px' }}>
                    <div className="card kpi">
                      <div className="l">{'ENROLLED LEARNERS'}</div>
                      <div className="v">{'28'}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text3)' }}>{'Section A'}</div>
                    </div>
                    <div className="card kpi">
                      <div className="l">{'SEMESTER PROGRESS'}</div>
                      <div className="v">
                        {'Week 7'}
                        <span style={{ fontSize: '15px', color: 'var(--text3)' }}>{' of 20'}</span>
                      </div>
                      <div className="bar" style={{ marginTop: '8px' }}>
                        <div className="barfill" style={{ width: '35%', background: 'var(--accent)' }}></div>
                      </div>
                    </div>
                    <div className="card kpi">
                      <div className="l">{'PRELIMINARY EXAMINATION PASS RATE'}</div>
                      <div className="v">{'93%'}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text3)' }}>{'Midterm examination: Week 10'}</div>
                    </div>
                  </div>
                </div>
                <div className="sect">
                  <div className="sect-h">
                    <h2 className="sect-t">{'Submissions and grading'}</h2>
                    <span className="sect-n">{'Laboratory 3 Part 1 · 10% of final grade'}</span>
                  </div>
                  <div className="g2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: '18px' }}>
                    <div className="card" style={{ padding: '22px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>{'Upcoming: Weeks 7 to 10'}</div>
                        <span className="demo">{'Demo data'}</span>
                      </div>
                      <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
                        <span>{'Laboratory 3 Part 1 submissions close, 16 October 2026, 11:59 PM PHT'}</span>
                        <span className="badge" style={{ background: 'var(--amber-soft-bg)', color: 'var(--amber-text)' }}>
                          {'Week 7'}
                        </span>
                      </div>
                      <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
                        <span>{'Knowledge check GA-3.1 auto-grading'}</span>
                        <span className="badge" style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>
                          {'In progress'}
                        </span>
                      </div>
                      <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
                        <span>{'Laboratory 3 Part 2: The Transformer'}</span>
                        <span className="badge" style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>
                          {'Week 8'}
                        </span>
                      </div>
                      <div className="row" style={{ gridTemplateColumns: '1fr auto' }}>
                        <span>{'Week 9 prompt-engineering workshop (class-wide model use)'}</span>
                        <span className="badge" style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>
                          {'Week 9'}
                        </span>
                      </div>
                      <div className="row" style={{ gridTemplateColumns: '1fr auto', borderBottom: 'none' }}>
                        <span>{'Midterm examination (proctored, 25% of final grade)'}</span>
                        <span className="badge" style={{ background: 'var(--red-soft-bg)', color: 'var(--red-text)' }}>
                          {'Week 10'}
                        </span>
                      </div>
                    </div>
                    <div className="card kpi" style={{ padding: '22px' }}>
                      <div className="l">{'LABORATORY 3 PART 1 SUBMITTED'}</div>
                      <div className="v">
                        {'26'}
                        <span style={{ fontSize: '15px', color: 'var(--text3)' }}>{' of 28'}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--amber-text)', fontWeight: '500' }}>
                        {v.toGradeCount}
                        {' awaiting grading'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sect">
                  <div className="sect-h">
                    <h2 className="sect-t">{'Learner roster'}</h2>
                    <span className="sect-n">{'28 learners · Section A'}</span>
                  </div>
                  <div
                    className="card"
                    style={{
                      padding: '22px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                    }}
                  >
                    <div style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '640px' }}>
                      {'Completion, laboratory results, knowledge checks and status are listed for every learner in Section A.'}
                    </div>
                    <button type="button" className="ghostbtn" onClick={v.goPerf} style={{ padding: '9px 16px', fontSize: '14px' }}>
                      {'Open full roster'}
                    </button>
                  </div>
                </div>
              </>
            ) : null}{' '}
            {v.tPerf ? (
              <>
                <div
                  className="g2"
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: '18px', marginBottom: '18px' }}
                >
                  <div className="card" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{'Weekly activity completion'}</div>
                      <span className="demo">{'Demo data'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px' }}>
                      {(v.weekBars || []).map((b, $index) => (
                        <React.Fragment key={$index}>
                          <div
                            style={{
                              flex: '1',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '5px',
                              height: '100%',
                              justifyContent: 'flex-end',
                            }}
                          >
                            <div className="mono" style={{ fontSize: '13px', color: 'var(--text3)' }}>
                              {b?.h}
                            </div>
                            <div style={css(`width:100%;border-radius:6px 6px 2px 2px;background:${b?.color};height:${b?.h}`)}></div>
                            <div className="mono" style={{ fontSize: '13px', color: 'var(--text3)' }}>
                              {'W'}
                              {b?.wk}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '8px' }}>
                      {'Week 7 is still open. Laboratory 3 Part 1 is due 17 October 2026, 11:59 PM PHT.'}
                    </div>
                  </div>
                  <div className="card" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{'Topic strength · GA-3.1'}</div>
                      <span className="demo">{'Demo data'}</span>
                    </div>
                    {(v.topics || []).map((tp, $index) => (
                      <React.Fragment key={$index}>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '5px' }}>
                            <span>{tp?.name}</span>
                            <span className="mono" style={css(`font-weight:500;color:${tp?.color}`)}>
                              {tp?.pct}
                            </span>
                          </div>
                          <div className="bar">
                            <div className="barfill" style={css(`width:${tp?.pct};background:${tp?.color}`)}></div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    <div style={{ fontSize: '13px', color: 'var(--text3)' }}>
                      {"Weakest area matches the rubric's most common mistake: softmax over the wrong dimension."}
                    </div>
                  </div>
                </div>
                <div className="card" style={{ padding: '22px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {'Student performance '}
                      <span style={{ fontWeight: '500', color: 'var(--text3)', fontSize: '14px' }}>{'· 8 of 28 shown'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {(v.filters || []).map((f, $index) => (
                        <React.Fragment key={$index}>
                          <button
                            type="button"
                            className="chipbtn"
                            onClick={f?.pick}
                            style={css(`background:${f?.bg};color:${f?.fg};border:1px solid ${f?.border}`)}
                          >
                            {f?.label}
                          </button>
                        </React.Fragment>
                      ))}
                      <span className="demo">{'Demo data'}</span>
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{
                      gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1.3fr) 70px 70px 90px 120px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--text3)',
                    }}
                  >
                    <span>{'Learner'}</span>
                    <span>{'Course completion'}</span>
                    <span>{'Labs'}</span>
                    <span>{'Checks'}</span>
                    <span>{'Preliminary'}</span>
                    <span style={{ textAlign: 'right' }}>{'Status'}</span>
                  </div>
                  {(v.roster || []).map((r, $index) => (
                    <React.Fragment key={$index}>
                      <div className="row" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1.3fr) 70px 70px 90px 120px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: '0' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              flexShrink: '0',
                              borderRadius: '999px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '13px',
                              fontWeight: '600',
                              background: 'var(--surface2)',
                              color: 'var(--text2)',
                              border: '1px solid var(--surface2-border)',
                            }}
                          >
                            {r?.ini}
                          </span>
                          <span style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {r?.name}
                          </span>
                        </span>{' '}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="bar" style={{ flex: '1' }}>
                            <span className="barfill" style={css(`display:block;width:${r?.prog};background:var(--accent)`)}></span>
                          </span>
                          <span className="mono" style={{ fontSize: '13px', color: 'var(--text3)', width: '32px' }}>
                            {r?.prog}
                          </span>
                        </span>{' '}
                        <span className="mono" style={{ fontSize: '14px' }}>
                          {r?.labs}
                        </span>{' '}
                        <span className="mono" style={{ fontSize: '14px' }}>
                          {r?.kc}
                        </span>{' '}
                        <span style={css(`font-size:14px;color:${r?.prelimColor};font-weight:500`)}>{r?.prelim}</span>{' '}
                        <span style={{ textAlign: 'right' }}>
                          <span className="badge" style={css(`background:${r?.sBg};color:${r?.sFg};border:1px solid ${r?.sBorder}`)}>
                            {r?.status}
                          </span>
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </>
            ) : null}{' '}
            {v.tGrade ? (
              <>
                <div
                  className="g2"
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.35fr)', gap: '18px', alignItems: 'start' }}
                >
                  <div className="card" style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600' }}>{'Laboratory 3 Part 1 queue'}</div>
                      <span className="demo">{'Demo data'}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '10px' }}>
                      {'Scaled dot-product attention · 10% of final grade · closes 16 October 2026, 11:59 PM PHT'}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {(v.qFilters || []).map((f, $index) => (
                        <React.Fragment key={$index}>
                          <button
                            type="button"
                            className="chipbtn"
                            onClick={f?.pick}
                            style={css(`background:${f?.bg};color:${f?.fg};border:1px solid ${f?.border}`)}
                          >
                            {f?.label}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {(v.queue || []).map((q, $index) => (
                        <React.Fragment key={$index}>
                          <button
                            type="button"
                            className="qrow"
                            onClick={q?.pick}
                            style={css(`background:${q?.bg};border:1px solid ${q?.border}`)}
                          >
                            <span
                              style={{
                                width: '30px',
                                height: '30px',
                                flexShrink: '0',
                                borderRadius: '999px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: '600',
                                background: 'var(--surface2)',
                                color: 'var(--text2)',
                              }}
                            >
                              {q?.ini}
                            </span>{' '}
                            <span style={{ flex: '1', minWidth: '0' }}>
                              <span style={{ display: 'block', fontSize: '15px', fontWeight: '500', color: 'var(--text)' }}>{q?.name}</span>
                              <span style={{ display: 'block', fontSize: '13px', color: 'var(--text3)' }}>{q?.when}</span>
                            </span>{' '}
                            <span className="badge" style={css(`background:${q?.sBg};color:${q?.sFg}`)}>
                              {q?.status}
                            </span>
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '10px' }}>{v.queueNote}</div>
                  </div>
                  <div className="card" style={{ padding: '22px' }}>
                    {v.selHasSub ? (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '12px',
                            marginBottom: '14px',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '600' }}>{v.selName}</div>
                            <div style={{ fontSize: '14px', color: 'var(--text3)' }}>
                              {'Submitted '}
                              {v.selWhen}
                              {' · executed notebook + heat map'}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="mono" style={css(`font-size:26px;font-weight:500;color:${v.totalColor};line-height:1.1`)}>
                              {v.total}
                              <span style={{ fontSize: '16px', color: 'var(--text3)' }}>{'/100'}</span>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text3)' }}>{v.totalNote}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                          {(v.rubric || []).map((c, $index) => (
                            <React.Fragment key={$index}>
                              <div>
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    fontSize: '14px',
                                    marginBottom: '5px',
                                  }}
                                >
                                  <span style={{ fontWeight: '500' }}>{c?.name}</span>
                                  <span className="mono" style={{ color: 'var(--text3)', flexShrink: '0' }}>
                                    {c?.got}
                                    {' / '}
                                    {c?.pts}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button
                                    type="button"
                                    className="lvl"
                                    onClick={c?.l0?.pick}
                                    title={c?.l0?.desc}
                                    style={css(`background:${c?.l0?.bg};color:${c?.l0?.fg};border:1px solid ${c?.l0?.border}`)}
                                  >
                                    {c?.l0?.label}
                                    {' · '}
                                    {c?.l0?.pts}
                                  </button>
                                  <button
                                    type="button"
                                    className="lvl"
                                    onClick={c?.l1?.pick}
                                    title={c?.l1?.desc}
                                    style={css(`background:${c?.l1?.bg};color:${c?.l1?.fg};border:1px solid ${c?.l1?.border}`)}
                                  >
                                    {c?.l1?.label}
                                    {' · '}
                                    {c?.l1?.pts}
                                  </button>
                                  <button
                                    type="button"
                                    className="lvl"
                                    onClick={c?.l2?.pick}
                                    title={c?.l2?.desc}
                                    style={css(`background:${c?.l2?.bg};color:${c?.l2?.fg};border:1px solid ${c?.l2?.border}`)}
                                  >
                                    {c?.l2?.label}
                                    {' · '}
                                    {c?.l2?.pts}
                                  </button>
                                </div>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: 'var(--surface2)',
                            border: '1px solid var(--surface2-border)',
                            marginBottom: '14px',
                          }}
                        >
                          <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text3)', marginBottom: '4px' }}>
                            {'FEEDBACK DRAFT'}
                          </div>
                          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>{v.feedback}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <button type="button" className="solidbtn" onClick={v.saveGrade}>
                            {v.saveLabel}
                          </button>
                          <button type="button" className="ghostbtn" onClick={v.nextUngraded}>
                            {'Next ungraded →'}
                          </button>
                          <span style={{ fontSize: '13px', color: 'var(--text3)' }}>
                            {'Points per level are suggestions from the Week 7 laboratory rubric.'}
                          </span>
                        </div>
                      </>
                    ) : null}{' '}
                    {v.selNoSub ? (
                      <>
                        <div style={{ padding: '24px 4px' }}>
                          <div style={{ fontSize: '16px', fontWeight: '600' }}>
                            {v.selName}
                            {' has not submitted'}
                          </div>
                          <div style={{ fontSize: '15px', color: 'var(--text2)', margin: '4px 0 16px' }}>
                            {'Laboratory 3 Part 1 closes 16 October 2026, 11:59 PM PHT.'}
                          </div>
                          <button type="button" className="solidbtn" onClick={v.remind}>
                            {v.remindLabel}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}{' '}
            {v.tDgx ? (
              <>
                <div
                  style={{
                    background: 'var(--amber-soft-bg)',
                    border: '1px solid var(--amber-soft-border)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ fontSize: '15px', color: 'var(--text)' }}>
                    <b style={{ color: 'var(--amber-text)' }}>{'Preview data.'}</b>
                    {
                      ' Laboratory sessions run on NVIDIA-accelerated infrastructure provided by the programme. No live resource data is read in this preview, and requests are queued for the programme office.'
                    }
                  </div>
                </div>
                <div
                  className="g4"
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '16px', marginBottom: '18px' }}
                >
                  <div className="card kpi">
                    <div className="l">{'LABORATORY MEMORY'}</div>
                    <div className="v">{'128 GB'}</div>
                    <div style={{ fontSize: '14px', color: 'var(--text3)' }}>{'Unified memory available to the cohort'}</div>
                  </div>
                  <div className="card kpi">
                    <div className="l">{'REQUESTS QUEUED'}</div>
                    <div className="v">{v.queuedCount}</div>
                    <div style={{ fontSize: '14px', color: 'var(--text3)' }}>{'This preview'}</div>
                  </div>
                </div>
                <div
                  className="g2"
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.3fr)', gap: '18px', alignItems: 'start' }}
                >
                  <div className="card" style={{ padding: '18px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>{'Sessions needing compute'}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(v.sessions || []).map((se, $index) => (
                        <React.Fragment key={$index}>
                          <button
                            type="button"
                            className="qrow"
                            onClick={se?.pick}
                            style={css(`background:${se?.bg};border:1px solid ${se?.border}`)}
                          >
                            <span style={{ flex: '1', minWidth: '0' }}>
                              <span style={{ display: 'block', fontSize: '15px', fontWeight: '500', color: 'var(--text)' }}>
                                {se?.name}
                              </span>
                              <span style={{ display: 'block', fontSize: '13px', color: 'var(--text3)' }}>{se?.when}</span>
                            </span>{' '}
                            <span className="badge" style={css(`background:${se?.sBg};color:${se?.sFg}`)}>
                              {se?.status}
                            </span>
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="card" style={{ padding: '22px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>{v.sesName}</div>
                    <div style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '16px' }}>{v.sesNote}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '12px', marginBottom: '18px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text3)', marginBottom: '6px' }}>
                          {'MEMORY / LEARNER'}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(v.memOpts || []).map((o, $index) => (
                            <React.Fragment key={$index}>
                              <button
                                type="button"
                                className="chipbtn"
                                onClick={o?.pick}
                                style={css(`background:${o?.bg};color:${o?.fg};border:1px solid ${o?.border}`)}
                              >
                                {o?.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text3)', marginBottom: '6px' }}>
                          {'COHORT GROUPS'}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(v.grpOpts || []).map((o, $index) => (
                            <React.Fragment key={$index}>
                              <button
                                type="button"
                                className="chipbtn"
                                onClick={o?.pick}
                                style={css(`background:${o?.bg};color:${o?.fg};border:1px solid ${o?.border}`)}
                              >
                                {o?.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text3)', marginBottom: '6px' }}>
                          {'BLOCK LENGTH'}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(v.lenOpts || []).map((o, $index) => (
                            <React.Fragment key={$index}>
                              <button
                                type="button"
                                className="chipbtn"
                                onClick={o?.pick}
                                style={css(`background:${o?.bg};color:${o?.fg};border:1px solid ${o?.border}`)}
                              >
                                {o?.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                      <span>
                        <b>{v.concurrent}</b>
                        {' concurrent learners × '}
                        {v.memPer}
                        {' GB + '}
                        {v.reserve}
                        {' GB reserved'}
                      </span>
                      <span className="mono" style={css(`font-weight:500;color:${v.utilColor}`)}>
                        {v.demand}
                        {' / 128 GB'}
                      </span>
                    </div>
                    <div className="bar" style={{ height: '12px', marginBottom: '8px' }}>
                      <div className="barfill" style={css(`width:${v.utilPct};background:${v.utilColor}`)}></div>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '6px' }}>
                      <b style={css(`color:${v.utilColor}`)}>{v.verdict}</b> {v.verdictWhy}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '16px' }}>
                      {'Schedule: '}
                      {v.groups}
                      {' block(s) × '}
                      {v.blockLen}
                      {' h = '}
                      <b style={{ color: 'var(--text)' }}>
                        {v.totalHours}
                        {' h'}
                      </b>
                      {' of laboratory time · reserve covers system services'}
                      {v.reserveExtra}
                      {'.'}
                    </div>
                    <button type="button" className="solidbtn" onClick={v.request}>
                      {v.requestLabel}
                    </button>
                  </div>
                </div>
              </>
            ) : null}{' '}
            {v.tProfile ? (
              <>
                <div className="card" style={{ padding: '28px', maxWidth: '580px', margin: '0 auto 18px' }}>
                  <div style={{ fontSize: '17px', fontWeight: '600', marginBottom: '6px' }}>{'No credentials have been added'}</div>
                  <div style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: '1.65', marginBottom: '18px' }}>
                    {
                      "Verified credentials appear on the instructor's public course profile. A Deep Learning, Generative AI or NVIDIA DLI certification may be added."
                    }
                  </div>
                  <button type="button" className="solidbtn" onClick={v.toggleForm}>
                    {'Add credential'}
                  </button>
                </div>
                {v.showForm ? (
                  <>
                    <div className="card" style={{ padding: '22px', maxWidth: '580px', margin: '0 auto 18px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>
                        {'New credential '}
                        <span style={{ color: 'var(--text3)', fontWeight: '500' }}>{'· form preview'}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
                        <div>
                          <div style={{ color: 'var(--text3)', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                            {'CREDENTIAL NAME'}
                          </div>
                          <div
                            style={{
                              background: 'var(--surface2)',
                              border: '1px solid var(--surface2-border)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              color: 'var(--text3)',
                            }}
                          >
                            {'e.g. NVIDIA DLI: Generative AI with LLMs'}
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <div style={{ color: 'var(--text3)', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                              {'ISSUING ORGANIZATION'}
                            </div>
                            <div
                              style={{
                                background: 'var(--surface2)',
                                border: '1px solid var(--surface2-border)',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                color: 'var(--text3)',
                              }}
                            >
                              {'NVIDIA'}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: 'var(--text3)', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                              {'DATE EARNED'}
                            </div>
                            <div
                              style={{
                                background: 'var(--surface2)',
                                border: '1px solid var(--surface2-border)',
                                borderRadius: '8px',
                                padding: '10px 12px',
                                color: 'var(--text3)',
                              }}
                            >
                              {'YYYY-MM-DD'}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text3)', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                            {'CREDENTIAL ID & VERIFICATION URL'}
                          </div>
                          <div
                            style={{
                              background: 'var(--surface2)',
                              border: '1px solid var(--surface2-border)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              color: 'var(--text3)',
                            }}
                          >
                            {'Required for verified status'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                <div className="card" style={{ padding: '22px', maxWidth: '580px', margin: '0 auto' }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{'Public profile visibility'}</div>
                  <div style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: '1.65' }}>
                    {
                      "Learners see the instructor's name, teaching biography and only the credentials marked visible. Nothing appears until a credential is added and verified. Supervaise does not create or pre-fill instructor credentials."
                    }
                  </div>
                </div>
              </>
            ) : null}
            <footer className="sitefoot">
              <div className="sf-top">
                <div className="sf-brand">
                  <svg viewBox="0 0 360 310" aria-hidden="true">
                    <polygon points="5,308 140,6 275,308 225,308 142,116 55,308" fill="var(--accent)"></polygon>
                    <circle cx="250" cy="73" r="40" fill="var(--accent)"></circle>
                    <rect x="308" y="13" width="47" height="295" fill="var(--accent)"></rect>
                  </svg>{' '}
                  <span className="sf-bt">
                    <b>{'AI Academy'}</b>
                    <span>{'A Supervaise and NVIDIA programme in generative artificial intelligence.'}</span>
                  </span>
                </div>
                <nav className="sf-cols" aria-label="Footer">
                  <div className="sf-col">
                    <h4>{'Programme'}</h4>
                    <DcLink href="CourseMap.dc.html">{'Course outline'}</DcLink> <DcLink href="Lesson.dc.html">{'Lesson workspace'}</DcLink>{' '}
                    <DcLink href="Capstone.dc.html">{'Capstone project'}</DcLink>
                  </div>
                  <div className="sf-col">
                    <h4>{'Assessment'}</h4>
                    <DcLink href="PracticeExam.dc.html">{'Examination preparation'}</DcLink>{' '}
                    <DcLink href="Certificates.dc.html">{'Credentials and records'}</DcLink>{' '}
                    <DcLink href="PromptWorkshop.dc.html">{'Practical workshops'}</DcLink>
                  </div>
                  <div className="sf-col">
                    <h4>{'Institution'}</h4>
                    <DcLink href="Educator.dc.html">{'Faculty console'}</DcLink>{' '}
                    <DcLink href="mailto:anthony.jose@supervaise.io">{'Programme office'}</DcLink>{' '}
                    <DcLink href="#">{'Academic integrity policy'}</DcLink>
                  </div>
                </nav>
              </div>
              <div className="sf-bot">
                <span>{'© 2026 Supervaise Inc. All rights reserved.'}</span>{' '}
                <span className="sf-soc">
                  <DcLink href="https://instagram.com/supervaise_ph" target="_blank" rel="noopener" aria-label="Supervaise on Instagram">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" stroke="currentColor" strokeWidth="1.7"></rect>
                      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.7"></circle>
                      <circle cx="17.1" cy="6.9" r="1.25" fill="currentColor"></circle>
                    </svg>
                  </DcLink>{' '}
                  <DcLink href="https://linkedin.com/company/supervaise" target="_blank" rel="noopener" aria-label="Supervaise on LinkedIn">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.4" stroke="currentColor" strokeWidth="1.7"></rect>
                      <circle cx="7.8" cy="8.1" r="1.35" fill="currentColor"></circle>
                      <rect x="6.75" y="10.5" width="2.1" height="7" fill="currentColor"></rect>
                      <path
                        d="M11.2 17.5v-7h2.05v1.03a2.75 2.75 0 0 1 2.35-1.23c1.76 0 2.8 1.14 2.8 3.16v4.04h-2.1v-3.76c0-1.04-.45-1.65-1.37-1.65-.95 0-1.63.7-1.63 1.82v3.59z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </DcLink>{' '}
                  <DcLink href="https://supervaise.io" target="_blank" rel="noopener" aria-label="supervaise.io">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="8.8" stroke="currentColor" strokeWidth="1.7"></circle>
                      <path d="M3.2 12h17.6" stroke="currentColor" strokeWidth="1.7"></path>
                      <path
                        d="M12 3.2c2.3 2.4 3.5 5.5 3.5 8.8s-1.2 6.4-3.5 8.8c-2.3-2.4-3.5-5.5-3.5-8.8S9.7 5.6 12 3.2z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      ></path>
                    </svg>
                  </DcLink>{' '}
                  <DcLink href="mailto:anthony.jose@supervaise.io" aria-label="Email the programme office">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="2.8" y="5" width="18.4" height="14" rx="3.2" stroke="currentColor" strokeWidth="1.7"></rect>
                      <path
                        d="M4.2 7.6 12 13l7.8-5.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </DcLink>
                </span>{' '}
                <span className="sf-power">
                  <span className="sf-pw-l">{'Powered by'}</span>
                  <img className="sf-nv nvl-d" src="/assets/nvidia-dark.png" alt="NVIDIA" />
                  <img className="sf-nv nvl-l" src="/assets/nvidia-light.png" alt="NVIDIA" />
                  <strong>{'DGX Spark'}</strong>
                </span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

Component.template = template;
Component.css = pageCss;
Component.pageKey = 'educator';
Component.persist = ['grades', 'reminded', 'plan', 'ses'];

export default Component;
