// Converts an inline CSS declaration string ("a:b;--x:y") into a React style object.
// Splits on ';' only outside of (), "" and '' so url(data:...;base64,...) survives.
export function splitDeclarations(str) {
  const out = [];
  let depth = 0;
  let quote = null;
  let cur = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (quote) {
      cur += ch;
      if (ch === quote && str[i - 1] !== '\\') quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      cur += ch;
    } else if (ch === '(') {
      depth++;
      cur += ch;
    } else if (ch === ')') {
      depth = Math.max(0, depth - 1);
      cur += ch;
    } else if (ch === ';' && depth === 0) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) out.push(cur);
  return out;
}

export function camelProp(name) {
  if (name.startsWith('--')) return name;
  // -webkit-foo -> WebkitFoo (React's convention); -ms-foo -> msFoo
  if (name.startsWith('-ms-')) name = name.slice(1);
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

export function cssToObject(str) {
  const style = {};
  if (!str) return style;
  for (const decl of splitDeclarations(String(str))) {
    const idx = decl.indexOf(':');
    if (idx < 0) continue;
    const name = decl.slice(0, idx).trim();
    let value = decl.slice(idx + 1).trim();
    if (!name || value === '') continue;
    value = value.replace(/\s*!important\s*$/i, '');
    style[camelProp(name)] = value;
  }
  return style;
}

// Runtime helper used by generated pages for style attributes that contain {{holes}}.
export function css(str) {
  return cssToObject(str);
}
