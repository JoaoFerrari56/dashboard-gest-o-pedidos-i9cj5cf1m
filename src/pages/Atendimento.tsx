import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Share2,
  RefreshCw,
  Send,
  ThumbsUp,
  ThumbsDown,
  QrCode,
  PenSquare,
} from 'lucide-react'

export default function Atendimento() {
  const [isConnected, setIsConnected] = useState(false)
  const [advancedPersonality, setAdvancedPersonality] = useState(true)

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Atendimento</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure o seu assistente virtual e notificações
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="configuracao"
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="w-full sm:w-auto self-start bg-transparent border-b border-slate-200 rounded-none h-12 p-0 space-x-6">
          <TabsTrigger
            value="configuracao"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-red data-[state=active]:text-brand-red data-[state=active]:bg-transparent px-1 py-3 text-base font-medium text-slate-500 hover:text-slate-700"
          >
            Configuração
          </TabsTrigger>
          <TabsTrigger
            value="notificacoes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-red data-[state=active]:text-brand-red data-[state=active]:bg-transparent px-1 py-3 text-base font-medium text-slate-500 hover:text-slate-700"
          >
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notificacoes" className="flex-1 mt-6">
          <Card className="border-none shadow-sm h-full flex items-center justify-center bg-slate-50/50">
            <div className="text-center">
              <p className="text-slate-500 font-medium">
                Nenhuma nova notificação no momento.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent
          value="configuracao"
          className="flex-1 mt-6 min-h-0 flex flex-col"
        >
          {!isConnected ? (
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-full max-w-md border-none shadow-md overflow-hidden">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="h-48 w-48 bg-slate-100 rounded-xl mb-6 p-4 flex items-center justify-center border-2 border-dashed border-slate-300">
                    <img
                      src="https://img.usecurling.com/p/200/200?q=qrcode&color=gray"
                      alt="QR Code Placeholder"
                      className="w-full h-full object-contain mix-blend-multiply opacity-50"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Conectar WhatsApp
                  </h2>
                  <p className="text-slate-500 mb-8 max-w-xs">
                    Escaneie o QR Code com o seu aplicativo do WhatsApp para
                    vincular o número ao assistente virtual.
                  </p>
                  <Button
                    className="w-full bg-brand-red hover:bg-red-700 text-white h-12 text-lg"
                    onClick={() => setIsConnected(true)}
                  >
                    Conectar
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
              {/* Left Column - Form */}
              <div className="lg:col-span-7 flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <ScrollArea className="flex-1 p-6 lg:p-8">
                  <div className="max-w-2xl mx-auto space-y-10">
                    {/* Identification */}
                    <section className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          Personalidade do atendente
                        </h3>
                        <p className="text-sm text-slate-500">
                          Defina como o seu assistente virtual irá se
                          apresentar.
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <Avatar className="h-20 w-20 border-2 border-slate-100">
                            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=brenda" />
                            <AvatarFallback>AT</AvatarFallback>
                          </Avatar>
                          <button className="absolute bottom-0 right-0 bg-brand-red text-white p-1.5 rounded-full shadow-md hover:bg-red-700 transition-colors">
                            <PenSquare className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label
                            htmlFor="bot-name"
                            className="text-sm font-semibold text-slate-700"
                          >
                            Nome do(a) atendente
                          </Label>
                          <Input
                            id="bot-name"
                            defaultValue="Brenda"
                            className="bg-slate-50"
                          />
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-6">
                          <Label className="text-sm font-medium text-slate-600">
                            Permitir respostas com áudio
                          </Label>
                          <Switch defaultChecked />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700">
                          Comportamento
                        </Label>
                        <Select defaultValue="amigavel">
                          <SelectTrigger className="w-full bg-slate-50">
                            <SelectValue placeholder="Selecione um comportamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amigavel">Amigável</SelectItem>
                            <SelectItem value="prestativo">
                              Prestativo
                            </SelectItem>
                            <SelectItem value="vendedor">Vendedor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </section>

                    <div className="h-px bg-slate-100" />

                    {/* Personality & Emojis */}
                    <section className="space-y-8">
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-slate-700">
                          Selecione a personalidade principal
                        </Label>
                        <ToggleGroup
                          type="single"
                          defaultValue="feliz"
                          className="flex flex-wrap justify-start gap-3"
                        >
                          <ToggleGroupItem
                            value="feliz"
                            className="rounded-full px-5 py-2.5 h-auto border border-slate-200 bg-white text-slate-600 data-[state=on]:bg-red-50 data-[state=on]:border-brand-red data-[state=on]:text-brand-red hover:bg-slate-50 font-medium"
                          >
                            Feliz e Educado
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="informal"
                            className="rounded-full px-5 py-2.5 h-auto border border-slate-200 bg-white text-slate-600 data-[state=on]:bg-red-50 data-[state=on]:border-brand-red data-[state=on]:text-brand-red hover:bg-slate-50 font-medium"
                          >
                            Informal e brincalhão
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="formal"
                            className="rounded-full px-5 py-2.5 h-auto border border-slate-200 bg-white text-slate-600 data-[state=on]:bg-red-50 data-[state=on]:border-brand-red data-[state=on]:text-brand-red hover:bg-slate-50 font-medium"
                          >
                            Formal e respeitoso
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-slate-700">
                          Uso de emojis
                        </Label>
                        <ToggleGroup
                          type="single"
                          defaultValue="ocasional"
                          className="flex flex-wrap justify-start gap-3"
                        >
                          <ToggleGroupItem
                            value="sempre"
                            className="rounded-full px-5 py-2.5 h-auto border border-slate-200 bg-white text-slate-600 data-[state=on]:bg-red-50 data-[state=on]:border-brand-red data-[state=on]:text-brand-red hover:bg-slate-50 font-medium"
                          >
                            Sempre usar emojis
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="ocasional"
                            className="rounded-full px-5 py-2.5 h-auto border border-slate-200 bg-white text-slate-600 data-[state=on]:bg-red-50 data-[state=on]:border-brand-red data-[state=on]:text-brand-red hover:bg-slate-50 font-medium"
                          >
                            Usar ocasionalmente
                          </ToggleGroupItem>
                          <ToggleGroupItem
                            value="nunca"
                            className="rounded-full px-5 py-2.5 h-auto border border-slate-200 bg-white text-slate-600 data-[state=on]:bg-red-50 data-[state=on]:border-brand-red data-[state=on]:text-brand-red hover:bg-slate-50 font-medium"
                          >
                            Nunca usar emojis
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </section>

                    <div className="h-px bg-slate-100" />

                    {/* Advanced Personality */}
                    <section className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-800">
                            Personalidade avançada
                          </h3>
                          <p className="text-sm text-slate-500">
                            Instruções personalizadas (Prompt)
                          </p>
                        </div>
                        <Switch
                          checked={advancedPersonality}
                          onCheckedChange={setAdvancedPersonality}
                        />
                      </div>

                      {advancedPersonality && (
                        <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <span className="text-lg">💬</span> Vícios de
                              linguagem
                            </Label>
                            <Textarea
                              placeholder="Exemplo: Usa 'uai' frequentemente, fala de forma animada e calorosa"
                              className="resize-none bg-slate-50 min-h-[80px]"
                            />
                            <div className="text-right text-xs text-slate-400">
                              0/150
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                              <span className="text-lg">🎭</span>{' '}
                              Características
                            </Label>
                            <Textarea
                              defaultValue="Exemplo: Simpática, alegre, acolhedora, sempre pronta para ajudar"
                              className="resize-none bg-slate-50 min-h-[80px]"
                            />
                            <div className="text-right text-xs text-slate-400">
                              0/150
                            </div>
                          </div>
                        </div>
                      )}
                    </section>

                    <div className="h-px bg-slate-100" />

                    {/* Menu and Orders */}
                    <section className="space-y-8 pb-8">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base font-bold text-slate-800">
                            Link do cardápio
                          </h3>
                          <p className="text-sm text-slate-500">
                            Ative essa funcionalidade para que o link do
                            cardápio seja enviado como botão no WhatsApp.
                          </p>
                        </div>

                        <div className="bg-orange-50 border border-orange-100 text-orange-800 text-sm p-4 rounded-lg">
                          Atenção: O botão pode não aparecer para quem enviou,
                          mas o link será enviado normalmente e pode ser
                          verificado no chat da plataforma.
                        </div>

                        <div className="flex items-center gap-3">
                          <Switch defaultChecked />
                          <Label className="text-sm font-medium text-slate-700">
                            Enviar link do cardápio como botão no WhatsApp
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-slate-800">
                            Pedidos tirados pelo atendente virtual
                          </h3>
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-brand-blue px-2 py-0.5 rounded-full">
                            Em Teste
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          Ao ativar essa funcionalidade o atendente virtual irá
                          finalizar o pedido diretamente no WhatsApp sem que o
                          cliente precise acessar o cardápio digital.
                        </p>

                        <div className="bg-green-50 border border-green-100 text-brand-green text-sm p-4 rounded-lg font-medium">
                          NOVIDADE: agora o atendente virtual pede para o
                          cliente revisar o pedido. Você só precisará revisar os
                          pedidos que estiverem errados.
                        </div>

                        <div className="flex items-center gap-3">
                          <Switch />
                          <Label className="text-sm font-medium text-slate-700">
                            Permitir pedidos tirados pelo atendente virtual
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Switch defaultChecked />
                          <Label className="text-sm font-medium text-slate-700">
                            Chamar o gerente se o cliente tentar fazer um pedido
                            manual
                          </Label>
                        </div>

                        <div className="pl-14 space-y-3">
                          <Label className="text-sm font-medium text-slate-600 block mb-2">
                            Quando chamar o gerente:
                          </Label>
                          <RadioGroup defaultValue="primeira">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem
                                value="primeira"
                                id="r1"
                                className="text-brand-red border-slate-300 data-[state=checked]:border-brand-red"
                              />
                              <Label
                                htmlFor="r1"
                                className="text-sm text-slate-700 cursor-pointer"
                              >
                                Na primeira interação
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 mt-2">
                              <RadioGroupItem
                                value="insistir"
                                id="r2"
                                className="text-brand-red border-slate-300 data-[state=checked]:border-brand-red"
                              />
                              <Label
                                htmlFor="r2"
                                className="text-sm text-slate-700 cursor-pointer"
                              >
                                Apenas se o consumidor insistir
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                  <Button className="bg-brand-red hover:bg-red-700 text-white px-8">
                    Salvar Configurações
                  </Button>
                </div>
              </div>

              {/* Right Column - Chat Preview */}
              <div className="lg:col-span-5 h-full hidden lg:flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden relative">
                {/* Background Pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                ></div>

                <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between relative z-10">
                  <h3 className="font-semibold text-slate-700">
                    Treine seu atendente virtual
                  </h3>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-slate-500"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-6 relative z-10">
                  <div className="space-y-4 pb-4 flex flex-col">
                    {/* Chat Messages */}
                    <div className="bg-red-50 text-slate-800 self-end rounded-t-xl rounded-bl-xl rounded-br-sm px-4 py-2.5 max-w-[80%] shadow-sm relative">
                      <p className="text-sm">oi</p>
                      <span className="text-[10px] text-slate-400 absolute bottom-1 right-2">
                        15:33
                      </span>
                      <div className="w-6" /> {/* spacer for time */}
                    </div>

                    <div className="bg-white text-slate-800 border border-slate-100 self-start rounded-t-xl rounded-br-xl rounded-bl-sm px-4 py-2.5 max-w-[85%] shadow-sm relative">
                      <p className="text-sm leading-relaxed">Olá, Bruna! 😊</p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        15:33
                      </span>
                    </div>

                    <div className="bg-white text-slate-800 border border-slate-100 self-start rounded-t-xl rounded-br-xl rounded-bl-sm px-4 py-2.5 max-w-[85%] shadow-sm relative">
                      <p className="text-sm leading-relaxed">
                        Que bom receber sua mensagem!
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        15:33
                      </span>
                    </div>

                    <div className="bg-white text-slate-800 border border-slate-100 self-start rounded-t-xl rounded-br-xl rounded-bl-sm px-4 py-2.5 max-w-[85%] shadow-sm relative">
                      <p className="text-sm leading-relaxed">
                        No momento, a nossa loja está fechada, mas reabriremos
                        logo mais, hoje, quinta-feira, às 18:00
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        15:33
                      </span>
                    </div>

                    <div className="bg-white text-slate-800 border border-slate-100 self-start rounded-t-xl rounded-br-xl rounded-bl-sm px-4 py-2.5 max-w-[85%] shadow-sm relative">
                      <p className="text-sm leading-relaxed">
                        Posso te ajudar com alguma dúvida enquanto isso? ✨
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        15:33
                      </span>
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-4 bg-transparent relative z-10">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <ThumbsUp className="h-5 w-5" />
                    </button>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <ThumbsDown className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-white rounded-full border border-slate-200 p-1.5 shadow-sm">
                    <Input
                      placeholder="Converse com seu atendente virtual..."
                      className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 px-4"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-slate-400 rounded-full hover:bg-slate-100"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 bg-brand-red hover:bg-red-700 text-white rounded-full shadow-md"
                    >
                      <Send className="h-4 w-4 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
