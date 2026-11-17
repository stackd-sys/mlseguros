import { lerAvaliacoes } from './_lib/avaliacoes.js';

// Devolve a nota, o total e até cinco avaliações para a secção do site.
// Sem configuração responde 204 e o site mostra só a ligação para o Google.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ erro: 'method_not_allowed' });
  }
  try {
    const dados = await lerAvaliacoes();
    if (!dados) return res.status(204).end();
    res.setHeader('Cache-Control', 'public, s-maxage=3600');
    return res.status(200).json(dados);
  } catch (e) {
    console.error('avaliacoes:', e.message);
    return res.status(502).json({ erro: 'indisponivel' });
  }
}
