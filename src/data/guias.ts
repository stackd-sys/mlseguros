import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from './site.js';

export type Guia = CollectionEntry<'guias'>;

const agora = new Date();

export const dataPT = (d: Date) => d.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Lisbon' });

export const jaPublicado = (g: Guia) => !g.data.rascunho && g.data.publicado <= agora;

export const etiqueta = (g: Guia) => (g.data.rascunho ? 'Rascunho' : g.data.publicado > agora ? 'Agendado' : null);

// Site publicado: só os guias cuja data já chegou (o site é reconstruído nos dias 1 e 15).
// Pré-visualização: todos, com os rascunhos e os agendados marcados.
export async function guiasVisiveis(): Promise<Guia[]> {
  const todos = await getCollection('guias', (g) => (site.publicado ? jaPublicado(g) : true));
  return todos.sort((a, b) => b.data.publicado.getTime() - a.data.publicado.getTime());
}

// Temas dos filtros da página dos guias, pela ordem em que aparecem. Sem ramo: "outros".
export const TEMAS: [string, string][] = [
  ['automovel', 'Automóvel'],
  ['habitacao', 'Casa'],
  ['saude', 'Saúde'],
  ['vida', 'Vida'],
  ['acidentes-de-trabalho', 'Acidentes de trabalho'],
  ['multirriscos-empresarial', 'Negócios'],
  ['responsabilidade-civil', 'Responsabilidade civil'],
  ['outros', 'Outros temas'],
];

export const temaDe = (g: Guia) => g.data.ramo ?? 'outros';

export const nomeTema = (tema: string) => TEMAS.find(([k]) => k === tema)?.[1] ?? 'Outros temas';

export const textoDePesquisa = (g: Guia) =>
  `${g.data.titulo} ${g.data.descricao} ${g.data.resumo}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const minutosDeLeitura = (g: Guia) => Math.max(1, Math.round((g.body ?? '').split(/\s+/).filter(Boolean).length / 200));
