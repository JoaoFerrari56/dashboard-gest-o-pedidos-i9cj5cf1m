import type { Product } from '@/types/cardapio'

export const parsePrice = (priceStr: string | undefined | null) => {
  if (!priceStr) return 0
  const clean = priceStr.toString().replace(/[^\d.,]/g, '')
  return parseFloat(clean.replace(/\./g, '').replace(',', '.')) || 0
}

export const getDisplayPrice = (p: Product) => {
  if (p.variations && p.variations.length > 0) {
    const prices = p.variations
      .map((v) => parseFloat(v.price.replace(',', '.')) || 0)
      .filter((v) => v > 0)
    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      return `A partir de R$ ${minPrice.toFixed(2).replace('.', ',')}`
    }
    return 'Preço variável'
  }
  return `R$ ${p.price || '0,00'}`
}
