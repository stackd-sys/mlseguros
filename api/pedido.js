import { motivoSpam } from './_lib/antispam.js';
import { emailDoPedido } from './_lib/pedido.js';
import { fornecedorEmail } from './_lib/email.js';

// Recebe os formulários do site e envia-os por email para a ML (EMAIL_PEDIDOS).
// Serve enquanto o CRM não recebe os pedidos: depois, PUBLIC_FORM_ENDPOINT
// passa a apontar para o CRM e esta função deixa de ser usada.
//
// Só aceita pedidos vindos do próprio site (ou das origens em PEDIDO_ORIGENS,
// separadas por vírgulas, para testes).

const json = (estado, corpo, origem) =>
  new Response(JSON.stringify(corpo), {
    status: estado,
    headers: { 'Content-Type': 'application/json', ...(origem && { 'Access-Control-Allow-Origin': origem, Vary: 'Origin' }) },
  });

function origemPermitida(request) {
  const origem = request.headers.get('origin');
  if (!origem) return null;
  let host;
  try {
    host = new URL(origem).host;
  } catch {
    return null;
  }
  const proprio = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const extra = (process.env.PEDIDO_ORIGENS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return host === proprio || extra.includes(origem) ? origem : null;
}

export async function POST(request) {
  const origem = origemPermitida(request);
  if (!origem) return json(403, { erro: 'origem' });

  let campos;
  try {
    campos = Object.fromEntries((await request.formData()).entries());
  } catch {
    return json(400, { erro: 'formato' }, origem);
  }

  const spam = motivoSpam(campos);
  if (spam) {
    console.warn(`pedido do site ignorado: ${spam}`);
    return json(200, { ok: true }, origem);
  }

  const email = emailDoPedido(campos, { site: origem });
  if (email.erro) return json(400, { erro: email.erro }, origem);

  const fornecedor = fornecedorEmail();
  const para = process.env.EMAIL_PEDIDOS;
  if (!fornecedor || !para) {
    console.error('pedido do site: falta configurar o email (EMAIL_PEDIDOS, EMAIL_REMETENTE, EMAIL_FORNECEDOR)');
    return json(503, { erro: 'indisponivel' }, origem);
  }

  try {
    await fornecedor.enviar({ para, ...email });
  } catch (e) {
    console.error('pedido do site:', e.message);
    return json(502, { erro: 'envio' }, origem);
  }
  return json(200, { ok: true }, origem);
}
