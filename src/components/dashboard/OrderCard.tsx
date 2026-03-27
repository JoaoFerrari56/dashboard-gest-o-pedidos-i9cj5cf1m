import { useState } from 'react'
import { Order } from '@/hooks/use-orders'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, ChevronRight, Trash2 } from 'lucide-react'
import { OrderDetailsDialog } from './OrderDetailsDialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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
  onDeleteOrder,
}: {
  order: Order
  onUpdateStatus: (id: string, status: string) => void
  onDeleteOrder: (id: string) => void
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDragging, setIsDragging] = useState(false)

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteConfirmText('')
    setDeleteOpen(true)
  }

  const confirmDelete = () => {
    if (deleteConfirmText === 'excluir') {
      onDeleteOrder(order.id)
      setDeleteOpen(false)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('orderId', order.id)
    setTimeout(() => setIsDragging(true), 0)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <>
      <Card
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={cn(
          'cursor-grab active:cursor-grabbing hover:shadow-md transition-all border-slate-200 bg-white relative group',
          isDragging && 'opacity-50 scale-95',
        )}
      >
        {/* Overlay interativo: Permite clicar no card sem violar a regra de elementos aninhados (button dentro de button) */}
        <div
          className="absolute inset-0 z-0 cursor-pointer"
          onClick={() => setDetailsOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setDetailsOpen(true)
            }
          }}
          aria-label={`Ver detalhes do pedido de ${order.customer_name}`}
        />

        <CardContent className="p-4 relative z-10 flex flex-col h-full pointer-events-none">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-0.5">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <h4 className="font-bold text-slate-800 leading-tight">
                {order.customer_name}
              </h4>
            </div>
            <div className="flex flex-col items-end gap-1 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-300 hover:text-brand-red hover:bg-red-50 -mr-2 -mt-2 transition-colors relative z-20"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="font-bold text-brand-red text-sm mt-1">
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

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 pointer-events-auto">
            <Badge
              variant="outline"
              className="text-slate-500 text-[10px] font-medium uppercase tracking-wider relative z-20"
            >
              {order.payment_method}
            </Badge>
            {nextStatus && (
              <Button
                size="sm"
                className="h-7 px-2 text-xs bg-brand-red hover:bg-red-700 text-white transition-transform hover:scale-105 active:scale-95 relative z-20"
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

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent
          className="sm:max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="text-brand-red flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Excluir Pedido
            </DialogTitle>
            <DialogDescription className="pt-2">
              Você está prestes a excluir o pedido de{' '}
              <strong>{order.customer_name}</strong>. Esta ação não pode ser
              desfeita. Para confirmar, digite a palavra{' '}
              <strong>excluir</strong> abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="confirmDelete" className="text-slate-700">
              Confirmação de segurança
            </Label>
            <Input
              id="confirmDelete"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Digite excluir"
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== 'excluir'}
              onClick={confirmDelete}
            >
              Excluir Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
