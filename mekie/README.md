# Mekie Planet — loja online

Site da [Mekie Planet](https://mekie-planet.com), refeito em [Astro](https://astro.build) com um layout inspirado na loja da Ementa: header centrado sobre a imagem de capa, carrossel de produtos, mosaico de categorias, banner de drop, blocos editoriais e footer em 4 colunas.

## Correr localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera o site estático em dist/
```

## Onde mudar as coisas

| O quê | Ficheiro |
| --- | --- |
| Produtos, preços, tamanhos, imagens | `src/data/products.ts` |
| Categorias do menu | `src/data/products.ts` (`categories`) |
| Email, Instagram, morada, envio grátis, avisos do topo | `src/data/site.ts` |
| Textos legais | `src/data/legal.ts` |
| Cores e tipografia | `src/styles/global.css` |
| Imagens | `public/images/products` e `public/images/site` |

Para adicionar um produto: coloca as imagens em `public/images/products/` (de preferência `.webp`, 1200px) e acrescenta uma entrada a `products` em `src/data/products.ts`. A página do produto é criada automaticamente.

## Carrinho e encomendas

O carrinho funciona no browser (guardado em `localStorage`). Por agora, o checkout recolhe os dados do cliente e abre o email com o resumo da encomenda para `geral@mekie-planet.com`. Na fase seguinte liga-se um pagamento online (Stripe com MB WAY, Multibanco, cartão, Apple Pay e Google Pay).

## Newsletter e 10% de boas-vindas

O popup (e o formulário do rodapé) pede o email e o consentimento e mostra o código `MEKIE10`.

Para guardar os emails, põe o URL de um webhook em `newsletterWebhook` (`src/data/site.ts`). O site envia um `POST` (`application/x-www-form-urlencoded`) com:

| Campo | Exemplo |
| --- | --- |
| `email` | `cliente@exemplo.pt` |
| `consent` | `true` |
| `source` | `popup` ou `footer` |
| `page` | `/loja/` |
| `code` | `MEKIE10` |
| `created_at` | `2026-10-16T10:19:21.325Z` |

Funciona com Make, Zapier, n8n ou um Google Apps Script que escreve numa Google Sheet. Enquanto o campo estiver vazio, o código aparece na mesma mas o email **não fica guardado**.

O código e a percentagem estão em `welcomeCode` e `welcomeDiscount`. O código tem de ser criado também no sistema de pagamento, com uso único por cliente e sem acumular com outras promoções.

## Deploy na Vercel

Importar o repositório na Vercel; o preset **Astro** é detetado automaticamente (build `npm run build`, output `dist`).
