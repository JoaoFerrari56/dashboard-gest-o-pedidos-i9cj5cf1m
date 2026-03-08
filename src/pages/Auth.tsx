import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Loader2, Store } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate(from, { replace: true })
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        toast({
          title: 'Conta criada!',
          description: 'Sua conta foi criada com sucesso. Bem-vindo!',
        })
        navigate(from, { replace: true })
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro na autenticação',
        description: error.message || 'Ocorreu um erro ao tentar autenticar.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/800/800?q=pattern&color=red')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
        <div className="h-16 w-16 bg-brand-red rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 mb-6">
          <Store className="h-8 w-8 text-white transform rotate-6" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Deliro Delivery
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium">
          Portal do Lojista
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-brand-red to-red-500" />
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
            </CardTitle>
            <CardDescription className="text-center text-slate-500">
              {isLogin
                ? 'Insira suas credenciais para acessar o painel'
                : 'Preencha os dados abaixo para começar a vender'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-brand-red"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-brand-red"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-brand-red hover:bg-red-700 text-white font-bold text-base transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isLogin ? (
                  'Entrar'
                ) : (
                  'Cadastrar'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-semibold text-brand-red hover:text-red-700 transition-colors"
              >
                {isLogin
                  ? 'Não tem uma conta? Cadastre-se'
                  : 'Já tem uma conta? Entre agora'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
