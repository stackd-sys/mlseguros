// Registo dos robôs que leem o site (Routing Middleware da Vercel). Para cada
// pedido de uma página por um robô conhecido (pesquisa, assistentes de IA,
// treino de modelos), envia o nome do robô e a página para o CRM (Marketing →
// GEO e AEO). Às pessoas não faz nada. Nunca muda a resposta: a página segue
// sempre, mesmo que o envio falhe.
//
// Precisa de PUBLIC_MEDICAO_URL (o endereço do CRM sai daqui) e de ROBOS_CHAVE
// (a mesma no CRM). Sem elas, não regista. Os nomes batem com
// lib/marketing/robos.ts no CRM.

const ROBOS = [
  [/Google-CloudVertexBot/i, 'Google-CloudVertexBot'],
  [/GoogleOther/i, 'GoogleOther'],
  [/Googlebot(?!-Image|-Video)/i, 'Googlebot'],
  [/bingbot/i, 'Bingbot'],
  [/OAI-SearchBot/i, 'OAI-SearchBot'],
  [/ChatGPT-User/i, 'ChatGPT-User'],
  [/GPTBot/i, 'GPTBot'],
  [/Claude-SearchBot/i, 'Claude-SearchBot'],
  [/Claude-User/i, 'Claude-User'],
  [/ClaudeBot/i, 'ClaudeBot'],
  [/Perplexity-User/i, 'Perplexity-User'],
  [/PerplexityBot/i, 'PerplexityBot'],
  [/Applebot/i, 'Applebot'],
  [/meta-externalfetcher/i, 'meta-externalfetcher'],
  [/meta-externalagent/i, 'meta-externalagent'],
  [/DuckAssistBot/i, 'DuckAssistBot'],
  [/MistralAI-User/i, 'MistralAI-User'],
  [/Amazonbot/i, 'Amazonbot'],
  [/Bytespider/i, 'Bytespider'],
  [/CCBot/i, 'CCBot'],
];

// Só páginas e os ficheiros que os robôs leem (robots.txt, llms.txt, sitemap); nada de imagens, letras, scripts nem funções.
export const config = {
  matcher: ['/((?!_astro/|api/|fotos/|fonts/|assets/|email/|.*\\.(?:png|jpe?g|webp|avif|svg|gif|ico|css|js|mjs|map|woff2?|ttf|mp4|webm|pdf|json)$).*)'],
};

export default function middleware(request, context) {
  try {
    const ua = request.headers.get('user-agent') || '';
    const robo = ROBOS.find(([r]) => r.test(ua))?.[1];
    const crm = (process.env.PUBLIC_MEDICAO_URL || '').trim();
    const chave = process.env.ROBOS_CHAVE || '';
    if (!robo || !crm || !chave) return;
    const envio = fetch(new URL('/api/site/robos', crm), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${chave}` },
      body: JSON.stringify({ robo, pagina: new URL(request.url).pathname.slice(0, 200) }),
      signal: AbortSignal.timeout(3000),
    }).catch(() => {});
    context?.waitUntil?.(envio);
  } catch {
    // A página segue sempre.
  }
}
