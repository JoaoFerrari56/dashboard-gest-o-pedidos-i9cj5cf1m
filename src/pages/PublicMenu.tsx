import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ShoppingBag,
  Store,
  Bike,
  Plus,
  Minus,
  ArrowLeft,
  Trash2,
  Search,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { cn } from '@/lib/utils'

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

  const [activeEstablishmentId, setActiveEstablishmentId] = useState<
    string | null
  >(establishmentId)
  const [loading, setLoading] = useState(true)
  const [establishment, setEstablishment] = useState<any>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [searchQuery, setSearchQuery] = useState('')

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')

  // Structured Address
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'cash'>(
    'pix',
  )
  const [observations, setObservations] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const isAddressValid =
    street.trim().length > 0 &&
    number.trim().length > 0 &&
    neighborhood.trim().length > 0 &&
    city.trim().length > 0
  const isCheckoutValid =
    customerName.trim().length > 2 &&
    customerPhone.trim().length >= 10 &&
    (orderType === 'pickup' || isAddressValid)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let targetId = activeEstablishmentId

        if (!targetId) {
          // If no ID provided, load the first establishment as a fallback for demo purposes
          const { data } = await supabase
            .from('establishments')
            .select('id')
            .limit(1)
            .single()
          if (data) {
            setActiveEstablishmentId(data.id)
            return // Will re-trigger effect
          } else {
            setLoading(false)
            return
          }
        }

        const [estRes, catRes, itemsRes] = await Promise.all([
          supabase
            .from('establishments')
            .select('*')
            .eq('id', targetId)
            .single(),
          supabase
            .from('menu_categories')
            .select('*')
            .eq('establishment_id', targetId)
            .order('sort_order'),
          supabase
            .from('menu_items')
            .select('*')
            .eq('establishment_id', targetId)
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

    if (!activeEstablishmentId) return

    const channel = supabase
      .channel('public-menu-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'establishments',
          filter: `id=eq.${activeEstablishmentId}`,
        },
        fetchData,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items',
          filter: `establishment_id=eq.${activeEstablishmentId}`,
        },
        fetchData,
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_categories',
          filter: `establishment_id=eq.${activeEstablishmentId}`,
        },
        fetchData,
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeEstablishmentId])

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item])
    setSelectedProduct(null)
    toast({
      title: 'Adicionado à sacola',
      description: `${item.quantity}x ${item.product.name} adicionado com sucesso.`,
    })
  }

  const updateCartItemQuantity = (id: string, delta: number) => {
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const newQuantity = item.quantity + delta
              if (newQuantity <= 0) return null
              const unitPrice = item.totalPrice / item.quantity
              return {
                ...item,
                quantity: newQuantity,
                totalPrice: unitPrice * newQuantity,
              }
            }
            return item
          })
          .filter(Boolean) as CartItem[],
    )
  }

  const handleIncrement = (product: Product) => {
    const hasOptions =
      (product.variations && product.variations.length > 0) ||
      (product.complementGroups && product.complementGroups.length > 0)
    if (hasOptions) {
      setSelectedProduct(product)
    } else {
      const existing = cartItems.find((item) => item.product.id === product.id)
      if (existing) {
        updateCartItemQuantity(existing.id, 1)
        toast({
          title: 'Quantidade atualizada',
          description: `Mais 1x ${product.name} adicionado.`,
        })
      } else {
        setCartItems([
          ...cartItems,
          {
            id: Date.now().toString(),
            product,
            complements: [],
            quantity: 1,
            totalPrice: parsePrice(product.price),
          },
        ])
        toast({
          title: 'Adicionado à sacola',
          description: `1x ${product.name} adicionado.`,
        })
      }
    }
  }

  const handleDecrement = (product: Product) => {
    const itemsOfProduct = cartItems.filter(
      (item) => item.product.id === product.id,
    )
    if (itemsOfProduct.length === 0) return
    updateCartItemQuantity(itemsOfProduct[itemsOfProduct.length - 1].id, -1)
  }

  const handleFinalizeOrder = async () => {
    if (!establishment) return
    setIsSubmitting(true)

    try {
      const orderItems = cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.totalPrice,
        variation: item.variation?.name,
        complements: item.complements.map((c) => c.item.name),
      }))

      const delivery_address =
        orderType === 'delivery'
          ? { street, number, neighborhood, city, observations }
          : { observations }

      const { error } = await supabase.from('orders').insert({
        establishment_id: establishment.id,
        customer_name: customerName,
        customer_whatsapp: customerPhone,
        delivery_address,
        payment_method: paymentMethod,
        order_items: orderItems,
        total_price: cartTotal.toString(),
        status: 'ANÁLISE',
      })

      if (error) throw error

      toast({
        title: 'Pedido realizado com sucesso!',
        description:
          'Seu pedido foi recebido e já está em análise pelo restaurante.',
        className: 'bg-green-50 text-green-900 border-green-200',
      })

      setCartItems([])
      setIsCartOpen(false)
      setCheckoutStep('cart')
      setCustomerName('')
      setCustomerPhone('')
      setStreet('')
      setNumber('')
      setNeighborhood('')
      setCity('')
      setObservations('')
    } catch (err: any) {
      toast({
        title: 'Erro ao enviar pedido',
        description: err.message || 'Tente novamente',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 border-4 border-brand-red border-t-transparent rounded-full" />
      </div>
    )
  if (!activeEstablishmentId || !establishment)
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
          Faça seu pedido abaixo
        </p>
      </div>

      <main className="max-w-3xl mx-auto p-5 md:p-8 space-y-8 mt-2">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Buscar no cardápio..."
            className="pl-10 bg-white border-slate-200 h-12 shadow-sm rounded-xl text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {categories.map((cat) => {
          const productsInCategory = products.filter((p) => {
            if (p.category_id !== cat.id || p.status === 'Inativo') return false
            if (!searchQuery) return true
            const q = searchQuery.toLowerCase()
            return (
              p.name.toLowerCase().includes(q) ||
              (p.description && p.description.toLowerCase().includes(q))
            )
          })

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
                    cartQuantity={cartItems
                      .filter((item) => item.product.id === p.id)
                      .reduce((sum, item) => sum + item.quantity, 0)}
                    onIncrement={() => handleIncrement(p)}
                    onDecrement={() => handleDecrement(p)}
                    onClick={() => setSelectedProduct(p)}
                  />
                ))}
              </div>
            </div>
          )
        })}
        {products.filter((p) => {
          if (p.status === 'Inativo') return false
          if (!searchQuery) return true
          const q = searchQuery.toLowerCase()
          return (
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
          )
        }).length === 0 && (
          <div className="text-center py-20 text-slate-500 font-medium">
            {searchQuery
              ? 'Nenhum item encontrado para sua busca.'
              : 'Nenhum produto disponível no momento.'}
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

      <Sheet
        open={isCartOpen}
        onOpenChange={(open) => {
          setIsCartOpen(open)
          if (!open) setTimeout(() => setCheckoutStep('cart'), 300)
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col bg-slate-50 border-l border-slate-200 focus-visible:outline-none"
        >
          <div className="p-5 border-b border-slate-200 bg-white shadow-sm z-10 flex items-center justify-between">
            <SheetHeader className="text-left space-y-0 w-full">
              <SheetTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                {checkoutStep === 'checkout' ? (
                  <>
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="mr-1 hover:bg-slate-100 p-1.5 rounded-md transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    Finalizar Pedido
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5 text-brand-red" />
                    Sua Sacola
                  </>
                )}
              </SheetTitle>
            </SheetHeader>
          </div>

          <ScrollArea className="flex-1 relative">
            <div className="p-5 space-y-6">
              {checkoutStep === 'cart' ? (
                cartItems.length === 0 ? (
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
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 leading-tight pr-4">
                              {item.product.name}
                            </h4>
                            <span className="font-bold text-slate-800 shrink-0">
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
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
                              <button
                                onClick={() =>
                                  updateCartItemQuantity(item.id, -1)
                                }
                                className="h-7 w-7 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-bold text-slate-800 text-sm w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateCartItemQuantity(item.id, 1)
                                }
                                className="h-7 w-7 flex items-center justify-center rounded-md bg-white text-brand-red shadow-sm hover:bg-red-50"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                setCartItems((prev) =>
                                  prev.filter((i) => i.id !== item.id),
                                )
                              }
                              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-8 pb-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">
                      Seus Dados
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Nome Completo</Label>
                        <Input
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ex: João da Silva"
                          className="bg-white mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Telefone (WhatsApp)</Label>
                        <Input
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="(00) 00000-0000"
                          className="bg-white mt-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">
                      Entrega ou Retirada?
                    </h3>
                    <RadioGroup
                      value={orderType}
                      onValueChange={(v: any) => setOrderType(v)}
                      className="flex gap-4"
                    >
                      <label
                        className={cn(
                          'flex-1 border rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer transition-colors bg-white',
                          orderType === 'delivery'
                            ? 'border-brand-red bg-red-50 text-brand-red'
                            : 'border-slate-200 hover:border-brand-red/50',
                        )}
                      >
                        <RadioGroupItem value="delivery" className="sr-only" />
                        <Bike className="h-6 w-6" />
                        <span className="font-medium text-sm">Entrega</span>
                      </label>
                      <label
                        className={cn(
                          'flex-1 border rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer transition-colors bg-white',
                          orderType === 'pickup'
                            ? 'border-brand-red bg-red-50 text-brand-red'
                            : 'border-slate-200 hover:border-brand-red/50',
                        )}
                      >
                        <RadioGroupItem value="pickup" className="sr-only" />
                        <Store className="h-6 w-6" />
                        <span className="font-medium text-sm">Retirada</span>
                      </label>
                    </RadioGroup>
                  </div>

                  {orderType === 'delivery' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <h3 className="font-bold text-slate-800 text-lg">
                        Endereço de Entrega
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label>Rua</Label>
                          <Input
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="Ex: Rua das Flores"
                            className="bg-white mt-1.5"
                          />
                        </div>
                        <div className="flex gap-3">
                          <div className="w-1/3">
                            <Label>Número</Label>
                            <Input
                              value={number}
                              onChange={(e) => setNumber(e.target.value)}
                              placeholder="Ex: 123"
                              className="bg-white mt-1.5"
                            />
                          </div>
                          <div className="w-2/3">
                            <Label>Bairro</Label>
                            <Input
                              value={neighborhood}
                              onChange={(e) => setNeighborhood(e.target.value)}
                              placeholder="Ex: Centro"
                              className="bg-white mt-1.5"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Cidade</Label>
                          <Input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Ex: São Paulo"
                            className="bg-white mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">
                      Forma de Pagamento
                    </h3>
                    <Select
                      value={paymentMethod}
                      onValueChange={(v: any) => setPaymentMethod(v)}
                    >
                      <SelectTrigger className="w-full h-12 bg-white">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="card">
                          Cartão (Crédito/Débito)
                        </SelectItem>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">
                      Observações do Pedido
                    </h3>
                    <Textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Ex: Tirar cebola, troco para R$ 50..."
                      className="resize-none bg-white"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {cartItems.length > 0 && (
            <div className="p-5 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 shrink-0">
              <div className="flex justify-between text-xl font-black text-slate-800 mb-5">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {checkoutStep === 'cart' ? (
                <Button
                  className="w-full bg-brand-red hover:bg-red-700 text-white font-bold h-14 text-lg rounded-xl shadow-sm active:scale-95 transition-all"
                  onClick={() => setCheckoutStep('checkout')}
                >
                  Avançar para Pagamento
                </Button>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 text-lg rounded-xl shadow-sm active:scale-95 transition-all"
                  onClick={handleFinalizeOrder}
                  disabled={!isCheckoutValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{' '}
                      Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" /> Enviar Pedido
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
