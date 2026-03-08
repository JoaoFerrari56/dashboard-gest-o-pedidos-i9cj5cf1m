import { useState } from 'react'
import { Order } from '@/hooks/use-orders'
import { OrderCard } from './OrderCard'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function KanbanColumn({
  status,
  label,
  orders,
  onUpdateStatus,
  onDeleteOrder,
}: {
  status: string
  label: string
  orders: Order[]
  onUpdateStatus: (id: string, status: string) => void
  onDeleteOrder: (id: string) => void
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Necessary to allow dropping
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const orderId = e.dataTransfer.getData('orderId')
    if (orderId) {
      // Only update if it's moving to a new column
      const draggedOrder = orders.find((o) => o.id === orderId)
      if (!draggedOrder) {
        onUpdateStatus(orderId, status)
      }
    }
  }

  return (
    <div
      className={cn(
        'flex-shrink-0 w-[320px] bg-slate-50/80 rounded-xl flex flex-col h-full max-h-[800px] border-2 transition-all duration-200',
        isDragOver
          ? 'border-brand-red/50 bg-brand-red/5 shadow-inner'
          : 'border-slate-200/50',
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-200/80 bg-slate-100/50 rounded-t-xl">
        <h3 className="font-bold text-slate-700 uppercase tracking-wider text-sm">
          {label}
        </h3>
        <Badge
          variant="secondary"
          className="bg-slate-200 text-slate-700 hover:bg-slate-200"
        >
          {orders.length}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center border-2 border-dashed border-slate-200 rounded-lg">
            <span className="text-sm font-medium text-slate-400">
              Nenhum pedido
            </span>
            {isDragOver && (
              <span className="text-xs text-brand-red mt-1">Solte aqui!</span>
            )}
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
              onDeleteOrder={onDeleteOrder}
            />
          ))
        )}
      </div>
    </div>
  )
}
