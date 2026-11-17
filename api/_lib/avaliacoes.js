// Avaliações dos clientes, num formato do site, venham de onde vierem.
// Hoje: Google Places API (New). Para trocar de fornecedor, acrescentar outro
// em `fornecedores` e mudar AVALIACOES_FORNECEDOR.

const fornecedores = {
  async 'google-places'() {
    const chave = process.env.GOOGLE_PLACES_API_KEY;
    const lugar = process.env.GOOGLE_PLACE_ID;
    if (!chave || !lugar) return null;
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(lugar)}?languageCode=pt-PT`, {
      headers: {
        'X-Goog-Api-Key': chave,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews,googleMapsUri',
      },
    });
    if (!res.ok) throw new Error(`Google Places ${res.status}`);
    const p = await res.json();
    return {
      fonte: 'Google Maps',
      nota: p.rating ?? null,
      total: p.userRatingCount ?? 0,
      link: p.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${lugar}`,
      escrever: `https://search.google.com/local/writereview?placeid=${lugar}`,
      avaliacoes: (p.reviews ?? []).map((r) => ({
        autor: r.authorAttribution?.displayName ?? '',
        autorUrl: r.authorAttribution?.uri ?? '',
        foto: r.authorAttribution?.photoUri ?? '',
        nota: r.rating ?? null,
        texto: r.text?.text ?? r.originalText?.text ?? '',
        traduzida: Boolean(r.originalText && r.text && r.originalText.languageCode !== r.text.languageCode),
        quando: r.relativePublishTimeDescription ?? '',
        link: r.googleMapsUri ?? '',
      })).filter((r) => r.texto),
    };
  },
};

export async function lerAvaliacoes() {
  const nome = process.env.AVALIACOES_FORNECEDOR || 'google-places';
  const fornecedor = fornecedores[nome];
  if (!fornecedor) throw new Error(`Fornecedor de avaliações desconhecido: ${nome}`);
  return fornecedor();
}
