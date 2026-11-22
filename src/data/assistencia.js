// Linhas de assistência das seguradoras com mais apólices na ML (contagens do CRM).
// Só números lidos no site da própria seguradora. Rever de seis em seis meses: os números mudam.
// Fontes (22/11/2026):
// - Fidelidade: fidelidade.pt/blog/imprevisto-na-estrada-assistencia-em-viagem-em-4-passos, /perguntas-frequentes-fidelidade, /particulares/habitacao/utilizar/participar-sinistro-casa
// - Victoria: victoria-seguros.pt/wps/portal/institucional/victoria/contactos (rodapé e páginas de sinistros)
// - Lusitania: lusitania.pt/contactos/
// - Generali Tranquilidade: generalitranquilidade.pt/contactos e /sinistros/assistencia-viagem
// - Antiga Liberty: generalitranquilidade.pt/generali-tranquilidade/generalion/contactos
// - Allianz: allianz.pt/contactos.html e /informacao-legal.html
// Fica de fora o que as páginas oficiais contradizem (lar da Generali Tranquilidade e da antiga Liberty).

const FIXA = 'Chamada para a rede fixa nacional';
const INTERNACIONAL = 'Custo de chamada internacional';

export const assistencia = {
  confirmado: '22 de novembro de 2026',
  seguradoras: [
    {
      nome: 'Fidelidade',
      site: 'https://fidelidade.pt',
      linhas: [
        { tipo: 'Automóvel, 24 horas', numero: '214 405 008', tel: '+351214405008', nota: FIXA },
        { tipo: 'Automóvel, a partir do estrangeiro', numero: '+351 214 417 373', tel: '+351214417373', nota: INTERNACIONAL },
        { tipo: 'Casa, 24 horas', numero: '214 405 055', tel: '+351214405055', nota: FIXA },
      ],
    },
    {
      nome: 'Victoria',
      site: 'https://www.victoria-seguros.pt',
      linhas: [
        { tipo: 'Automóvel, 24 horas, também do estrangeiro', numero: '213 134 421', tel: '+351213134421', nota: FIXA },
        { tipo: 'Casa, 24 horas', numero: '213 134 454', tel: '+351213134454', nota: FIXA },
      ],
    },
    {
      nome: 'Lusitania',
      site: 'https://www.lusitania.pt',
      linhas: [
        { tipo: 'Automóvel, 24 horas, também do estrangeiro', numero: '210 454 955', tel: '+351210454955', nota: FIXA },
        { tipo: 'Casa e condomínio, 24 horas', numero: '210 454 950', tel: '+351210454950', nota: FIXA },
      ],
    },
    {
      nome: 'Generali Tranquilidade',
      site: 'https://www.generalitranquilidade.pt',
      linhas: [
        { tipo: 'Automóvel, 24 horas, também do estrangeiro', numero: '213 863 322', tel: '+351213863322', nota: FIXA },
        { tipo: 'Linha de clientes, dias úteis das 9h às 19h', numero: '211 520 310', tel: '+351211520310', nota: FIXA },
      ],
      aviso: 'Para a assistência em casa, use o número que vem na sua apólice.',
    },
    {
      nome: 'Liberty Seguros',
      site: 'https://www.generalitranquilidade.pt/generali-tranquilidade/generalion',
      siteTexto: 'Página da Generali para quem tinha Liberty',
      texto: 'Desde 1 de agosto de 2025, as apólices da Liberty são da Generali Seguros, com as mesmas condições.',
      linhas: [
        { tipo: 'Assistência automóvel', numero: '213 124 330', tel: '+351213124330', nota: FIXA },
        { tipo: 'Linha de clientes, dias úteis das 9h às 17h', numero: '213 124 300', tel: '+351213124300', nota: FIXA },
      ],
      aviso: 'Para a assistência em casa, use o número que vem na sua apólice.',
    },
    {
      nome: 'Allianz',
      site: 'https://www.allianz.pt',
      linhas: [
        { tipo: 'Automóvel, 24 horas', numero: '800 201 833', tel: '+351800201833', nota: 'Chamada gratuita' },
        { tipo: 'Automóvel, a partir do estrangeiro', numero: '+351 210 049 291', tel: '+351210049291', nota: INTERNACIONAL },
        { tipo: 'Casa, 24 horas', numero: '213 108 300', tel: '+351213108300', nota: FIXA },
      ],
    },
  ],
};
