import { useState, useMemo } from 'react'
import {
  Volume2,
  MoreVertical,
  Clock,
  FileText,
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

type OrderStatus = 'ANÁLISE' | 'PREPARO' | 'ENTREGA'

interface Order {
  id: string
  customer: string
  items: string
  total: number
  time: string
  status: OrderStatus
  phone: string
  address: string
}

const initialOrders: Order[] = [
  {
    id: '#1024',
    customer: 'João Silva',
    items: '1x X-Burger, 1x Coca-Cola',
    total: 45.0,
    time: 'Há 5 min',
    status: 'ANÁLISE',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - Centro',
  },
  {
    id: '#1027',
    customer: 'Carlos Mendes',
    items: '3x Pizza Calabresa',
    total: 120.0,
    time: 'Há 2 min',
    status: 'ANÁLISE',
    phone: '(11) 99999-8888',
    address: 'Av. Paulista, 1000 - Bela Vista',
  },
  {
    id: '#1025',
    customer: 'Maria Oliveira',
    items: '2x Combo Master, 1x Fritas',
    total: 82.0,
    time: 'Há 12 min',
    status: 'PREPARO',
    phone: '(11) 91122-3344',
    address: 'Rua Augusta, 500 - Consolação',
  },
  {
    id: '#1023',
    customer: 'Ana Costa',
    items: '1x Salada Especial',
    total: 35.0,
    time: 'Há 25 min',
    status: 'ENTREGA',
    phone: '(11) 97777-6666',
    address: 'Rua Oscar Freire, 200 - Jardins',
  },
  {
    id: '#1022',
    customer: 'Pedro Santos',
    items: '4x X-Salada, 2x Guaraná',
    total: 110.0,
    time: 'Há 40 min',
    status: 'ENTREGA',
    phone: '(11) 95555-4444',
    address: 'Rua Pamplona, 300 - Jd Paulista',
  },
]

export default function OrderManager() {
  const { searchQuery } = useSearch()
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders
    const lowerQuery = searchQuery.toLowerCase()
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(lowerQuery) ||
        o.customer.toLowerCase().includes(lowerQuery) ||
        o.phone.includes(lowerQuery),
    )
  }, [orders, searchQuery])

  const openDrawer = (order: Order) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }

  const changeStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    )
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const getStatusTotal = (status: OrderStatus) => {
    return filteredOrders
      .filter((o) => o.status === status)
      .reduce((acc, curr) => acc + curr.total, 0)
      .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const getStatusCount = (status: OrderStatus) => {
    return filteredOrders.filter((o) => o.status === status).length
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
      {/* Page Header */}
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
          <Button
            variant="outline"
            className="border-slate-200 text-slate-700 bg-white hover:text-brand-red transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            Relatório Diário
          </Button>
          <Button className="bg-brand-red hover:bg-red-700 text-white shadow-sm transition-transform active:scale-95">
            <Plus className="h-4 w-4 mr-2" />
            Criar Pedido
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-hidden">
        {/* Column 1: Em Análise */}
        <div className="flex flex-col h-full bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-brand-red"></div>
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                Em Análise
                <Volume2 className="h-4 w-4 text-brand-red animate-alert-pulse" />
              </h2>
              <Badge
                variant="secondary"
                className="ml-1 bg-slate-200 hover:bg-slate-200 text-slate-700"
              >
                {getStatusCount('ANÁLISE')}
              </Badge>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              {getStatusTotal('ANÁLISE')}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-4">
            {filteredOrders
              .filter((o) => o.status === 'ANÁLISE')
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => openDrawer(order)}
                  onChangeStatus={(s) => changeStatus(order.id, s)}
                />
              ))}
          </div>
        </div>

        {/* Column 2: Em Preparo */}
        <div className="flex flex-col h-full bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-brand-orange"></div>
              <h2 className="font-bold text-slate-800">Em Preparo</h2>
              <Badge
                variant="secondary"
                className="ml-1 bg-slate-200 hover:bg-slate-200 text-slate-700"
              >
                {getStatusCount('PREPARO')}
              </Badge>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              {getStatusTotal('PREPARO')}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-4">
            {filteredOrders
              .filter((o) => o.status === 'PREPARO')
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => openDrawer(order)}
                  onChangeStatus={(s) => changeStatus(order.id, s)}
                />
              ))}
          </div>
        </div>

        {/* Column 3: Em Entrega */}
        <div className="flex flex-col h-full bg-slate-100/50 rounded-xl p-4 border border-slate-200/60">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-brand-green"></div>
              <h2 className="font-bold text-slate-800">Em Entrega</h2>
              <Badge
                variant="secondary"
                className="ml-1 bg-slate-200 hover:bg-slate-200 text-slate-700"
              >
                {getStatusCount('ENTREGA')}
              </Badge>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              {getStatusTotal('ENTREGA')}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-4">
            {filteredOrders
              .filter((o) => o.status === 'ENTREGA')
              .map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => openDrawer(order)}
                  onChangeStatus={(s) => changeStatus(order.id, s)}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Quick View Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-white p-0 border-l border-slate-200">
          {selectedOrder && (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`text-xs font-semibold px-2.5 py-1 uppercase tracking-wider ${
                        selectedOrder.status === 'ANÁLISE'
                          ? 'bg-red-50 text-brand-red border-red-200 hover:bg-red-50'
                          : selectedOrder.status === 'PREPARO'
                            ? 'bg-orange-50 text-brand-orange border-orange-200 hover:bg-orange-50'
                            : 'bg-green-50 text-brand-green border-green-200 hover:bg-green-50'
                      }`}
                      variant="outline"
                    >
                      {selectedOrder.status}
                    </Badge>
                    <span className="text-sm font-medium flex items-center text-slate-500 bg-white px-2 py-1 rounded-md border shadow-sm">
                      <Clock className="h-3 w-3 mr-1" /> {selectedOrder.time}
                    </span>
                  </div>
                  <SheetTitle className="text-2xl font-bold mt-4 mb-1">
                    Pedido {selectedOrder.id}
                  </SheetTitle>
                  <SheetDescription className="text-slate-500 font-medium">
                    Detalhes completos e ações rápidas
                  </SheetDescription>
                </SheetHeader>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-brand-red" />
                    Cliente
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

                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-brand-red" />
                    Itens do Pedido
                  </h3>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 space-y-3 border-b border-slate-100">
                      {selectedOrder.items.split(', ').map((item, idx) => {
                        const match = item.match(/(\d+)x\s(.+)/)
                        if (match) {
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                                  {match[1]}x
                                </span>
                                <span className="font-medium text-slate-700">
                                  {match[2]}
                                </span>
                              </div>
                            </div>
                          )
                        }
                        return (
                          <div key={idx} className="font-medium text-slate-700">
                            {item}
                          </div>
                        )
                      })}
                    </div>
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

              {/* Actions Footer */}
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
                      Mover para Preparo
                      <ArrowRight className="h-4 w-4 ml-2" />
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
                      Despachar para Entrega
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

