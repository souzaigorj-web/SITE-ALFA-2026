export function renderAbout(): string {
  return `
    <section id="sobre" class="about-showcase" aria-labelledby="about-title">
      <div class="about-showcase__visual" aria-hidden="true">
        <img class="about-showcase__asset" src="/assets/planeta-alfa.png" alt="" loading="lazy" decoding="async" />
      </div>

      <div class="about-showcase__content">
        <img class="about-showcase__logo" src="/logo-alfa.png" alt="ALFA Telecom" loading="lazy" decoding="async" />
        <h2 id="about-title">
          <span>Conectamos</span>
          <span>você, sua casa</span>
          <span>e seu trabalho</span>
          <span>com o mundo!</span>
        </h2>
        <span class="about-showcase__rule" aria-hidden="true"></span>
        <p>
          Conheça a internet que une<br />
          tecnologia, estabilidade e velocidade<br />
          para toda a família.
        </p>
      </div>
    </section>
  `;
}
