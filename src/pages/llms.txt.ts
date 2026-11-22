// Resumo do site para assistentes e motores de IA (llmstxt.org), gerado a partir dos mesmos dados das páginas.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { company, ramos, insurers, generalFaq } from '../data/site.js';
import { jaPublicado } from '../data/guias';

export const GET: APIRoute = async ({ site }) => {
  const guias = await getCollection('guias', jaPublicado);
  const u = (p: string) => new URL(p, site).href;
  const a = company.address;
  const seguradoras = `${insurers.slice(0, -1).map((i) => i.name).join(', ')} e ${insurers.at(-1)!.name}`;
  const texto = [
    `# ${company.name}`,
    '',
    `> Mediadora de seguros com escritório na Ericeira, concelho de Mafra, há mais de ${company.years} anos. Pede propostas a várias seguradoras para particulares e empresas, trata das alterações às apólices e acompanha os clientes nos sinistros.`,
    '',
    '## Contactos',
    `- Morada: ${a.street}, ${a.postalCode} ${a.locality}, Portugal`,
    `- Telemóvel: +351 ${company.phone} (${company.phoneNote})`,
    `- WhatsApp: ${company.whatsappHref}`,
    `- Email: ${company.email}`,
    ...company.hours.rows.map((h) => `- ${h.label}: ${h.value}`),
    `- Google Maps: ${company.mapsHref}`,
    '',
    '## Empresa',
    `- ${company.legalName}, NIF ${company.nif}`,
    `- Mediador de seguros inscrito na Autoridade de Supervisão de Seguros e Fundos de Pensões (ASF) com o n.º ${company.asf}`,
    `- Trabalha com várias seguradoras, entre elas ${seguradoras}`,
    `- Atende clientes de ${company.areaServed.join(', ')} e, à distância, de todo o país`,
    `- Equipa: ${company.equipa.map((p) => `${p.nome} (${p.funcao.toLowerCase()})`).join(', ')}`,
    '',
    '## Seguros',
    ...ramos.map((r) => `- [${r.label}](${u(`/seguros/${r.slug}/`)}): ${r.short}`),
    '',
    '## Páginas',
    `- [Pedido de proposta](${u('/simulacao/')}): simulação sem custo, com propostas de várias seguradoras`,
    `- [Participar um sinistro](${u('/sinistros/')}): passos, documentos e formulário de participação`,
    `- [Seguros para particulares](${u('/seguros-particulares/')})`,
    `- [Seguros para empresas](${u('/seguros-empresas/')}): inclui a análise das apólices da empresa, sem custo`,
    `- [Sobre a ML Seguros](${u('/sobre-nos/')}): a equipa, as seguradoras e o registo na ASF`,
    `- [Seguros no concelho de Mafra](${u('/seguros-em-mafra/')}): Ericeira, Mafra, Malveira, Venda do Pinheiro e o resto do concelho`,
    `- [Contactos](${u('/contactos/')})`,
    `- [Informação legal e privacidade](${u('/politica-de-privacidade/')})`,
    '',
    ...(guias.length ? ['## Guias', ...guias.map((g) => `- [${g.data.titulo}](${u(`/guias/${g.id}/`)}): ${g.data.resumo}`), ''] : []),
    '## Perguntas frequentes',
    ...generalFaq.flatMap(([q, r]) => ['', `### ${q}`, r]),
    ...ramos.flatMap((r) => ['', `## Perguntas sobre: ${r.label}`, ...r.faq.flatMap(([q, resp]) => ['', `### ${q}`, resp])]),
    '',
  ].join('\n');
  return new Response(texto, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
