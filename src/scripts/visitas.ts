// Medição própria do site, só com os cookies de estatística aceites: páginas
// vistas, tempo ativo, até onde se lê, que secções se veem e onde se clica.
// Vai para o CRM da ML (PUBLIC_MEDICAO_URL). Sem nomes, contactos, o que se
// escreve nos formulários nem endereço de rede.
// Com ?mapa=1, dentro do CRM, desenha o mapa de calor que o CRM lhe envia.
// ?nao-medir=1 deixa de medir este browser (para a equipa); ?nao-medir=0 volta a medir.

const URL_MEDICAO = (import.meta.env.PUBLIC_MEDICAO_URL ?? '').trim();
const MINUTO = 60_000;
const SESSAO_MAX = 30 * MINUTO;
const ORIGEM_MAX = 30 * 24 * 60 * MINUTO;
const VISITANTE_MAX = 395 * 24 * 60 * MINUTO;
const PARADO = 2 * MINUTO;
const K = { visitante: 'ml_v', sessao: 'ml_s', origem: 'ml_o', excluir: 'ml_nm' };

type Canal = 'organico' | 'anuncios-google' | 'anuncios-meta' | 'anuncios' | 'redes' | 'ia' | 'email' | 'ficha-google' | 'referencia' | 'direto';
interface Origem { canal: Canal; fonte: string; campanha: string; entrada: string; em: number }
interface Sessao extends Origem { id: string; ultimo: number }
interface Regiao { el: HTMLElement; n: string; i: number; v: number; a: number }
interface Clique { s: number; x: number; y: number; k: string; t: string; h: string }

