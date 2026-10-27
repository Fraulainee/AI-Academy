// One-time migration: Claude Design ".dc.html" artboards  ->  React page components.
//
//   design-source/<Name>.dc.html  ->  frontend/src/pages/<Name>.jsx  (+ <Name>.css)
//
// Each artboard has: <helmet> (fonts + <style>), markup with {{holes}} / <sc-if> / <sc-for>,
// and a `class Component extends DCLogic` script whose renderVals() feeds the markup.
// The script is kept verbatim; the markup becomes a JSX `template(v)` function fed by renderVals().
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'htmlparser2';
import prettier from 'prettier';
import { cssToObject } from '../frontend/src/dc/css.js';
import { PATCHES } from './patches.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'design-source');
const OUT = path.join(ROOT, 'frontend', 'src', 'pages');

export const ROUTES = {
  'LandingFull.dc.html': '/',
  'Landing.dc.html': '/intro',
  'Main.dc.html': '/dashboard',
  'CourseMap.dc.html': '/course-map',
  'Lesson.dc.html': '/lesson',
  'PromptWorkshop.dc.html': '/prompt-workshop',
  'Capstone.dc.html': '/capstone',
  'PracticeExam.dc.html': '/mock-exam',
  'Certificates.dc.html': '/certification',
  'Educator.dc.html': '/educator',
};

const ASSETS = {
  '/_blob/f316a2796fca160c9156daf0f939dde7': '/assets/nvidia-dark.png',
  '/_blob/beac3dd2beaf37c159727568d4b834d3': '/assets/nvidia-light.png',
};

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const INLINE = new Set(['span', 'a', 'b', 'i', 'em', 'strong', 'small', 'sub', 'sup', 'code', 'mark', 'button', 'input', 'label',
  'img', 'svg', 'br', 'select', 'textarea', 'abbr', 'kbd', 'time', 'u', 's', 'sc-if', 'sc-for']);
const TABLEISH = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'colgroup', 'select']);
const BOOL_ATTRS = new Set(['disabled', 'checked', 'readonly', 'required', 'selected', 'open', 'hidden', 'autofocus', 'multiple']);
const ATTR_MAP = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  colspan: 'colSpan', rowspan: 'rowSpan', autocomplete: 'autoComplete', autofocus: 'autoFocus', spellcheck: 'spellCheck',
  contenteditable: 'contentEditable', crossorigin: 'crossOrigin', srcset: 'srcSet', datetime: 'dateTime',
  'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'accept-charset': 'acceptCharset',
};

const warnings = [];

// ---------- hole handling ----------
const HOLE = /\{\{\s*([^{}]*?)\s*\}\}/g;
const hasHole = (s) => /\{\{[^}]*\}\}/.test(s);
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function holeExpr(path_, scope) {
  if (path_ === 'true' || path_ === 'false' || path_ === 'null' || /^-?\d+(\.\d+)?$/.test(path_)) return path_;
  const parts = path_.split('.');
  if (!parts.every((p) => IDENT.test(p))) {
    warnings.push(`unsupported hole expression {{${path_}}}`);
    return 'undefined';
  }
  const root = scope.has(parts[0]) || parts[0] === '$index' ? parts[0] : `v.${parts[0]}`;
  return root + parts.slice(1).map((p) => `?.${p}`).join('');
}

// "a {{x}} b" -> [{t:'a '},{e:'v.x'},{t:' b'}]
function splitText(str, scope) {
  const parts = [];
  let last = 0;
  for (const m of str.matchAll(HOLE)) {
    if (m.index > last) parts.push({ t: str.slice(last, m.index) });
    parts.push({ e: holeExpr(m[1], scope) });
    last = m.index + m[0].length;
  }
  if (last < str.length) parts.push({ t: str.slice(last) });
  return parts;
}

const tpl = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
function templateLiteral(str, scope) {
  return '`' + splitText(str, scope).map((p) => (p.t !== undefined ? tpl(p.t) : '${' + p.e + '}')).join('') + '`';
}

// ---------- attributes ----------
function attrName(name) {
  if (ATTR_MAP[name]) return ATTR_MAP[name];
  if (name.startsWith('data-') || name.startsWith('aria-')) return name;
  if (name.includes('-')) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return name;
}

