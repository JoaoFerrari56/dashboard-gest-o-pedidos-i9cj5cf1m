import { useState } from 'react'
import { EyeOff, ShoppingBag, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import type {
  Category,
  Product,
  Variation,
  ComplementItem,
} from '@/types/cardapio'
import { getDisplayPrice, parsePrice } from '@/utils/cardapio'

interface CartItem {
  id: string
  product: Product
  variation?: Variation
  complements: { groupName: string; item: ComplementItem }[]
  quantity: number
}

export function PreviewPanel({
  menuName,
  menuStatus,
  categories,
  products,
  establishmentId,
}: {
  menuName: string
  menuStatus: string
  categories: Category[]
  products: Product[]
  establishmentId?: string | null
}) {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddToCart = (product: Product) => {
    if (product.status !== 'Ativo') {
      toast({
        title: 'Item indisponível',
        description: 'Este produto não pode ser adicionado no momento.',
        variant: 'destructive',
      })
      return
    }

    const variation =
      product.variations && product.variations.length > 0
        ? product.variations[0]
        : undefined
    const complements = []

    if (product.complementGroups && product.complementGroups.length > 0) {
      const group = product.complementGroups[0]
      if (group.items && group.items.length > 0) {
        complements.push({ groupName: group.name, item: group.items[0] })
      }
    }

    const newItem: CartItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      product,
      variation,
      complements,
      quantity: 1,
    }

    setCartItems((prev) => [...prev, newItem])
    toast({
      title: 'Adicionado à sacola',
      description: `${product.name} foi adicionado para teste.`,
    })
  }

  const removeCartItem = (id: string) =>
    setCartItems(cartItems.filter((item) => item.id !== id))

  const getItemTotal = (item: CartItem) => {
    const basePrice = item.variation
      ? parsePrice(item.variation.price)
      : parsePrice(item.product.price)
    const compsPrice = item.complements.reduce(
      (sum, c) => sum + parsePrice(c.item.price),
      0,
    )
    return (basePrice + compsPrice) * item.quantity
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + getItemTotal(item),
    0,
  )
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = async () => {
    if (!establishmentId) {
      toast({
        title: 'Erro',
        description: 'Estabelecimento não configurado.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const orderItems = cartItems.map((item) => ({
        quantity: item.quantity,
        name: item.product.name,
        variation: item.variation?.name,
        complements: item.complements.map((c) => c.item.name),
      }))

      const { error } = await supabase.from('orders' as any).insert({
        establishment_id: establishmentId,
        customer_name: 'Cliente Teste (Preview)',
        customer_whatsapp: '(11) 99999-9999',
        delivery_address: {
          street: 'Rua Fictícia',
          number: '123',
          neighborhood: 'Bairro Teste',
          city: 'Cidade Teste',
        },
        payment_method: 'PIX',
        order_items: orderItems,
        total_price: cartTotal.toFixed(2),
        status: 'ANÁLISE',
      })

      if (error) throw error

      toast({
        title: 'Pedido Teste Enviado!',
        description: 'Verifique a aba de Pedidos para gerenciar.',
      })
      setCartItems([])
      setIsCartOpen(false)
    } catch (e: any) {
      toast({
        title: 'Erro ao enviar pedido',
        description: e.message,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-100 rounded-[2.5rem] p-3 shadow-xl border-[10px] border-slate-800 relative h-full w-full max-w-[380px] mx-auto flex flex-col overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-30"></div>

      <div className="bg-white flex-1 rounded-[1.7rem] overflow-y-auto no-scrollbar shadow-inner relative flex flex-col z-20">
        <div className="bg-gradient-to-br from-brand-red to-red-700 pt-14 pb-8 px-6 text-center text-white relative overflow-hidden shrink-0 shadow-sm">
          <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/400/200?q=pattern&color=red')] opacity-20 mix-blend-overlay"></div>
          <h2 className="text-2xl font-black relative z-10 drop-shadow-sm">
            {menuName || 'Meu Cardápio'}
          </h2>
          <p className="text-red-100 text-xs mt-1.5 relative z-10 font-medium">
            Clique nos itens para simular o pedido
          </p>
        </div>

        {menuStatus === 'Oculto' && (
          <div className="bg-orange-50 border-b border-orange-100 p-2.5 text-center shrink-0">
            <span className="text-xs font-bold text-orange-600 flex items-center justify-center gap-1.5 uppercase tracking-wide">
              <EyeOff className="h-3.5 w-3.5" /> Cardápio Oculto
            </span>
          </div>
        )}

        <div className="p-5 space-y-8 flex-1 bg-slate-50/30">
          {categories.map((cat) => {
            const catProducts = products.filter(
              (p) => p.category_id === cat.id && p.status !== 'Inativo',
            )
            if (catProducts.length === 0) return null

            return (
              <div key={cat.id} className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b-2 border-slate-100 pb-2">
                  {cat.name}
                </h3>
                <div className="space-y-4">
                  {catProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleAddToCart(p)}
                      className={cn(
                        'flex gap-3 group relative bg-white p-3 rounded-2xl shadow-sm border border-slate-100/50 transition-all',
                        p.status === 'Ativo'
                          ? 'cursor-pointer hover:border-brand-red/50 hover:shadow-md'
                          : 'opacity-70',
                      )}
                    >
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-brand-red transition-colors pr-2">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1 pr-2">
                            {p.description}
                          </p>
                        </div>
                        <div className="font-bold text-slate-800 text-sm mt-3 flex flex-wrap items-center gap-2">
                          {getDisplayPrice(p)}
                          {p.status === 'Em falta' && (
                            <span className="text-[9px] text-brand-red uppercase font-black bg-red-50 px-1.5 py-0.5 rounded-sm">
                              Esgotado
                            </span>
                          )}
                          {p.complementGroups &&
                            p.complementGroups.length > 0 && (
                              <span className="text-[9px] text-brand-orange bg-orange-50 px-1.5 py-0.5 rounded-sm border border-orange-100 font-semibold">
                                + Opções
                              </span>
                            )}
                        </div>
                      </div>
                      {p.image && (
                        <div className="h-24 w-24 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100 relative">
                          <img
                            src={p.image}
                            className={`h-full w-full object-cover ${p.status === 'Em falta' ? 'grayscale opacity-50' : ''}`}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {products.filter((p) => p.status !== 'Inativo').length === 0 && (
            <div className="text-center py-12 opacity-50 flex flex-col items-center justify-center h-full">
              <Layers className="h-12 w-12 text-slate-400 mb-3" />
              <p className="text-sm font-bold text-slate-600">Cardápio vazio</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                Os produtos visíveis aparecerão aqui para seus clientes.
              </p>
            </div>
          )}
        </div>

        {products.filter((p) => p.status !== 'Inativo').length > 0 && (
          <div className="sticky bottom-6 left-0 right-0 px-5 mt-auto z-20">
            <div
              className={cn(
                'text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer transition-all active:scale-95',
                totalItems > 0
                  ? 'bg-brand-red hover:bg-red-700'
                  : 'bg-slate-800 hover:bg-slate-700',
              )}
              onClick={() => setIsCartOpen(true)}
            >
              <span className="bg-black/20 px-2.5 py-1 rounded-lg text-xs font-bold shadow-inner">
                {totalItems} itens
              </span>
              <span className="font-bold text-sm">Ver Resumo do Pedido</span>
              <span className="font-bold text-sm shadow-sm">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        )}
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-slate-50 border-l border-slate-200">
          <div className="p-6 border-b border-slate-200 bg-white shadow-sm z-10">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <ShoppingBag className="h-5 w-5 text-brand-red" /> Resumo do
                Pedido
              </SheetTitle>
              <SheetDescription className="text-slate-500">
                Revise os itens selecionados antes de finalizar.
              </SheetDescription>
            </SheetHeader>
          </div>
          <ScrollArea className="flex-1 p-6 relative">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                <ShoppingBag className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600 font-medium">
                  Sua sacola está vazia.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm">
                          {item.quantity}x {item.product.name}
                        </h4>
                        {item.variation && (
                          <p className="text-xs text-slate-500 mt-1">
                            Variação:{' '}
                            <span className="font-semibold text-slate-700">
                              {item.variation.name}
                            </span>
                          </p>
                        )}
                        {item.complements.length > 0 && (
                          <div className="mt-3 space-y-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {item.complements.map((c, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center text-xs text-slate-600"
                              >
                                <span>+ {c.item.name}</span>
                                <span className="text-slate-500 font-medium">
                                  R$ {c.item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end">
                        <p className="font-bold text-brand-green text-sm">
                          R$ {getItemTotal(item).toFixed(2).replace('.', ',')}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCartItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2 mt-2 -mr-2 text-xs font-semibold"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 shrink-0">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-xl font-bold text-slate-800">
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            <Button
              className="w-full bg-brand-red hover:bg-red-700 text-white font-bold h-12 text-lg rounded-xl shadow-sm"
              disabled={cartItems.length === 0 || isSubmitting}
              onClick={handleCheckout}
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Pedido'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
