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
import { createEstablishment, uploadLogo } from '@/services/establishments'
import { toast } from '@/hooks/use-toast'
import { Loader2, Store, Clock, Utensils } from 'lucide-react'
import {
  ScheduleBuilder,
  DEFAULT_SCHEDULE,
  WeeklySchedule,
} from '@/components/onboarding/ScheduleBuilder'
import { LogoUpload } from '@/components/onboarding/LogoUpload'

const DAY_LABELS: Record<string, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
}

export default function Onboarding() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_SCHEDULE)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    if (!name || !category) return 'Preencha todos os campos obrigatórios.'
    for (const [day, s] of Object.entries(schedule)) {
      if (s.isOpen && s.closeTime <= s.openTime) {
        return `O horário de fechamento deve ser posterior ao de abertura na ${DAY_LABELS[day]}.`
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errorMsg = validate()
    if (errorMsg) {
      toast({ variant: 'destructive', title: 'Atenção', description: errorMsg })
      return
    }

    setLoading(true)
    try {
      let logo_url = ''
      if (logoFile) {
        logo_url = await uploadLogo(logoFile)
      }

      const { error } = await createEstablishment({
        name,
        category,
        schedule,
        logo_url,
      })

      if (error) throw error

      toast({
        title: 'Tudo pronto!',
        description: 'Seu estabelecimento foi configurado.',
      })
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
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-5 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden h-auto md:h-[90vh] md:max-h-[850px]">
        {/* Left side decoration */}
        <div className="bg-brand-red p-8 flex-col justify-between text-white relative hidden md:flex md:col-span-2">
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
        <div className="p-8 md:p-10 flex flex-col bg-white overflow-y-auto md:col-span-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="mb-6 shrink-0">
            <h1 className="text-2xl font-bold text-slate-800">Bem-vindo(a)!</h1>
            <p className="text-sm text-slate-500 mt-1">
              Preencha os dados do seu negócio.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex-1 flex flex-col justify-between"
          >
            <div className="space-y-5">
              <LogoUpload onFileSelect={setLogoFile} />

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-slate-700 font-semibold text-sm"
                >
                  Nome do Estabelecimento *
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Pizzaria do João"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 bg-slate-50 border-slate-200 focus-visible:ring-brand-red"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-slate-700 font-semibold text-sm"
                >
                  Categoria Principal *
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 bg-slate-50 border-slate-200 focus:ring-brand-red text-slate-700">
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
                    <SelectItem value="Doceria">
                      Doceria / Sobremesas
                    </SelectItem>
                    <SelectItem value="Bebidas">Bebidas / Adega</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScheduleBuilder value={schedule} onChange={setSchedule} />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-brand-red hover:bg-red-700 text-white font-bold text-base mt-6 transition-all active:scale-[0.98] shrink-0"
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
