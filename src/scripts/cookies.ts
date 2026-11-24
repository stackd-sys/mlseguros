// Banner de cookies: guarda a escolha em ml_consent (versão|estatística|marketing)
// e atualiza o Consent Mode da Google.
type Gtag = (...args: unknown[]) => void;
const NOME = 'ml_consent';
const VERSAO = '1';
const SEIS_MESES = 60 * 60 * 24 * 182;

const caixa = document.querySelector<HTMLElement>('[data-cookies]');

function lerEscolha(): { est: boolean; mkt: boolean } | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${NOME}=([^;]*)`));
  const c = m ? decodeURIComponent(m[1]).split('|') : [];
  return c[0] === VERSAO ? { est: c[1] === '1', mkt: c[2] === '1' } : null;
}

function guardar(est: boolean, mkt: boolean) {
  const seguro = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${NOME}=${encodeURIComponent(`${VERSAO}|${est ? 1 : 0}|${mkt ? 1 : 0}`)}; Max-Age=${SEIS_MESES}; Path=/; SameSite=Lax${seguro}`;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  const e = est ? 'granted' : 'denied';
  const k = mkt ? 'granted' : 'denied';
  g?.('consent', 'update', { analytics_storage: e, ad_storage: k, ad_user_data: k, ad_personalization: k, personalization_storage: k });
  (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'consentimento_atualizado', estatistica: est, marketing: mkt });
  document.dispatchEvent(new CustomEvent('ml:consentimento', { detail: { estatistica: est, marketing: mkt } }));
  fechar();
}

function abrir(detalhe: boolean) {
  if (!caixa) return;
  const atual = lerEscolha();
  caixa.querySelector<HTMLInputElement>('[data-cookies-estatistica]')!.checked = atual?.est ?? false;
  caixa.querySelector<HTMLInputElement>('[data-cookies-marketing]')!.checked = atual?.mkt ?? false;
  mostrarOpcoes(detalhe);
  caixa.hidden = false;
  document.body.classList.add('cookies-aberto');
}

function fechar() {
  if (!caixa) return;
  caixa.hidden = true;
  document.body.classList.remove('cookies-aberto');
}

function mostrarOpcoes(sim: boolean) {
  caixa!.querySelector<HTMLElement>('[data-cookies-opcoes]')!.hidden = !sim;
  caixa!.querySelector<HTMLElement>('[data-cookies-guardar]')!.hidden = !sim;
  caixa!.querySelector<HTMLElement>('[data-cookies-personalizar]')!.hidden = sim;
}

if (caixa) {
  caixa.querySelector('[data-cookies-aceitar]')!.addEventListener('click', () => guardar(true, true));
  caixa.querySelector('[data-cookies-recusar]')!.addEventListener('click', () => guardar(false, false));
  caixa.querySelector('[data-cookies-personalizar]')!.addEventListener('click', () => mostrarOpcoes(true));
  caixa.querySelector('[data-cookies-guardar]')!.addEventListener('click', () =>
    guardar(caixa.querySelector<HTMLInputElement>('[data-cookies-estatistica]')!.checked, caixa.querySelector<HTMLInputElement>('[data-cookies-marketing]')!.checked));
  if (!lerEscolha()) abrir(false);
  document.querySelectorAll('[data-cookies-abrir]').forEach((b) => b.addEventListener('click', () => abrir(true)));
} else {
  document.querySelectorAll<HTMLElement>('[data-cookies-abrir]').forEach((b) => (b.closest('li') ?? b).remove());
}
