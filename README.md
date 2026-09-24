# ML Seguros — site

Novo site da ML Seguros (mlseguros.pt). É um site estático feito em [Astro](https://astro.build), com um design inspirado no template **Covar** (Awaiken) e adaptado à marca: o vermelho do logótipo, tinta escura e um fundo quente.

Resolve os pontos da auditoria de 24/09/2026:

| Problema no site atual | No site novo |
|---|---|
| Home com 24 MB, 6 plugins, 5 famílias de fontes | Site estático, sem plugins. Uma fonte self-hosted (~49 KB), ícones SVG inline, fotos responsivas com lazy-load |
| Só 2 páginas de serviço | 11 páginas, uma por ramo (`/seguros/<ramo>/`), cada uma com coberturas, público, FAQ e schema |
| Formulário com prefixo +1 | +351 por defeito e validação de número PT |
| SEO duplicado e genérico | Um título, descrição e H1 por página, canonical, Open Graph, `InsuranceAgency` + `LocalBusiness`, `FAQPage`, `BreadcrumbList` e sitemap automático |
| Nada sobre sinistros | Página `/sinistros/` com passo-a-passo, documentos por tipo e seguradoras |
| Conversão pouco guiada | Simulador em 3 passos (`/simulacao/`), barra fixa no mobile, auditoria PME em destaque |
| Logótipo sem nome | Ícone + wordmark "ML Seguros" no header |
| Animações que escondem conteúdo | Conteúdo visível à partida, só transições de hover, respeita `prefers-reduced-motion` |
| Banner de cookies PT-BR | Sem cookies: o mapa Google só carrega se o visitante o pedir |
| Botão WhatsApp tapa texto no mobile | Substituído por uma barra inferior (Ligar / WhatsApp / Simulação) |

## Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera ./dist, pronto para Netlify, Cloudflare Pages, Vercel ou qualquer alojamento estático
```

## Onde alterar conteúdo

Tudo está em `src/data/site.js`: contactos, seguradoras, fotografias, ramos (textos, coberturas e FAQ) e perguntas gerais.

## Por fazer antes de publicar

- [ ] **Logótipo oficial**: `public/favicon.svg` é uma recriação aproximada. Substituir pelo ficheiro original em SVG.
- [ ] **Formulários**: definir `formEndpoint` em `src/data/site.js` (Formspree, Make/n8n ou webhook do CRM). Sem endpoint, os formulários abrem o email do visitante já preenchido.
- [ ] **Fotografias**: são fotos do Pexels (licença gratuita) carregadas diretamente do CDN do Pexels. O ideal é substituí-las por fotos reais da equipa e do escritório da Ericeira (ponto "pessoas reais" da auditoria).
- [ ] **Equipa e avaliações**: a página "Sobre nós" não tem nomes nem citações, porque não se devem inventar. Acrescentar a equipa (nomes e funções) e 2 a 3 avaliações reais do Google, com autorização.
- [ ] **Rever textos**: os textos de "Sobre nós" (história) e as FAQ de cada ramo devem ser validados pela ML Seguros.
- [ ] **Alojamento**: fazer um único redirect `http://www` → `https://mlseguros.pt` e redirects 301 das páginas antigas (`/particulares/` → `/seguros-particulares/`, etc.).
- [ ] Confirmar o link do Facebook antes de o voltar a incluir.
