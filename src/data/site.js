// Dados da empresa e conteúdo dos ramos de seguro.
// Tudo o que aparece no site vem daqui: altere aqui e o site inteiro atualiza.

export const company = {
  name: 'ML Seguros',
  legalName: 'M. L. Seguros – Sociedade de Mediação de Seguros, Lda.',
  tagline: 'Mediação de seguros na Ericeira',
  phone: '+351 919 400 228',
  phoneHref: 'tel:+351919400228',
  phoneNote: 'Chamada para rede móvel nacional',
  whatsappHref: 'https://wa.me/351919400228',
  email: 'geral@mlseguros.pt',
  address: {
    street: 'Rua Dr. Eduardo Burnay, 20-B',
    postalCode: '2655-369',
    locality: 'Ericeira',
    municipality: 'Mafra',
    country: 'PT',
  },
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=ML+Seguros+Rua+Dr.+Eduardo+Burnay+20-B+Ericeira',
  mapsEmbed: 'https://www.google.com/maps?q=Rua+Dr.+Eduardo+Burnay+20-B,+2655-369+Ericeira&output=embed',
  asf: '407255064/3',
  nif: '507430409',
  years: 25,
  google: {
    rating: '5,0',
    count: 25,
    href: 'https://www.google.com/maps/search/?api=1&query=ML+Seguros+Ericeira',
  },
  areaServed: ['Ericeira', 'Mafra', 'Sintra', 'Torres Vedras', 'Lisboa'],
  // Endpoint que recebe os formulários (ex.: Formspree, Make, n8n, webhook do CRM).
  // Enquanto estiver vazio, os formulários abrem o email do visitante já preenchido.
  formEndpoint: '',
};

// Seguradoras parceiras (texto; substituir por logótipos oficiais em /public/parceiros/ se autorizados).
export const insurers = [
  { name: 'Fidelidade', href: 'https://www.fidelidade.pt' },
  { name: 'Allianz', href: 'https://www.allianz.pt' },
  { name: 'Generali Tranquilidade', href: 'https://www.generalitranquilidade.pt' },
  { name: 'Ageas', href: 'https://www.ageas.pt' },
];

// Fotografias do Pexels (licença livre, sem atribuição obrigatória).
export const photos = {
  heroAdvisor: 8441861, // mediadora com casal sénior, sorridentes
  couple: 7731318,
  elderly: 8441780,
  explaining: 7735626,
  homeVisit: 8439647,
  familyHome: 3875141,
  familyMeal: 7492954,
  ericeiraAerial: 20414673,
  ericeiraHouses: 23856802,
  ericeiraBeach: 24350498,
  ericeiraBoats: 32473806,
  driving: 1051071,
  worker: 28196526,
  construction: 4956918,
  doctor: 7579831,
  medicalForm: 7088834,
};

