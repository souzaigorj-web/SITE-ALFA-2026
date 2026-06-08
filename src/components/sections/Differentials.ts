import { escapeHtml } from '../lib';

const differentials = [
  {
    title: 'Estabilidade para sua rotina',
    copy: 'Conexão consistente para trabalho, streaming, estudos e operação diária.',
    icon: 'stability',
  },
  {
    title: 'Suporte ágil e humano',
    copy: 'Atendimento direto, claro e próximo quando você precisar de resposta.',
    icon: 'support',
  },
  {
    title: 'Atendimento local',
    copy: 'Uma equipe que conhece Caxias, entende a região e acompanha de perto.',
    icon: 'local',
  },
  {
    title: 'Tecnologia de ponta',
    copy: 'Rede preparada para alta demanda, baixa latência e evolução contínua.',
    icon: 'tech',
  },
];

function renderDifferentialIcon(icon: string): string {
  const common = 'fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"';

  const icons: Record<string, string> = {
    stability: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect class="yield-icon__panel" x="1" y="1" width="118" height="118" rx="24" />
        <path ${common} d="M30 76a30 30 0 1 1 60 0" />
        <path ${common} d="M60 76l18-24" />
        <path ${common} d="M39 76h42" />
        <path ${common} d="M42 55l-6-6M78 55l6-6M60 45v-8" />
      </svg>
    `,
    support: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect class="yield-icon__panel" x="1" y="1" width="118" height="118" rx="24" />
        <path ${common} d="M34 65v-8a26 26 0 0 1 52 0v8" />
        <path ${common} d="M34 65c0-5 4-9 9-9h4v24h-4c-5 0-9-4-9-9z" />
        <path ${common} d="M86 65c0-5-4-9-9-9h-4v24h4c5 0 9-4 9-9z" />
        <path ${common} d="M74 83c-4 5-9 7-16 7h-7" />
      </svg>
    `,
    local: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect class="yield-icon__panel" x="1" y="1" width="118" height="118" rx="24" />
        <path ${common} d="M60 86s25-23 25-40a25 25 0 0 0-50 0c0 17 25 40 25 40z" />
        <circle ${common} cx="60" cy="46" r="9" />
        <path ${common} d="M39 91c6 4 13 6 21 6s15-2 21-6" />
      </svg>
    `,
    tech: `
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect class="yield-icon__panel" x="1" y="1" width="118" height="118" rx="24" />
        <rect ${common} x="42" y="42" width="36" height="36" rx="8" />
        <path ${common} d="M51 30v12M69 30v12M51 78v12M69 78v12M30 51h12M30 69h12M78 51h12M78 69h12" />
        <path ${common} d="M54 60h12" />
      </svg>
    `,
  };

  return icons[icon] ?? icons.tech;
}

export function renderDifferentials(): string {
  return `
    <section class="section section--differentials">
      <div class="container">
        <div class="differentials-hero">
          <div class="differentials-hero__copy">
            <p class="eyebrow">Diferenciais</p>
            <h2>
              <span>Quando</span>
              <span>tudo flui</span>
              <span>é porque</span>
              <span>a <span class="text-accent">conexão</span></span>
              <span>acompanha!</span>
            </h2>
            <p>Conheça os nossos diferenciais ↓</p>
          </div>
          <img
            class="differentials-hero__image"
            src="/assets/diferenciais-clean.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div class="bento-grid">
          ${differentials
            .map(
              (item, index) => `
                <article class="bento-card bento-card--${index + 1}" style="--delay: ${index * 90}ms">
                  <span class="bento-card__icon bento-card__icon--${escapeHtml(item.icon)}" aria-hidden="true">
                    ${renderDifferentialIcon(item.icon)}
                  </span>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.copy)}</p>
                </article>
              `,
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}
