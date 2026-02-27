import { useState } from 'react'
import {
  Plus,
  Image as ImageIcon,
  Upload,
  Layers,
  Settings2,
  Eye,
  EyeOff,
  Edit2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'

type ProductStatus = 'Ativo' | 'Inativo' | 'Em falta'

interface Product {
  id: string
  name: string
  description: string
  category: string
  price: string
  size: string
  serves: string
  status: ProductStatus
  image: string
}

const initialCategories = ['Lanches', 'Bebidas', 'Sobremesas']

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'X-Burger Especial',
    description:
      'Pão brioche, hambúrguer artesanal 180g, queijo cheddar, alface, tomate e maionese da casa.',
    category: 'Lanches',
    price: '35,90',
    size: '400g',
    serves: '1',
    status: 'Ativo',
    image: 'https://img.usecurling.com/p/200/200?q=burger&color=orange',
  },
  {
    id: '2',
    name: 'Refrigerante Lata',
    description: 'Coca-cola, Guaraná ou Fanta 350ml.',
    category: 'Bebidas',
    price: '6,50',
    size: '350ml',
    serves: '1',
    status: 'Ativo',
    image: 'https://img.usecurling.com/p/200/200?q=soda',
  },
]

const defaultProduct: Product = {
  id: '',
  name: '',
  description: '',
  category: '',
  price: '',
  size: '',
  serves: '',
  status: 'Ativo',
  image: '',
}

