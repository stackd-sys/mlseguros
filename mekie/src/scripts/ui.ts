import { cart, money, href } from './cart';

const FREE_FROM = Number(document.documentElement.dataset.freeShipping || 60);
const NEWSLETTER = document.documentElement.dataset.newsletterEndpoint || '';
const EMAIL = document.documentElement.dataset.email || '';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/* ---------- Avisos rotativos ---------- */
const items = document.querySelectorAll<HTMLElement>('.announce__item');
if (items.length > 1) {
  let i = 0;
  setInterval(() => {
    items[i].classList.remove('is-active');
    i = (i + 1) % items.length;
    items[i].classList.add('is-active');
  }, 4000);
}

/* ---------- Header sólido ao fazer scroll ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
if (header?.classList.contains('header--overlay')) {
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Painéis (menu e carrinho) ---------- */
let lastFocus: Element | null = null;
function openPanel(el: HTMLElement | null) {
  if (!el) return;
  lastFocus = document.activeElement;
  el.hidden = false;
  document.body.classList.add('no-scroll');
  el.querySelector<HTMLElement>('button, a')?.focus();
}
function closePanel(el: HTMLElement | null) {
  if (!el || el.hidden) return;
  el.hidden = true;
  if (!document.querySelector('[data-cart]:not([hidden]), [data-mnav]:not([hidden]), [data-popup]:not([hidden])')) {
    document.body.classList.remove('no-scroll');
  }
  (lastFocus as HTMLElement | null)?.focus?.();
}

const mnav = document.querySelector<HTMLElement>('[data-mnav]');
const drawer = document.querySelector<HTMLElement>('[data-cart]');
document.querySelectorAll('[data-menu-open]').forEach((b) => b.addEventListener('click', () => openPanel(mnav)));
document.querySelectorAll('[data-menu-close]').forEach((b) => b.addEventListener('click', () => closePanel(mnav)));
document.querySelectorAll('[data-cart-open]').forEach((b) => b.addEventListener('click', () => openPanel(drawer)));
document.querySelectorAll('[data-cart-close]').forEach((b) => b.addEventListener('click', () => closePanel(drawer)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePanel(drawer);
    closePanel(mnav);
    closePanel(document.querySelector('[data-popup]'));
  }
});
export const openCart = () => openPanel(drawer);

/* ---------- Render do carrinho ---------- */
const list = document.querySelector<HTMLElement>('[data-cart-items]');
cart.subscribe((lines) => {
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);

  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
  document.querySelectorAll<HTMLElement>('[data-cart-count-label]').forEach((el) => (el.textContent = count ? `(${count})` : ''));
  document.querySelectorAll<HTMLElement>('[data-cart-subtotal]').forEach((el) => (el.textContent = money(subtotal)));

  const missing = Math.max(0, FREE_FROM - subtotal);
  const shipText = document.querySelector<HTMLElement>('[data-ship-text]');
  const shipBar = document.querySelector<HTMLElement>('[data-ship-bar]');
  if (shipText) shipText.innerHTML = missing > 0 ? `Faltam <strong>${money(missing)}</strong> para teres envio gratuito.` : 'Tens <strong>envio gratuito</strong> nesta encomenda.';
  if (shipBar) shipBar.style.width = `${Math.min(100, (subtotal / FREE_FROM) * 100)}%`;

  const empty = document.querySelector<HTMLElement>('[data-cart-empty]');
  const foot = document.querySelector<HTMLElement>('[data-cart-foot]');
  const ship = document.querySelector<HTMLElement>('[data-ship]');
  if (empty) empty.hidden = count > 0;
  if (foot) foot.hidden = count === 0;
  if (ship) ship.hidden = count === 0;

  document.querySelectorAll<HTMLElement>('[data-upsell-item]').forEach((el) => {
    el.hidden = lines.some((l) => String(l.id) === el.dataset.upsellItem);
  });
  const upsell = document.querySelector<HTMLElement>('[data-upsell]');
  if (upsell) upsell.hidden = count === 0 || !upsell.querySelector('[data-upsell-item]:not([hidden])');

  if (list) {
    list.innerHTML = lines
      .map(
        (l) => `
      <li class="line" data-key="${esc(l.key)}">
        <a href="${href(`/produto/${esc(l.slug)}/`)}"><img class="line__img" src="${href(esc(l.image))}" alt="" width="84" height="105" /></a>
        <div>
          <p class="line__name"><a href="${href(`/produto/${esc(l.slug)}/`)}">${esc(l.name)}</a></p>
          <p class="line__meta">${esc(l.color)}${l.size ? ` · Tamanho ${esc(l.size)}` : ''}</p>
          <div class="qty">
            <button type="button" data-qty="-1" aria-label="Diminuir quantidade">−</button>
            <span aria-live="polite">${l.qty}</span>
            <button type="button" data-qty="1" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <div class="line__right">
          <span class="line__price">${money(l.price * l.qty)}</span>
          <button type="button" class="line__remove" data-remove>Remover</button>
        </div>
      </li>`,
      )
      .join('');
  }
});

