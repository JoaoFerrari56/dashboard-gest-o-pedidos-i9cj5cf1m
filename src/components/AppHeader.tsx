import { Bell, Info, Search, ChevronDown } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSearch } from '@/contexts/SearchContext'

export function AppHeader() {
  const { searchQuery, setSearchQuery } = useSearch()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 bg-brand-bg px-4 md:px-8 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>

      <div className="flex flex-1 items-center gap-4 md:gap-8 justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por Nome, Telefone ou Código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-none pl-10 h-10 rounded-full shadow-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-brand-blue"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-slate-600 hover:text-brand-blue transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-red border-2 border-white"></span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-slate-600 hover:text-brand-blue transition-colors">
              <Info className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-slate-50 transition-colors border border-slate-100">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=jane"
                alt="Jane"
              />
              <AvatarFallback>JN</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-700">
                Bem-vinda, Jane!
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  )
}
