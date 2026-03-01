import { useState, useMemo } from 'react'
import { Plus, Minus, ShoppingBag, ArrowLeft, Info, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

// --- Types ---
type ProductStatus = 'Ativo' | 'Inativo' | 'Em falta'

interface Variation {
  id: string
  name: string
  price: string
}

interface ComplementItem {
  id: string
  name: string
  price: string
}

interface ComplementGroup {
  id: string
  name: string
  selectionType: 'single' | 'multiple'
  min: string
  max: string
  items: ComplementItem[]
}

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: string
  size: string
  serves: string
  status: ProductStatus
  image: string
  variations?: Variation[]
  complementGroups?: ComplementGroup[]
}

interface CartItem {
  id: string
  product: Product
  variation?: Variation
  complements: { groupName: string; item: ComplementItem }[]
  quantity: number
  totalPrice: number
}

// --- Utils ---
const parsePrice = (priceStr: string | undefined | null) => {
  if (!priceStr) return 0
  const clean = priceStr.toString().replace(/[^\d.,]/g, '')
  return parseFloat(clean.replace(/\./g, '').replace(',', '.')) || 0
}

const formatPrice = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const getDisplayPrice = (p: Product) => {
  if (p.variations && p.variations.length > 0) {
    const prices = p.variations
      .map((v) => parsePrice(v.price))
      .filter((v) => v > 0)
    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      return `A partir de ${formatPrice(minPrice)}`
    }
    return 'Preço variável'
  }
  return formatPrice(parsePrice(p.price))
}

