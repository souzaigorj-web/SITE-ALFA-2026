import { escapeHtml } from './lib';

type ButtonOptions = {
  href: string;
  label: string;
  variant?: 'primary' | 'ghost';
  className?: string;
};

export function renderButton({ href, label, variant = 'primary', className = '' }: ButtonOptions): string {
  return `
    <a class="button button--${variant} ${className}" href="${escapeHtml(href)}">
      <span>${escapeHtml(label)}</span>
      <span class="button__arrow" aria-hidden="true">→</span>
    </a>
  `;
}

export function renderSectionHeader(eyebrow: string, title: string, text?: string): string {
  return `
    <div class="section-header">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      ${text ? `<p>${escapeHtml(text)}</p>` : ''}
    </div>
  `;
}