export default function Cardapio() {
  const [menuName, setMenuName] = useState('Deliro Delivery')
  const [menuStatus, setMenuStatus] = useState('Visível')

  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product>(defaultProduct)

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed])
    }
    setNewCategoryName('')
    setIsAddingCategory(false)
  }

  const openDrawer = (category: string) => {
    setEditingProduct({ ...defaultProduct, category })
    setIsDrawerOpen(true)
  }

  const saveProduct = () => {
    if (!editingProduct.name) return
    setProducts((prev) => [
      ...prev,
      { ...editingProduct, id: Date.now().toString() },
    ])
  }

  const handleSaveAndAddAnother = () => {
    saveProduct()
    setEditingProduct({
      ...defaultProduct,
      category: editingProduct.category,
    })
  }

  const handleFinalize = () => {
    saveProduct()
    setIsDrawerOpen(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-0 relative">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestão do Cardápio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize categorias e produtos do seu menu digital
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
        {/* Left Column - Form & Categories */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
          <Card className="border-none shadow-sm rounded-xl overflow-hidden shrink-0">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-brand-red" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">
                  Nome do Cardápio
                </Label>
                <Input
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="Ex: Cardápio Principal"
                  className="bg-slate-50 border-slate-200 focus-visible:ring-brand-red"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">
                  Status do Cardápio
                </Label>
                <Select value={menuStatus} onValueChange={setMenuStatus}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-brand-red">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visível">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-brand-green" />
                        <span>Visível para clientes</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Oculto">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-slate-400" />
                        <span>Oculto / Em manutenção</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Categorias e Produtos
              </h2>
              <Button
                variant="outline"
                onClick={() => setIsAddingCategory(true)}
                className="text-brand-red border-brand-red/30 hover:bg-red-50 bg-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </div>

            {isAddingCategory && (
              <Card className="border-brand-red/50 shadow-sm animate-in fade-in zoom-in duration-200">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 space-y-2 w-full">
                    <Label className="text-slate-700 font-semibold">
                      Nome da Categoria
                    </Label>
                    <Input
                      autoFocus
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleAddCategory()
                      }
                      placeholder="Ex: Pizzas, Bebidas..."
                      className="focus-visible:ring-brand-red"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={handleAddCategory}
                      className="bg-brand-red text-white hover:bg-red-700 flex-1 sm:flex-none"
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAddingCategory(false)}
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 flex-1 sm:flex-none"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Accordion
              type="multiple"
              defaultValue={categories}
              className="space-y-4"
            >
              {categories.map((cat) => {
                const catProducts = products.filter((p) => p.category === cat)
                return (
                  <AccordionItem
                    value={cat}
                    key={cat}
                    className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden px-1"
                  >
                    <AccordionTrigger className="px-5 hover:no-underline hover:bg-slate-50/50 py-4 group">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-red transition-colors">
                          {cat}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 font-medium hover:bg-slate-200"
                        >
                          {catProducts.length} itens
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-2 border-t border-slate-100">
                      <div className="flex flex-col gap-3">
                        {catProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-start sm:items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-red/30 hover:shadow-sm bg-slate-50/30 transition-all group/item"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-lg overflow-hidden bg-white border border-slate-100 shrink-0 shadow-sm relative">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    className={`h-full w-full object-cover transition-all ${
                                      product.status === 'Em falta'
                                        ? 'grayscale opacity-60'
                                        : ''
                                    }`}
                                  />
                                ) : (
                                  <ImageIcon className="h-6 w-6 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 leading-tight">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-sm">
                                  {product.description || 'Sem descrição'}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="font-bold text-brand-green text-sm">
                                    R$ {product.price}
                                  </span>
                                  <Badge
                                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 border-none ${
                                      product.status === 'Ativo'
                                        ? 'bg-green-100 text-brand-green hover:bg-green-100'
                                        : product.status === 'Inativo'
                                          ? 'bg-slate-200 text-slate-600 hover:bg-slate-200'
                                          : 'bg-red-100 text-brand-red hover:bg-red-100'
                                    }`}
                                    variant="outline"
                                  >
                                    {product.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-brand-red hover:bg-red-50 shrink-0 hidden sm:flex opacity-0 group-hover/item:opacity-100 transition-opacity"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          variant="ghost"
                          className="mt-2 border-2 border-dashed border-slate-200 text-slate-500 hover:text-brand-red hover:bg-red-50 hover:border-brand-red/50 w-full justify-center h-14 rounded-xl"
                          onClick={() => openDrawer(cat)}
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          <span className="font-semibold">
                            Adicionar Item em {cat}
                          </span>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="hidden lg:block lg:col-span-4 relative h-full">
          <div className="sticky top-0 h-[calc(100vh-160px)]">
            <PreviewPanel
              menuName={menuName}
              menuStatus={menuStatus}
              categories={categories}
              products={products}
            />
          </div>
        </div>
      </div>

      {/* Product Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md lg:max-w-lg p-0 flex flex-col bg-white border-l border-slate-200">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-slate-800">
                Novo Produto
              </SheetTitle>
              <SheetDescription className="text-slate-500">
                Preencha as informações para adicionar um item ao cardápio em{' '}
                <strong className="text-slate-700">
                  {editingProduct.category}
                </strong>
                .
              </SheetDescription>
            </SheetHeader>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 pb-6">
              {/* Status */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">
                  Status do Produto
                </Label>
                <ToggleGroup
                  type="single"
                  value={editingProduct.status}
                  onValueChange={(v) =>
                    v &&
                    setEditingProduct({
                      ...editingProduct,
                      status: v as ProductStatus,
                    })
                  }
                  className="justify-start bg-slate-50 p-1.5 rounded-xl border border-slate-200 inline-flex"
                >
                  <ToggleGroupItem
                    value="Ativo"
                    className="rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-brand-green font-semibold px-5 text-slate-500 transition-all hover:text-slate-800 h-9"
                  >
                    Ativo
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="Inativo"
                    className="rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-slate-800 font-semibold px-5 text-slate-500 transition-all hover:text-slate-800 h-9"
                  >
                    Inativo
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="Em falta"
                    className="rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-brand-orange font-semibold px-5 text-slate-500 transition-all hover:text-slate-800 h-9"
                  >
                    Em falta
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* General Info */}
              <div className="space-y-4 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Nome do Produto *
                  </Label>
                  <Input
                    placeholder="Ex: X-Burger Artesanal"
                    className="bg-white border-slate-200 focus-visible:ring-brand-red h-11"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Descrição
                  </Label>
                  <Textarea
                    placeholder="Descreva os ingredientes e detalhes apetitosos do produto..."
                    className="bg-white border-slate-200 min-h-[100px] resize-none focus-visible:ring-brand-red"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Categoria *
                  </Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(v) =>
                      setEditingProduct({ ...editingProduct, category: v })
                    }
                  >
                    <SelectTrigger className="bg-white border-slate-200 focus:ring-brand-red h-11">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Preço (R$) *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                      R$
                    </span>
                    <Input
                      className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-brand-red h-11 font-medium"
                      placeholder="0,00"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Tamanho da porção
                  </Label>
                  <Input
                    placeholder="Ex: 500g, 2L"
                    className="bg-slate-50 border-slate-200 focus-visible:ring-brand-red h-11"
                    value={editingProduct.size}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        size: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Serve até X pessoas
                  </Label>
                  <Input
                    type="number"
                    placeholder="Ex: 2"
                    className="bg-slate-50 border-slate-200 focus-visible:ring-brand-red h-11"
                    value={editingProduct.serves}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        serves: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Image */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">
                  Imagem do Produto
                </Label>
                <div
                  onClick={() =>
                    setEditingProduct({
                      ...editingProduct,
                      image: 'https://img.usecurling.com/p/400/400?q=food',
                    })
                  }
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-red-50 hover:border-brand-red/50 transition-colors group"
                >
                  {editingProduct.image ? (
                    <img
                      src={editingProduct.image}
                      className="h-40 w-40 object-cover rounded-xl shadow-md border border-slate-100"
                      alt="Preview"
                    />
                  ) : (
                    <>
                      <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:text-white text-slate-400 transition-colors">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-brand-red transition-colors">
                        Clique para fazer upload
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG ou WEBP (Máx. 2MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Complements */}
              <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100 space-y-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-brand-orange" />
                  <h3 className="font-bold text-slate-800">Complementos</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ofereça opções extras para este produto, como ingredientes
                  adicionais ou escolhas obrigatórias.
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-white border-dashed border-orange-200 text-brand-orange hover:text-orange-700 hover:border-orange-400 hover:bg-orange-50 h-12"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="font-semibold">
                    Adicionar novos grupos de adicionais
                  </span>
                </Button>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-slate-200 bg-white grid grid-cols-2 gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            <Button
              variant="outline"
              className="w-full font-bold border-slate-300 text-slate-700 hover:bg-slate-50 h-12"
              onClick={handleFinalize}
            >
              Finalizar
            </Button>
            <Button
              className="w-full bg-brand-red hover:bg-red-700 text-white font-bold shadow-sm h-12 transition-transform active:scale-95"
              onClick={handleSaveAndAddAnother}
            >
              Salvar e Adicionar Outro
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function PreviewPanel({
  menuName,
  menuStatus,
  categories,
  products,
}: {
  menuName: string
  menuStatus: string
  categories: string[]
  products: Product[]
}) {
  return (
    <div className="bg-slate-100 rounded-[2.5rem] p-3 shadow-xl border-[10px] border-slate-800 relative h-full w-full max-w-[380px] mx-auto flex flex-col overflow-hidden">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-2xl z-30"></div>

      <div className="bg-white flex-1 rounded-[1.7rem] overflow-y-auto no-scrollbar shadow-inner relative flex flex-col z-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-red to-red-700 pt-14 pb-8 px-6 text-center text-white relative overflow-hidden shrink-0 shadow-sm">
          <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/400/200?q=pattern&color=red')] opacity-20 mix-blend-overlay"></div>
          <h2 className="text-2xl font-black relative z-10 drop-shadow-sm">
            {menuName || 'Meu Cardápio'}
          </h2>
          <p className="text-red-100 text-sm mt-1 relative z-10 font-medium">
            Faça seu pedido agora
          </p>
        </div>

        {/* Status Warning if Hidden */}
        {menuStatus === 'Oculto' && (
          <div className="bg-orange-50 border-b border-orange-100 p-2.5 text-center shrink-0">
            <span className="text-xs font-bold text-orange-600 flex items-center justify-center gap-1.5 uppercase tracking-wide">
              <EyeOff className="h-3.5 w-3.5" />
              Cardápio Oculto
            </span>
          </div>
        )}

        {/* Menu Content */}
        <div className="p-5 space-y-8 flex-1 bg-slate-50/30">
          {categories.map((cat) => {
            const catProducts = products.filter(
              (p) => p.category === cat && p.status !== 'Inativo',
            )
            if (catProducts.length === 0) return null

            return (
              <div key={cat} className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg border-b-2 border-slate-100 pb-2">
                  {cat}
                </h3>
                <div className="space-y-4">
                  {catProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex gap-3 group relative bg-white p-3 rounded-2xl shadow-sm border border-slate-100/50"
                    >
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-brand-red transition-colors pr-2">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1 pr-2">
                            {p.description}
                          </p>
                        </div>
                        <div className="font-bold text-slate-800 text-sm mt-3 flex items-center gap-2">
                          R$ {p.price}
                          {p.status === 'Em falta' && (
                            <span className="text-[9px] text-brand-red uppercase font-black bg-red-50 px-1.5 py-0.5 rounded-sm">
                              Esgotado
                            </span>
                          )}
                        </div>
                      </div>
                      {p.image && (
                        <div className="h-24 w-24 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100 relative">
                          <img
                            src={p.image}
                            className={`h-full w-full object-cover ${
                              p.status === 'Em falta'
                                ? 'grayscale opacity-50'
                                : ''
                            }`}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {products.filter((p) => p.status !== 'Inativo').length === 0 && (
            <div className="text-center py-12 opacity-50 flex flex-col items-center justify-center h-full">
              <Layers className="h-12 w-12 text-slate-400 mb-3" />
              <p className="text-sm font-bold text-slate-600">Cardápio vazio</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                Os produtos visíveis aparecerão aqui para seus clientes.
              </p>
            </div>
          )}
        </div>

        {/* Floating Cart Button Fake */}
        {products.filter((p) => p.status !== 'Inativo').length > 0 && (
          <div className="sticky bottom-6 left-0 right-0 px-5 mt-auto z-20">
            <div className="bg-brand-red text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer hover:bg-red-700 transition-colors">
              <span className="bg-black/20 px-2.5 py-1 rounded-lg text-xs font-bold">
                0 itens
              </span>
              <span className="font-bold text-sm">Ver Sacola</span>
              <span className="font-bold text-sm">R$ 0,00</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
