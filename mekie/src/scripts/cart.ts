export type CartLine = {
  key: string;
  id: number;
  slug: string;
  name: string;
  color: string;
  size?: string;
  price: number;
  image: string;
  stock?: number;
  madeToOrderDays?: number;
  qty: number;
};

const KEY = 'mekie-cart-v1';
const listeners = new Set<(lines: CartLine[]) => void>();

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* modo privado: o carrinho vive só nesta página */
  }
  memory = lines;
  listeners.forEach((fn) => fn(lines));
}

/* Catálogo atual (preço, stock, imagem) publicado pelo layout. Um carrinho guardado
   antes de uma mudança de preço ou de stock é corrigido ao abrir o site. */
type CatalogItem = Pick<CartLine, 'slug' | 'name' | 'color' | 'price' | 'image' | 'stock' | 'madeToOrderDays'>;
function catalog(): Record<string, CatalogItem> | null {
  try {
    const el = document.getElementById('mekie-catalog');
    return el ? JSON.parse(el.textContent || '{}') : null;
  } catch {
    return null;
  }
}
export const maxQty = (l: Pick<CartLine, 'stock' | 'madeToOrderDays'>) => (l.madeToOrderDays ? 10 : l.stock ?? 10);

function sync(lines: CartLine[]): CartLine[] {
  const cat = catalog();
  if (!cat) return lines;
  return lines
    .filter((l) => cat[l.id])
    .map((l) => {
      const c = cat[l.id];
      const next = { ...l, ...c, stock: c.stock, madeToOrderDays: c.madeToOrderDays };
      return { ...next, qty: Math.min(l.qty, maxQty(next)) };
    })
    .filter((l) => l.qty > 0);
}

let memory: CartLine[] = sync(read());
if (JSON.stringify(memory) !== JSON.stringify(read())) write(memory);

export const cart = {
  get lines() {
    return memory;
  },
  get count() {
    return memory.reduce((n, l) => n + l.qty, 0);
  },
  get subtotal() {
    return memory.reduce((n, l) => n + l.qty * l.price, 0);
  },
  add(line: Omit<CartLine, 'key' | 'qty'>, qty = 1) {
    const key = `${line.id}:${line.size ?? ''}`;
    const max = maxQty(line);
    const existing = memory.find((l) => l.key === key);
    const next = existing
      ? memory.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, max) } : l))
      : [...memory, { ...line, key, qty: Math.min(qty, max) }];
    write(next);
  },
  setQty(key: string, qty: number) {
    write(qty <= 0 ? memory.filter((l) => l.key !== key) : memory.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, maxQty(l)) } : l)));
  },
  remove(key: string) {
    write(memory.filter((l) => l.key !== key));
  },
  clear() {
    write([]);
  },
  subscribe(fn: (lines: CartLine[]) => void) {
    listeners.add(fn);
    fn(memory);
    return () => listeners.delete(fn);
  },
};

window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    memory = sync(read());
    listeners.forEach((fn) => fn(memory));
  }
});

export const money = (v: number) => `${v.toFixed(2).replace('.', ',')}€`;

/* Caminhos do site; `data-base` só existe em pré-visualizações servidas numa subpasta. */
export const href = (path: string) => {
  const base = document.documentElement.dataset.base;
  if (!base) return path;
  const rel = path.replace(/^\//, '');
  return base + (rel === '' || rel.endsWith('/') ? `${rel}index.html` : rel);
};
