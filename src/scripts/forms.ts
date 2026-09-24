// Envio dos formulários: para o endpoint configurado (email/CRM via webhook) ou,
// sem endpoint, abre o email do visitante já preenchido para geral@mlseguros.pt.

const PT_PHONE = /^(9[1236]\d{7}|2\d{8})$/;

export function validatePhone(form: HTMLFormElement): boolean {
  const prefix = form.querySelector<HTMLSelectElement>('[name="indicativo"]');
  const phone = form.querySelector<HTMLInputElement>('[name="telemovel"]');
  if (!phone) return true;
  const digits = phone.value.replace(/\D/g, '');
  const ok = prefix?.value !== '+351' ? digits.length >= 6 : PT_PHONE.test(digits);
  phone.setCustomValidity(ok ? '' : 'Indique um número português válido com 9 dígitos (ex.: 912 345 678).');
  return ok;
}

export function setupForm(form: HTMLFormElement, opts: { endpoint: string; email: string; subject: string }) {
  const status = form.querySelector<HTMLElement>('.form-status');
  const phone = form.querySelector<HTMLInputElement>('[name="telemovel"]');
  phone?.addEventListener('input', () => validatePhone(form));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    validatePhone(form);
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    delete data['_gotcha'];
    if ((form.querySelector('[name="_gotcha"]') as HTMLInputElement | null)?.value) return; // spam
    data['origem'] = location.pathname;

    const show = (state: 'ok' | 'err', msg: string) => {
      if (!status) return;
      status.hidden = false;
      status.dataset.state = state;
      status.textContent = msg;
      status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    if (opts.endpoint) {
      const btn = form.querySelector<HTMLButtonElement>('[type="submit"]');
      btn?.setAttribute('disabled', '');
      try {
        const res = await fetch(opts.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ assunto: opts.subject, ...data }),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        show('ok', 'Obrigado! Recebemos o seu pedido e entramos em contacto no próximo dia útil.');
        form.dispatchEvent(new CustomEvent('sent'));
      } catch {
        show('err', `Não foi possível enviar. Ligue-nos ou escreva para ${opts.email}.`);
      } finally {
        btn?.removeAttribute('disabled');
      }
      return;
    }

    const body = Object.entries(data)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
      .join('\n');
    location.href = `mailto:${opts.email}?subject=${encodeURIComponent(opts.subject)}&body=${encodeURIComponent(body)}`;
    show('ok', 'Abrimos o seu programa de email com o pedido preenchido. Basta carregar em enviar.');
  });
}
