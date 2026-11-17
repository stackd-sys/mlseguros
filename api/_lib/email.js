// Envio de email numa camada trocável. Hoje: Resend (produção) ou Mailpit
// (caixa de correio de teste, em local). O fornecedor escolhe-se por
// variáveis de ambiente; o resto do código não depende de nenhum.
//
//   EMAIL_FORNECEDOR = resend | mailpit
//   EMAIL_REMETENTE  = "Site ML Seguros <site@dominio-do-cliente>"
//   RESEND_API_KEY   (resend)
//   MAILPIT_URL      (mailpit, ex.: http://127.0.0.1:54324)

// "Nome <email>" → partes
function remetente(valor) {
  const m = valor.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return m ? { nome: m[1] || '', email: m[2] } : { nome: '', email: valor.trim() };
}

function resend(chave, de) {
  return {
    async enviar(e) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: de,
          to: [e.para],
          subject: e.assunto,
          html: e.html,
          text: e.texto,
          ...(e.responderA && { reply_to: e.responderA }),
        }),
      });
      if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
    },
  };
}

function mailpit(url, de) {
  const from = remetente(de);
  return {
    async enviar(e) {
      const r = await fetch(`${url.replace(/\/$/, '')}/api/v1/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          From: { Email: from.email, Name: from.nome },
          To: [{ Email: e.para }],
          Subject: e.assunto,
          HTML: e.html,
          Text: e.texto,
          ...(e.responderA && { ReplyTo: [{ Email: e.responderA }] }),
        }),
      });
      if (!r.ok) throw new Error(`Mailpit ${r.status}: ${await r.text()}`);
    },
  };
}

// null quando não está configurado.
export function fornecedorEmail() {
  const de = process.env.EMAIL_REMETENTE;
  if (!de) return null;
  switch (process.env.EMAIL_FORNECEDOR) {
    case 'resend':
      return process.env.RESEND_API_KEY ? resend(process.env.RESEND_API_KEY, de) : null;
    case 'mailpit':
      return process.env.MAILPIT_URL ? mailpit(process.env.MAILPIT_URL, de) : null;
    default:
      return null;
  }
}
