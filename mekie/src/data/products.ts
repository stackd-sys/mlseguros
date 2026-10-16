export type Category = {
  slug: string;
  name: string;
  /** Categoria-mãe (ex.: Caps dentro de Acessórios). */
  parent?: string;
  image: string;
};

export type Collection = {
  slug: string;
  name: string;
  intro: string;
  image: string;
};

export type ProductDetails = {
  features: string[];
  composition: string[];
  care?: string[];
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  collection?: string;
  color: string;
  regularPrice: number;
  price: number;
  sizes?: string[];
  /** Unidades em stock quando são poucas; sem valor = stock normal. */
  stock?: number;
  /** Feito por encomenda quando não há stock: prazo de entrega em dias úteis. */
  madeToOrderDays?: number;
  images: string[];
  badge?: string;
  description: string;
  details?: ProductDetails;
};

export const categories: Category[] = [
  { slug: 't-shirts', name: 'T-Shirts', image: '/images/lookbook/mushrooms-black.webp' },
  { slug: 'hoodies-crewnecks', name: 'Hoodies & Crewnecks', image: '/images/lookbook/mushrooms-hoodie-yellow.webp' },
  { slug: 'acessorios', name: 'Acessórios', image: '/images/lookbook/stack-leaves.webp' },
  { slug: 'caps', name: 'Caps', parent: 'acessorios', image: '/images/products/cap-black-1.webp' },
  { slug: 'bucket-hat', name: 'Bucket Hat', parent: 'acessorios', image: '/images/products/bucket-white-1.webp' },
  { slug: 'meias', name: 'Meias', parent: 'acessorios', image: '/images/products/socks-mekie-1.webp' },
  { slug: 'scrunchies', name: 'Scrunchies', parent: 'acessorios', image: '/images/products/scrunchie-rosa-1.webp' },
  { slug: 'tote-bag', name: 'Tote Bag', parent: 'acessorios', image: '/images/lookbook/stack-leaves.webp' },
];