const KEY_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function styleLiteral(obj) {
  return '{' + Object.entries(obj).map(([k, v]) => `${KEY_RE.test(k) ? k : JSON.stringify(k)}: ${JSON.stringify(v)}`).join(', ') + '}';
}

function genAttrs(node, scope) {
  const out = [];
  const tag = node.name;
  const attrs = node.attribs;
  const hasOnChange = 'onChange' in attrs || 'onInput' in attrs;
  for (const [rawName, rawValue] of Object.entries(attrs)) {
    if (rawName.startsWith('hint-')) continue;
    let name = attrName(rawName);
    let value = rawValue;
    if (tag === 'img' && rawName === 'src') value = ASSETS[value] ?? value;
    const isHoleOnly = /^\{\{\s*[^{}]*?\s*\}\}$/.test(value);

    if (rawName === 'style') {
      if (!hasHole(value)) {
        out.push(`style={${styleLiteral(cssToObject(value))}}`);
      } else {
        out.push(`style={css(${templateLiteral(value, scope)})}`);
      }
      continue;
    }
    if ((tag === 'input' || tag === 'textarea' || tag === 'select') && rawName === 'value') {
      if (!hasHole(value)) {
        name = 'defaultValue';
      } else if (!hasOnChange) {
        warnings.push(`<${tag}> with bound value but no change handler: ${value}`);
      }
    }
    if (isHoleOnly) {
      const expr = holeExpr(value.replace(HOLE, '$1'), scope);
      out.push(`${name}={${expr}}`);
    } else if (hasHole(value)) {
      out.push(`${name}={${templateLiteral(value, scope)}}`);
    } else if (BOOL_ATTRS.has(rawName) && (value === '' || value === rawName)) {
      out.push(name);
    } else {
      out.push(`${name}=${JSON.stringify(value)}`);
    }
  }
  return out.join(' ');
}

// ---------- nodes ----------
const jsxText = (s) => `{${JSON.stringify(s)}}`;

function isInlineLike(n) {
  if (!n) return false;
  if (n.type === 'text') return true;
  if (n.type !== 'tag') return false;
  return INLINE.has(n.name) || n.name.startsWith('sc-');
}

function inFlexOrGrid(parent) {
  const style = parent?.attribs?.style || '';
  return /display\s*:\s*(inline-)?(flex|grid)/.test(style);
}

function genChildren(parent, scope) {
  const kids = parent.children || [];
  const out = [];
  kids.forEach((n, i) => {
    if (n.type === 'comment' || n.type === 'directive') return;
    if (n.type === 'text') {
      const data = n.data;
      if (data.trim() === '') {
        if (TABLEISH.has(parent.name)) return;
        if (inFlexOrGrid(parent)) return;
        if (/\n/.test(data) && !(isInlineLike(kids[i - 1]) && isInlineLike(kids[i + 1]))) return;
        out.push(jsxText(' '));
        return;
      }
      if (TABLEISH.has(parent.name) && data.trim() === '') return;
      for (const p of splitText(data, scope)) {
        if (p.t !== undefined) out.push(jsxText(p.t));
        else out.push(`{${p.e}}`);
      }
      return;
    }
    if (n.type === 'tag' || n.type === 'script' || n.type === 'style') out.push(genNode(n, scope));
  });
  return out;
}

function genNode(node, scope) {
  const tag = node.name;
  if (tag === 'sc-if') {
    const cond = holeExpr(node.attribs.value.replace(HOLE, '$1').trim(), scope);
    return `{${cond} ? (<>${genChildren(node, scope).join('')}</>) : null}`;
  }
  if (tag === 'sc-for') {
    const list = holeExpr(node.attribs.list.replace(HOLE, '$1').trim(), scope);
    const as = node.attribs.as;
    const inner = new Set(scope);
    inner.add(as);
    return `{(${list} || []).map((${as}, $index) => (<React.Fragment key={$index}>${genChildren(node, inner).join('')}</React.Fragment>))}`;
  }
  if (tag === 'dc-import') throw new Error('dc-import is not supported by this converter');
  const jsxTag = tag === 'a' ? 'DcLink' : tag;
  const attrs = genAttrs(node, scope);
  const open = `<${jsxTag}${attrs ? ' ' + attrs : ''}`;
  if (VOID.has(tag)) return `${open} />`;
  if (tag === 'textarea') {
    const text = (node.children || []).map((c) => c.data || '').join('');
    const hasDefault = 'value' in node.attribs;
    return `${open}${text && !hasDefault ? ` defaultValue={${JSON.stringify(text)}}` : ''} />`;
  }
  const kids = genChildren(node, scope).join('');
  return `${open}>${kids}</${jsxTag}>`;
}

