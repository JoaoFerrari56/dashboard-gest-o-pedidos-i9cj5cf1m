import { Order } from '@/hooks/use-orders'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const NEXT_STATUS: Record<string, string | null> = {
  ANÁLISE: 'EM PREPARO',
  'EM PREPARO': 'SAIU PARA ENTREGA',
  'SAIU PARA ENTREGA': 'CONCLUÍDO',
  CONCLUÍDO: null,
}

const STATUS_LABELS: Record<string, string> = {
  'EM PREPARO': 'Mover para Em Preparo',
  'SAIU PARA ENTREGA': 'Mover para Entrega',
  CONCLUÍDO: 'Marcar como Concluído',
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
}: {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (id: string, status: string) => void
}) {
  const address = order.delivery_address as any
  const items = (order.order_items as any[]) || []
  const nextStatus = NEXT_STATUS[order.status]

  const handleNextStatus = () => {
    if (nextStatus) {
      onUpdateStatus(order.id, nextStatus)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-xl">
              Pedido #{order.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
            <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none">
              {order.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Realizado em{' '}
            {format(new Date(order.created_at), "dd 'de' MMMM 'às' HH:mm", {
              locale: ptBR,
            })}
          </p>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div>
            <h4 className="font-semibold text-slate-800 text-sm mb-1 uppercase tracking-wider">
              Cliente
            </h4>
            <div className="text-sm">
              <p className="font-medium text-slate-800">
                {order.customer_name}
              </p>
              <p className="text-slate-500">{order.customer_whatsapp}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-slate-800 text-sm mb-1 uppercase tracking-wider">
              Entrega
            </h4>
            {address?.street ? (
              <div className="text-sm text-slate-700">
                <p>
                  {address.street}, {address.number}
                </p>
                {address.complement && <p>{address.complement}</p>}
                <p>
                  {address.neighborhood}
                  {address.city ? `, ${address.city}` : ''}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Retirada no local</p>
            )}
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold text-slate-800 text-sm mb-2 uppercase tracking-wider">
              Itens do Pedido
            </h4>
            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div className="flex gap-2">
                    <span className="font-medium text-slate-800">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="text-slate-800">{item.name}</p>
                      {item.notes && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Obs: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-slate-700 whitespace-nowrap ml-4">
                    R${' '}
                    {((item.price || 0) * (item.quantity || 1))
                      .toFixed(2)
                      .replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span className="text-brand-red">{order.total_price}</span>
          </div>
          <div className="text-sm text-right text-slate-500 mt-[-12px]">
            Pagamento: {order.payment_method}
          </div>

          {nextStatus && (
            <div className="pt-4">
              <Button
                className="w-full bg-brand-red hover:bg-red-700 text-white"
                onClick={handleNextStatus}
              >
                {STATUS_LABELS[nextStatus]}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
