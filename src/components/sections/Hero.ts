import { renderShaderBackground } from '../effects/ShaderBackground';

export function renderHero(): string {
  return `
    <header class="hero hero--shader">
      ${renderShaderBackground()}
      <nav class="nav container" aria-label="Principal">
        <a class="brand brand--hero" href="#top" aria-label="ALFA Telecom">
          <span class="brand__logo-frame">
            <img class="brand__logo" src="/logo-alfa-icon.png" alt="" />
          </span>
          <span class="brand__text">ALFA Telecom</span>
        </a>
        <div class="nav__links">
          <a href="#sobre">Quem somos</a>
          <a href="#planos">Planos</a>
          <a href="#cobertura">Cobertura</a>
        </div>
      </nav>

      <section id="top" class="hero__content">
        <div class="hero__center">
          <div class="hero__logo-wrap animate-fade-in-down">
            <img
              class="hero__logo"
              src="/logo-alfa.png"
              alt="ALFA Telecom"
              decoding="async"
              fetchpriority="high"
              onerror="this.style.display='none';this.nextElementSibling.style.display='inline-flex'"
            />
            <span class="hero__logo-fallback">ALFA TELECOM</span>
          </div>
          <a class="hero__plans-button animate-fade-in-up animation-delay-200" href="#planos">
            <span>Conheça os planos</span>
          </a>
        </div>
      </section>
    </header>
  `;
}
