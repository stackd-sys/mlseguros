export const site = {
  name: 'Mekie Planet',
  shortName: 'Mekie',
  tagline: 'The basics, bro, never fail.',
  url: 'https://mekie-planet.com',
  email: 'geral@mekie-planet.com',
  instagram: 'https://www.instagram.com/mekie_planet/',
  address: 'Rua Dr. Eduardo Burnay 26B, 2655-420 Ericeira',
  freeShippingFrom: 60,
  deliveryDays: 5,
  // Endpoint que recebe POST { email } (ex.: Brevo, Mailchimp, Formspree). Vazio = abre o email.
  newsletterEndpoint: '',
  announcement: [
    'Últimas unidades — 25% OFF',
    'Envio gratuito em encomendas acima de 60€',
    'Entrega em 5 dias úteis via CTT',
  ],
};

export const formatPrice = (value: number) =>
  `${value.toFixed(2).replace('.', ',')}€`;
