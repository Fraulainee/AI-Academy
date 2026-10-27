import React from 'react';
import { css as _css } from './css.js'; // eslint-disable-line no-unused-vars
import * as session from './session.js';

const initialsOf = (name) =>
  (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '?';

const pick = (obj, keys) => {
  const out = {};
  keys.forEach((k) => {
    if (obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
};

/**
 * Base class for the pages ported from the design.
 *
 * A page subclass supplies `renderVals()` (data + handlers for the markup) and the static
 * `template(v)` / `css` / `persist` / `pageKey` attached by the generated module.
 * This base adds: the signed-in user's vals, the sign-in/sign-up form handlers used by the
 * landing pages, and debounced persistence of the state keys listed in `persist`.
 */
export default class DCLogic extends React.Component {
  setState(update, cb) {
    super.setState(update, () => {
      this.__queueSave();
      if (cb) cb();
    });
  }

  // ----- persistence (works even when a subclass overrides componentDidMount) -----
  hydrate(saved) {
    const C = this.constructor;
    const slice = pick(saved || {}, C.persist || []);
    this.__last = JSON.stringify(slice);
    if (Object.keys(slice).length) super.setState(slice);
    this.__hydrated = true;
  }

  __queueSave() {
    const C = this.constructor;
    if (!this.__hydrated || !C.persist || !C.persist.length) return;
    clearTimeout(this.__saveTimer);
    this.__saveTimer = setTimeout(() => {
      const slice = pick(this.state, C.persist);
      const json = JSON.stringify(slice);
      if (json === this.__last) return;
      this.__last = json;
      session.savePageState(C.pageKey, slice).catch(() => {});
    }, 600);
  }

  // ----- signed-in user + auth form -----
  sessionVals() {
    const user = this.props.user || null;
    const auth = this.state.auth || {};
    const patchAuth = (p) => super.setState({ auth: { ...(this.state.auth || {}), ...p } });
    const submit = async (fn) => {
      patchAuth({ busy: true, error: '' });
      try {
        const u = await fn();
        patchAuth({ busy: false, password: '' });
        session.navigate(session.afterLoginPath(u));
      } catch (e) {
        patchAuth({ busy: false, error: e.message || 'Something went wrong.' });
      }
    };
    return {
      userName: user ? user.name : '',
      userInitials: initialsOf(user && user.name),
      userEmail: user ? user.email : '',
      userRole: user ? user.role : '',
      authEmail: auth.email || '',
      authName: auth.name || '',
      authPassword: auth.password || '',
      authError: auth.error || '',
      authBusy: !!auth.busy,
      onField: (e) => patchAuth({ [e.target.name]: e.target.value, error: '' }),
      onAuthKey: (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        this.state.panel === 'signup' ? this.sessionVals().submitSignup() : this.sessionVals().submitLogin();
      },
      submitLogin: () => {
        const a = this.state.auth || {};
        if (!a.email || !a.password) return patchAuth({ error: 'Enter your email and password.' });
        return submit(() => session.login(a.email, a.password));
      },
      submitSignup: () => {
        const a = this.state.auth || {};
        if (!a.name || !a.email || !a.password) return patchAuth({ error: 'Enter your name, email and a password.' });
        if (a.password.length < 8) return patchAuth({ error: 'Use a password of at least 8 characters.' });
        return submit(() => session.register({ name: a.name, email: a.email, password: a.password }));
      },
      signOut: async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        await session.logout();
        session.navigate('/');
      },
    };
  }

  render() {
    const C = this.constructor;
    const v = { ...this.sessionVals(), ...this.renderVals() };
    return (
      <>
        {C.css ? <style>{C.css}</style> : null}
        {C.template(v)}
      </>
    );
  }
}