list?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const li = target.closest<HTMLElement>('[data-key]');
  if (!li) return;
  const key = li.dataset.key!;
  const line = cart.lines.find((l) => l.key === key);
  if (!line) return;
  const step = target.closest<HTMLElement>('[data-qty]');
  if (step) cart.setQty(key, line.qty + Number(step.dataset.qty));
  if (target.closest('[data-remove]')) cart.remove(key);
});

/* ---------- Newsletter ---------- */
document.querySelectorAll<HTMLFormElement>('[data-newsletter]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (new FormData(form).get('email') as string).trim();
    const msg = form.querySelector<HTMLElement>('.newsletter-form__msg, [role=status]');
    if (NEWSLETTER) {
      try {
        const res = await fetch(NEWSLETTER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error(String(res.status));
        if (msg) { msg.textContent = 'Obrigado! Já estás na lista.'; msg.hidden = false; }
        form.reset();
        localStorage.setItem('mekie-popup', 'done');
      } catch {
        if (msg) { msg.textContent = 'Não foi possível subscrever. Tenta novamente.'; msg.hidden = false; }
      }
    } else {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Newsletter Mekie')}&body=${encodeURIComponent(`Quero receber as novidades da Mekie no email: ${email}`)}`;
    }
  });
});

/* ---------- Popup "Novo drop" (uma vez por visitante) ---------- */
const popup = document.querySelector<HTMLElement>('[data-popup]');
if (popup) {
  let seen = false;
  try { seen = !!localStorage.getItem('mekie-popup'); } catch { seen = true; }
  if (!seen) {
    setTimeout(() => {
      if (document.body.classList.contains('no-scroll')) return;
      openPanel(popup);
      try { localStorage.setItem('mekie-popup', 'seen'); } catch {}
    }, 6000);
  }
  document.querySelectorAll('[data-popup-open]').forEach((b) => b.addEventListener('click', () => openPanel(popup)));
  popup.querySelectorAll('[data-popup-close]').forEach((b) => b.addEventListener('click', () => closePanel(popup)));
}

/* ---------- Animações de entrada ---------- */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io?.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' })
  : null;
document.querySelectorAll('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));

/* ---------- Adicionar rápido (cartões de produto) ---------- */
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-quick]');
  if (!btn) return;
  const holder = btn.closest<HTMLElement>('[data-product]');
  if (!holder) return;
  const product = JSON.parse(holder.dataset.product!);
  const size = btn.dataset.quick || undefined;
  cart.add({ ...product, size }, 1);
  const box = btn.closest<HTMLElement>('.quick, .upsell__item');
  box?.classList.add('is-added');
  setTimeout(() => box?.classList.remove('is-added'), 1400);
  if (!btn.closest('[data-cart]')) openCart();
});
