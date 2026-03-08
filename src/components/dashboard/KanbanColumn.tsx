import { Order } from '@/hooks/use-orders'
import { OrderCard } from './OrderCard'
import { Badge } from '@/components/ui/badge'

export function KanbanColumn({
  status,
  label,
  orders,
  onUpdateStatus,
}: {
  status: string
  label: string
  orders: Order[]
  onUpdateStatus: (id: string, status: string) => void
}) {
  return (
    <div className="flex-shrink-0 w-[320px] bg-slate-50 rounded-xl flex flex-col h-full max-h-[800px]">
      <div className="p-4 flex items-center justify-between border-b border-slate-200">
        <h3 className="font-semibold text-slate-700">{label}</h3>
        <Badge
          variant="secondary"
          className="bg-slate-200 text-slate-700 hover:bg-slate-200"
        >
          {orders.length}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {orders.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-8">
            Nenhum pedido no momento
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  )
}
