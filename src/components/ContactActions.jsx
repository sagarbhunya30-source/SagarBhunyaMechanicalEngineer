import { useEffect, useRef, useState } from 'react';
import { mailtoHref, profile, telHref } from '../data/profile.js';
import { CheckIcon, CopyIcon, DownloadIcon, MailIcon, PhoneIcon } from './Icons.jsx';

export function CopyEmailButton({ className = 'btn-secondary' }) {
  const [state, setState] = useState('idle');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const text = profile.contact.email;
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      // Fallback for browsers without async clipboard access.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      ta.remove();
    }
    setState(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2500);
  };

  return (
    <>
      <button type="button" onClick={copy} className={className}>
        {state === 'copied' ? <CheckIcon className="text-emerald-500" /> : <CopyIcon />}
        {state === 'copied' ? 'Email copied' : 'Copy Email'}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'copied' && `Email address ${profile.contact.email} copied to clipboard`}
        {state === 'failed' && `Copy failed. The email address is ${profile.contact.email}`}
      </span>
      {state === 'failed' && (
        <span className="text-xs text-amber-300">Copy unavailable — select the address above.</span>
      )}
    </>
  );
}

export default function ContactActions({ showCopy = true, showCv = true }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={mailtoHref} className="btn-primary">
        <MailIcon /> Email Sagar
      </a>
      <a href={telHref} className="btn-secondary">
        <PhoneIcon /> Call Sagar
      </a>
      {showCopy && <CopyEmailButton />}
      {showCv && (
        <a href={profile.cv.href} download={profile.cv.fileName} className="btn-secondary">
          <DownloadIcon /> Download CV
        </a>
      )}
    </div>
  );
}
