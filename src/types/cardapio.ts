export type ProductStatus = 'Ativo' | 'Inativo' | 'Em falta'

export interface Variation {
  id: string
  name: string
  price: string
}

export interface ComplementItem {
  id: string
  name: string
  price: string
}

export interface ComplementGroup {
  id: string
  name: string
  selectionType: 'single' | 'multiple'
  min: string
  max: string
  items: ComplementItem[]
}

export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  category_id: string
  price: string
  size: string
  serves: string
  status: ProductStatus
  image: string
  variations?: Variation[]
  complementGroups?: ComplementGroup[]
}
