import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShoppingBag, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import type {
  Category,
  Product,
  ComplementItem,
  Variation,
} from '@/types/cardapio'
import { parsePrice } from '@/utils/cardapio'
import { ProductCard } from '@/components/public-menu/ProductCard'
import { ProductDetailsModal } from '@/components/public-menu/ProductDetailsModal'

export interface CartItem {
  id: string
  product: Product
  variation?: Variation
  complements: { groupName: string; item: ComplementItem }[]
  quantity: number
  totalPrice: number
}

const formatPrice = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`

export default function PublicMenu() {
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const establishmentId = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [establishment, setEstablishment] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    if (!establishmentId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [estRes, catRes, itemsRes] = await Promise.all([
          supabase
            .from('establishments')
            .select('*')
            .eq('id', establishmentId)
            .single(),
          supabase
            .from('menu_categories')
            .select('*')
            .eq('establishment_id', establishmentId)
            .order('sort_order'),
          supabase
            .from('menu_items')
            .select('*')
            .eq('establishment_id', establishmentId)
            .order('sort_order'),
        ])
        if (estRes.data) setEstablishment(estRes.data)
        if (catRes.data) setCategories(catRes.data)
        if (itemsRes.data) {
          setProducts(
            itemsRes.data.map((i: any) => ({
              id: i.id,
              name: i.name,
              description: i.description || '',
              category_id: i.category_id,
              price: i.price || '',
              size: i.size || '',
              serves: i.serves || '',
              status: i.status,
              image: i.image_url || '',
              variations: Array.isArray(i.variations) ? i.variations : [],
              complementGroups: Array.isArray(i.complement_groups)
                ? i.complement_groups
                : [],
            })),
          )
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const channel = supabase
      .channel('public-menu-changes')
      .on(
        'postgres',
        {
          event: '*',
          schema: 'public',
          table: 'establishments',
          filter: `id=eq.${establishmentId}`,
        },
        fetchData,
      )
      .on(
        'postgres',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items',
          filter: `establishment_id=eq.${establishmentId}`,
        },
        fetchData,
      )
      .on(
        'postgres',
        {
          event: '*',
          schema: 'public',
          table: 'menu_categories',
          filter: `establishment_id=eq.${establishmentId}`,
        },
        fetchData,
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [establishmentId])

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item])
    setSelectedProduct(null)
    toast({
      title: 'Adicionado à sacola',
      description: `${item.quantity}x ${item.product.name} adicionado com sucesso.`,
    })
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 border-4 border-brand-red border-t-transparent rounded-full" />
      </div>
    )
  if (!establishmentId || !establishment)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800">
        <Store className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold">Estabelecimento não encontrado</h2>
        <p className="text-slate-500 mt-2">
          Acesse através do link correto do estabelecimento.
        </p>
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 selection:bg-brand-red selection:text-white">
      <div className="bg-gradient-to-br from-brand-red to-red-700 pt-16 pb-12 px-6 text-center text-white relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/400/200?q=pattern&color=red')] opacity-20 mix-blend-overlay"></div>
        <h1 className="text-[32px] md:text-4xl font-black relative z-10 drop-shadow-sm tracking-tight leading-none">
          {establishment.name}
        </h1>
        <p className="text-red-100 text-[15px] md:text-base mt-2.5 relative z-10 font-medium">
          Clique nos itens para simular o pedido
        </p>
      </div>

      <main className="max-w-3xl mx-auto p-5 md:p-8 space-y-10 mt-2">
        {categories.map((cat) => {
          const productsInCategory = products.filter(
            (p) => p.category_id === cat.id && p.status !== 'Inativo',
          )
          if (productsInCategory.length === 0) return null
          return (
            <div key={cat.id} id={`category-${cat.id}`} className="space-y-5">
              <h2 className="font-bold text-slate-800 text-xl border-b border-slate-200/80 pb-3 tracking-tight">
                {cat.name}
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
        })}
        {products.filter((p) => p.status !== 'Inativo').length === 0 && (
          <div className="text-center py-20 text-slate-500 font-medium">
            Nenhum produto disponível no momento.
          </div>
        )}
      </main>

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

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

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
                className="w-full bg-brand-red hover:bg-red-700 text-white font-bold h-14 text-lg rounded-xl shadow-sm active:scale-95"
                onClick={() => {
                  toast({ title: 'Pedido Simulado!' })
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