function OrderCard({
  order,
  onClick,
  onChangeStatus,
}: {
  order: Order
  onClick: () => void
  onChangeStatus: (s: OrderStatus) => void
}) {
  const borderColor =
    order.status === 'ANÁLISE'
      ? 'border-brand-red'
      : order.status === 'PREPARO'
        ? 'border-brand-orange'
        : 'border-brand-green'

  return (
    <Card
      className={`relative cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md border-t-4 border-x border-b border-x-slate-200 border-b-slate-200 bg-white group ${borderColor}`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-lg group-hover:text-brand-red transition-colors">
              {order.id}
            </span>
          </div>
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
                {order.status !== 'ANÁLISE' && (
                  <DropdownMenuItem onClick={() => onChangeStatus('ANÁLISE')}>
                    Mover p/ Análise
                  </DropdownMenuItem>
                )}
                {order.status !== 'PREPARO' && (
                  <DropdownMenuItem onClick={() => onChangeStatus('PREPARO')}>
                    Mover p/ Preparo
                  </DropdownMenuItem>
                )}
                {order.status !== 'ENTREGA' && (
                  <DropdownMenuItem onClick={() => onChangeStatus('ENTREGA')}>
                    Mover p/ Entrega
                  </DropdownMenuItem>
                )}
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
  )
}
