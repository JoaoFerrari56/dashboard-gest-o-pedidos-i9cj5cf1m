import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createEstablishment } from '@/services/establishments'
import { toast } from '@/hooks/use-toast'
import { Loader2, Store, Clock, Utensils } from 'lucide-react'

export default function Onboarding() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [operatingHours, setOperatingHours] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !category || !operatingHours) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos para continuar.',
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await createEstablishment({
        name,
        category,
        operating_hours: operatingHours,
      })

      if (error) throw error

      toast({
        title: 'Estabelecimento configurado!',
        description: 'Bem-vindo ao seu novo painel de gestão.',
      })

      // Navigate to dashboard
      navigate('/', { replace: true })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description:
          error.message || 'Ocorreu um erro ao configurar o estabelecimento.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {/* Left side decoration */}
        <div className="bg-brand-red p-8 flex flex-col justify-between text-white relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/800?q=food&color=red')] opacity-10 mix-blend-overlay object-cover" />
          <div className="relative z-10">
            <Store className="h-10 w-10 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Configure sua loja</h2>
            <p className="text-red-100 text-sm leading-relaxed">
              Estamos quase lá! Precisamos de apenas mais alguns detalhes para
              personalizar o seu ambiente de gestão de pedidos e cardápio.
            </p>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 bg-red-800/30 p-3 rounded-xl backdrop-blur-sm border border-red-400/20">
              <div className="h-8 w-8 bg-red-400/30 rounded-lg flex items-center justify-center shrink-0">
                <Utensils className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Cardápio 100% digital</p>
            </div>
            <div className="flex items-center gap-3 bg-red-800/30 p-3 rounded-xl backdrop-blur-sm border border-red-400/20">
              <div className="h-8 w-8 bg-red-400/30 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Gestão ágil de pedidos</p>
            </div>
          </div>
        </div>

        {/* Right side form */}
        <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Bem-vindo(a)!</h1>
            <p className="text-sm text-slate-500 mt-1">
              Preencha os dados do seu negócio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-semibold">
                Nome do Estabelecimento
              </Label>
              <Input
                id="name"
                placeholder="Ex: Pizzaria do João"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-brand-red"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-slate-700 font-semibold"
              >
                Categoria Principal
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:ring-brand-red text-slate-700">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lanchonete">
                    Lanchonete / Burger
                  </SelectItem>
                  <SelectItem value="Pizzaria">Pizzaria</SelectItem>
                  <SelectItem value="Restaurante">
                    Restaurante / Marmitas
                  </SelectItem>
                  <SelectItem value="Doceria">Doceria / Sobremesas</SelectItem>
                  <SelectItem value="Bebidas">Bebidas / Adega</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours" className="text-slate-700 font-semibold">
                Horário de Funcionamento
              </Label>
              <Input
                id="hours"
                placeholder="Ex: Ter a Dom das 18h às 23h"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-brand-red"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-brand-red hover:bg-red-700 text-white font-bold text-base mt-4 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Finalizar Configuração'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
