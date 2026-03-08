import { useOrders } from '@/hooks/use-orders'
import { KanbanBoard } from '@/components/dashboard/KanbanBoard'
import { OrderStats } from '@/components/dashboard/OrderStats'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Index() {
  const { orders, loading, updateStatus, createMockOrder } = useOrders()

  return (
    <div className="flex flex-col gap-6 h-full min-h-[calc(100vh-6rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard de Pedidos
          </h1>
          <p className="text-slate-500 mt-1">
            Acompanhe seus pedidos em tempo real
          </p>
        </div>
        <Button
          onClick={createMockOrder}
          className="bg-brand-red hover:bg-red-700 text-white rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Pedido Teste
        </Button>
      </div>

      <OrderStats orders={orders} />

      <div className="flex-1 overflow-hidden min-h-[500px] bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <KanbanBoard
          orders={orders}
          loading={loading}
          onUpdateStatus={updateStatus}
        />
      </div>
    </div>
  )
}
