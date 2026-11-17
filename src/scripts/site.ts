const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const limite = () => (window.innerWidth < 768 ? 120 : 200);
  const atualizar = () => header.classList.toggle('is-fixed', window.scrollY > limite());
  atualizar();
  addEventListener('scroll', atualizar, { passive: true });
}

const menu = document.querySelector<HTMLElement>('[data-menu]');
const abrir = document.querySelector<HTMLButtonElement>('[data-menu-abrir]');
const fechar = document.querySelector<HTMLButtonElement>('[data-menu-fechar]');
if (menu && abrir && fechar) {
  const definir = (aberto: boolean) => {
    menu.classList.toggle('is-open', aberto);
    document.body.classList.toggle('menu-aberto', aberto);
    abrir.setAttribute('aria-expanded', String(aberto));
    (aberto ? fechar : abrir).focus();
  };
  abrir.addEventListener('click', () => definir(true));
  fechar.addEventListener('click', () => definir(false));
  menu.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) definir(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) definir(false); });
}

const revelar = document.querySelectorAll<HTMLElement>('.reveal');
if ('IntersectionObserver' in window && !reduzido) {
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revelar.forEach((el) => io.observe(el));
} else {
  revelar.forEach((el) => el.classList.add('is-in'));
}

const contadores = document.querySelectorAll<HTMLElement>('[data-conta]');
if ('IntersectionObserver' in window && !reduzido) {
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target as HTMLElement;
      const fim = Number(el.dataset.conta);
      const sufixo = el.dataset.sufixo ?? '';
      const t0 = performance.now();
      const passo = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        el.textContent = `${Math.round(fim * (1 - Math.pow(1 - p, 3)))}${sufixo}`;
        if (p < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
  }, { threshold: 0.6 });
  contadores.forEach((el) => io.observe(el));
}

for (const slider of document.querySelectorAll<HTMLElement>('[data-slider]')) {
  const pista = slider.querySelector<HTMLElement>('[data-slider-pista]')!;
  const pontos = slider.querySelector<HTMLElement>('[data-slider-pontos]')!;
  const ant = slider.querySelector<HTMLButtonElement>('[data-slider-ant]')!;
  const seg = slider.querySelector<HTMLButtonElement>('[data-slider-seg]')!;
  const cartoes = [...pista.children] as HTMLElement[];
  const passo = () => (cartoes[1] ? cartoes[1].offsetLeft - cartoes[0].offsetLeft : pista.clientWidth);
  const paginas = () => Math.max(1, Math.round((pista.scrollWidth - pista.clientWidth) / passo()) + 1);
  const atual = () => Math.round(pista.scrollLeft / passo());
  const desenhar = () => {
    const n = paginas();
    if (pontos.children.length !== n) {
      pontos.replaceChildren(...Array.from({ length: n }, (_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Ir para o cartão ${i + 1}`);
        b.addEventListener('click', () => pista.scrollTo({ left: i * passo(), behavior: reduzido ? 'auto' : 'smooth' }));
        return b;
      }));
    }
    const a = atual();
    [...pontos.children].forEach((b, i) => b.setAttribute('aria-current', String(i === a)));
    ant.disabled = a <= 0;
    seg.disabled = a >= n - 1;
    slider.querySelector<HTMLElement>('.slider__nav')!.hidden = n <= 1;
  };
  ant.addEventListener('click', () => pista.scrollBy({ left: -passo(), behavior: reduzido ? 'auto' : 'smooth' }));
  seg.addEventListener('click', () => pista.scrollBy({ left: passo(), behavior: reduzido ? 'auto' : 'smooth' }));
  pista.addEventListener('scroll', () => requestAnimationFrame(desenhar), { passive: true });
  addEventListener('resize', desenhar);
  desenhar();
}

const hoje = document.querySelector<HTMLElement>('[data-horario]');
if (hoje) {
  const dia = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'Europe/Lisbon' }).format(new Date()).toLowerCase().slice(0, 3);
  for (const tr of hoje.querySelectorAll<HTMLElement>('tr[data-dias]')) {
    const dias = tr.dataset.dias!.split(',').flatMap((d) => {
      const ordem = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      const [a, b] = d.split('-');
      return b ? ordem.slice(ordem.indexOf(a), ordem.indexOf(b) + 1) : [a];
    });
    tr.classList.toggle('hoje', dias.includes(dia));
  }
}
