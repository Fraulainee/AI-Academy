// Wiring that the static design cannot express: real sign-in, the signed-in user's name in the
// sidebar, sign-out, and which page state is persisted to the backend.
// Every patch asserts its target exists, so a design change that breaks one fails loudly.

const must = (src, re, what) => {
  if (!re.test(src)) throw new Error(`patch target not found: ${what}`);
};

// ---- sidebar profile card + sign out (the 8 signed-in screens) ----
function appShell({ markup, script, file }) {
  // initials + name inside .profilecard
  const card = /(<div class="profilecard"[^>]*>\s*<div[^>]*>)([A-Z]{2})(<\/div>\s*<div style="min-width:0"><div[^>]*>)([^<]+)(<\/div>)/;
  must(markup, card, `${file} profile card`);
  markup = markup.replace(card, '$1{{userInitials}}$3{{userName}}$5');
  const signOut = /<a class="navlink" href="Landing\.dc\.html" style="color:#7C857A">/;
  must(markup, signOut, `${file} sign out link`);
  markup = markup.replace(signOut, '<a class="navlink" href="Landing.dc.html" onClick="{{signOut}}" style="color:#7C857A">');
  return { markup, script };
}

// ---- log in / sign up panels (both landing variants) ----
function authPanels({ markup, script, file }) {
  const email = '<input type="email" name="email" placeholder="you@example.com" autocomplete="email">';
  must(markup, new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${file} email input`);
  markup = markup.split(email).join(
    '<input type="email" name="email" placeholder="you@example.com" autocomplete="email" value="{{authEmail}}" onChange="{{onField}}" onKeyDown="{{onAuthKey}}">'
  );
  const swap = (from, to) => {
    must(markup, new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${file}: ${from.slice(0, 60)}`);
    markup = markup.split(from).join(to);
  };
  swap(
    '<input type="password" name="password" placeholder="Password" autocomplete="current-password">',
    '<input type="password" name="password" placeholder="Password" autocomplete="current-password" value="{{authPassword}}" onChange="{{onField}}" onKeyDown="{{onAuthKey}}">'
  );
  swap(
    '<input type="text" name="name" placeholder="Maya Santos" autocomplete="name">',
    '<input type="text" name="name" placeholder="Maya Santos" autocomplete="name" value="{{authName}}" onChange="{{onField}}" onKeyDown="{{onAuthKey}}">'
  );
  swap(
    '<input type="password" name="password" placeholder="Create a password" autocomplete="new-password">',
    '<input type="password" name="password" placeholder="Create a password (8+ characters)" autocomplete="new-password" value="{{authPassword}}" onChange="{{onField}}" onKeyDown="{{onAuthKey}}">'
  );
  const err =
    '<sc-if value="{{authError}}" hint-placeholder-val="{{false}}"><p class="note" role="alert" style="color:#F87171;font-size:12.5px;margin:0 0 10px">{{authError}}</p></sc-if>';
  swap(
    '<a class="btn primary" href="Main.dc.html">Log in</a>',
    err + '<button type="button" class="btn primary" disabled="{{authBusy}}" onClick="{{submitLogin}}">Log in</button>'
  );
  swap(
    '<a class="btn primary" href="Main.dc.html">Create account</a>',
    err + '<button type="button" class="btn primary" disabled="{{authBusy}}" onClick="{{submitSignup}}">Create account</button>'
  );
  swap('<p class="note">Preview mode. Any credentials are accepted and no password is verified.</p>', '');
  return { markup, script };
}

const COMMON = [appShell];

export const PATCHES = {
  'LandingFull.dc.html': { after: [authPanels], config: { pageKey: 'landing' } },
  'Landing.dc.html': { after: [authPanels], config: { pageKey: 'intro' } },
  'Main.dc.html': { after: COMMON, config: { pageKey: 'dashboard' } },
  'CourseMap.dc.html': { after: COMMON, config: { pageKey: 'course-map', persist: ['selected', 'openTerms'] } },
  'Lesson.dc.html': { after: COMMON, config: { pageKey: 'lesson', persist: ['qIndex', 'selectedOpt', 'submitted'] } },
  'PromptWorkshop.dc.html': {
    after: COMMON,
    config: { pageKey: 'prompt-workshop', persist: ['ex', 'drafts', 'note', 'saved'] },
  },
  'Capstone.dc.html': { after: COMMON, config: { pageKey: 'capstone' } },
  'PracticeExam.dc.html': {
    after: COMMON,
    // attempt history now lives on the server (persisted state key `history`), not in localStorage
    script: [
      ["function loadHistory() {\n  try { const raw = localStorage.getItem(HISTORY_KEY); const arr = raw ? JSON.parse(raw) : []; return Array.isArray(arr) ? arr : []; } catch (e) { return []; }\n}", 'function loadHistory() {\n  return [];\n}'],
      ['function storeHistory(arr) { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr)); } catch (e) {} }', 'function storeHistory(arr) {}'],
    ],
    config: { pageKey: 'mock-exam', persist: ['history'] },
  },
  'Certificates.dc.html': { after: COMMON, config: { pageKey: 'certification' } },
  'Educator.dc.html': {
    after: COMMON,
    config: { pageKey: 'educator', persist: ['grades', 'reminded', 'plan', 'ses'] },
  },
};
