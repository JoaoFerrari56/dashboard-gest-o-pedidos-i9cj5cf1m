import { Order } from '@/hooks/use-orders'
import { KanbanColumn } from './KanbanColumn'
import { Skeleton } from '@/components/ui/skeleton'

const COLUMNS = [
  { id: 'ANÁLISE', label: 'Análise' },
  { id: 'EM PREPARO', label: 'Em Preparo' },
  { id: 'SAIU PARA ENTREGA', label: 'Saiu para Entrega' },
  { id: 'CONCLUÍDO', label: 'Concluído' },
]

export function KanbanBoard({
  orders,
  loading,
  onUpdateStatus,
}: {
  orders: Order[]
  loading: boolean
  onUpdateStatus: (id: string, status: string) => void
}) {
  if (loading && orders.length === 0) {
    return (
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[320px] bg-slate-50 rounded-xl p-4 flex flex-col gap-4"
          >
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          status={col.id}
          label={col.label}
          orders={orders.filter((o) => o.status === col.id)}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  )
}
