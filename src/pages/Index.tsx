import {
  Truck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MapPin,
  Package,
  Car,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const data = [
  { name: 'Jul', delivered: 4000, reported: 2400 },
  { name: 'Aug', delivered: 8000, reported: 1398 },
  { name: 'Sept', delivered: 10123, reported: 9800 },
  { name: 'Oct', delivered: 5000, reported: 3908 },
  { name: 'Nov', delivered: 8500, reported: 4800 },
]

const recentOrders = [
  {
    id: 'CA-12321-ID',
    date: '12/11/2024',
    departure: 'California, US',
    destination: 'Jakarta, ID',
    status: 'Em Progresso',
  },
  {
    id: 'NY-12321-SF',
    date: '14/11/2024',
    departure: 'New York, US',
    destination: 'San Francisco, US',
    status: 'Em Progresso',
  },
  {
    id: 'CGK-12321-NY',
    date: '16/11/2024',
    departure: 'Jakarta, ID',
    destination: 'New York, US',
    status: 'Pendente',
  },
  {
    id: 'UK-12321-MLG',
    date: '18/11/2024',
    departure: 'London, UK',
    destination: 'Malang, ID',
    status: 'Entregue',
  },
]

export default function Index() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium text-slate-600 flex items-center gap-2">
            <span>11 December 2024</span>
            <ChevronDownIcon className="h-4 w-4 text-slate-400" />
          </div>
          <Button className="bg-brand-blue hover:bg-blue-700 text-white rounded-lg">
            + Novo Envio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <Truck className="h-5 w-5 text-brand-blue" />
                    Em Entrega
                  </div>
                  <span className="text-brand-green text-sm font-semibold flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +16.5%
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-800">1,354</div>
                <div className="text-sm text-slate-400 mt-1">
                  Desde semana passada
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                    Entregas Sucesso
                  </div>
                  <span className="text-brand-red text-sm font-semibold flex items-center">
                    <TrendingDownIcon className="h-3 w-3 mr-1" />
                    -0.5%
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-800">40,523</div>
                <div className="text-sm text-slate-400 mt-1">
                  Desde semana passada
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <DollarSign className="h-5 w-5 text-brand-blue" />
                    Receita
                  </div>
                  <span className="text-brand-green text-sm font-semibold flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.2%
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-800">
                  $ 140,854
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Desde semana passada
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Analytics Chart */}
          <Card className="border-none shadow-sm rounded-xl flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-brand-blue" />
                Análise de Entregas
              </CardTitle>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                  <span className="text-slate-600">Pacotes Entregues</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <span className="text-slate-600">Reportados</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} barSize={40}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickFormatter={(value) =>
                        value === 0 ? '0' : `${value / 1000}K`
                      }
                      dx={-10}
                    />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#1e293b',
                        color: 'white',
                      }}
                      itemStyle={{ color: 'white' }}
                      labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                    />
                    <Bar
                      dataKey="delivered"
                      radius={[6, 6, 6, 6]}
                      activeBar={<Cell fill="#2563eb" />}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.name === 'Sept' ? '#2563eb' : '#e2e8f0'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Data Table */}
          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <LayoutListIcon className="h-5 w-5 text-brand-blue" />
                Dados de Atividade
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="week">
                  <SelectTrigger className="w-[130px] bg-slate-50 border-none">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-none bg-slate-50 text-slate-600"
                >
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="font-semibold text-slate-500">
                      ID Envio
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500">
                      Data
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500">
                      Origem
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500">
                      Destino
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="border-slate-50 hover:bg-slate-50/50"
                    >
                      <TableCell className="font-medium text-slate-700">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {order.date}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {order.departure}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {order.destination}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`font-medium ${
                            order.status === 'Em Progresso'
                              ? 'bg-orange-50 text-brand-orange hover:bg-orange-100'
                              : order.status === 'Pendente'
                                ? 'bg-red-50 text-brand-red hover:bg-red-100'
                                : 'bg-green-50 text-brand-green hover:bg-green-100'
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
                <span>Mostrando 1 a 4 de 100 entradas</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="solid"
                    className="h-8 w-8 bg-brand-blue text-white rounded-md p-0"
                  >
                    1
                  </Button>
                  <Button variant="ghost" className="h-8 w-8 rounded-md p-0">
                    2
                  </Button>
                  <Button variant="ghost" className="h-8 w-8 rounded-md p-0">
                    3
                  </Button>
                  <Button variant="ghost" className="h-8 w-8 rounded-md p-0">
                    4
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Tracker & Messages */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <Card className="border-none shadow-sm rounded-xl overflow-hidden">
            <div className="h-40 bg-slate-200 relative">
              <img
                src="https://img.usecurling.com/p/800/400?q=street%20map&color=gray"
                alt="Map View"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
            </div>
            <CardContent className="pt-4 relative">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Tracker ID
                </h3>
                <div className="text-xl font-bold text-slate-800">
                  NY-12321-SF
                </div>
                <Badge className="bg-orange-50 text-brand-orange hover:bg-orange-50 mt-2 font-medium">
                  Em Progresso
                </Badge>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Localização
                </h3>
                <div className="relative pl-6 pb-6 border-l-2 border-brand-blue/30 last:border-0 last:pb-0">
                  <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full border-4 border-white bg-brand-blue shadow-sm" />
                  <p className="font-semibold text-slate-800 text-sm">
                    Pacote rumo a San Francisco
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    12/12/2024 - 02:00 AM
                  </p>
                </div>
                <div className="relative pl-6 pb-6 border-l-2 border-slate-200 last:border-0 last:pb-0">
                  <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full border-4 border-white bg-slate-300 shadow-sm" />
                  <p className="font-medium text-slate-600 text-sm">
                    Checando no armazém
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    11/12/2024 - 10:32 PM
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-slate-200 border-transparent">
                  <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full border-4 border-white bg-slate-300 shadow-sm" />
                  <p className="font-medium text-slate-600 text-sm">
                    Pacote recebido
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    11/12/2024 - 05:00 PM
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=moriarty" />
                    <AvatarFallback>MO</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Moriarty</p>
                    <p className="text-xs text-slate-500">
                      Motorista / Courier
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-slate-200 text-slate-600"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full border-slate-200 text-slate-600"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MessageSquareIcon className="h-5 w-5 text-brand-blue" />
                Mensagens Rápidas
              </CardTitle>
              <span className="text-xs font-medium text-brand-green bg-green-50 px-2 py-1 rounded-full">
                24 Online
              </span>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=ethan" />
                      <AvatarFallback>ET</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-brand-blue transition-colors">
                      Ethan
                    </p>
                    <p className="text-xs text-brand-blue font-medium mt-0.5">
                      Online - 12/12/24
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-50 text-brand-blue font-medium hover:bg-blue-50 border-none">
                  2 novas mensagens
                </Badge>
              </div>

              <div className="flex items-center justify-between group cursor-pointer opacity-70">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=ricky" />
                      <AvatarFallback>RI</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-slate-300"></span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Ricky</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Offline - 11/12/24
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function TrendingDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  )
}

function BarChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

function LayoutListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <path d="M14 4h7" />
      <path d="M14 9h7" />
      <path d="M14 15h7" />
      <path d="M14 20h7" />
    </svg>
  )
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
