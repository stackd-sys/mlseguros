// Pedido dos formulários do site → email para a ML. Só os campos conhecidos
// entram no email; o resto é ignorado.
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TELEMOVEL = /^\+?[0-9][0-9 ]{7,17}$/;

const CAMPOS = [
  ['empresa', 'Empresa', 200],
  ['nome', 'Nome', 120],
  ['telemovel', 'Telemóvel', 30],
  ['email', 'Email', 200],
  ['tipo_de_seguro', 'Seguro', 200],
  ['assunto_pedido', 'Assunto', 200],
  ['melhor_altura', 'Melhor altura para ligar', 60],
  ['apolice_ou_matricula', 'Apólice ou matrícula', 120],
  ['atividade', 'Atividade', 200],
  ['trabalhadores', 'Trabalhadores', 60],
  ['mensagem', 'Mensagem', 4000],
];

const texto = (v, max) => (typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim().slice(0, max) : '');
const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Telemóvel português (9 dígitos a começar por 9) → link do WhatsApp.
function linkWhatsapp(tel) {
  let d = tel.replace(/\D/g, '');
  if (d.startsWith('00351')) d = d.slice(5);
  else if (d.startsWith('351') && d.length === 12) d = d.slice(3);
  return /^9\d{8}$/.test(d) ? `https://wa.me/351${d}` : null;
}

function assunto(d) {
  const quem = d.empresa ? `${d.empresa} (${d.nome})` : d.nome;
  if (d.tipo_de_seguro === 'Análise de apólices (empresa)') return `Análise de apólices: ${quem}`;
  if (d.tipo_de_seguro) return `Proposta (${d.tipo_de_seguro}): ${quem}`;
  if (d.assunto_pedido === 'Participar um sinistro') return `Participação de sinistro: ${quem}`;
  if (d.assunto_pedido === 'Pedido de contacto') return `Pedido para ligar: ${quem}`;
  return `${d.assunto_pedido || 'Mensagem'}: ${quem}`;
}

// { erro } quando falta ou está errado um campo; senão o email pronto a enviar.
export function emailDoPedido(campos, { site, agora = new Date() }) {
  const d = Object.fromEntries(CAMPOS.map(([k, , max]) => [k, texto(campos[k], max)]));
  if (d.nome.length < 2) return { erro: 'nome' };
  if (!TELEMOVEL.test(d.telemovel)) return { erro: 'telemovel' };
  if (d.email && !EMAIL.test(d.email)) return { erro: 'email' };
  if (campos.consentimento !== 'sim') return { erro: 'consentimento' };

  const caminho = texto(campos.origem, 200);
  const pagina = caminho.startsWith('/') ? new URL(caminho, site).href : site;
  const quando = new Intl.DateTimeFormat('pt-PT', { timeZone: 'Europe/Lisbon', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(agora).replace(', ', ' às ');
  const linhas = CAMPOS.filter(([k]) => d[k] && k !== 'mensagem').map(([k, rotulo]) => [k === 'nome' && d.empresa ? 'Pessoa de contacto' : rotulo, d[k]]);
  const wa = linkWhatsapp(d.telemovel);
  const tel = `tel:${d.telemovel.replace(/\s/g, '')}`;
  const responder = d.email ? 'Para responder por email, basta responder a esta mensagem.' : 'A pessoa não deixou email: responda pelo telefone.';

  const textoSimples = [
    `Pedido feito no site a ${quando}, na página ${pagina}.`,
    '',
    ...linhas.map(([r, v]) => `${r}: ${v}`),
    ...(d.mensagem ? ['', 'Mensagem:', d.mensagem] : []),
    '',
    'A pessoa autorizou a ML Seguros a usar estes dados para responder a este pedido.',
    responder,
  ].join('\n');

  const html = `<!doctype html><html lang="pt-PT"><body style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#17171c">
<p>Pedido feito no site a ${escapar(quando)}, na página <a href="${escapar(pagina)}">${escapar(pagina)}</a>.</p>
<table cellpadding="6" style="border-collapse:collapse">${linhas.map(([r, v]) => `<tr><td style="color:#5d5f66;vertical-align:top">${escapar(r)}</td><td><strong>${escapar(v)}</strong></td></tr>`).join('')}</table>
${d.mensagem ? `<p style="margin-top:16px"><strong>Mensagem</strong><br>${escapar(d.mensagem).replace(/\n/g, '<br>')}</p>` : ''}
<p style="margin-top:16px"><a href="${escapar(tel)}">Ligar</a>${wa ? ` · <a href="${wa}">Escrever pelo WhatsApp</a>` : ''}</p>
<p style="color:#5d5f66;font-size:13px">A pessoa autorizou a ML Seguros a usar estes dados para responder a este pedido. ${escapar(responder)}</p>
</body></html>`;

  return { assunto: assunto(d), texto: textoSimples, html, responderA: d.email || undefined };
}
