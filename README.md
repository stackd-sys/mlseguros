# ML Seguros — site

Novo site da ML Seguros (mlseguros.pt). É um site estático feito em [Astro](https://astro.build), com a estrutura inspirada no template **Covar** (Awaiken) e um estilo sóbrio: títulos em serifa (Source Serif 4), texto em Source Sans 3, e o vermelho do logótipo só em botões e ligações.

Resolve os pontos da auditoria de 24/09/2026:

| Problema no site atual | No site novo |
|---|---|
| Home com 24 MB, 6 plugins, 5 famílias de fontes | Site estático, sem plugins. Duas fontes self-hosted, ícones SVG só onde ajudam (telefone, email, WhatsApp), fotos responsivas com lazy-load |
| Só 2 páginas de serviço | 7 páginas, uma por ramo (`/seguros/<ramo>/`), cada uma com coberturas, público, FAQ e schema |
| Formulário com prefixo +1 | +351 por defeito e validação de número PT |
| SEO duplicado e genérico | Um título, descrição e H1 por página, canonical, Open Graph, `InsuranceAgency` + `LocalBusiness`, `FAQPage`, `BreadcrumbList` e sitemap automático |
| Nada sobre sinistros | Página `/sinistros/` com passo-a-passo, documentos por tipo e seguradoras |
| Conversão pouco guiada | Simulador em 3 passos (`/simulacao/`), barra fixa no mobile, auditoria PME em destaque |
| Logótipo sem nome | Ícone + wordmark "ML Seguros" no header |
| Animações que escondem conteúdo | Conteúdo visível à partida, só transições de hover, respeita `prefers-reduced-motion` |
| Banner de cookies PT-BR | Sem cookies: o mapa Google só carrega se o visitante o pedir |
| Botão WhatsApp tapa texto no mobile | Substituído por uma barra inferior (Ligar / WhatsApp / Simulação) |

## Estrutura (13 páginas)

Home · Particulares · Empresas · 7 ramos (Automóvel e frota, Habitação, Saúde individual e de grupo, Vida, Acidentes de Trabalho, Multirriscos Empresarial, Responsabilidade Civil) · Sinistros · Simulação · Contactos · Sobre nós · Informação legal e privacidade.

O header tem um botão **Área de Cliente**, reservado para o portal de cliente do CRM. Ainda não tem ligação: quando o portal estiver pronto, basta trocar o `<button>` por um `<a href="…">` em `src/components/Header.astro` (aparece duas vezes: desktop e menu mobile).

## Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera ./dist, pronto para Netlify, Cloudflare Pages, Vercel ou qualquer alojamento estático
```

## Regras de estilo e texto

Para o site não parecer feito por IA nem por template:
- **Visual**: sem etiquetas por cima dos títulos, sem metade do título a vermelho, sem cartões a flutuar, gradientes, números decorativos ou animações. Cantos quase retos e listas com linhas simples.
- **Texto**: frases diretas e concretas, sem slogans ("não somos um call center"), sem listas de três palavras para dar ritmo, sem travessões, e sem promessas que a empresa não confirmou (prazos de resposta, por exemplo).

## Onde alterar conteúdo

Tudo está em `src/data/site.js`: contactos, seguradoras, fotografias, ramos (textos, coberturas e FAQ) e perguntas gerais.

## Por fazer antes de publicar

- [ ] **Logótipo oficial**: `public/favicon.svg` é uma recriação aproximada. Substituir pelo ficheiro original em SVG.
- [ ] **Formulários**: definir `PUBLIC_FORM_ENDPOINT` na Vercel com o endereço do CRM (`https://<domínio do CRM>/api/site/pedido`) e, no CRM, `SITE_ORIGENS` com o domínio do site. Os pedidos de simulação entram como leads e as outras mensagens como tarefas. Sem endpoint, os formulários abrem o email do visitante já preenchido.
- [ ] **Fotografias**: são fotos do Pexels (licença gratuita) carregadas diretamente do CDN do Pexels, todas revistas: sem texto legível em inglês e com pessoas coerentes com um público português. Ao trocar uma foto, manter estas regras. O ideal é substituí-las por fotos reais da equipa e do escritório da Ericeira (ponto "pessoas reais" da auditoria).
- [ ] **Equipa e avaliações**: a página "Sobre nós" não tem nomes nem citações, porque não se devem inventar. Acrescentar a equipa (nomes e funções) e 2 a 3 avaliações reais do Google, com autorização.
- [ ] **Rever textos**: os textos de "Sobre nós" (história) e as FAQ de cada ramo devem ser validados pela ML Seguros.
- [ ] **Política de privacidade** (versão em `privacy` no `site.js`; ao mudá-la, subir também `VERSAO_POLITICA` no CRM): a ML deve confirmar se os dados de saúde são tratados com consentimento explícito, se os clientes dos parceiros de mediação (Barymont, Sabseg, Vitorinos) têm dados partilhados com eles, se há encarregado de proteção de dados e se usa um contabilista externo.
- [ ] **Alojamento**: fazer um único redirect `http://www` → `https://mlseguros.pt` e redirects 301 das páginas antigas (`/particulares/` → `/seguros-particulares/`, etc.).
- [ ] **Área de Cliente**: ligar o botão ao portal do CRM.
- [ ] Confirmar o link do Facebook antes de o voltar a incluir.
