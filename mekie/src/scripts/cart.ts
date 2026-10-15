export type CartLine = {
  key: string;
  id: number;
  slug: string;
  name: string;
  color: string;
  size?: string;
  price: number;
  image: string;
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

let memory: CartLine[] = read();

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
    const existing = memory.find((l) => l.key === key);
    const next = existing
      ? memory.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
      : [...memory, { ...line, key, qty }];
    write(next);
  },
  setQty(key: string, qty: number) {
    write(qty <= 0 ? memory.filter((l) => l.key !== key) : memory.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 10) } : l)));
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
    memory = read();
    listeners.forEach((fn) => fn(memory));
  }
});

export const money = (v: number) => `${v.toFixed(2).replace('.', ',')}€`;
