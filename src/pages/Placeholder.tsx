import { useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Settings, Wrench } from 'lucide-react'

export default function Placeholder() {
  const location = useLocation()

  const pageName =
    location.pathname.replace('/', '').charAt(0).toUpperCase() +
    location.pathname.slice(2)

  return (
    <div className="flex flex-col gap-6 h-full min-h-[60vh] justify-center items-center">
      <Card className="max-w-md w-full border-none shadow-sm text-center py-12">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center">
            <Wrench className="h-10 w-10 text-brand-blue" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Página em Construção
          </h2>
          <p className="text-slate-500 max-w-xs mx-auto">
            A seção{' '}
            <strong className="text-slate-700">
              {pageName || 'solicitada'}
            </strong>{' '}
            está sendo desenvolvida e estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