export const pexels = (id, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const pexelsSrcset = (id, widths = [480, 800, 1200, 1600]) =>
  widths.map((w) => `${pexels(id, w)} ${w}w`).join(', ');

// Ramos de seguro. Cada um gera uma página em /seguros/<slug>/.
export const ramos = [
  // ---------- Particulares ----------
  {
    slug: 'automovel',
    segment: 'particulares',
    icon: 'car',
    name: 'Seguro Automóvel',
    short: 'Para o seu carro ou para a frota da empresa: responsabilidade civil, danos próprios e assistência em viagem à medida.',
    seoTitle: 'Seguro Automóvel e Frota na Ericeira e Mafra',
    seoDescription: 'Seguro automóvel para particulares e frotas de empresa. Compare a Fidelidade, Allianz, Generali Tranquilidade e Ageas com um mediador local na Ericeira. Simulação gratuita e apoio em caso de acidente.',
    image: 'driving',
    intro: 'O seguro de responsabilidade civil automóvel é obrigatório, mas as diferenças entre apólices estão nos pormenores: franquias, veículo de substituição, assistência e quem o ajuda quando há um acidente. Comparamos as opções das seguradoras com quem trabalhamos e explicamos cada uma sem letras pequenas.',
    coverages: [
      ['Responsabilidade civil obrigatória', 'Danos causados a terceiros, dentro dos capitais mínimos legais ou superiores.'],
      ['Danos próprios', 'Choque, colisão, capotamento, incêndio, furto ou roubo do seu veículo.'],
      ['Fenómenos da natureza', 'Tempestades, inundações e queda de árvores, frequentes na costa.'],
      ['Assistência em viagem', 'Reboque, transporte e alojamento, em Portugal e no estrangeiro.'],
      ['Veículo de substituição', 'Para não ficar parado enquanto o carro está na oficina.'],
      ['Frota automóvel', 'Todas as viaturas da empresa numa só apólice, com gestão centralizada.'],
    ],
    audience: ['Condutores particulares', 'Carros novos ou em leasing', 'Motociclos e clássicos', 'Empresas com várias viaturas'],
    faq: [
      ['O que é obrigatório num seguro automóvel?', 'Apenas a responsabilidade civil, que cobre os danos que causar a terceiros. As restantes coberturas (danos próprios, vidros, assistência) são opcionais e ajustam-se ao valor e à idade do carro.'],
      ['Posso mudar de seguradora antes do fim da apólice?', 'Pode mudar na data de renovação, avisando a seguradora atual com a antecedência prevista no contrato. Tratamos do processo por si para que não fique nenhum dia sem seguro.'],
      ['A minha empresa tem várias viaturas. Compensa um seguro de frota?', 'Normalmente a partir de três viaturas. Junta todos os veículos numa só apólice, com coberturas diferentes por viatura se fizer sentido, e basta comunicar-nos a matrícula para incluir ou retirar um carro.'],
      ['Tive um acidente. O que faço?', 'Preencha a Declaração Amigável se houver outro veículo envolvido, tire fotografias e ligue-nos. Na página de sinistros tem o passo-a-passo completo.'],
    ],
  },
  {
    slug: 'habitacao',
    segment: 'particulares',
    icon: 'home',
    name: 'Seguro Habitação',
    short: 'Multirriscos para casa própria, arrendada ou de férias: edifício, recheio, danos por água e responsabilidade civil.',
    seoTitle: 'Seguro Multirriscos Habitação na Ericeira',
    seoDescription: 'Seguro multirriscos habitação para casa própria, arrendada ou de férias na Ericeira e Mafra. Edifício, recheio, fenómenos sísmicos e assistência 24h.',
    image: 'familyHome',
    intro: 'A casa é, para a maioria das famílias, o maior investimento de uma vida. Um multirriscos bem feito protege o edifício e o recheio pelos valores certos, o que evita a regra proporcional num sinistro. Ajudamos a calcular os capitais e a escolher as coberturas que fazem sentido para a sua casa.',
    coverages: [
      ['Incêndio, raio e explosão', 'Obrigatório em frações de propriedade horizontal.'],
      ['Danos por água', 'Roturas de canalizações e infiltrações, incluindo pesquisa de avarias.'],
      ['Tempestades e inundações', 'Essencial em zonas costeiras e expostas ao vento.'],
      ['Fenómenos sísmicos', 'Cobertura opcional e muitas vezes esquecida.'],
      ['Furto ou roubo', 'Do recheio e dos danos causados ao edifício.'],
      ['Responsabilidade civil familiar', 'Danos que a família cause a terceiros no dia-a-dia.'],
    ],
    audience: ['Casa própria com crédito', 'Casas arrendadas (senhorios e inquilinos)', 'Casas de férias e alojamento local', 'Condomínios'],
    faq: [
      ['O seguro do banco é obrigatório?', 'O banco exige um seguro com determinadas coberturas, mas não o pode obrigar a contratá-lo consigo. Muitas vezes conseguimos condições melhores numa seguradora à sua escolha.'],
      ['Qual é a diferença entre edifício e recheio?', 'O edifício é a construção (paredes, telhado, canalizações). O recheio são os bens dentro de casa: móveis, eletrodomésticos, roupa. Podem ser seguros em conjunto ou separadamente.'],
      ['Tenho alojamento local. Preciso de um seguro diferente?', 'Sim. O alojamento local exige um seguro específico de responsabilidade civil e o multirriscos normal pode excluir a atividade. Fazemos a análise ao seu caso.'],
    ],
  },
  {
    slug: 'saude',
    segment: 'particulares',
    icon: 'heart',
    name: 'Seguro de Saúde',
    short: 'Consultas, exames e internamento na rede privada: planos individuais, familiares ou de grupo para empresas.',
    seoTitle: 'Seguro de Saúde Individual, Familiar e de Grupo',
    seoDescription: 'Compare seguros de saúde individuais, familiares e de grupo para empresas. Consultas, exames, internamento e estomatologia com o apoio de um mediador na Ericeira.',
    image: 'doctor',
    intro: 'Os seguros de saúde parecem todos iguais até ao dia em que são precisos. Plafonds, copagamentos, períodos de carência e rede de prestadores fazem toda a diferença. Comparamos planos e explicamos o que cada um cobre de facto na sua zona.',
    coverages: [
      ['Internamento e cirurgia', 'Com plafonds anuais adequados a situações graves.'],
      ['Ambulatório', 'Consultas de especialidade, exames e análises.'],
      ['Estomatologia', 'Consultas e tratamentos dentários com copagamento reduzido.'],
      ['Parto', 'Cobertura para gravidez após o período de carência.'],
      ['Rede e reembolso', 'Acesso à rede convencionada e reembolso fora dela.'],
      ['Saúde de grupo para empresas', 'Benefício para a equipa, com condições melhores do que as individuais.'],
    ],
    audience: ['Particulares', 'Famílias com filhos', 'Trabalhadores independentes', 'Empresas e PME'],
    faq: [
      ['O que é o período de carência?', 'É o tempo entre o início do contrato e o momento em que certas coberturas ficam disponíveis. Varia por seguradora e cobertura, por isso é um dos pontos que comparamos.'],
      ['Doenças pré-existentes estão cobertas?', 'Em regra, não. Algumas seguradoras aceitam-nas com condições especiais. Convém declará-las sempre na proposta.'],
      ['Posso incluir toda a família?', 'Sim, e costuma compensar. Os planos familiares têm geralmente um custo por pessoa mais baixo.'],
      ['Tenho uma empresa. Posso oferecer seguro de saúde à equipa?', 'Sim. As apólices de grupo aceitam, em algumas seguradoras, equipas a partir de duas ou três pessoas, muitas vezes sem questionário médico e com extensão aos familiares.'],
    ],
  },
  {
    slug: 'vida',
    segment: 'particulares',
    icon: 'shield',
    name: 'Seguro de Vida',
    short: 'Proteção para a família e para o crédito à habitação, em caso de morte ou invalidez.',
    seoTitle: 'Seguro de Vida e Crédito Habitação',
    seoDescription: 'Seguro de vida para crédito habitação ou proteção familiar. Poupe ao transferir o seguro do banco para outra seguradora, com apoio de um mediador na Ericeira.',
    image: 'familyMeal',
    intro: 'O seguro de vida protege quem depende de si. No crédito à habitação é exigido pelo banco, mas pode ser contratado noutra seguradora, e a poupança ao longo do empréstimo pode ser significativa. Fazemos as contas e tratamos da transferência.',
    coverages: [
      ['Morte', 'Pagamento do capital seguro aos beneficiários ou ao banco.'],
      ['Invalidez absoluta e definitiva', 'Quando deixa de poder exercer qualquer atividade.'],
      ['Invalidez total e permanente', 'A partir de um grau de incapacidade definido na apólice.'],
      ['Doenças graves', 'Adiantamento do capital em diagnósticos definidos.'],
      ['Capital decrescente', 'Acompanha o valor em dívida do crédito.'],
      ['Proteção familiar', 'Capital livre para os beneficiários que escolher.'],
    ],
    audience: ['Titulares de crédito à habitação', 'Pais com filhos a cargo', 'Sócios de empresas', 'Quem quer poupar no seguro do banco'],
    faq: [
      ['Posso transferir o seguro de vida do banco?', 'Sim. A lei permite contratar o seguro de vida do crédito numa seguradora à sua escolha, desde que cumpra as coberturas exigidas pelo banco. Convém confirmar se o contrato do crédito tem alguma bonificação de spread ligada ao seguro do banco; fazemos essa conta consigo.'],
      ['Quanto posso poupar?', 'Depende da idade, do capital e do prazo, mas a diferença costuma ser relevante. Pedimos-lhe a última declaração do banco e fazemos a simulação sem compromisso.'],
      ['Preciso de fazer exames médicos?', 'Depende do capital e da idade. Na maioria dos casos basta um questionário de saúde.'],
    ],
  },
  // ---------- Empresas ----------
  {
    slug: 'acidentes-de-trabalho',
    segment: 'empresas',
    icon: 'hardhat',
    name: 'Acidentes de Trabalho',
    short: 'Seguro obrigatório para trabalhadores por conta de outrem e independentes, com gestão simples de folhas de férias.',
    seoTitle: 'Seguro de Acidentes de Trabalho em Mafra e Ericeira',
    seoDescription: 'Seguro de acidentes de trabalho obrigatório para empresas e independentes em Mafra e Ericeira. Enquadramento correto da atividade e apoio na gestão de sinistros.',
    image: 'worker',
    intro: 'O seguro de acidentes de trabalho é obrigatório para todas as entidades empregadoras e para os trabalhadores independentes. Um enquadramento errado da atividade ou da massa salarial pode levar a recusas ou a acertos elevados no fim do ano. Tratamos da apólice, das folhas de férias e dos sinistros.',
    coverages: [
      ['Trabalhadores por conta de outrem', 'Cobertura obrigatória por lei para todos os trabalhadores.'],
      ['Trabalhadores independentes', 'Apólice própria obrigatória para quem passa recibos.'],
      ['Assistência clínica', 'Tratamento, medicamentos e reabilitação do sinistrado.'],
      ['Indemnizações', 'Por incapacidade temporária ou permanente.'],
      ['Folhas de férias', 'Apoio no envio mensal e na atualização salarial.'],
      ['Gestão de sinistros', 'Acompanhamos a participação e o processo até ao fim.'],
    ],
    audience: ['Construção civil e obras', 'Restauração e comércio', 'Serviços e escritórios', 'Trabalhadores independentes'],
    faq: [
      ['É mesmo obrigatório?', 'Sim. A lei obriga todas as entidades empregadoras a transferir a responsabilidade por acidentes de trabalho para uma seguradora, e os trabalhadores independentes a ter apólice própria.'],
      ['Como é calculado o prémio?', 'Com base na atividade da empresa e na massa salarial anual. Por isso é importante declarar a atividade correta e manter as folhas de férias atualizadas.'],
      ['Um trabalhador teve um acidente. E agora?', 'Garanta primeiro a assistência médica e ligue-nos logo que possível: a participação à seguradora tem prazos curtos. Na página de sinistros explicamos os passos.'],
    ],
  },
  {
    slug: 'multirriscos-empresarial',
    segment: 'empresas',
    icon: 'building',
    name: 'Multirriscos Empresarial',
    short: 'Instalações, equipamentos, mercadorias e perdas de exploração para lojas, restaurantes, escritórios e armazéns.',
    seoTitle: 'Seguro Multirriscos Empresarial e Comércio',
    seoDescription: 'Seguro multirriscos para lojas, restaurantes, escritórios e armazéns na Ericeira e Mafra. Edifício, recheio, mercadorias e perdas de exploração.',
    image: 'ericeiraHouses',
    intro: 'Um incêndio, uma inundação ou um assalto podem parar um negócio durante semanas. O multirriscos empresarial protege as instalações e os bens e, com a cobertura de perdas de exploração, ajuda a pagar as despesas fixas enquanto a atividade está parada.',
    coverages: [
      ['Edifício e recheio', 'Instalações, mobiliário, equipamentos e obras de adaptação.'],
      ['Mercadorias', 'Stocks em loja ou armazém.'],
      ['Avaria de máquinas', 'Equipamentos de frio, cozinha, informática.'],
      ['Furto ou roubo', 'Incluindo valores em caixa, conforme a apólice.'],
      ['Perdas de exploração', 'Rendimento perdido durante a paragem.'],
      ['Responsabilidade civil de exploração', 'Danos causados a clientes e terceiros.'],
    ],
    audience: ['Comércio e lojas', 'Restauração e cafés', 'Escritórios e consultórios', 'Armazéns e oficinas'],
    faq: [
      ['Qual é a diferença para o multirriscos habitação?', 'Os riscos de uma atividade comercial são diferentes: mercadorias, clientes nas instalações, equipamentos profissionais e a paragem do negócio. O multirriscos empresarial foi desenhado para isso.'],
      ['O que são perdas de exploração?', 'É a cobertura que compensa a quebra de faturação e as despesas fixas (rendas, salários) enquanto o negócio está parado por causa de um sinistro coberto.'],
      ['Sou inquilino. Preciso de segurar o edifício?', 'Normalmente não, mas deve segurar o recheio, as obras que fez no espaço e a responsabilidade civil. Confirmamos o que o contrato de arrendamento exige.'],
    ],
  },
  {
    slug: 'responsabilidade-civil',
    segment: 'empresas',
    icon: 'scale',
    name: 'Responsabilidade Civil',
    short: 'Exploração, profissional e produtos: proteção contra reclamações de clientes e terceiros.',
    seoTitle: 'Seguro de Responsabilidade Civil Profissional e de Exploração',
    seoDescription: 'Seguros de responsabilidade civil de exploração, profissional e de produtos para empresas e profissionais liberais. Análise gratuita do risco.',
    image: 'explaining',
    intro: 'Um erro, um acidente com um cliente ou um produto defeituoso podem dar origem a pedidos de indemnização elevados. Algumas atividades têm seguro de responsabilidade civil obrigatório; noutras é simplesmente prudente. Ajudamos a perceber o que precisa e com que capitais.',
    coverages: [
      ['RC de exploração', 'Danos a terceiros resultantes da atividade da empresa.'],
      ['RC profissional', 'Erros e omissões de profissionais liberais e consultores.'],
      ['RC de produtos', 'Danos causados por produtos fabricados ou vendidos.'],
      ['RC ambiental', 'Danos ambientais, exigidos em algumas atividades.'],
      ['Defesa jurídica', 'Custos de defesa em processos de reclamação.'],
      ['Seguros obrigatórios', 'Alojamento local, mediação imobiliária, obras e outros.'],
    ],
    audience: ['Profissionais liberais', 'Empreiteiros e obras', 'Alojamento local', 'Indústria e comércio'],
    faq: [
      ['A minha atividade tem seguro obrigatório?', 'Várias atividades têm: alojamento local, mediação imobiliária, empreiteiros, técnicos de certificação, entre outras. Diga-nos a sua atividade e confirmamos.'],
      ['Que capital devo contratar?', 'Depende da atividade, da dimensão e do que os seus clientes exigem. Por vezes os contratos públicos ou grandes clientes impõem capitais mínimos.'],
      ['Cobre reclamações de trabalhos antigos?', 'Depende da apólice (regime de ocorrência ou de reclamação). É um pormenor importante que explicamos antes de contratar.'],
    ],
  },
];

export const ramosBySegment = (segment) => ramos.filter((r) => r.segment === segment);

// Perguntas gerais (home e contactos).
export const generalFaq = [
  ['O que faz um mediador de seguros?', 'Um mediador trabalha com várias seguradoras, compara propostas e aconselha-o sobre a melhor solução. Acompanha-o também depois de contratar, nas alterações à apólice e sobretudo nos sinistros.'],
  ['Pagar através de um mediador fica mais caro?', 'Não. O preço da apólice é o mesmo da seguradora. O que ganha é aconselhamento, comparação entre várias companhias e alguém do seu lado quando precisa de participar um sinistro.'],
  ['Com que seguradoras trabalham?', 'Trabalhamos com Fidelidade, Allianz, Generali Tranquilidade e Ageas, entre outras. Isso permite-nos comparar condições e escolher a que melhor se ajusta a cada caso.'],
  ['Posso transferir os meus seguros atuais para a ML Seguros?', 'Sim. Analisamos as apólices que já tem, sem compromisso, e tratamos da transferência na data de renovação, sem que fique sem cobertura.'],
  ['Onde estão localizados?', 'Estamos na Rua Dr. Eduardo Burnay, 20-B, na Ericeira. Atendemos clientes de todo o concelho de Mafra e, à distância, de qualquer ponto do país.'],
];
