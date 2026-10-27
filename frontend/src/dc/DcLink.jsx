import React from 'react';
import routes from '../pages/routes.json';
import { navigate } from './session.js';

// Design artboards linked to each other as "Main.dc.html"; map those to real routes.
// Everything else (external URLs, mailto:, #anchors) is a normal anchor.
export default function DcLink({ href, onClick, children, ...rest }) {
  // "Lesson.dc.html" (design artboard link) or an app path such as "/lesson/3"
  const route = href ? routes[href.replace(/^\.?\//, '')] || (/^\/(?!\/)/.test(href) ? href : undefined) : undefined;
  if (!route) {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  const handle = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === '_blank') return;
    e.preventDefault();
    navigate(route);
  };
  return (
    <a href={route} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