export const collections: Collection[] = [
  {
    slug: 'cogumelos',
    name: 'Cogumelos',
    intro: 'Três cogumelos bordados no peito e o logótipo Mekie na manga.',
    image: '/images/lookbook/mushrooms-duo.webp',
  },
  {
    slug: 'esqueleto',
    name: 'Esqueleto',
    intro: 'O esqueleto Mekie bordado em hoodies e estampado em meias.',
    image: '/images/lookbook/esqueleto-black-hood.webp',
  },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const img = (name: string) => `/images/products/${name}.webp`;
const look = (name: string) => `/images/lookbook/${name}.webp`;
const TAGLINE = 'Bro, o básico nunca falha.';

const careEmbroidery = [
  'Lavar na máquina a 40 °C no máximo',
  'Não utilizar lixívia',
  'Não utilizar máquina de secar',
  'Passar a ferro a 110 °C no máximo',
  'Não limpar a seco',
  'Lavar do avesso protege o bordado e ajuda a preservar a peça',
];

const tshirt = (motif: string): ProductDetails => ({
  features: [
    'T-shirt oversized unissexo, de corte descontraído',
    `Bordado de ${motif} no peito, com acabamento detalhado`,
    'Pormenor bordado na manga',
    'Gola redonda reforçada',
  ],
  composition: ['100% algodão', '190 g'],
  care: careEmbroidery,
});

const hoodie = (motif: string): ProductDetails => ({
  features: [
    'Hoodie unissexo com capuz e bolso canguru',
    `Bordado de ${motif} no peito, com acabamento detalhado`,
    'Pormenor bordado a vermelho no punho',
    'Cordão de ajuste no capuz',
    'Punhos e barra em canelado, para um ajuste confortável',
  ],
  composition: ['80% algodão, 20% poliéster', '320 g'],
  care: careEmbroidery,
});

const cap: ProductDetails = {
  features: [
    'Cap de bombazina unissexo, de 6 painéis',
    'Fita interior e acabamentos em sarja de algodão',
    'Aba curva com tira ajustável em bombazina',
  ],
  composition: ['100% algodão (bombazina)'],
};

const bucket: ProductDetails = {
  features: [
    'Bucket hat que protege do sol e completa qualquer look',
    'Aba clássica e perfil alto',
    'Tamanho único, que serve a maioria das pessoas',
    'Tecido respirável e costura cuidada',
    'Ideal para o verão',
  ],
  composition: [
    'Sarja 100% algodão orgânico',
    'Algodão orgânico com certificação GOTS',
    'Tecido com certificação OEKO-TEX Standard 100',
  ],
};

/* Prontas para quando a sweatshirt e a tote bag entrarem na loja */
export const sweatshirtDetails: ProductDetails = {
  features: [
    'Sweatshirt unissexo de gola redonda clássica',
    'Corte unissexo que valoriza a silhueta',
    'Exterior macio',
    'Malha de trama fechada com 3 fios',
    'Costuras laterais',
    'Aplique de tecido na parte de trás',
    'Gola, punhos e bainha em canelado com costura dupla',
    'Etiqueta removível',
  ],
  composition: ['100% algodão', '288 g/m², um tecido encorpado'],
};

export const toteDetails: ProductDetails = {
  features: [
    'Tote bag em sarja de algodão orgânico, de cor lisa',
    'Espaçosa: cabe compras, livros e muito mais',
    'Compartimento principal aberto',
    'Alças duplas com 2,5 cm de largura e 62,2 cm de comprimento',
    'Dimensões: 40,6 × 35,6 × 12,7 cm',
    'Aguenta até 13,6 kg',
  ],
  composition: [
    'Sarja 3/1 100% algodão orgânico',
    '272 g/m²',
    'Algodão orgânico com certificações GOTS e OCS',
    'Certificação OEKO-TEX Standard 100',
    'Selo vegano aprovado pela PETA',
  ],
};

const scrunchie: ProductDetails = {
  features: ['Feito à mão em crochet'],
  composition: [],
};

const socks: ProductDetails = {
  features: [
    'Meias de cano médio (crew), unissexo',
    'Perna em canelado',
    'Estampado por sublimação, com cores nítidas que não desbotam',
  ],
  composition: ['60% nylon, 22% algodão, 18% elastano'],
  care: ['Lavar do avesso ajuda a preservar a estampa e as cores por mais tempo'],
};

export const products: Product[] = [
  {
    id: 3590,
    slug: 'cap-mekie-black',
    name: 'Cap Mekie',
    category: 'caps',
    color: 'Preto',
    regularPrice: 30,
    price: 30,
    stock: 1,
    images: [img('cap-black-1')],
    description: TAGLINE,
    details: cap,
  },
  {
    id: 3589,
    slug: 'cap-mekie-blue-navy',
    name: 'Cap Mekie',
    category: 'caps',
    color: 'Azul navy',
    regularPrice: 30,
    price: 30,
    stock: 1,
    images: [img('cap-navy-1')],
    description: TAGLINE,
    details: cap,
  },
  {
    id: 3585,
    slug: 'cap-mekie-dark-olive',
    name: 'Cap Mekie',
    category: 'caps',
    color: 'Verde azeitona',
    regularPrice: 30,
    price: 30,
    stock: 1,
    images: [img('cap-olive-1')],
    description: TAGLINE,
    details: cap,
  },
  {
    id: 3583,
    slug: 'bucket-hat-mekie',
    name: 'Bucket Hat Mekie',
    category: 'bucket-hat',
    color: 'Branco',
    regularPrice: 30,
    price: 30,
    stock: 1,
    images: [img('bucket-white-1'), look('stack-leaves')],
    details: bucket,
    description: 'Bro, o básico nunca falha. Feito em algodão orgânico certificado.',
  },
  {
    id: 3572,
    slug: 'hoodie-amarelo-pastel-cogumelos',
    name: 'Hoodie Cogumelos',
    category: 'hoodies-crewnecks',
    collection: 'cogumelos',
    color: 'Amarelo pastel',
    regularPrice: 70,
    price: 70,
    sizes: SIZES,
    images: [img('hoodie-cogumelos-yellow-1'), look('mushrooms-hoodie-yellow'), look('stack-leaves')],
    description: TAGLINE,
    details: hoodie('cogumelos'),
  },
  {
    id: 3565,
    slug: 'hoodie-cogumelos',
    name: 'Hoodie Cogumelos',
    category: 'hoodies-crewnecks',
    collection: 'cogumelos',
    color: 'Preto',
    regularPrice: 70,
    price: 70,
    sizes: SIZES,
    images: [img('hoodie-cogumelos-black-1'), look('hoodie-black-cuff')],
    description: TAGLINE,
    details: hoodie('cogumelos'),
  },
  {
    id: 3558,
    slug: 'hoodie-amarelo-pastel-esqueleto',
    name: 'Hoodie Esqueleto',
    category: 'hoodies-crewnecks',
    collection: 'esqueleto',
    color: 'Amarelo pastel',
    regularPrice: 70,
    price: 70,
    sizes: SIZES,
    images: [img('hoodie-esqueleto-yellow-1'), look('esqueleto-duo')],
    description: TAGLINE,
    details: hoodie('esqueleto'),
  },
  {
    id: 3301,
    slug: 'hoodie-black-esqueleto',
    name: 'Hoodie Esqueleto',
    category: 'hoodies-crewnecks',
    collection: 'esqueleto',
    color: 'Preto',
    regularPrice: 70,
    price: 70,
    sizes: SIZES,
    images: [img('hoodie-skeleton-1'), look('esqueleto-black-hood'), look('hoodie-black-cuff')],
    description: TAGLINE,
    details: hoodie('esqueleto'),
  },
  {
    id: 3542,
    slug: 'meias-esqueleto',
    name: 'Meias Esqueleto',
    category: 'meias',
    collection: 'esqueleto',
    color: 'Branco e preto',
    regularPrice: 20,
    price: 20,
    stock: 1,
    images: [img('socks-esqueleto-1')],
    description: TAGLINE,
    details: socks,
  },
  {
    id: 3294,
    slug: 'meias-mekie',
    name: 'Meias Mekie',
    category: 'meias',
    color: 'Branco e preto',
    regularPrice: 20,
    price: 20,
    stock: 1,
    images: [img('socks-mekie-1'), img('socks-mekie-2')],
    description: TAGLINE,
    details: socks,
  },
  {
    id: 9001,
    slug: 'scrunchie-rosa',
    name: 'Scrunchie Mekie',
    category: 'scrunchies',
    color: 'Rosa',
    regularPrice: 15,
    price: 15,
    stock: 1,
    madeToOrderDays: 10,
    images: [img('scrunchie-rosa-1'), img('scrunchie-rosa')],
    details: scrunchie,
    description: TAGLINE,
  },
  {
    id: 9002,
    slug: 'scrunchie-dourado',
    name: 'Scrunchie Mekie',
    category: 'scrunchies',
    color: 'Dourado',
    regularPrice: 15,
    price: 15,
    stock: 1,
    madeToOrderDays: 10,
    images: [img('scrunchie-dourado-1'), img('scrunchie-dourado')],
    details: scrunchie,
    description: TAGLINE,
  },
  {
    id: 3222,
    slug: 'tshirt-khaki-cogumelos',
    name: 'T-shirt Cogumelos',
    category: 't-shirts',
    collection: 'cogumelos',
    color: 'Khaki',
    regularPrice: 45,
    price: 45,
    sizes: SIZES,
    images: [
      img('tshirt-khaki-mushrooms-1'),
      look('mushrooms-duo'),
      look('mushrooms-sleeve'),
    ],
    description: 'The basics, bro, never fail.',
    details: tshirt('cogumelos'),
  },
  {
    id: 299,
    slug: 'tshirt-black-cogumelos',
    name: 'T-shirt Cogumelos',
    category: 't-shirts',
    collection: 'cogumelos',
    color: 'Preto',
    regularPrice: 45,
    price: 45,
    sizes: SIZES,
    images: [
      img('tshirt-black-mushrooms-1'),
      look('mushrooms-black'),
      look('mushrooms-duo'),
    ],
    description: 'The basics, bro, never fail.',
    details: tshirt('cogumelos'),
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const childCategories = (slug: string) => categories.filter((c) => c.parent === slug);
export const topCategories = categories.filter((c) => !c.parent);
/** Produtos da categoria e das suas subcategorias. */
export const productsIn = (slug: string) => {
  const slugs = [slug, ...childCategories(slug).map((c) => c.slug)];
  return products.filter((p) => slugs.includes(p.category));
};
export const productsInCollection = (slug: string) => products.filter((p) => p.collection === slug);
export const lowStock = () => products.filter((p) => p.stock !== undefined && p.stock <= 3 && !p.madeToOrderDays);
export const variantsOf = (p: Product) => products.filter((o) => o.name === p.name);
export const discount = (p: Product) =>
  p.regularPrice > p.price ? Math.round((1 - p.price / p.regularPrice) * 100) : 0;
