import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ListTodo,
  Headset,
  MenuSquare,
  TicketPercent,
  Send,
  Wallet,
  Settings,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

const mainNav = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Gestor de Pedidos', icon: ListTodo, url: '/pedidos' },
  { title: 'Atendimento', icon: Headset, url: '/atendimento' },
  { title: 'Cardápio', icon: MenuSquare, url: '/cardapio' },
  { title: 'Cupons', icon: TicketPercent, url: '/cupons' },
  { title: 'Disparos', icon: Send, url: '/disparos' },
]

const othersNav = [
  { title: 'Financeiro', icon: Wallet, url: '/financeiro' },
  { title: 'Configurações', icon: Settings, url: '/configuracoes' },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset" className="border-r border-slate-200">
      <SidebarHeader className="flex h-16 items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-blue text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          Deliro
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Principal
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="font-medium text-slate-600 hover:text-brand-blue hover:bg-blue-50 data-[active=true]:bg-blue-50 data-[active=true]:text-brand-blue rounded-xl py-5"
                  >
                    <Link to={item.url}>
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Outros
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {othersNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="font-medium text-slate-600 hover:text-brand-blue hover:bg-blue-50 data-[active=true]:bg-blue-50 data-[active=true]:text-brand-blue rounded-xl py-5"
                  >
                    <Link to={item.url}>
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-brand-blue to-blue-600 p-4 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold mb-1">Planos Pro</h4>
            <div className="text-2xl font-bold mb-1">50% Off</div>
            <p className="text-xs text-blue-100 mb-3">
              Aproveite mais recursos com o Pro
            </p>
            <Button
              variant="secondary"
              className="w-full bg-white text-brand-blue hover:bg-slate-50"
              size="sm"
            >
              Testar Pro
            </Button>
          </div>
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute top-0 right-0 h-16 w-16 -translate-y-1/2 translate-x-1/2 rotate-45 bg-white/10 blur-xl"></div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
