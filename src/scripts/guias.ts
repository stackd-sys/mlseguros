// Filtros da página dos guias: tema e pesquisa, com o estado no endereço (?tema=…&q=…).
const raiz = document.querySelector<HTMLElement>('[data-filtros]');

if (raiz) {
  const cartoes = [...document.querySelectorAll<HTMLElement>('[data-guias] .guia')];
  const botoes = [...raiz.querySelectorAll<HTMLButtonElement>('button[data-tema]')];
  const busca = raiz.querySelector<HTMLInputElement>('[data-busca]')!;
  const contagem = document.querySelector<HTMLElement>('[data-contagem]');
  const vazio = document.querySelector<HTMLElement>('[data-vazio]');
  const normal = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const params = new URLSearchParams(location.search);
  let tema = params.get('tema') ?? '';
  if (!botoes.some((b) => b.dataset.tema === tema)) tema = '';
  busca.value = params.get('q') ?? '';

  const aplicar = () => {
    const termos = normal(busca.value).split(/\s+/).filter(Boolean);
    let n = 0;
    for (const c of cartoes) {
      const ok = (!tema || c.dataset.tema === tema) && termos.every((t) => (c.dataset.texto ?? '').includes(t));
      c.hidden = !ok;
      if (ok) {
        n++;
        c.classList.add('is-in');
      }
    }
    for (const b of botoes) {
      const on = b.dataset.tema === tema;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    }
    if (contagem) contagem.textContent = n === 1 ? '1 guia' : `${n} guias`;
    if (vazio) vazio.hidden = n > 0;
    const novo = new URLSearchParams();
    if (tema) novo.set('tema', tema);
    if (busca.value.trim()) novo.set('q', busca.value.trim());
    const qs = novo.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  };

  for (const b of botoes) {
    b.addEventListener('click', () => {
      tema = b.dataset.tema ?? '';
      aplicar();
    });
  }
  busca.addEventListener('input', aplicar);
  document.querySelector('[data-limpar]')?.addEventListener('click', () => {
    tema = '';
    busca.value = '';
    aplicar();
    busca.focus();
  });
  if (tema || busca.value) aplicar();

  const ativo = botoes.find((b) => b.dataset.tema === tema);
  if (tema && ativo?.parentElement) {
    const fila = ativo.parentElement;
    fila.scrollLeft += ativo.getBoundingClientRect().left - fila.getBoundingClientRect().left - 16;
  }
}
