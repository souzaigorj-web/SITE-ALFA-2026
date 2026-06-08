import { company } from '../../constants/company';
import { whatsapp } from '../../constants/whatsapp';
import { escapeHtml, whatsappUrl } from '../lib';

export function renderFooter(): string {
  return `
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <a class="brand" href="#top" aria-label="ALFA Telecom">
            <span class="brand__logo-frame">
              <img class="brand__logo" src="/logo-alfa-icon.png" alt="" />
            </span>
            <span>${escapeHtml(company.name)}</span>
          </a>
          <div class="footer__legal">
            <p>CNPJ ${escapeHtml(company.cnpj)}</p>
            <p>${escapeHtml(company.address)}</p>
            <p>CEP ${escapeHtml(company.zipCode)} · ${escapeHtml(company.city)}</p>
          </div>
        </div>

        <div class="footer__contact">
          <div>
            <strong>Contato</strong>
            <div class="footer__phones">
              ${company.phones.map((phone) => `<p>${escapeHtml(phone)}</p>`).join('')}
            </div>
          </div>
          <div class="footer__actions">
            <a class="footer__button footer__button--primary" href="${whatsappUrl(whatsapp.phone, whatsapp.message)}">
              WhatsApp
            </a>
            <a class="footer__button" href="${escapeHtml(company.instagramUrl)}" target="_blank" rel="noreferrer noopener">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
