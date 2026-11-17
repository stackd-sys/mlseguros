type Campo = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function erroDe(c: Campo): HTMLElement | null {
  const id = c.getAttribute('aria-describedby');
  return id ? document.getElementById(id) : null;
}

function verificar(c: Campo): boolean {
  if (c instanceof HTMLInputElement && c.type === 'tel') c.value = c.value.replace(/\s+/g, ' ').trim();
  const ok = c.checkValidity();
  const erro = erroDe(c);
  if (erro) erro.hidden = ok;
  if (ok) c.removeAttribute('aria-invalid');
  else c.setAttribute('aria-invalid', 'true');
  return ok;
}

for (const form of document.querySelectorAll<HTMLFormElement>('form[data-form]')) {
  const campos = [...form.querySelectorAll<Campo>('input:not([type=hidden]):not([name=_gotcha]), select, textarea')];
  const estado = form.querySelector<HTMLElement>('[data-form-status]')!;
  const botao = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const rotulo = botao.querySelector<HTMLElement>('.btn__label')!;
  const textoBotao = rotulo.textContent ?? '';
  let tentou = false;

  for (const c of campos) {
    const ev = c instanceof HTMLInputElement && c.type === 'checkbox' ? 'change' : 'input';
    c.addEventListener(ev, () => { if (tentou) verificar(c); });
    c.addEventListener('blur', () => { if (tentou) verificar(c); });
  }

  const enviado = () => {
    const destino = form.dataset.obrigado;
    if (destino) {
      try {
        const nome = (form.querySelector<HTMLInputElement>("[name=nome]")?.value ?? "").trim().split(/\s+/)[0];
        if (nome) sessionStorage.setItem("ml-obrigado-nome", nome);
        sessionStorage.setItem("ml-pedido", destino.split("/")[2]);
      } catch {}
      location.assign(destino);
      return;
    }
    const caixa = document.createElement('div');
    caixa.className = 'form-ok';
    caixa.setAttribute('role', 'status');
    caixa.tabIndex = -1;
    caixa.innerHTML = '<span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span><div><h3></h3><p></p></div>';
    caixa.querySelector('h3')!.textContent = form.dataset.sentTitle ?? '';
    caixa.querySelector('p')!.textContent = form.dataset.sent ?? '';
    form.replaceWith(caixa);
    caixa.focus();
  };

  form.addEventListener('submit', async (e) => {
    tentou = true;
    const invalidos = campos.filter((c) => !verificar(c));
    if (invalidos.length) {
      e.preventDefault();
      estado.textContent = (form.dataset.fix ?? '').replace('{n}', String(invalidos.length));
      invalidos[0].focus();
      return;
    }
    estado.textContent = '';
    const endpoint = (form.dataset.endpoint ?? '').trim();
    if (!endpoint) return;
    e.preventDefault();
    if ((form.querySelector<HTMLInputElement>('[name=_gotcha]')?.value ?? '') !== '') { enviado(); return; }
    const tempo = form.querySelector<HTMLInputElement>("[name=_t]");
    if (tempo) tempo.value = String(Math.round(performance.now()));
    botao.disabled = true;
    rotulo.textContent = form.dataset.sending ?? textoBotao;
    try {
      const r = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(String(r.status));
      enviado();
    } catch {
      estado.textContent = form.dataset.failed ?? '';
      botao.disabled = false;
      rotulo.textContent = textoBotao;
    }
  });
}
