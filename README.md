# ML Seguros: site

Site da ML Seguros (mlseguros.pt), mediadora de seguros na Ericeira. Site estático em [Astro](https://astro.build), alojado na Vercel, com duas funções da Vercel em `api/`.

O desenho segue a estrutura do template Covar (Awaiken Themes), adaptada às cores da ML, com código próprio: nada do template foi copiado. O estilo está todo em `src/styles/global.css` e o JavaScript em `src/scripts/` (menu, entradas ao rolar, carrossel, formulários e avaliações).

- Letra: Google Sans (licença OFL), servida pelo próprio site em `public/fonts/`, sem pedidos às Google Fonts.
- Ícones: Lucide (ISC) e Simple Icons (CC0), lidos dos pacotes no build (`src/components/Icon.astro`).
- Cores: vermelho da ML `#c2182d` e grafite `#1e1f23`.

## Páginas

| Endereço | O que é |
|----------|---------|
| `/` | Início: sobre nós, seguros, porquê um mediador, escritório, como trabalhamos, sinistros, pedido de proposta, perguntas, avaliações do Google |
| `/seguros-particulares/`, `/seguros-empresas/` | Seguros por tipo de cliente. Empresas tem a análise das apólices |
| `/seguros/<ramo>/` | Uma página por seguro (7), com coberturas, perguntas e pedido de proposta já com o seguro escolhido |
| `/simulacao/` | Pedido de proposta (o "Pedir proposta" do menu leva aqui) |
| `/sinistros/` | Passos, documentos e participação de sinistro |
| `/contactos/` | Contactos, horário e mensagem |
| `/sobre-nos/`, `/politica-de-privacidade/`, `/creditos/` | Sobre a ML, informação legal e privacidade, créditos das fotografias |
| `/obrigado/<tipo>/` | Página de obrigado depois de cada formulário (proposta, sinistro, mensagem, ligamos, análise). Fica fora do sitemap e com `noindex` |
| `/guias/`, `/guias/<guia>/` | Guias (blog), escritos em Markdown em `src/content/guias/` |
| `/mapa-do-site/` | Mapa do site em HTML, ligado no rodapé |
| `/llms.txt` | Resumo do negócio para assistentes e motores de IA, gerado de `src/data/site.js` |

## Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera ./dist
```

## Formulários: por email agora, para o CRM depois

Todos os formulários (`src/components/Formulario.astro`) enviam para o endereço em `PUBLIC_FORM_ENDPOINT`. Há dois destinos, e muda-se só esta variável:

- **Email (enquanto o CRM não está em produção):** `PUBLIC_FORM_ENDPOINT=/api/pedido/`. A função `api/pedido.js` envia cada pedido para `EMAIL_PEDIDOS` (geral@mlseguros.pt). O assunto diz o tipo e quem pede (ex.: "Proposta (Seguro Automóvel): Ana Costa"); o email traz os campos, a página de onde veio e ligações para ligar e para o WhatsApp. Se a pessoa deixou email, responder ao email responde-lhe. O envio está numa camada trocável (`api/_lib/email.js`, hoje Resend; em local, Mailpit).
- **CRM:** `PUBLIC_FORM_ENDPOINT=https://<domínio do CRM>/api/site/pedido`. Pedidos de proposta entram como **lead**; sinistros, mensagens e pedidos para ligarem como **tarefa por atribuir**, com a tarefa "Contactar". No CRM, `SITE_ORIGENS` tem de ter o endereço do site.

Depois de enviar, o visitante vai para `/obrigado/<tipo>/`, que o trata pelo primeiro nome. É o endereço a usar para medir conversões.

Spam (as mesmas regras na função e no CRM): campo escondido `_gotcha` e, em `_t`, o tempo entre abrir a página e enviar. São ignorados, sem avisar, os envios com menos de 3 segundos, sem esse tempo, com HTML ou com várias ligações. A função só aceita pedidos vindos do próprio site (`PEDIDO_ORIGENS` acrescenta outras origens, para testes). O CRM limita também a 5 pedidos por hora do mesmo endereço de rede.

Sem `PUBLIC_FORM_ENDPOINT`, os formulários abrem o email do visitante já preenchido para geral@mlseguros.pt.

## Avaliações do Google

`api/avaliacoes.js` lê a nota, o total e até cinco avaliações da ficha da ML no Google (Google Places API). O início mostra-as uma a uma, com setas, e a nota aparece junto aos formulários. O fornecedor está em `api/_lib/avaliacoes.js` e pode ser trocado.

- Precisa de uma chave da Google Places API (New), num projecto Google Cloud em nome da ML, com faturação ativa e a chave restrita a esta API. O Place ID da ML já está no `.env.example`.
- A resposta fica 1 hora em cache na Vercel. Com isso, os pedidos à Google ficam dentro da quota gratuita mensal.
- As regras da Google obrigam a mostrar o autor de cada avaliação (fotografia, nome e ligação) e a indicação "Google Maps".
- Sem chave, mostra-se o total de avaliações e as ligações para ler e escrever avaliações no Google, sem nota.

## SEO, GEO e AEO

- Título, descrição, imagem de partilha e (depois de publicado) `canonical` em todas as páginas.
- Dados estruturados: `InsuranceAgency` com morada, horário, registo na ASF, contacto e catálogo dos seguros em todas as páginas; `WebSite` no início; `BreadcrumbList` nas páginas interiores; `Service` em cada seguro; `FAQPage` onde há perguntas frequentes.
- `sitemap-index.xml` gerado no build (sem o 404 e as páginas de obrigado) e indicado no `robots.txt`, que autoriza também os robôs de IA.
- `/llms.txt` com contactos, registo, seguros e perguntas frequentes, para os assistentes de IA citarem a ML com os dados certos.

## Guias (blog)

Cada guia é um ficheiro `.md` em `src/content/guias/`, com título, descrição, resumo (a resposta curta que aparece no topo e que o Google e os assistentes de IA usam), fotografias, seguro relacionado (para o formulário no fim) e perguntas frequentes.

- Um guia novo a cada 15 dias, nos dias 1 e 15. A data em `publicado` decide quando aparece: o site publicado só gera os guias cuja data já chegou. Nas pré-visualizações (sem `PUBLIC_PUBLICADO`) aparecem todos, os futuros com a etiqueta "Agendado" e `noindex`.
- `rascunho: true` segura um guia, mesmo com a data passada.
- Publicação automática: nos dias 1 e 15, às 06:00 UTC, o GitHub Actions (`.github/workflows/publicar-guias.yml`) chama o Deploy Hook da Vercel, guardado no segredo `VERCEL_DEPLOY_HOOK` do repositório, e o site é reconstruído. Também se pode correr à mão em Actions, "Publicar guias". Qualquer deploy depois da data também publica o guia.
- Escrita: português de Portugal, sem travessões, frases curtas, só factos confirmados (os prazos legais vêm da lei: Lei do Contrato de Seguro, seguro automóvel, alojamento local).
- Ligação "Guias" só no rodapé. A página inicial mostra os três mais recentes.
- 28 guias: um em cada dia 1 e 15 desde 1 de janeiro de 2026, e agendados até 15 de fevereiro de 2027. O lote seguinte tem de estar escrito antes disso.
- A página `/guias/` tem filtros por tema (o `ramo` do guia; sem ramo, "Outros temas") e pesquisa no título, descrição e resumo, com o estado no endereço (`?tema=automovel&q=...`). Os temas e os nomes estão em `TEMAS`, em `src/data/guias.ts`.
- Na página de cada guia, a barra lateral mostra seis guias, primeiro os do mesmo tema.
- As fotografias são as do site, sem repetir a principal entre guias do mesmo tema sempre que possível.

## Cookies e medição

Com `PUBLIC_GTM_ID`, o site carrega o Google Tag Manager com o Consent Mode v2 (modo avançado) e mostra o aviso de cookies (Necessários, Estatística e Marketing). Sem a variável, não há aviso nem medição.

- Tudo começa recusado. A escolha fica no cookie `ml_consent` durante 6 meses e é aplicada antes de o GTM carregar. "Definições de cookies", no rodapé, reabre as opções.
- Quem recusa não fica com cookies da Google; as etiquetas da Google enviam só sinais sem cookies nem identificadores, que a Google usa para estimar estatísticas e conversões.
- Eventos para o GTM (sem dados pessoais): `generate_lead` com `tipo_pedido` (proposta, sinistro, mensagem, ligamos, analise), na página de obrigado e só uma vez por envio; `contacto_clique` com `canal` (telefone, whatsapp, email) e `local`; `consentimento_atualizado`.
- No GTM: as etiquetas da Google (GA4, Google Ads) respeitam o consentimento sozinhas. Etiquetas de outras plataformas (ex.: Meta) têm de exigir `ad_storage` em "Consentimento adicional".

## Variáveis de ambiente (Vercel)

| Variável | Para quê |
|----------|----------|
| `PUBLIC_FORM_ENDPOINT` | Para onde vão os formulários: `/api/pedido/` (email) ou a rota do CRM (`https://<domínio do CRM>/api/site/pedido`) |
| `EMAIL_PEDIDOS` | Quem recebe os pedidos por email (`geral@mlseguros.pt`) |
| `EMAIL_REMETENTE` | Ex.: `Site ML Seguros <pedidos@site.mlseguros.pt>` (domínio verificado no Resend) |
| `EMAIL_FORNECEDOR`, `RESEND_API_KEY` | `resend` e a chave da conta Resend em nome da ML |
| `PUBLIC_CRM_URL` | Endereço do CRM, para o botão "Área de cliente". Sem ele, não há área de cliente no site nem na política de privacidade |
| `PUBLIC_PUBLICADO` | `true` quando o site estiver no domínio da ML: tira o `noindex` e põe o `canonical` |
| `PUBLIC_GTM_ID` | Contentor do Google Tag Manager (`GTM-MSFNHBZX`): aviso de cookies, Consent Mode v2 e medição |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`, `AVALIACOES_FORNECEDOR` | Avaliações do Google |

## Endereços do site antigo

O `vercel.json` redireciona (301) as páginas do WordPress que mudaram: `/seguros-para-empresas/` → `/seguros-empresas/`, `/termos-e-condicoes/` e `/politica-de-cookies/` → `/politica-de-privacidade/`. As outras mantêm o endereço.

## Conteúdo

Dados da empresa, seguros, coberturas e perguntas: `src/data/site.js`. Fotografias: `src/data/fotos.js` (ficheiros em `public/fotos/`, em WebP de 800 a 2400 px).

## Assinatura de email

Página em https://mlseguros.pt/email/assinatura.html (ficheiro `public/email/assinatura.html`, com `noindex` e sem ligações no site). Escolhe-se a pessoa, transferem-se as imagens, copia-se e cola-se no Outlook (os passos estão na página). As imagens (`public/email/logo-ml.png` e `natal-postal.png`) devem ir dentro da assinatura, inseridas no editor do Outlook: ligadas ao site, o Outlook clássico bloqueia-as. Não mudar os nomes nem o sítio das imagens. Os dados da empresa estão repetidos na página: se mudarem em `src/data/site.js`, mudar lá também.

## Por confirmar com a ML antes de publicar

- [ ] **Textos**: perguntas frequentes, coberturas e "Sobre nós" validados pela ML.
- [ ] **Fotografias** do escritório e da fachada, de preferência sem caras, para substituir as do Unsplash em "Sobre nós" e "Contactos".
- [ ] **Facebook**: o link do site antigo (`facebook.com/seguros_ml`) não foi confirmado e ficou de fora.
- [ ] **Chave da Google Places API** em nome da ML (ver "Avaliações do Google").
- [ ] **Cookies**: confirmar no GTM que as etiquetas estão configuradas com o Consent Mode e desligar o Complianz do WordPress quando o site novo entrar.

## Antes de publicar no domínio (site sem o CRM)

- [ ] Push de `site-novo` (pré-visualização na Vercel) e, depois de testar, para a branch de produção: `git push origin site-novo:claude/aml-seguros-redesign-dclczi`.
- [ ] Resend em nome da ML, na região da UE, com o subdomínio `site.mlseguros.pt` verificado (um subdomínio, como o Resend recomenda: uma chave roubada não serve para enviar emails em nome de geral@mlseguros.pt). Os registos do Resend (`resend._domainkey.site` e `send.site`) acrescentam-se ao DNS no Microsoft 365, sem mexer nos MX, SPF e TXT da Microsoft. Chave só com permissão de envio e só para esse domínio.
- [ ] Variáveis na Vercel: `PUBLIC_PUBLICADO=true`, `PUBLIC_FORM_ENDPOINT=/api/pedido/`, `PUBLIC_GTM_ID`, `EMAIL_PEDIDOS`, `EMAIL_REMETENTE`, `EMAIL_FORNECEDOR=resend`, `RESEND_API_KEY`. Sem `PUBLIC_CRM_URL`.
- [ ] Antes de mudar o DNS, testar cada formulário no endereço `.vercel.app` e confirmar que o email chega a geral@mlseguros.pt (e não ao spam).
- [ ] DNS: só os registos do site (`@` e `www`) mudam para a Vercel. Os registos MX, SPF e de verificação da Microsoft ficam como estão, para o email continuar a funcionar.
- [ ] Guias: na Vercel, em Settings, Git, Deploy Hooks, criar um hook para a branch de produção e guardá-lo no GitHub como segredo `VERCEL_DEPLOY_HOOK`. Testar com "Run workflow" em Actions.
- [ ] Search Console: enviar `https://mlseguros.pt/sitemap-index.xml`.
- [ ] Desligar o WordPress e o Complianz (guardar uma cópia do WordPress durante uns meses).
- [ ] Endereço do site na ficha do Google.
- [ ] Na caixa geral@mlseguros.pt, uma pasta para os pedidos do site, e apagar os que não deram contrato ao fim de 12 meses, como diz a política de privacidade.

## Quando o CRM entrar em produção

- [ ] `PUBLIC_FORM_ENDPOINT` com a rota do CRM e `PUBLIC_CRM_URL` com o endereço do CRM (volta a "Área de cliente" no site e na política de privacidade).
- [ ] No CRM, `SITE_ORIGENS` com o domínio do site.
