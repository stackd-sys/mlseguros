// Pedido dos formulários do site → email para a ML. Só os campos conhecidos
// entram no email; o resto é ignorado.
//
// O HTML é feito com tabelas e estilos inline porque o Outlook do Windows
// ignora quase todo o CSS moderno.
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TELEMOVEL = /^\+?[0-9][0-9 ]{7,17}$/;

const CAMPOS = [
  ['empresa', 200],
  ['nome', 120],
  ['telemovel', 30],
  ['email', 200],
  ['tipo_de_seguro', 200],
  ['assunto_pedido', 200],
  ['melhor_altura', 60],
  ['apolice_ou_matricula', 120],
  ['atividade', 200],
  ['trabalhadores', 60],
  ['mensagem', 4000],
];

const COR = { marca: '#c2182d', texto: '#17171c', suave: '#5d5f66', linha: '#e7e5e1', borda: '#d9d6d0', fundo: '#f3f2ef', caixa: '#f8f7f5' };
const LETRA = "'Segoe UI',-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif";

const texto = (v, max) => (typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim().slice(0, max) : '');
const escapar = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Telemóvel com os dígitos agrupados, o link para ligar e, se for um telemóvel
// português, o do WhatsApp.
function telefone(tel) {
  const digitos = tel.replace(/\D/g, '');
  let nacional = digitos;
  if (digitos.startsWith('00351')) nacional = digitos.slice(5);
  else if (digitos.startsWith('351') && digitos.length === 12) nacional = digitos.slice(3);
  const pt = /^[29]\d{8}$/.test(nacional);
  return {
    mostrar: pt ? nacional.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : tel,
    ligar: pt ? `tel:+351${nacional}` : `tel:${tel.startsWith('+') ? '+' : ''}${digitos}`,
    whatsapp: /^9\d{8}$/.test(nacional) ? `https://wa.me/351${nacional}` : null,
  };
}

function tipoDoPedido(d) {
  if (d.tipo_de_seguro === 'Análise de apólices (empresa)') return { nome: 'Análise de apólices', assunto: 'Análise de apólices' };
  if (d.tipo_de_seguro) return { nome: 'Pedido de proposta', seguro: d.tipo_de_seguro, assunto: `Proposta (${d.tipo_de_seguro})` };
  if (d.assunto_pedido === 'Participar um sinistro') return { nome: 'Participação de sinistro', assunto: 'Participação de sinistro' };
  if (d.assunto_pedido === 'Pedido de contacto') return { nome: 'Pedido para ligar', assunto: 'Pedido para ligar' };
  const outro = d.assunto_pedido || 'Mensagem';
  return { nome: outro, assunto: outro };
}

// A página de onde veio o pedido, só se for do próprio site.
function paginaDe(caminho, site) {
  try {
    const u = new URL(caminho, site);
    return u.origin === new URL(site).origin ? u.href : site;
  } catch {
    return site;
  }
}

const botao = (href, rotulo, principal) =>
  `<table role="presentation" align="left" cellpadding="0" cellspacing="0" border="0" style="margin:0 8px 8px 0"><tr>` +
  `<td bgcolor="${principal ? COR.marca : '#ffffff'}" style="padding:11px 18px;border-radius:8px;border:1px solid ${principal ? COR.marca : COR.borda}">` +
  `<a href="${escapar(href)}" style="font-family:${LETRA};font-size:15px;line-height:20px;font-weight:600;color:${principal ? '#ffffff' : COR.texto};text-decoration:none;white-space:nowrap">${escapar(rotulo)}</a>` +
  `</td></tr></table>`;

const linhaDeDados = ([rotulo, valor, href], i) => {
  const topo = i ? `border-top:1px solid ${COR.linha};` : '';
  const conteudo = href ? `<a href="${escapar(href)}" style="color:${COR.texto};text-decoration:underline">${escapar(valor)}</a>` : escapar(valor);
  return (
    `<tr><td width="38%" style="${topo}padding:12px 12px 12px 0;vertical-align:top;font-family:${LETRA};font-size:13px;line-height:20px;color:${COR.suave}">${escapar(rotulo)}</td>` +
    `<td style="${topo}padding:12px 0;vertical-align:top;font-family:${LETRA};font-size:15px;line-height:20px;font-weight:600;color:${COR.texto};word-break:break-word">${conteudo}</td></tr>`
  );
};

