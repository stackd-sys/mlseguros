export type Category = {
  slug: string;
  name: string;
  plural: string;
  image: string;
};

export type Collection = {
  slug: string;
  name: string;
  intro: string;
  image: string;
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
  images: string[];
  badge?: string;
  description: string;
};

export const categories: Category[] = [
  { slug: 't-shirts', name: 'T-Shirt', plural: 'T-Shirts', image: '/images/lookbook/mushrooms-black.webp' },
  { slug: 'hoodie', name: 'Hoodie', plural: 'Hoodies', image: '/images/site/banner-94.webp' },
  { slug: 'meias', name: 'Meias', plural: 'Meias', image: '/images/site/banner-95.webp' },
  { slug: 'chapeu', name: 'Chapéu', plural: 'Chapéus', image: '/images/site/banner-93.webp' },
  { slug: 'tote-bag', name: 'Tote Bag', plural: 'Tote Bags', image: '/images/site/banner-92.webp' },
];

export const collections: Collection[] = [
  {
    slug: 'mushrooms',
    name: 'Mushrooms',
    intro: 'Três cogumelos bordados no peito e o logótipo Mekie na manga.',
    image: '/images/lookbook/mushrooms-duo.webp',
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    intro: 'O esqueleto Mekie em t-shirts, hoodie e meias.',
    image: '/images/products/hoodie-skeleton-2.webp',
  },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const img = (name: string) => `/images/products/${name}.webp`;
const look = (name: string) => `/images/lookbook/${name}.webp`;

export const products: Product[] = [
  {
    id: 3542,
    slug: 'socks-esqueleto',
    name: 'Socks – Esqueleto',
    category: 'meias',
    collection: 'skeleton',
    color: 'Branco / Preto',
    regularPrice: 22.5,
    price: 16.88,
    images: [img('socks-esqueleto-1')],
    badge: 'Novo',
    description: 'The basics, bro, never fail.',
  },
  {
    id: 3301,
    slug: 'hoodie-black-skeleton',
    name: 'Hoodie – Skeleton',
    category: 'hoodie',
    collection: 'skeleton',
    color: 'Preto',
    regularPrice: 55,
    price: 41.25,
    sizes: SIZES,
    images: [img('hoodie-skeleton-1'), img('hoodie-skeleton-2')],
    description: 'The basics, bro, never fail.',
  },
  {
    id: 3294,
    slug: 'socks-mekie',
    name: 'Socks – Mekie',
    category: 'meias',
    color: 'Branco / Preto',
    regularPrice: 22.5,
    price: 16.88,
    images: [img('socks-mekie-1'), img('socks-mekie-2')],
    description: 'The basics, bro, never fail.',
  },
  {
    id: 3286,
    slug: 'tshirt-khaki-skeleton',
    name: 'Tshirt – Skeleton',
    category: 't-shirts',
    collection: 'skeleton',
    color: 'Khaki',
    regularPrice: 55,
    price: 41.25,
    sizes: SIZES,
    images: [img('tshirt-khaki-skeleton-1'), img('tshirt-khaki-skeleton-2')],
    description: 'The basics, bro, never fail.',
  },
  {
    id: 3275,
    slug: 'tshirt-black-skeleton',
    name: 'Tshirt – Skeleton',
    category: 't-shirts',
    collection: 'skeleton',
    color: 'Cinza',
    regularPrice: 55,
    price: 41.25,
    sizes: SIZES,
    images: [img('tshirt-black-skeleton-1'), img('tshirt-black-skeleton-2')],
    description: 'The basics, bro, never fail.',
  },
  {
    id: 3222,
    slug: 'tshirt-khaki-mushrooms',
    name: 'Tshirt – Mushrooms',
    category: 't-shirts',
    collection: 'mushrooms',
    color: 'Khaki',
    regularPrice: 55,
    price: 41.25,
    sizes: SIZES,
    images: [
      img('tshirt-khaki-mushrooms-1'),
      look('mushrooms-duo'),
      look('mushrooms-sleeve'),
      img('tshirt-khaki-mushrooms-2'),
    ],
    description: 'The basics, bro, never fail.',
  },
  {
    id: 299,
    slug: 'tshirt-black-mushrooms',
    name: 'Tshirt – Mushrooms',
    category: 't-shirts',
    collection: 'mushrooms',
    color: 'Preto',
    regularPrice: 55,
    price: 41.25,
    sizes: SIZES,
    images: [
      img('tshirt-black-mushrooms-1'),
      look('mushrooms-black'),
      look('mushrooms-duo'),
      img('tshirt-black-mushrooms-2'),
    ],
    description: 'The basics, bro, never fail.',
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const productsIn = (slug: string) => products.filter((p) => p.category === slug);
export const productsInCollection = (slug: string) => products.filter((p) => p.collection === slug);
export const variantsOf = (p: Product) => products.filter((o) => o.name === p.name);
export const discount = (p: Product) =>
  p.regularPrice > p.price ? Math.round((1 - p.price / p.regularPrice) * 100) : 0;
