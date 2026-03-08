import { Order } from '@/hooks/use-orders'
import { Card, CardContent } from '@/components/ui/card'
import { Package, TrendingUp, DollarSign, Clock } from 'lucide-react'

export function OrderStats({ orders }: { orders: Order[] }) {
  const totalOrders = orders.length
  const pendingOrders = orders.filter(
    (o) => o.status === 'ANÁLISE' || o.status === 'EM PREPARO',
  ).length
  const completedOrders = orders.filter((o) => o.status === 'CONCLUÍDO').length

  const revenue = orders
    .filter((o) => o.status === 'CONCLUÍDO')
    .reduce((acc, o) => {
      const priceStr = String(o.total_price)
        .replace(/[^0-9,.-]+/g, '')
        .replace(',', '.')
      const price = parseFloat(priceStr) || 0
      return acc + price
    }, 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total de Pedidos"
        value={totalOrders}
        icon={<Package className="h-5 w-5 text-brand-red" />}
      />
      <StatCard
        title="Em Andamento"
        value={pendingOrders}
        icon={<Clock className="h-5 w-5 text-orange-500" />}
      />
      <StatCard
        title="Concluídos"
        value={completedOrders}
        icon={<TrendingUp className="h-5 w-5 text-green-500" />}
      />
      <StatCard
        title="Receita (Concluídos)"
        value={`R$ ${revenue.toFixed(2).replace('.', ',')}`}
        icon={<DollarSign className="h-5 w-5 text-blue-500" />}
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <Card className="border-none shadow-sm rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-slate-600 font-medium mb-4">
          {icon}
          {title}
        </div>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
      </CardContent>
    </Card>
  )
}
