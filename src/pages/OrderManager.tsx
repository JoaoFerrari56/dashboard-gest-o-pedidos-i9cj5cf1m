import { useMemo } from 'react'
import { useOrders } from '@/hooks/use-orders'
import { KanbanBoard } from '@/components/dashboard/KanbanBoard'
import { OrderStats } from '@/components/dashboard/OrderStats'
import { useSearch } from '@/contexts/SearchContext'

export default function OrderManager() {
  const { orders, loading, updateStatus, deleteOrder } = useOrders()
  const { searchQuery } = useSearch()

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders
    const q = searchQuery.toLowerCase()
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_whatsapp.includes(q),
    )
  }, [orders, searchQuery])

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gerenciador de Pedidos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe o fluxo de entrega, gerencie status e fature suas vendas.
          </p>
        </div>
      </div>

      <OrderStats orders={filteredOrders} />

      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          orders={filteredOrders}
          loading={loading}
          onUpdateStatus={updateStatus}
          onDeleteOrder={deleteOrder}
        />
      </div>
    </div>
  )
}
