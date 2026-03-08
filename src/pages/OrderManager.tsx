import { useState, useEffect, useMemo } from 'react'
import {
  Volume2,
  MoreVertical,
  Clock,
  Plus,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSearch } from '@/contexts/SearchContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

type OrderStatus = 'ANÁLISE' | 'PREPARO' | 'ENTREGA'

interface Order {
  id: string
  displayId: string
  customer: string
  items: string
  total: number
  time: string
  status: OrderStatus
  phone: string
  address: string
  observations: string
  rawItems: any[]
}

const mapDbOrder = (dbOrder: any): Order => ({
  id: dbOrder.id,
  displayId: `#${dbOrder.id.substring(0, 5).toUpperCase()}`,
  customer: dbOrder.customer_name,
  items: Array.isArray(dbOrder.order_items)
    ? dbOrder.order_items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')
    : '',
  total: parseFloat(dbOrder.total_price) || 0,
  time: new Date(dbOrder.created_at).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }),
  status: dbOrder.status as OrderStatus,
  phone: dbOrder.customer_whatsapp,
  address:
    dbOrder.delivery_address && dbOrder.delivery_address.street
      ? `${dbOrder.delivery_address.street}, ${dbOrder.delivery_address.number} - ${dbOrder.delivery_address.neighborhood}`
      : 'Retirada no local',
  observations: dbOrder.delivery_address?.observations || '',
  rawItems: Array.isArray(dbOrder.order_items) ? dbOrder.order_items : [],
})

const COLUMNS: {
  title: string
  status: OrderStatus
  color: string
  bg: string
  border: string
}[] = [
  {
    title: 'Em Análise',
    status: 'ANÁLISE',
    color: 'bg-brand-red',
    bg: 'bg-red-50 text-brand-red border-red-200',
    border: 'border-brand-red',
  },
  {
    title: 'Em Preparo',
    status: 'PREPARO',
    color: 'bg-brand-orange',
    bg: 'bg-orange-50 text-brand-orange border-orange-200',
    border: 'border-brand-orange',
  },
  {
    title: 'Em Entrega',
    status: 'ENTREGA',
    color: 'bg-brand-green',
    bg: 'bg-green-50 text-brand-green border-green-200',
    border: 'border-brand-green',
  },
]

