type Avaliacao = { autor: string; autorUrl: string; foto: string; nota: number | null; texto: string; quando: string; link: string; traduzida: boolean };
type Dados = { nota: number | null; total: number; link: string; escrever?: string; avaliacoes: Avaliacao[] };

const caixas = document.querySelectorAll<HTMLElement>('[data-av]');
const decimal = (n: number) => n.toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const ESTRELA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.5 2.3a.6.6 0 0 1 1 0l2.8 5.7 6.3.9a.6.6 0 0 1 .3 1l-4.6 4.4 1.1 6.3a.6.6 0 0 1-.8.6L12 18.3l-5.6 2.9a.6.6 0 0 1-.8-.6l1.1-6.3L2.1 9.9a.6.6 0 0 1 .3-1l6.3-.9z"/></svg>';

function estrelas(nota: number): HTMLElement {
  const s = document.createElement('span');
  s.className = 'estrelas';
  s.style.setProperty('--on', `${Math.max(0, Math.min(5, nota)) * 20}%`);
  s.setAttribute('role', 'img');
  s.setAttribute('aria-label', `${nota} em 5 estrelas`);
  s.innerHTML = ESTRELA.repeat(5) + `<span class="estrelas__on">${ESTRELA.repeat(5)}</span>`;
  return s;
}

function carrossel(caixa: HTMLElement, d: Dados) {
  const lista = d.avaliacoes.filter((a) => a.texto);
  if (!lista.length) return;
  const slides = caixa.querySelector<HTMLElement>('[data-av-slides]')!;
  const autor = caixa.querySelector<HTMLElement>('[data-av-autor]')!;
  const pe = caixa.querySelector<HTMLElement>('[data-av-pe]')!;
  const ant = caixa.querySelector<HTMLButtonElement>('[data-av-ant]')!;
  const seg = caixa.querySelector<HTMLButtonElement>('[data-av-seg]')!;
  let i = 0;
  const mostrar = () => {
    const a = lista[i];
    const texto = document.createElement('blockquote');
    texto.className = a.texto.length > 320 ? 'testemunho__texto testemunho__texto--longo' : 'testemunho__texto';
    texto.style.margin = '18px 0 0';
    texto.textContent = `“${a.texto}”`;
    slides.replaceChildren(...(a.nota ? [estrelas(a.nota)] : []), texto);
    const quem = document.createElement(a.autorUrl ? 'a' : 'div');
    if (quem instanceof HTMLAnchorElement) { quem.href = a.autorUrl; quem.target = '_blank'; quem.rel = 'noopener'; }
    quem.className = 'autor';
    if (a.foto) {
      const img = document.createElement('img');
      img.src = a.foto; img.alt = ''; img.width = 52; img.height = 52; img.referrerPolicy = 'no-referrer'; img.loading = 'lazy';
      quem.append(img);
    }
    const nome = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = a.autor;
    const small = document.createElement('small');
    small.textContent = [a.quando, a.traduzida ? 'traduzida pelo Google' : ''].filter(Boolean).join(' · ');
    nome.append(strong, small);
    if (a.link) {
      const ver = document.createElement('a');
      ver.href = a.link; ver.target = '_blank'; ver.rel = 'noopener'; ver.className = 'link small'; ver.textContent = 'Ver no Google';
      nome.append(ver);
    }
    quem.append(nome);
    autor.replaceChildren(quem);
    ant.disabled = i === 0;
    seg.disabled = i === lista.length - 1;
  };
  ant.addEventListener('click', () => { if (i > 0) { i--; mostrar(); } });
  seg.addEventListener('click', () => { if (i < lista.length - 1) { i++; mostrar(); } });
  mostrar();
  caixa.querySelector<HTMLElement>('[data-av-fallback]')!.hidden = true;
  slides.hidden = false;
  pe.hidden = false;
  caixa.querySelector<HTMLElement>('[data-av-fonte]')!.hidden = false;
  if (lista.length < 2) caixa.querySelector<HTMLElement>('.testemunho__setas')!.hidden = true;
}

function carregar() {
  fetch('/api/avaliacoes/', { headers: { Accept: 'application/json' } })
    .then((r) => (r.status === 200 ? (r.json() as Promise<Dados>) : null))
    .then((d) => {
      if (!d) return;
      for (const caixa of caixas) {
        const nota = caixa.querySelector<HTMLElement>('[data-av-nota]');
        const total = caixa.querySelector<HTMLElement>('[data-av-total]');
        const est = caixa.querySelector<HTMLElement>('[data-av-estrelas]');
        if (nota && d.nota) {
          nota.textContent = `${decimal(d.nota)}/5`;
          nota.hidden = false;
          if (est) { est.style.setProperty('--on', `${d.nota * 20}%`); est.hidden = false; est.setAttribute('role', 'img'); est.setAttribute('aria-label', `${decimal(d.nota)} em 5 estrelas`); }
        }
        if (total && d.total) total.textContent = `Com base em ${d.total} avaliações no Google`;
        if (d.link) caixa.querySelectorAll<HTMLAnchorElement>('[data-av-link]').forEach((a) => (a.href = d.link));
        if (caixa.hasAttribute('data-av-carrossel')) carrossel(caixa, d);
      }
    })
    .catch(() => {});
}

// A Google não deixa guardar as avaliações e cada leitura é uma consulta à API:
// só se pedem quando a secção está quase à vista.
if (caixas.length) {
  const vigia = new IntersectionObserver((entradas) => {
    if (!entradas.some((e) => e.isIntersecting)) return;
    vigia.disconnect();
    carregar();
  }, { rootMargin: '400px 0px' });
  caixas.forEach((c) => vigia.observe(c));
}