// { erro } quando falta ou está errado um campo; senão o email pronto a enviar.
export function emailDoPedido(campos, { site, agora = new Date() }) {
  const d = Object.fromEntries(CAMPOS.map(([k, max]) => [k, texto(campos[k], max)]));
  if (d.nome.length < 2) return { erro: 'nome' };
  if (!TELEMOVEL.test(d.telemovel)) return { erro: 'telemovel' };
  if (d.email && !EMAIL.test(d.email)) return { erro: 'email' };
  if (campos.consentimento !== 'sim') return { erro: 'consentimento' };

  const tipo = tipoDoPedido(d);
  const tel = telefone(d.telemovel);
  const pagina = paginaDe(texto(campos.origem, 200), site);
  const paginaCurta = pagina.replace(/^https?:\/\//, '');
  const quando = new Intl.DateTimeFormat('pt-PT', { timeZone: 'Europe/Lisbon', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(agora).replace(', ', ' às ');
  const titulo = d.empresa || d.nome;
  const assunto = `${tipo.assunto}: ${d.empresa ? `${d.empresa} (${d.nome})` : d.nome}`;
  const responder = d.email
    ? 'Para responder por email, basta responder a esta mensagem.'
    : `Não deixou email: responda pelo telefone${tel.whatsapp ? ' ou pelo WhatsApp' : ''}.`;
  const consentimento = 'A pessoa autorizou a ML Seguros a usar estes dados para responder a este pedido.';

  const dados = [
    [tel.whatsapp ? 'Telemóvel' : 'Telefone', tel.mostrar, tel.ligar],
    d.email && ['Email', d.email, `mailto:${d.email}`],
    d.empresa && ['Pessoa de contacto', d.nome],
    d.atividade && ['Atividade', d.atividade],
    d.trabalhadores && ['Trabalhadores', d.trabalhadores],
    d.apolice_ou_matricula && ['Apólice ou matrícula', d.apolice_ou_matricula],
    d.melhor_altura && ['Melhor altura para ligar', d.melhor_altura],
  ].filter(Boolean);

  const textoSimples = [
    `${tipo.nome}${tipo.seguro ? ` (${tipo.seguro})` : ''}`,
    titulo,
    '',
    ...dados.map(([r, v]) => `${r}: ${v}`),
    ...(d.mensagem ? ['', 'Mensagem:', d.mensagem] : []),
    '',
    `Ligar: ${tel.ligar}`,
    ...(tel.whatsapp ? [`WhatsApp: ${tel.whatsapp}`] : []),
    '',
    `Recebido a ${quando}, na página ${pagina}.`,
    responder,
    consentimento,
  ].join('\n');

  const resumo = [titulo, tel.mostrar, tipo.seguro].filter(Boolean).join(' · ');
  const botoes = [
    botao(tel.ligar, `Ligar ${tel.mostrar}`, true),
    tel.whatsapp && botao(tel.whatsapp, 'WhatsApp'),
    d.email && botao(`mailto:${d.email}`, 'Escrever email'),
  ].filter(Boolean).join('');
  const px = 'padding-left:32px;padding-right:32px';

  const html = `<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapar(assunto)}</title>
<style>
@media (max-width:620px){.px{padding-left:20px!important;padding-right:20px!important}.titulo{font-size:22px!important;line-height:28px!important}}
</style>
</head>
<body style="margin:0;padding:0;background-color:${COR.fundo}">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escapar(resumo)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COR.fundo}" style="background-color:${COR.fundo}">
<tr><td align="center" style="padding:24px 12px">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;background-color:#ffffff;border:1px solid ${COR.linha};border-radius:12px;border-collapse:separate">
<tr><td height="4" bgcolor="${COR.marca}" style="height:4px;font-size:0;line-height:0;border-radius:12px 12px 0 0">&nbsp;</td></tr>
<tr><td class="px" style="${px};padding-top:24px;font-family:${LETRA};font-size:13px;line-height:18px;font-weight:700;color:${COR.texto}">ML Seguros <span style="font-weight:400;color:${COR.suave}">&middot; pedido do site</span></td></tr>
<tr><td class="px" style="${px};padding-top:20px">
<p style="margin:0;font-family:${LETRA};font-size:12px;line-height:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${COR.marca}">${escapar(tipo.nome)}</p>
<h1 class="titulo" style="margin:6px 0 0;font-family:${LETRA};font-size:26px;line-height:32px;font-weight:700;color:${COR.texto}">${escapar(titulo)}</h1>
${tipo.seguro ? `<p style="margin:4px 0 0;font-family:${LETRA};font-size:16px;line-height:22px;color:${COR.suave}">${escapar(tipo.seguro)}</p>` : ''}
</td></tr>
<tr><td class="px" style="${px};padding-top:20px;padding-bottom:12px">${botoes}</td></tr>
<tr><td class="px" style="${px};padding-bottom:${d.mensagem ? 8 : 24}px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${COR.linha}">${dados.map(linhaDeDados).join('')}</table>
</td></tr>
${d.mensagem ? `<tr><td class="px" style="${px};padding-bottom:28px">
<p style="margin:12px 0 8px;font-family:${LETRA};font-size:13px;line-height:18px;color:${COR.suave}">Mensagem</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${COR.caixa}" style="padding:14px 16px;border-left:3px solid ${COR.marca};background-color:${COR.caixa};font-family:${LETRA};font-size:15px;line-height:23px;color:${COR.texto}">${escapar(d.mensagem).replace(/\n/g, '<br>')}</td></tr></table>
</td></tr>` : ''}
<tr><td class="px" bgcolor="${COR.caixa}" style="${px};padding-top:16px;padding-bottom:18px;background-color:${COR.caixa};border-top:1px solid ${COR.linha};border-radius:0 0 12px 12px;font-family:${LETRA};font-size:13px;line-height:20px;color:${COR.suave}">
Recebido a ${escapar(quando)}, na página <a href="${escapar(pagina)}" style="color:${COR.suave};text-decoration:underline">${escapar(paginaCurta)}</a>.<br>
${escapar(responder)}<br>
${escapar(consentimento)}
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;

  return { assunto, texto: textoSimples, html, responderA: d.email || undefined };
}
