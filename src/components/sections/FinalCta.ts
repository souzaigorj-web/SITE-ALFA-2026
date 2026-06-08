import { whatsapp } from '../../constants/whatsapp';
import { whatsappUrl } from '../lib';
import { renderButton } from '../ui';

export function renderFinalCta(): string {
  return `
    <section class="section final-cta">
      <img
        class="final-cta__background"
        src="/assets/cta-atendimento.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <div class="container final-cta__inner">
        <div>
          <p class="eyebrow">Conexão premium</p>
          <h2>Pronto para viver o padrão ALFA?</h2>
          <p>Fale com a equipe local e escolha o plano ideal para sua casa ou negócio.</p>
        </div>
        ${renderButton({
          href: whatsappUrl(whatsapp.phone, whatsapp.message),
          label: 'Contratar pelo WhatsApp',
        })}
      </div>
    </section>
  `;
}