// ---------- file level ----------
function between(src, a, b) {
  const i = src.indexOf(a);
  if (i < 0) throw new Error(`missing ${a}`);
  const j = src.indexOf(b, i + a.length);
  if (j < 0) throw new Error(`missing ${b}`);
  return [src.slice(i + a.length, j), i, j + b.length];
}

async function convertFile(file) {
  const name = file.replace('.dc.html', '');
  let src = fs.readFileSync(path.join(SRC, file), 'utf8');

  const [helmet] = between(src, '<helmet>', '</helmet>');
  const [style] = between(helmet, '<style>', '</style>');
  const links = [...helmet.matchAll(/<link[^>]*href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));

  let [markup] = between(src, '</helmet>', '</x-dc>');
  const scriptMatch = src.match(/<script type="text\/x-dc" data-dc-script[^>]*>([\s\S]*?)<\/script>/);
  let script = scriptMatch[1];

  // design-specific wiring (auth, profile card, persistence) -> tools/patches.mjs
  const patch = PATCHES[file] || {};
  for (const [from, to] of patch.markup || []) {
    if (!markup.includes(from)) throw new Error(`${file}: markup patch target not found: ${from.slice(0, 80)}`);
    markup = markup.split(from).join(to);
  }
  for (const [from, to] of patch.script || []) {
    if (!script.includes(from)) throw new Error(`${file}: script patch target not found: ${from.slice(0, 80)}`);
    script = script.split(from).join(to);
  }
  for (const fn of patch.after || []) ({ markup, script } = fn({ markup, script, file }));

  const doc = parseDocument(markup, { lowerCaseTags: false, lowerCaseAttributeNames: false, recognizeSelfClosing: true, decodeEntities: true });
  const rootKids = genChildren({ children: doc.children, name: 'root' }, new Set());

  const cfg = patch.config || {};
  const code = `// Generated from design-source/${file} by tools/convert.mjs.
// Re-running the converter regenerates (and overwrites) this file, so edit design-source/ + tools/patches.mjs instead,
// or stop using the converter and edit this file directly.
/* eslint-disable */
import React from 'react';
import DCLogic from '../dc/DCLogic.jsx';
import DcLink from '../dc/DcLink.jsx';
import { css } from '../dc/css.js';
import pageCss from './${name}.css?inline';

${script.replace('class Component extends DCLogic', 'class Component extends DCLogic')}

function template(v) {
  return (<>${rootKids.join('')}</>);
}

Component.template = template;
Component.css = pageCss;
Component.pageKey = ${JSON.stringify(cfg.pageKey || name)};
Component.persist = ${JSON.stringify(cfg.persist || [])};

export default Component;
`;
  const formatted = await prettier.format(code, { parser: 'babel', printWidth: 140, singleQuote: true, trailingComma: 'es5' });
  fs.writeFileSync(path.join(OUT, `${name}.jsx`), formatted);
  fs.writeFileSync(path.join(OUT, `${name}.css`), style.replace(/^\n/, '').trimEnd() + '\n');
  return { name, links };
}

fs.mkdirSync(OUT, { recursive: true });
const allLinks = new Set();
for (const file of Object.keys(ROUTES)) {
  const { name, links } = await convertFile(file);
  links.forEach((l) => allLinks.add(l));
  console.log('converted', name);
}
fs.writeFileSync(path.join(OUT, 'routes.json'), JSON.stringify(ROUTES, null, 2) + '\n');
if (warnings.length) {
  console.log('\nWARNINGS');
  [...new Set(warnings)].forEach((w) => console.log(' -', w));
}
