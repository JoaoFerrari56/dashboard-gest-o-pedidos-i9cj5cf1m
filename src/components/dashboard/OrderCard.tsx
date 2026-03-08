import { useState } from 'react'
import { Order } from '@/hooks/use-orders'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, ChevronRight } from 'lucide-react'
import { OrderDetailsDialog } from './OrderDetailsDialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const NEXT_STATUS: Record<string, string | null> = {
  ANÁLISE: 'EM PREPARO',
  'EM PREPARO': 'SAIU PARA ENTREGA',
  'SAIU PARA ENTREGA': 'CONCLUÍDO',
  CONCLUÍDO: null,
}

const STATUS_LABELS: Record<string, string> = {
  'EM PREPARO': 'Preparar',
  'SAIU PARA ENTREGA': 'Enviar',
  CONCLUÍDO: 'Concluir',
}

export function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order
  onUpdateStatus: (id: string, status: string) => void
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const nextStatus = NEXT_STATUS[order.status]

  const address = order.delivery_address as any
  const addressStr = address?.street
    ? `${address.street}, ${address.number || 'S/N'}`
    : 'Retirada no local'

  const handleNextStatus = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (nextStatus) {
      onUpdateStatus(order.id, nextStatus)
    }
  }

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow border-slate-200 bg-white"
        onClick={() => setDetailsOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <h4 className="font-bold text-slate-800 leading-tight">
                {order.customer_name}
              </h4>
            </div>
            <div className="text-right">
              <div className="font-bold text-brand-red text-sm">
                {order.total_price}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {formatDistanceToNow(new Date(order.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{addressStr}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
            <Badge
              variant="outline"
              className="text-slate-500 text-[10px] font-medium uppercase tracking-wider"
            >
              {order.payment_method}
            </Badge>
            {nextStatus && (
              <Button
                size="sm"
                className="h-7 px-2 text-xs bg-brand-red hover:bg-red-700 text-white"
                onClick={handleNextStatus}
              >
                {STATUS_LABELS[nextStatus]}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <OrderDetailsDialog
        order={order}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onUpdateStatus={onUpdateStatus}
      />
    </>
  )
}
