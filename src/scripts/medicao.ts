// Eventos para o GTM (sem dados pessoais): cliques nos contactos e pedidos enviados.
const camada = () => (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer;

document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
  if (!a) return;
  const href = a.getAttribute('href') ?? '';
  const canal = href.startsWith('tel:') ? 'telefone' : href.startsWith('mailto:') ? 'email' : /wa\.me\//.test(href) ? 'whatsapp' : '';
  if (!canal) return;
  const local = a.closest('.wa-float') ? 'botao_flutuante' : a.closest('header, .topbar, .mnav') ? 'cabecalho' : a.closest('footer') ? 'rodape' : a.closest('section[id]')?.id ?? 'pagina';
  camada()?.push({ event: 'contacto_clique', canal, local });
});

const pedido = document.querySelector<HTMLElement>('[data-pedido-tipo]');
if (pedido) {
  try {
    if (sessionStorage.getItem('ml-pedido') === pedido.dataset.pedidoTipo) {
      sessionStorage.removeItem('ml-pedido');
      camada()?.push({ event: 'generate_lead', tipo_pedido: pedido.dataset.pedidoTipo });
    }
  } catch {}
}