export default function OrderManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { searchQuery } = useSearch()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [establishmentId, setEstablishmentId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data: est } = await supabase
        .from('establishments')
        .select('id')
        .eq('user_id', user!.id)
        .single()
      if (est) {
        setEstablishmentId(est.id)
        const { data } = await supabase
          .from('orders' as any)
          .select('*')
          .eq('establishment_id', est.id)
          .order('created_at', { ascending: false })
        if (data) setOrders(data.map(mapDbOrder))
      }
      setLoading(false)
    }
    load()
  }, [user])

  useEffect(() => {
    if (!establishmentId) return
    const channel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `establishment_id=eq.${establishmentId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [mapDbOrder(payload.new), ...prev])
            toast({ title: 'Novo pedido recebido!' })
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapDbOrder(payload.new)
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id ? updated : o)),
            )
            setSelectedOrder((prev) =>
              prev?.id === updated.id ? updated : prev,
            )
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
          }
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [establishmentId, toast])

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders
    const q = searchQuery.toLowerCase()
    return orders.filter(
      (o) =>
        o.displayId.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.phone.includes(q),
    )
  }, [orders, searchQuery])

  const changeStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    )
    if (selectedOrder?.id === orderId)
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
    await supabase
      .from('orders' as any)
      .update({ status: newStatus })
      .eq('id', orderId)
  }

  if (loading)
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-brand-red border-t-transparent rounded-full" />
      </div>
    )

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Pedidos em Aberto
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie o fluxo de entrega dos seus pedidos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-brand-red hover:bg-red-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Criar Pedido
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden">
        {COLUMNS.map((col) => {
          const colOrders = filteredOrders.filter(
            (o) => o.status === col.status,
          )
          return (
            <div
              key={col.status}
              className="flex flex-col h-full bg-slate-100/50 rounded-xl p-4 border border-slate-200/60"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${col.color}`} />
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    {col.title}{' '}
                    {col.status === 'ANÁLISE' && (
                      <Volume2 className="h-4 w-4 text-brand-red animate-pulse" />
                    )}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-slate-200 text-slate-700"
                  >
                    {colOrders.length}
                  </Badge>
                </div>
                <span className="text-sm font-semibold text-slate-500">
                  {colOrders
                    .reduce((a, b) => a + b.total, 0)
                    .toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-4">
                {colOrders.map((order) => (
                  <Card
                    key={order.id}
                    className={`cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md border-t-4 border-x border-b border-x-slate-200 border-b-slate-200 bg-white group ${col.border}`}
                    onClick={() => {
                      setSelectedOrder(order)
                      setIsDrawerOpen(true)
                    }}
                  >
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800 text-lg group-hover:text-brand-red transition-colors">
                          {order.displayId}
                        </span>
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-brand-red -mr-2"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              {COLUMNS.filter(
                                (c) => c.status !== order.status,
                              ).map((c) => (
                                <DropdownMenuItem
                                  key={c.status}
                                  onClick={() =>
                                    changeStatus(order.id, c.status)
                                  }
                                >
                                  Mover p/ {c.title.replace('Em ', '')}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 truncate">
                          {order.customer}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {order.items}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100">
                        <span className="font-bold text-slate-800">
                          {order.total.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                        <span className="text-xs font-medium flex items-center text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                          <Clock className="h-3 w-3 mr-1" />
                          {order.time}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-white p-0 border-l border-slate-200">
          {selectedOrder && (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    {COLUMNS.map(
                      (c) =>
                        c.status === selectedOrder.status && (
                          <Badge
                            key={c.status}
                            variant="outline"
                            className={`text-xs font-semibold px-2.5 py-1 uppercase tracking-wider ${c.bg}`}
                          >
                            {c.status}
                          </Badge>
                        ),
                    )}
                    <span className="text-sm font-medium flex items-center text-slate-500 bg-white px-2 py-1 rounded-md border shadow-sm">
                      <Clock className="h-3 w-3 mr-1" /> {selectedOrder.time}
                    </span>
                  </div>
                  <SheetTitle className="text-2xl font-bold mt-4 mb-1">
                    Pedido {selectedOrder.displayId}
                  </SheetTitle>
                  <SheetDescription className="text-slate-500 font-medium">
                    Detalhes completos e ações rápidas
                  </SheetDescription>
                </SheetHeader>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-brand-red" /> Cliente
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Nome</span>
                      <span className="font-semibold text-slate-800">
                        {selectedOrder.customer}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Telefone</span>
                      <span className="font-medium text-slate-700 flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-slate-400" />
                        {selectedOrder.phone}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500 text-sm">Endereço</span>
                      <span className="font-medium text-slate-700 text-right flex items-start max-w-[200px]">
                        <MapPin className="h-3.5 w-3.5 mr-1 mt-0.5 text-slate-400 shrink-0" />
                        {selectedOrder.address}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-brand-red" />{' '}
                    Itens do Pedido
                  </h3>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 space-y-3 border-b border-slate-100">
                      {selectedOrder.rawItems.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-slate-700">
                              {item.name}
                            </span>
                          </div>
                          {item.variation && (
                            <div className="pl-10 text-xs text-slate-500">
                              Variação: {item.variation}
                            </div>
                          )}
                          {item.complements?.map((c: string, i: number) => (
                            <div
                              key={i}
                              className="pl-10 text-xs text-slate-500"
                            >
                              + {c}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    {selectedOrder.observations && (
                      <div className="p-4 bg-amber-50 border-b border-slate-100">
                        <span className="font-bold text-amber-800 text-xs uppercase block mb-1">
                          Observações
                        </span>
                        <p className="text-amber-900 text-sm leading-relaxed">
                          {selectedOrder.observations}
                        </p>
                      </div>
                    )}
                    <div className="bg-slate-50 p-4 flex justify-between items-center">
                      <span className="font-semibold text-slate-600">
                        Total
                      </span>
                      <span className="text-xl font-bold text-slate-800">
                        {selectedOrder.total.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 bg-white">
                <div className="flex gap-3">
                  {selectedOrder.status === 'ANÁLISE' && (
                    <Button
                      className="w-full bg-brand-orange hover:bg-orange-600 text-white"
                      onClick={() => {
                        changeStatus(selectedOrder.id, 'PREPARO')
                        setIsDrawerOpen(false)
                      }}
                    >
                      Mover para Preparo <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                  {selectedOrder.status === 'PREPARO' && (
                    <Button
                      className="w-full bg-brand-green hover:bg-green-600 text-white"
                      onClick={() => {
                        changeStatus(selectedOrder.id, 'ENTREGA')
                        setIsDrawerOpen(false)
                      }}
                    >
                      Despachar para Entrega{' '}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                  {selectedOrder.status === 'ENTREGA' && (
                    <Button
                      variant="outline"
                      className="w-full hover:text-brand-red transition-colors"
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      Fechar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
