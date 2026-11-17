// As mesmas regras do CRM (lib/antispam.ts). Um pedido apanhado aqui recebe
// uma resposta de sucesso, para o robô não perceber que foi travado.
const TEMPO_MINIMO_MS = 3000;
const LIGACAO = /(https?:\/\/|www\.)/gi;
const HTML = /<a\s|<\/?[a-z][^>]*>|\[url[=\]]/i;

export function motivoSpam(campos) {
  if (typeof campos._gotcha === 'string' && campos._gotcha.trim()) return 'campo escondido preenchido';
  const tempo = Number(campos._t);
  if (!Number.isFinite(tempo) || tempo < TEMPO_MINIMO_MS) return 'enviado depressa demais ou sem passar pela página';
  const tudo = Object.entries(campos)
    .filter(([k, v]) => !k.startsWith('_') && k !== 'origem' && typeof v === 'string')
    .map(([, v]) => v)
    .join('\n');
  if (HTML.test(tudo)) return 'html';
  if ((tudo.match(LIGACAO) ?? []).length >= 2) return 'ligações';
  if (typeof campos.nome === 'string' && /(https?:\/\/|www\.|@)/i.test(campos.nome)) return 'ligação no nome';
  return null;
}