const ler = <T>(k: string): T | null => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? 'null') as T | null;
  } catch {
    return null;
  }
};
const gravar = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  } catch {}
};
const apagar = () => {
  try {
    [K.visitante, K.sessao, K.origem].forEach((k) => localStorage.removeItem(k));
  } catch {}
};
const codigo = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`);
const texto = (s: string | null | undefined, max: number) => (s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

function estatisticaAceite(): boolean {
  const m = document.cookie.match(/(?:^|; )ml_consent=([^;]*)/);
  const c = m ? decodeURIComponent(m[1]).split('|') : [];
  return c[0] === '1' && c[1] === '1';
}

// ── De onde veio a visita ──────────────────────────────────────────────────
const IA: [RegExp, string][] = [
  [/chatgpt\.com$|openai\.com$/, 'ChatGPT'], [/perplexity\.ai$/, 'Perplexity'], [/gemini\.google\.com$|bard\.google\.com$/, 'Gemini'],
  [/copilot\.microsoft\.com$|copilot\.cloud\.microsoft$/, 'Copilot'], [/claude\.ai$/, 'Claude'], [/deepseek\.com$/, 'DeepSeek'],
  [/meta\.ai$/, 'Meta AI'], [/grok\.com$/, 'Grok'], [/mistral\.ai$/, 'Mistral'], [/you\.com$/, 'You.com'],
];
const REDES: [RegExp, string][] = [
  [/facebook\.com$|fb\.com$|fb\.me$/, 'Facebook'], [/instagram\.com$/, 'Instagram'], [/linkedin\.com$|lnkd\.in$/, 'LinkedIn'],
  [/^t\.co$|x\.com$|twitter\.com$/, 'X'], [/youtube\.com$|youtu\.be$/, 'YouTube'], [/tiktok\.com$/, 'TikTok'], [/threads\.net$/, 'Threads'], [/pinterest\./, 'Pinterest'],
];
const PESQUISA: [RegExp, string][] = [
  [/(^|\.)google\.[a-z.]+$|googlequicksearchbox/, 'Google'], [/bing\.com$/, 'Bing'], [/duckduckgo\.com$/, 'DuckDuckGo'], [/yahoo\.com$/, 'Yahoo'],
  [/ecosia\.org$/, 'Ecosia'], [/search\.brave\.com$/, 'Brave'], [/qwant\.com$/, 'Qwant'],
];
const EMAIL = /mail\.google\.com$|outlook\.(live|office|office365)\.com$|mail\.yahoo\.com$|android\.gm$|^webmail\./;
const achar = (lista: [RegExp, string][], s: string) => lista.find(([r]) => r.test(s))?.[1] ?? '';

export function origemDaVisita(url: URL, referencia: string, proprio: string): Omit<Origem, 'entrada' | 'em'> {
  const p = url.searchParams;
  const src = (p.get('utm_source') ?? '').toLowerCase().trim();
  const med = (p.get('utm_medium') ?? '').toLowerCase().trim();
  const campanha = texto(p.get('utm_campaign'), 100);
  let ref = '';
  try {
    const r = new URL(referencia);
    const host = r.protocol === 'android-app:' ? r.hostname : r.hostname.replace(/^www\./, '');
    if (host && host !== proprio.replace(/^www\./, '')) ref = host;
  } catch {}
  const pago = /^(cpc|ppc|paid|paid[_-]?social|paidsocial|ads?|display|cpm|cpv)$/.test(med);
  const fonteUtm = src.replace(/^www\./, '');

  if (p.has('gclid') || p.has('gbraid') || p.has('wbraid') || (pago && /google|youtube/.test(src))) return { canal: 'anuncios-google', fonte: 'Google', campanha };
  if (pago && /facebook|instagram|meta|^fb$|^ig$/.test(src)) return { canal: 'anuncios-meta', fonte: /instagram|^ig$/.test(src) ? 'Instagram' : 'Facebook', campanha };
  if (pago || p.has('msclkid')) return { canal: 'anuncios', fonte: fonteUtm || (p.has('msclkid') ? 'Bing' : ref), campanha };
  if (/^(gbp|gmb|google[_-]?business([_-]?profile)?)$/.test(src) || med === 'gbp') return { canal: 'ficha-google', fonte: 'Google', campanha };
  if (/^(e-?mail|newsletter)$/.test(med) || EMAIL.test(ref)) return { canal: 'email', fonte: fonteUtm || ref, campanha };
  const ia = achar(IA, fonteUtm) || achar(IA, ref);
  if (ia) return { canal: 'ia', fonte: ia, campanha };
  const rede = achar(REDES, fonteUtm) || achar(REDES, ref) || (p.has('fbclid') ? 'Facebook' : '');
  if (rede) return { canal: 'redes', fonte: rede, campanha };
  const motor = achar(PESQUISA, ref) || (med === 'organic' ? achar(PESQUISA, fonteUtm) || fonteUtm : '');
  if (motor) return { canal: 'organico', fonte: motor, campanha };
  if (ref) return { canal: 'referencia', fonte: ref, campanha };
  if (fonteUtm) return { canal: 'referencia', fonte: fonteUtm, campanha };
  return { canal: 'direto', fonte: '', campanha };
}

// ── Regiões da página: cabeçalho, cada secção do conteúdo e rodapé ─────────
function regioes(): Regiao[] {
  const lista: Regiao[] = [];
  const cab = document.querySelector<HTMLElement>('[data-header], header.header');
  if (cab) lista.push({ el: cab, n: 'Cabeçalho', i: 0, v: 0, a: 1 });
  const main = document.querySelector('main');
  const seccoes = main ? [...main.querySelectorAll<HTMLElement>('section')].filter((s) => !s.parentElement?.closest('section')) : [];
  const nomes = new Map<string, number>();
  seccoes.forEach((s, k) => {
    let n = texto(s.querySelector('h1, h2')?.textContent, 60) || texto(s.getAttribute('aria-label'), 60) || (s.id ? s.id.replace(/-/g, ' ') : `Secção ${k + 1}`);
    const rep = nomes.get(n) ?? 0;
    nomes.set(n, rep + 1);
    if (rep) n = `${n} (${rep + 1})`;
    lista.push({ el: s, n, i: lista.length, v: 0, a: 0 });
  });
  const rod = document.querySelector<HTMLElement>('footer');
  if (rod) lista.push({ el: rod, n: 'Rodapé', i: lista.length, v: 0, a: 0 });
  return lista;
}

function regiaoDe(alvo: Element, lista: Regiao[]): Regiao | undefined {
  if (alvo.closest('.topbar, .natal, [data-header], header.header')) return lista.find((r) => r.n === 'Cabeçalho');
  return lista.find((r) => r.n !== 'Cabeçalho' && r.el.contains(alvo));
}

function tipoDoClique(el: Element): { k: string; t: string; h: string } {
  const a = el.closest<HTMLAnchorElement>('a[href]');
  if (a) {
    const href = a.getAttribute('href') ?? '';
    // Num cartão com título, o nome é o título; senão, o texto da ligação.
    const t = texto(a.getAttribute('aria-label') || a.querySelector('h2, h3, h4, strong')?.textContent || a.textContent, 60);
    if (href.startsWith('tel:')) return { k: 'tel', t, h: 'tel' };
    if (href.startsWith('mailto:')) return { k: 'email', t, h: 'email' };
    if (/wa\.me\/|whatsapp\.com/.test(href)) return { k: 'whatsapp', t: a.closest('.wa-float') ? 'WhatsApp flutuante' : t, h: 'whatsapp' };
    try {
      const u = new URL(href, location.href);
      if (u.host === location.host) return { k: 'link', t, h: (u.pathname + u.hash).slice(0, 120) };
      return { k: 'externo', t, h: u.host.slice(0, 120) };
    } catch {
      return { k: 'link', t, h: '' };
    }
  }
  const campo = el.closest<HTMLInputElement>('input, select, textarea');
  if (campo) return { k: 'campo', t: texto(campo.name || campo.id, 60), h: '' };
  const botao = el.closest<HTMLElement>('button, [role=button], summary, label');
  if (botao) return { k: 'botao', t: texto(botao.getAttribute('aria-label') || botao.textContent, 60), h: '' };
  return { k: 'outro', t: '', h: '' };
}

function dispositivo(): 'computador' | 'tablet' | 'telemovel' {
  const w = innerWidth;
  return w < 640 ? 'telemovel' : w < 1024 ? 'tablet' : 'computador';
}

// ── Medição ────────────────────────────────────────────────────────────────
function medir() {
  if (!URL_MEDICAO || navigator.webdriver || /bot|crawl|spider|headless|lighthouse/i.test(navigator.userAgent)) return;
  let ativa = false;
  let parar = () => {};

  function iniciar() {
    if (ativa) return;
    try {
      if (localStorage.getItem(K.excluir) === '1') return;
    } catch {
      return;
    }
    ativa = true;
    const agora = Date.now();

    let vis = (() => {
      try {
        return localStorage.getItem(K.visitante);
      } catch {
        return null;
      }
    })();
    const [vid, criado] = (vis ?? '').split('.');
    if (!vid || !Number(criado) || agora - Number(criado) > VISITANTE_MAX) {
      vis = `${codigo()}.${agora}`;
      gravar(K.visitante, vis);
    }
    const visitante = vis!.split('.')[0];

    const daqui = origemDaVisita(new URL(location.href), document.referrer, location.hostname);
    let sessao = ler<Sessao>(K.sessao);
    // Sessão nova ao fim de 30 minutos parado, ou quando a pessoa chega de outro sítio.
    const outraOrigem = sessao && daqui.canal !== 'direto' && (daqui.canal !== sessao.canal || daqui.fonte !== sessao.fonte || daqui.campanha !== sessao.campanha);
    const entrada = !sessao || agora - sessao.ultimo > SESSAO_MAX || Boolean(outraOrigem);
    if (entrada) {
      sessao = { id: codigo(), ultimo: agora, ...daqui, entrada: location.pathname, em: agora };
      if (daqui.canal !== 'direto') gravar(K.origem, { ...daqui, entrada: location.pathname, em: agora } satisfies Origem);
    }
    const s = sessao!;
    s.ultimo = agora;
    gravar(K.sessao, s);

    const id = codigo();
    const lista = regioes();
    const cliques: Clique[] = [];
    let tempo = 0;
    let scroll = 0;
    let formulario = false;
    let mexeu = agora;

    const verScroll = () => {
      const doc = document.documentElement;
      const alt = Math.max(doc.scrollHeight, 1);
      scroll = Math.max(scroll, Math.min(100, Math.round(((scrollY + innerHeight) / alt) * 100)));
      const vh = innerHeight;
      for (const r of lista) {
        const b = r.el.getBoundingClientRect();
        const visto = Math.max(0, Math.min(b.bottom, vh) - Math.max(b.top, 0));
        if (b.height > 0 && visto >= Math.min(b.height * 0.5, vh * 0.3)) r.a = 1;
      }
    };
    let pedido = 0;
    const aoScroll = () => {
      mexeu = Date.now();
      if (!pedido) pedido = requestAnimationFrame(() => { pedido = 0; verScroll(); });
    };
    const aoMexer = () => { mexeu = Date.now(); };
    const tic = setInterval(() => {
      if (document.visibilityState !== 'visible' || Date.now() - mexeu > PARADO) return;
      tempo += 1000;
      const vh = innerHeight;
      for (const r of lista) {
        const b = r.el.getBoundingClientRect();
        const visto = Math.max(0, Math.min(b.bottom, vh) - Math.max(b.top, 0));
        // O cabeçalho está sempre à vista: conta como visto, mas não soma tempo.
        if (b.height > 0 && visto >= Math.min(b.height * 0.5, vh * 0.3)) { r.a = 1; if (r.n !== 'Cabeçalho') r.v += 1000; }
      }
    }, 1000);
    const aoClicar = (e: MouseEvent) => {
      mexeu = Date.now();
      const alvo = e.target instanceof Element ? e.target : null;
      if (!alvo || cliques.length >= 80) return;
      const r = regiaoDe(alvo, lista);
      const b = r?.el.getBoundingClientRect();
      const tipo = tipoDoClique(alvo);
      cliques.push({
        s: r ? r.i : -1,
        x: b && b.width ? Math.round(((e.clientX - b.left) / b.width) * 1000) : 0,
        y: b && b.height ? Math.round(((e.clientY - b.top) / b.height) * 1000) : 0,
        ...tipo,
      });
    };
    const aoFormulario = (e: FocusEvent) => {
      if (e.target instanceof Element && e.target.closest('form [name]')) formulario = true;
    };
    // Origem do pedido: vai com o formulário, para a lead entrar no CRM com o canal.
    const aoEnviar = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (!(form instanceof HTMLFormElement)) return;
      formulario = true;
      const ultima = ler<Origem>(K.origem);
      const o: Omit<Origem, 'em'> = s.canal === 'direto' && ultima && Date.now() - ultima.em < ORIGEM_MAX ? ultima : s;
      const por = (nome: string, valor: string) => {
        let campo = form.querySelector<HTMLInputElement>(`input[name="${nome}"]`);
        if (!campo) {
          campo = document.createElement('input');
          campo.type = 'hidden';
          campo.name = nome;
          form.append(campo);
        }
        campo.value = valor;
      };
      por('canal', o.canal);
      if (o.fonte) por('fonte', o.fonte);
      if (o.campanha) por('campanha', o.campanha);
      por('entrada', o.entrada);
    };

    let ultimoEnvio = '';
    const enviar = () => {
      verScroll();
      const corpo = JSON.stringify({
        id, visitante, sessao: s.id, pagina: location.pathname, titulo: texto(document.title, 200), entrada,
        canal: s.canal, fonte: s.fonte, campanha: s.campanha, dispositivo: dispositivo(), largura: innerWidth,
        tempo_ms: tempo, scroll, formulario,
        seccoes: lista.map(({ i, n, v, a }) => ({ i, n, v, a })),
        cliques,
      });
      if (corpo === ultimoEnvio) return;
      ultimoEnvio = corpo;
      try {
        navigator.sendBeacon(URL_MEDICAO, new Blob([corpo], { type: 'text/plain' }));
      } catch {}
    };
    const aoEsconder = () => {
      if (document.visibilityState === 'hidden') enviar();
      else {
        s.ultimo = Date.now();
        gravar(K.sessao, s);
      }
    };

    addEventListener('scroll', aoScroll, { passive: true });
    addEventListener('pointermove', aoMexer, { passive: true });
    addEventListener('keydown', aoMexer, { passive: true });
    addEventListener('touchstart', aoMexer, { passive: true });
    document.addEventListener('click', aoClicar, { capture: true, passive: true });
    document.addEventListener('focusin', aoFormulario);
    document.addEventListener('submit', aoEnviar, { capture: true });
    document.addEventListener('visibilitychange', aoEsconder);
    addEventListener('pagehide', enviar);
    verScroll();

    parar = () => {
      ativa = false;
      clearInterval(tic);
      removeEventListener('scroll', aoScroll);
      removeEventListener('pointermove', aoMexer);
      removeEventListener('keydown', aoMexer);
      removeEventListener('touchstart', aoMexer);
      document.removeEventListener('click', aoClicar, { capture: true });
      document.removeEventListener('focusin', aoFormulario);
      document.removeEventListener('submit', aoEnviar, { capture: true });
      document.removeEventListener('visibilitychange', aoEsconder);
      removeEventListener('pagehide', enviar);
    };
  }

  const nm = new URLSearchParams(location.search).get('nao-medir');
  if (nm === '1') {
    gravar(K.excluir, '1');
    apagar();
  } else if (nm === '0') {
    try {
      localStorage.removeItem(K.excluir);
    } catch {}
  }

  if (estatisticaAceite()) iniciar();
  document.addEventListener('ml:consentimento', (e) => {
    if ((e as CustomEvent<{ estatistica: boolean }>).detail?.estatistica) iniciar();
    else {
      parar();
      apagar();
    }
  });
}

// ── Mapa de calor (dentro do CRM) ──────────────────────────────────────────
interface DadosMapa { tipo: 'ml-mapa'; cliques: [string, number, number][]; seccoes: { n: string; alcance: number; tempo: number; cliques: number }[] }

const CORES: [number, number, number, number][] = [
  [0, 0, 0, 0], [0.25, 40, 90, 255], [0.45, 0, 200, 200], [0.6, 60, 210, 60], [0.78, 255, 220, 0], [1, 230, 30, 30],
];
function cor(t: number): [number, number, number] {
  for (let k = 1; k < CORES.length; k++) {
    if (t <= CORES[k][0]) {
      const [p0, r0, g0, b0] = CORES[k - 1];
      const [p1, r1, g1, b1] = CORES[k];
      const f = (t - p0) / (p1 - p0 || 1);
      return [r0 + (r1 - r0) * f, g0 + (g1 - g0) * f, b0 + (b1 - b0) * f];
    }
  }
  return [230, 30, 30];
}

function modoMapa() {
  let origemCrm = '';
  try {
    origemCrm = new URL(URL_MEDICAO).origin;
  } catch {
    return;
  }
  document.documentElement.classList.add('modo-mapa');
  const estilo = document.createElement('style');
  estilo.textContent = '.cookies{display:none!important}.mapa-camada{position:absolute;left:0;top:0;pointer-events:none;z-index:2147483000}.mapa-rot{position:absolute;z-index:2147483001;pointer-events:none;font:600 12px/1.3 system-ui,sans-serif;background:rgba(20,22,28,.86);color:#fff;padding:5px 9px;border-radius:8px;white-space:nowrap}.mapa-rot b{color:#ffd54a}.mapa-veu{position:absolute;left:0;pointer-events:none;z-index:2147482999;background:#14161c}';
  document.head.append(estilo);
  document.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); }, { capture: true });
  document.addEventListener('submit', (e) => e.preventDefault(), { capture: true });

  let dados: DadosMapa | null = null;
  const camada = document.createElement('canvas');
  camada.className = 'mapa-camada';
  const rotulos = document.createElement('div');
  document.body.append(camada, rotulos);

  const desenhar = () => {
    if (!dados) return;
    const lista = regioes();
    const doc = document.documentElement;
    const L = doc.scrollWidth;
    const A = doc.scrollHeight;
    const escala = 0.5;
    camada.width = Math.ceil(L * escala);
    camada.height = Math.ceil(A * escala);
    camada.style.width = `${L}px`;
    camada.style.height = `${A}px`;
    const ctx = camada.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, camada.width, camada.height);
    const raio = 26 * escala;
    const porNome = new Map(lista.map((r) => [r.n, r.el.getBoundingClientRect()]));
    for (const [n, x, y] of dados.cliques) {
      const b = porNome.get(n);
      if (!b) continue;
      const px = (b.left + scrollX + (x / 1000) * b.width) * escala;
      const py = (b.top + scrollY + (y / 1000) * b.height) * escala;
      const g = ctx.createRadialGradient(px, py, 0, px, py, raio);
      g.addColorStop(0, 'rgba(0,0,0,0.22)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px - raio, py - raio, raio * 2, raio * 2);
    }
    const img = ctx.getImageData(0, 0, camada.width, camada.height);
    const d = img.data;
    for (let k = 0; k < d.length; k += 4) {
      const a = d[k + 3] / 255;
      if (!a) continue;
      const [r, g, b] = cor(Math.min(1, a * 1.6));
      d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = Math.min(220, 60 + a * 300);
    }
    ctx.putImageData(img, 0, 0);

    rotulos.replaceChildren();
    const info = new Map(dados.seccoes.map((s) => [s.n, s]));
    for (const r of lista) {
      const s = info.get(r.n);
      if (!s) continue;
      const b = r.el.getBoundingClientRect();
      const topo = b.top + scrollY;
      if (r.n !== 'Cabeçalho') {
        const veu = document.createElement('div');
        veu.className = 'mapa-veu';
        veu.style.cssText = `top:${topo}px;height:${b.height}px;width:${L}px;opacity:${(0.55 * (1 - s.alcance)).toFixed(2)}`;
        rotulos.append(veu);
      }
      const rot = document.createElement('div');
      rot.className = 'mapa-rot';
      rot.style.cssText = `top:${topo + 8}px;left:${Math.max(8, b.left + scrollX + 8)}px`;
      rot.innerHTML = `${r.n.replace(/[<>&]/g, '')} · <b>${Math.round(s.alcance * 100)}%</b> viram · ${Math.round(s.tempo / 1000)} s · ${s.cliques} cliques`;
      rotulos.append(rot);
    }
    parent.postMessage({ tipo: 'ml-mapa-desenhado', altura: A }, origemCrm);
  };

  addEventListener('message', (e) => {
    if (e.origin !== origemCrm || (e.data as DadosMapa)?.tipo !== 'ml-mapa') return;
    dados = e.data as DadosMapa;
    desenhar();
  });
  let espera = 0;
  const redesenhar = () => {
    clearTimeout(espera);
    espera = window.setTimeout(desenhar, 200);
  };
  new ResizeObserver(redesenhar).observe(document.body);
  addEventListener('load', redesenhar);
  // Os nomes das secções vão com o aviso: o CRM usa-os para os dados de exemplo.
  parent.postMessage({ tipo: 'ml-mapa-pronto', seccoes: regioes().map((r) => r.n) }, origemCrm);
}

if (new URLSearchParams(location.search).has('mapa') && window.parent !== window) modoMapa();
else medir();
