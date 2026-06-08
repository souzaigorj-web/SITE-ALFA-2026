import { whatsapp } from '../../constants/whatsapp';
import { whatsappUrl } from '../lib';
import { renderButton } from '../ui';

export function renderCoverage(): string {
  return `
    <section id="cobertura" class="section section--coverage" aria-label="Área de cobertura ALFA Telecom">
      <div class="coverage-showcase">
        <img
          class="coverage-showcase__image"
          src="/assets/cobertura-cidade.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
        <div class="coverage-showcase__content">
          <p class="eyebrow">Área de cobertura</p>
          <div class="coverage-showcase__body">
            <h2>
              <span>Levamos internet</span>
              <span>para a cidade de</span>
              <span>Caxias-MA</span>
            </h2>
            ${renderButton({
              href: whatsappUrl(whatsapp.phone, 'Olá, quero consultar se a ALFA Telecom atende minha região.'),
              label: 'Consulte a sua região',
              className: 'coverage-showcase__button',
            })}
          </div>
        </div>
      </div>
    </section>
  `;
}
