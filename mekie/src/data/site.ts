export const site = {
  name: 'Mekie Planet',
  shortName: 'Mekie',
  tagline: 'Bro, o básico nunca falha.',
  url: 'https://mekie-planet.com',
  email: 'geral@mekie-planet.com',
  instagram: 'https://www.instagram.com/mekie_planet/',
  address: 'Rua Dr. Eduardo Burnay 26B, 2655-420 Ericeira',
  freeShippingFrom: 60,
  deliveryDays: 5,
  // Webhook que guarda os emails da newsletter (Make, Zapier, n8n, Google Apps Script...).
  // Recebe um POST application/x-www-form-urlencoded com: email, consent, source, page, code, created_at.
  newsletterWebhook: '',
  // Código de boas-vindas mostrado depois de subscrever. Tem de existir também no sistema de pagamento.
  welcomeCode: 'MEKIE10',
  welcomeDiscount: 10,
  announcement: [
    'Últimas unidades',
    'Envio gratuito em encomendas acima de 60€',
    'Entrega em 5 dias úteis via CTT',
  ],
};

export const formatPrice = (value: number) =>
  `${value.toFixed(2).replace('.', ',')}€`;
