import { plans } from '../../constants/plans';
import { whatsapp } from '../../constants/whatsapp';
import { escapeHtml, whatsappUrl } from '../lib';
import { renderButton } from '../ui';

const planNames = ['Basico', 'Pro', 'ALFA'];
const planFeatures = [
  ['Internet por fibra óptica', 'Suporte local e rápido', 'Roteador ALFA'],
  ['Internet por fibra óptica', 'Suporte local e rápido', 'Watch TV'],
  ['Internet por fibra óptica', 'Suporte local e rápido', 'Watch TV'],
];

export function renderPlans(): string {
  return `
    <section id="planos" class="section section--plans">
      <div class="container">
        <div class="section-header section-header--center">
          <p class="eyebrow">Planos</p>
          <h2>Escolha o plano <span class="text-accent">ideal</span> pra você</h2>
        </div>
        <div class="plans-grid">
          ${plans
            .map(
              (plan, index) => `
                <article class="plan-card ${plan.highlight ? 'plan-card--highlight' : ''}" aria-label="Plano ${escapeHtml(planNames[index] ?? plan.speed)}">
                  <div class="plan-card__content">
                    <div class="plan-card__header">
                      <div class="plan-card__badges">
                        <span class="plan-card__label">${escapeHtml(planNames[index] ?? plan.speed)}</span>
                        ${plan.highlight ? '<span class="plan-card__tag">Mais escolhido</span>' : ''}
                      </div>
                      <h3>${escapeHtml(plan.speed)}</h3>
                      <p class="plan-card__price">${escapeHtml(plan.price)}</p>
                    </div>
                    <span class="plan-card__divider" aria-hidden="true"></span>
                    <ul>
                      ${(planFeatures[index] ?? planFeatures[0])
                        .map((feature) => `<li>${escapeHtml(feature)}</li>`)
                        .join('')}
                    </ul>
                  </div>
                  ${renderButton({
                    href: whatsappUrl(whatsapp.phone, `Olá, quero contratar o plano ${plan.speed} da ALFA Telecom.`),
                    label: 'Contratar',
                    variant: plan.highlight ? 'primary' : 'ghost',
                  })}
                </article>
              `,
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}
