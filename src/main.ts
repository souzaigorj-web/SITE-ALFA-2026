import './styles/global.css';
import { initShaderBackground } from './components/effects/ShaderBackground';
import { renderHero } from './components/sections/Hero';
import { renderAbout } from './components/sections/About';
import { renderDifferentials } from './components/sections/Differentials';
import { renderPlans } from './components/sections/Plans';
import { renderCoverage } from './components/sections/Coverage';
import { renderFinalCta } from './components/sections/FinalCta';
import { renderFooter } from './components/sections/Footer';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Elemento #app não encontrado.');
}

app.innerHTML = `
  ${renderHero()}
  <main>
    ${renderAbout()}
    ${renderDifferentials()}
    ${renderPlans()}
    ${renderCoverage()}
    ${renderFinalCta()}
  </main>
  ${renderFooter()}
`;

initShaderBackground();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');

  if (!link) {
    return;
  }

  const targetId = link.hash.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;

  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({
    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
    block: 'start',
  });
  history.pushState(null, '', link.hash);
}, { passive: false });