// --- Mock Data (Synced with Cardapio.tsx) ---
const mockCategories = ['Lanches', 'Bebidas', 'Sobremesas']

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'X-Burger Especial',
    description:
      'Pão brioche, hambúrguer artesanal 180g, queijo cheddar, alface, tomate e maionese da casa.',
    category: 'Lanches',
    price: '35,90',
    size: '400g',
    serves: '1',
    status: 'Ativo',
    image: 'https://img.usecurling.com/p/400/400?q=burger&color=orange',
    variations: [],
    complementGroups: [
      {
        id: 'g1',
        name: 'Adicionais',
        selectionType: 'multiple',
        min: '0',
        max: '5',
        items: [
          { id: 'i1', name: 'Bacon Extra', price: '5,00' },
          { id: 'i2', name: 'Queijo Extra', price: '4,00' },
          { id: 'i3', name: 'Cebola Caramelizada', price: '3,00' },
        ],
      },
      {
        id: 'g2',
        name: 'Ponto da Carne',
        selectionType: 'single',
        min: '1',
        max: '1',
        items: [
          { id: 'i4', name: 'Mal Passada', price: '0,00' },
          { id: 'i5', name: 'Ao Ponto', price: '0,00' },
          { id: 'i6', name: 'Bem Passada', price: '0,00' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Refrigerante',
    description: 'Gelado e refrescante.',
    category: 'Bebidas',
    price: '',
    size: '',
    serves: '1',
    status: 'Ativo',
    image: 'https://img.usecurling.com/p/400/400?q=soda',
    variations: [
      { id: 'v1', name: 'Lata 350ml', price: '6,50' },
      { id: 'v2', name: 'Garrafa 600ml', price: '8,90' },
      { id: 'v3', name: 'Garrafa 2L', price: '14,00' },
    ],
    complementGroups: [],
  },
  {
    id: '3',
    name: 'Batata Frita',
    description:
      'Porção generosa de batatas fritas crocantes por fora e macias por dentro.',
    category: 'Lanches',
    price: '22,00',
    size: '300g',
    serves: '2',
    status: 'Ativo',
    image: 'https://img.usecurling.com/p/400/400?q=fries',
  },
  {
    id: '4',
    name: 'Brownie de Chocolate',
    description: 'Brownie quentinho com calda de chocolate e pedaços de nozes.',
    category: 'Sobremesas',
    price: '18,50',
    size: '150g',
    serves: '1',
    status: 'Em falta',
    image: 'https://img.usecurling.com/p/400/400?q=brownie',
  },
]

export default function PublicMenu() {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState(mockCategories[0])
  const [searchQuery, setSearchQuery] = useState('')

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Product Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return mockProducts
    const q = searchQuery.toLowerCase()
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [searchQuery])

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item])
    setSelectedProduct(null)
    toast({
      title: 'Adicionado à sacola',
      description: `${item.quantity}x ${item.product.name} adicionado com sucesso.`,
    })
  }

  const removeCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat)
    const element = document.getElementById(`category-${cat}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 selection:bg-brand-red selection:text-white">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/400?q=restaurant%20food')] opacity-30 mix-blend-overlay object-cover"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center text-center mt-8">
            <div className="h-20 w-20 bg-white rounded-full p-1 shadow-xl -mb-10 relative z-20 overflow-hidden border-4 border-white">
              <img
                src="https://img.usecurling.com/i?q=burger&color=solid-black&shape=fill"
                className="w-full h-full object-contain p-2"
                alt="Logo"
              />
            </div>
          </div>
        </div>

        <div className="pt-12 pb-4 px-4 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Deliro Delivery
          </h1>
          <p className="text-slate-500 text-sm mt-1 mb-4 flex items-center justify-center gap-1.5 font-medium">
            <Info className="h-4 w-4" /> Aberto até as 23:00
          </p>

          <div className="relative max-w-md mx-auto group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-red transition-colors" />
            <Input
              placeholder="Buscar no cardápio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-100/50 border-transparent focus-visible:ring-brand-red focus-visible:bg-white rounded-full shadow-sm"
            />
          </div>
        </div>

        {/* Category Navigation */}
        {!searchQuery && (
          <ScrollArea className="w-full border-t border-slate-100 bg-white shadow-sm">
            <div className="flex w-max space-x-2 p-3 px-4">
              {mockCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  onClick={() => scrollToCategory(cat)}
                  className={cn(
                    'rounded-full px-5 font-semibold transition-all h-9',
                    activeCategory === cat
                      ? 'bg-brand-red hover:bg-red-700 text-white shadow-md border-brand-red'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900',
                  )}
                >
                  {cat}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-8">
        {searchQuery ? (
          <div className="space-y-4">
            <h2 className="font-bold text-slate-800 text-lg">
              Resultados para "{searchQuery}"
            </h2>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onClick={() => setSelectedProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
                Nenhum produto encontrado.
              </div>
            )}
          </div>
        ) : (
          mockCategories.map((cat) => {
            const productsInCategory = mockProducts.filter(
              (p) => p.category === cat,
            )
            if (productsInCategory.length === 0) return null

            return (
              <div
                key={cat}
                id={`category-${cat}`}
                className="space-y-4 scroll-mt-48"
              >
                <h2 className="font-bold text-slate-800 text-xl flex items-center gap-2">
                  {cat}
                  <Badge
                    variant="secondary"
                    className="bg-slate-200 text-slate-600 font-bold ml-2"
                  >
                    {productsInCategory.length}
                  </Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productsInCategory.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onClick={() => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </main>

      {/* Floating Cart Button */}
      {cartQuantity > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40 flex justify-center animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div
            onClick={() => setIsCartOpen(true)}
            className="bg-brand-red text-white p-4 rounded-full shadow-[0_10px_40px_rgba(229,62,62,0.4)] flex items-center justify-between w-full max-w-md cursor-pointer hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="bg-black/20 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                {cartQuantity}
              </div>
              <span className="font-bold text-base hidden sm:block">
                Ver sacola
              </span>
            </div>
            <div className="flex items-center gap-3 font-bold text-lg">
              {formatPrice(cartTotal)}
              <ShoppingBag className="h-5 w-5 opacity-80" />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Summary Modal */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col bg-slate-50 border-l border-slate-200"
        >
          <div className="p-5 border-b border-slate-200 bg-white shadow-sm z-10 flex items-center justify-between">
            <SheetHeader className="text-left space-y-0">
              <SheetTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <ShoppingBag className="h-5 w-5 text-brand-red" />
                Sua Sacola
              </SheetTitle>
            </SheetHeader>
          </div>

          <ScrollArea className="flex-1 p-5 relative">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-60">
                <ShoppingBag className="h-16 w-16 text-slate-300 mb-4" />
                <p className="text-slate-600 font-semibold text-lg">
                  Sua sacola está vazia
                </p>
                <p className="text-slate-500 mt-1 max-w-[200px]">
                  Adicione itens do cardápio para começar seu pedido.
                </p>
                <Button
                  className="mt-6 bg-slate-200 text-slate-700 hover:bg-slate-300 font-bold"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continuar explorando
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="text-brand-red bg-red-50 px-1.5 py-0.5 rounded-md text-sm">
                            {item.quantity}x
                          </span>
                          {item.product.name}
                        </h4>
                        <span className="font-bold text-slate-800 shrink-0 ml-2">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>

                      <div className="text-sm text-slate-500 mt-2 space-y-1">
                        {item.variation && (
                          <p>
                            Variação:{' '}
                            <span className="font-medium text-slate-700">
                              {item.variation.name}
                            </span>
                          </p>
                        )}
                        {item.complements.map((c, idx) => (
                          <p key={idx} className="flex justify-between">
                            <span>+ {c.item.name}</span>
                            {parsePrice(c.item.price) > 0 && (
                              <span className="text-slate-400">
                                {formatPrice(parsePrice(c.item.price))}
                              </span>
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {cartItems.length > 0 && (
            <div className="p-5 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 shrink-0">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Taxa de Entrega</span>
                  <span className="text-brand-green font-bold">A calcular</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-black text-slate-800">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <Button
                className="w-full bg-brand-red hover:bg-red-700 text-white font-bold h-14 text-lg rounded-xl transition-all shadow-sm active:scale-95"
                onClick={() => {
                  toast({
                    title: 'Pedido Simulado!',
                    description: 'Esta é uma tela de demonstração.',
                  })
                  setIsCartOpen(false)
                  setCartItems([])
                }}
              >
                Avançar para Pagamento
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ProductCard({
  product,
  onClick,
}: {
  product: Product
  onClick: () => void
}) {
  const isAvailable =
    product.status !== 'Em falta' && product.status !== 'Inativo'

  return (
    <div
      onClick={() => isAvailable && onClick()}
      className={cn(
        'flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 transition-all',
        isAvailable
          ? 'cursor-pointer hover:border-brand-red/40 hover:shadow-md active:scale-[0.98]'
          : 'opacity-60 grayscale-[0.5]',
      )}
    >
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-bold text-brand-green">
            {getDisplayPrice(product)}
          </span>
          {!isAvailable && (
            <Badge className="bg-red-50 text-brand-red border-none hover:bg-red-50 font-bold uppercase tracking-wider text-[10px]">
              Esgotado
            </Badge>
          )}
          {isAvailable &&
            product.complementGroups &&
            product.complementGroups.length > 0 && (
              <span className="text-[10px] font-bold text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full">
                Opções
              </span>
            )}
        </div>
      </div>
      {product.image && (
        <div className="h-28 w-28 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100 relative">
          <img
            src={product.image}
            className="w-full h-full object-cover"
            alt={product.name}
          />
        </div>
      )}
    </div>
  )
}

function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: {
  product: Product
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: CartItem) => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    product.variations && product.variations.length > 0
      ? product.variations[0].id
      : null,
  )
  const [selectedComplements, setSelectedComplements] = useState<
    Record<string, string[]>
  >({})

  // Calculate Prices
  const basePrice =
    selectedVariationId && product.variations
      ? parsePrice(
          product.variations.find((v) => v.id === selectedVariationId)?.price,
        )
      : parsePrice(product.price)

  const complementsPrice = Object.entries(selectedComplements).reduce(
    (sum, [groupId, itemIds]) => {
      const group = product.complementGroups?.find((g) => g.id === groupId)
      if (!group) return sum
      const itemsTotal = itemIds.reduce((itemSum, itemId) => {
        const item = group.items.find((i) => i.id === itemId)
        return itemSum + (item ? parsePrice(item.price) : 0)
      }, 0)
      return sum + itemsTotal
    },
    0,
  )

  const totalPrice = (basePrice + complementsPrice) * quantity

  // Validation
  const isValid = useMemo(() => {
    if (
      product.variations &&
      product.variations.length > 0 &&
      !selectedVariationId
    )
      return false

    if (product.complementGroups) {
      for (const group of product.complementGroups) {
        const min = parseInt(group.min) || 0
        const selectedCount = (selectedComplements[group.id] || []).length
        if (selectedCount < min) return false
      }
    }
    return true
  }, [product, selectedVariationId, selectedComplements])

  const handleToggleMultiple = (
    groupId: string,
    itemId: string,
    max: number,
  ) => {
    const current = selectedComplements[groupId] || []
    if (current.includes(itemId)) {
      setSelectedComplements((prev) => ({
        ...prev,
        [groupId]: current.filter((id) => id !== itemId),
      }))
    } else {
      if (current.length < max) {
        setSelectedComplements((prev) => ({
          ...prev,
          [groupId]: [...current, itemId],
        }))
      }
    }
  }

  const handleSelectSingle = (groupId: string, itemId: string) => {
    setSelectedComplements((prev) => ({ ...prev, [groupId]: [itemId] }))
  }

  const handleAdd = () => {
    if (!isValid) return

    const variation = product.variations?.find(
      (v) => v.id === selectedVariationId,
    )
    const complements: { groupName: string; item: ComplementItem }[] = []

    Object.entries(selectedComplements).forEach(([groupId, itemIds]) => {
      const group = product.complementGroups?.find((g) => g.id === groupId)
      if (group) {
        itemIds.forEach((itemId) => {
          const item = group.items.find((i) => i.id === itemId)
          if (item) complements.push({ groupName: group.name, item })
        })
      }
    })

    onAddToCart({
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      product,
      variation,
      complements,
      quantity,
      totalPrice,
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[90vh] sm:h-auto sm:max-h-[90vh] p-0 flex flex-col bg-slate-50 rounded-t-[2rem] sm:rounded-2xl sm:max-w-xl mx-auto border-none shadow-2xl"
      >
        <div className="absolute top-4 left-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow-sm text-slate-700 hover:bg-white"
            onClick={onClose}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto no-scrollbar relative">
          {product.image && (
            <div className="h-64 w-full bg-slate-200 relative shrink-0">
              <img
                src={product.image}
                className="w-full h-full object-cover"
                alt={product.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          )}

          <div
            className={cn(
              'p-6 bg-white shrink-0 relative',
              product.image ? '-mt-6 rounded-t-3xl' : '',
            )}
          >
            <h2 className="text-2xl font-black text-slate-800 leading-tight">
              {product.name}
            </h2>
            <p className="text-slate-500 mt-2 leading-relaxed text-sm">
              {product.description}
            </p>

            {(!product.variations || product.variations.length === 0) && (
              <div className="mt-4 font-black text-xl text-brand-green">
                {formatPrice(parsePrice(product.price))}
              </div>
            )}
          </div>

          <div className="p-4 space-y-4 pb-8 bg-slate-50">
            {/* Variations */}
            {product.variations && product.variations.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Escolha o tamanho
                    </h3>
                    <p className="text-xs text-slate-500">Obrigatório</p>
                  </div>
                  <Badge className="bg-slate-800 hover:bg-slate-800 uppercase text-[10px] px-2 font-bold tracking-wider">
                    Obrigatório
                  </Badge>
                </div>

                <RadioGroup
                  value={selectedVariationId || ''}
                  onValueChange={setSelectedVariationId}
                  className="space-y-3"
                >
                  {product.variations.map((v) => (
                    <label
                      key={v.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-red/50 cursor-pointer transition-colors has-[:checked]:border-brand-red has-[:checked]:bg-red-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value={v.id}
                          className="border-slate-300 text-brand-red"
                        />
                        <span className="font-medium text-slate-700">
                          {v.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {formatPrice(parsePrice(v.price))}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Complements */}
            {product.complementGroups?.map((group) => {
              const min = parseInt(group.min) || 0
              const max = parseInt(group.max) || 0
              const currentSelected = selectedComplements[group.id] || []
              const isRequired = min > 0

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                >
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">
                        {group.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {min === max
                          ? `Escolha ${max} opção`
                          : `Escolha de ${min} até ${max} opções`}
                      </p>
                    </div>
                    {isRequired ? (
                      <Badge className="bg-slate-800 hover:bg-slate-800 uppercase text-[10px] px-2 font-bold tracking-wider shrink-0">
                        Obrigatório
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="uppercase text-[10px] px-2 font-bold tracking-wider shrink-0 bg-slate-100 text-slate-500"
                      >
                        Opcional
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    {group.selectionType === 'single' ? (
                      <RadioGroup
                        value={currentSelected[0] || ''}
                        onValueChange={(v) => handleSelectSingle(group.id, v)}
                        className="space-y-3"
                      >
                        {group.items.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-red/50 cursor-pointer transition-colors has-[:checked]:border-brand-red has-[:checked]:bg-red-50/50"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value={item.id}
                                className="border-slate-300 text-brand-red"
                              />
                              <span className="font-medium text-slate-700">
                                {item.name}
                              </span>
                            </div>
                            {parsePrice(item.price) > 0 && (
                              <span className="font-bold text-slate-600">
                                + {formatPrice(parsePrice(item.price))}
                              </span>
                            )}
                          </label>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-3">
                        {group.items.map((item) => {
                          const isChecked = currentSelected.includes(item.id)
                          const isDisabled =
                            !isChecked && currentSelected.length >= max

                          return (
                            <label
                              key={item.id}
                              className={cn(
                                'flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer',
                                isChecked
                                  ? 'border-brand-red bg-red-50/50'
                                  : 'border-slate-100 hover:border-brand-red/50',
                                isDisabled
                                  ? 'opacity-50 cursor-not-allowed hover:border-slate-100'
                                  : '',
                              )}
                              onClick={(e) => {
                                if (isDisabled) e.preventDefault()
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() =>
                                    handleToggleMultiple(group.id, item.id, max)
                                  }
                                  disabled={isDisabled}
                                  className="border-slate-300 data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
                                />
                                <span className="font-medium text-slate-700">
                                  {item.name}
                                </span>
                              </div>
                              {parsePrice(item.price) > 0 && (
                                <span className="font-bold text-slate-600">
                                  + {formatPrice(parsePrice(item.price))}
                                </span>
                              )}
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="bg-white p-4 sm:p-6 border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 shrink-0 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center justify-center gap-4 bg-slate-100 p-2 rounded-xl sm:w-auto w-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-600 hover:bg-white rounded-lg shadow-sm"
              onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg w-6 text-center text-slate-800">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-brand-red hover:bg-white rounded-lg shadow-sm"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold h-14 rounded-xl text-lg flex items-center justify-between px-6 shadow-md transition-all active:scale-95 disabled:opacity-50"
            disabled={!isValid}
            onClick={handleAdd}
          >
            <span>Adicionar</span>
            <span>{formatPrice(totalPrice)}</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
