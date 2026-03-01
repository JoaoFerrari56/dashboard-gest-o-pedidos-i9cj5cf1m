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
  GripVertical,
  Trash2,
  Tags,
  X,
  ShoppingBag,
  ExternalLink,
  Link as LinkIcon,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

type ProductStatus = 'Ativo' | 'Inativo' | 'Em falta'

interface Variation {
  id: string
  name: string
  price: string
}

interface ComplementItem {
  id: string
  name: string
  price: string
}

interface ComplementGroup {
  id: string
  name: string
  selectionType: 'single' | 'multiple'
  min: string
  max: string
  items: ComplementItem[]
}

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
  variations?: Variation[]
  complementGroups?: ComplementGroup[]
}

interface CartItem {
  id: string
  product: Product
  variation?: Variation
  complements: { groupName: string; item: ComplementItem }[]
  quantity: number
}

const parsePrice = (priceStr: string | undefined | null) => {
  if (!priceStr) return 0
  const clean = priceStr.toString().replace(/[^\d.,]/g, '')
  return parseFloat(clean.replace(/\./g, '').replace(',', '.')) || 0
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
    variations: [],
    complementGroups: [
      {
        id: 'g1',
        name: 'Adicionais',
        selectionType: 'multiple',
        min: '0',
        max: '5',
        items: [
          { id: 'i1', name: 'Bacon Extra', price: '5,00' },
          { id: 'i2', name: 'Queijo Extra', price: '4,00' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Refrigerante',
    description: 'Coca-cola, Guaraná ou Fanta.',
    category: 'Bebidas',
    price: '',
    size: '',
    serves: '1',
    status: 'Ativo',
    image: 'https://img.usecurling.com/p/200/200?q=soda',
    variations: [
      { id: 'v1', name: 'Lata 350ml', price: '6,50' },
      { id: 'v2', name: 'Garrafa 600ml', price: '8,90' },
      { id: 'v3', name: 'Garrafa 2L', price: '14,00' },
    ],
    complementGroups: [],
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
  variations: [],
  complementGroups: [],
}

const getDisplayPrice = (p: Product) => {
  if (p.variations && p.variations.length > 0) {
    const prices = p.variations
      .map((v) => parseFloat(v.price.replace(',', '.')) || 0)
      .filter((v) => v > 0)
    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      return `A partir de R$ ${minPrice.toFixed(2).replace('.', ',')}`
    }
    return 'Preço variável'
  }
  return `R$ ${p.price || '0,00'}`
}

export default function Cardapio() {
  const { toast } = useToast()
  const [menuName, setMenuName] = useState('Deliro Delivery')
  const [menuStatus, setMenuStatus] = useState('Visível')

  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [openCategories, setOpenCategories] =
    useState<string[]>(initialCategories)
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product>(defaultProduct)
  const isEditingMode = !!editingProduct.id

  // Drag and Drop State
  const [dragEnabledCat, setDragEnabledCat] = useState<string | null>(null)
  const [draggedCat, setDraggedCat] = useState<string | null>(null)

  // Renaming Category State
  const [renamingCat, setRenamingCat] = useState<string | null>(null)
  const [newCatName, setNewCatName] = useState('')

  // Deletion State
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [variationToDelete, setVariationToDelete] = useState<string | null>(
    null,
  )
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null)

  const handleCopyLink = () => {
    const publicUrl =
      'https://dashboard-gestao-pedidos-ab1ea.goskip.app/visualizacao-cardapio'
    navigator.clipboard.writeText(publicUrl)
    toast({
      title: 'Link copiado!',
      description:
        'O link público do cardápio foi copiado para a área de transferência.',
    })
  }

  const handleViewMenu = () => {
    window.open('/visualizacao-cardapio', '_blank')
  }

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim()
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed])
      setOpenCategories([...openCategories, trimmed])
    }
    setNewCategoryName('')
    setIsAddingCategory(false)
  }

  const startRenaming = (e: React.MouseEvent, cat: string) => {
    e.preventDefault()
    e.stopPropagation()
    setRenamingCat(cat)
    setNewCatName(cat)
  }

  const saveRenamedCat = () => {
    const trimmed = newCatName.trim()
    if (trimmed && trimmed !== renamingCat && !categories.includes(trimmed)) {
      setCategories(categories.map((c) => (c === renamingCat ? trimmed : c)))
      setProducts(
        products.map((p) =>
          p.category === renamingCat ? { ...p, category: trimmed } : p,
        ),
      )
      setOpenCategories(
        openCategories.map((c) => (c === renamingCat ? trimmed : c)),
      )
    }
    setRenamingCat(null)
  }

  const handleDeleteCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat))
    setProducts(products.filter((p) => p.category !== cat))
    setCategoryToDelete(null)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    setProductToDelete(null)
    setIsDrawerOpen(false)
  }

  const handleDragStart = (e: React.DragEvent, cat: string) => {
    setDraggedCat(cat)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnter = (e: React.DragEvent, targetCat: string) => {
    e.preventDefault()
    if (!draggedCat || draggedCat === targetCat) return

    const draggedIdx = categories.indexOf(draggedCat)
    const targetIdx = categories.indexOf(targetCat)

    const newCategories = [...categories]
    newCategories.splice(draggedIdx, 1)
    newCategories.splice(targetIdx, 0, draggedCat)

    setCategories(newCategories)
  }

  const handleDragEnd = () => {
    setDraggedCat(null)
    setDragEnabledCat(null)
  }

  const openDrawer = (category: string) => {
    setEditingProduct({ ...defaultProduct, category, id: '' })
    setIsDrawerOpen(true)
  }

  const openEditDrawer = (product: Product) => {
    setEditingProduct({
      ...product,
      variations: product.variations || [],
      complementGroups: product.complementGroups || [],
    })
    setIsDrawerOpen(true)
  }

  const saveProduct = () => {
    if (!editingProduct.name) return

    if (isEditingMode) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
      )
    } else {
      setProducts((prev) => [
        ...prev,
        { ...editingProduct, id: Date.now().toString() },
      ])
    }
  }

  const handleSaveAndAddAnother = () => {
    saveProduct()
    setEditingProduct({
      ...defaultProduct,
      category: editingProduct.category,
      id: '',
    })
  }

  const handleFinalize = () => {
    saveProduct()
    setIsDrawerOpen(false)
  }

  // --- Variations Handlers ---
  const addVariation = () => {
    setEditingProduct((prev) => ({
      ...prev,
      variations: [
        ...(prev.variations || []),
        { id: Date.now().toString(), name: '', price: '' },
      ],
    }))
  }

  const updateVariation = (
    id: string,
    field: keyof Variation,
    value: string,
  ) => {
    setEditingProduct((prev) => ({
      ...prev,
      variations:
        prev.variations?.map((v) =>
          v.id === id ? { ...v, [field]: value } : v,
        ) || [],
    }))
  }

  const removeVariation = (id: string) => {
    setEditingProduct((prev) => ({
      ...prev,
      variations: prev.variations?.filter((v) => v.id !== id) || [],
    }))
    setVariationToDelete(null)
  }

  // --- Complement Groups Handlers ---
  const addComplementGroup = () => {
    setEditingProduct((prev) => ({
      ...prev,
      complementGroups: [
        ...(prev.complementGroups || []),
        {
          id: Date.now().toString(),
          name: '',
          selectionType: 'single',
          min: '0',
          max: '1',
          items: [],
        },
      ],
    }))
  }

  const updateComplementGroup = (
    id: string,
    field: keyof ComplementGroup,
    value: string,
  ) => {
    setEditingProduct((prev) => ({
      ...prev,
      complementGroups:
        prev.complementGroups?.map((g) =>
          g.id === id ? { ...g, [field]: value } : g,
        ) || [],
    }))
  }

  const removeComplementGroup = (id: string) => {
    setEditingProduct((prev) => ({
      ...prev,
      complementGroups: prev.complementGroups?.filter((g) => g.id !== id) || [],
    }))
    setGroupToDelete(null)
  }

  const addComplementItem = (groupId: string) => {
    setEditingProduct((prev) => ({
      ...prev,
      complementGroups:
        prev.complementGroups?.map((g) => {
          if (g.id === groupId) {
            return {
              ...g,
              items: [
                ...g.items,
                { id: Date.now().toString(), name: '', price: '' },
              ],
            }
          }
          return g
        }) || [],
    }))
  }

  const updateComplementItem = (
    groupId: string,
    itemId: string,
    field: keyof ComplementItem,
    value: string,
  ) => {
    setEditingProduct((prev) => ({
      ...prev,
      complementGroups:
        prev.complementGroups?.map((g) => {
          if (g.id === groupId) {
            return {
              ...g,
              items: g.items.map((i) =>
                i.id === itemId ? { ...i, [field]: value } : i,
              ),
            }
          }
          return g
        }) || [],
    }))
  }

  const removeComplementItem = (groupId: string, itemId: string) => {
    setEditingProduct((prev) => ({
      ...prev,
      complementGroups:
        prev.complementGroups?.map((g) => {
          if (g.id === groupId) {
            return { ...g, items: g.items.filter((i) => i.id !== itemId) }
          }
          return g
        }) || [],
    }))
  }

  const hasVariations =
    editingProduct.variations && editingProduct.variations.length > 0

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-0 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 shrink-0 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestão do Cardápio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize categorias e produtos do seu menu digital
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 flex-1 sm:flex-none"
            onClick={handleCopyLink}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Copiar Link
          </Button>
          <Button
            className="bg-brand-red hover:bg-red-700 text-white shadow-sm flex-1 sm:flex-none"
            onClick={handleViewMenu}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Cardápio
          </Button>
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
              value={openCategories}
              onValueChange={setOpenCategories}
              className="space-y-4"
            >
              {categories.map((cat) => {
                const catProducts = products.filter((p) => p.category === cat)
                return (
                  <div
                    key={cat}
                    draggable={dragEnabledCat === cat}
                    onDragStart={(e) => handleDragStart(e, cat)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, cat)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'transition-transform duration-200',
                      draggedCat === cat
                        ? 'opacity-50 scale-[0.98] z-10 relative shadow-lg'
                        : 'opacity-100',
                    )}
                  >
                    <AccordionItem
                      value={cat}
                      className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden px-1"
                    >
                      {renamingCat === cat ? (
                        <div className="flex items-center gap-3 px-5 py-4 w-full bg-slate-50/50 border-b border-slate-100">
                          <Input
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            className="h-9 max-w-[250px] bg-white border-slate-200 focus-visible:ring-brand-red"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRenamedCat()
                              if (e.key === 'Escape') setRenamingCat(null)
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={saveRenamedCat}
                            className="bg-brand-red text-white hover:bg-red-700 h-9 px-4"
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setRenamingCat(null)}
                            className="h-9 px-4 text-slate-500 hover:text-slate-700"
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <AccordionTrigger className="px-5 hover:no-underline hover:bg-slate-50/50 py-4 group">
                          <div className="flex items-center gap-3 flex-1 pr-4">
                            <div
                              className="cursor-grab active:cursor-grabbing p-1.5 -ml-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                              onMouseEnter={() => setDragEnabledCat(cat)}
                              onMouseLeave={() => setDragEnabledCat(null)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-red transition-colors">
                              {cat}
                            </h3>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-brand-red hover:bg-red-50 cursor-pointer"
                                onClick={(e) => startRenaming(e, cat)}
                                asChild
                              >
                                <span>
                                  <Edit2 className="h-3.5 w-3.5" />
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-brand-red hover:bg-red-50 cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setCategoryToDelete(cat)
                                }}
                                asChild
                              >
                                <span>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </span>
                              </Button>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 ml-auto"
                            >
                              {catProducts.length} itens
                            </Badge>
                          </div>
                        </AccordionTrigger>
                      )}
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
                                  <h4 className="font-bold text-slate-800 leading-tight flex items-center gap-2">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-sm">
                                    {product.description || 'Sem descrição'}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="font-bold text-brand-green text-sm">
                                      {getDisplayPrice(product)}
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
                                    {product.complementGroups &&
                                      product.complementGroups.length > 0 && (
                                        <Badge
                                          variant="outline"
                                          className="text-[10px] border-orange-200 text-brand-orange bg-orange-50 px-1.5 py-0 font-bold"
                                        >
                                          + Opções
                                        </Badge>
                                      )}
                                  </div>
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-brand-red hover:bg-red-50"
                                  onClick={() => openEditDrawer(product)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-brand-red hover:bg-red-50"
                                  onClick={() => setProductToDelete(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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
                  </div>
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
        <SheetContent className="w-full sm:max-w-md lg:max-w-xl p-0 flex flex-col bg-white border-l border-slate-200">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-slate-800">
                {isEditingMode ? 'Editar Produto' : 'Novo Produto'}
              </SheetTitle>
              <SheetDescription className="text-slate-500">
                {isEditingMode
                  ? 'Modifique os detalhes deste produto.'
                  : 'Preencha as informações para adicionar um item ao cardápio em '}
                {!isEditingMode && (
                  <strong className="text-slate-700">
                    {editingProduct.category}
                  </strong>
                )}
                {!isEditingMode && '.'}
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

              {/* Variações de Preço */}
              <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tags className="h-5 w-5 text-brand-red" />
                    <h3 className="font-bold text-slate-800">
                      Variações de Preço
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addVariation}
                    className="text-brand-red border-brand-red/30 hover:bg-red-50 bg-white"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
                <p className="text-sm text-slate-500">
                  Adicione tamanhos ou versões diferentes do seu produto.
                </p>

                {editingProduct.variations?.map((v) => (
                  <div
                    key={v.id}
                    className="flex gap-3 items-end bg-white p-3 rounded-lg border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-xs text-slate-500 font-semibold">
                        Nome (ex: P, M, G)
                      </Label>
                      <Input
                        value={v.name}
                        onChange={(e) =>
                          updateVariation(v.id, 'name', e.target.value)
                        }
                        placeholder="Tamanho M"
                        className="h-9"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-xs text-slate-500 font-semibold">
                        Preço (R$)
                      </Label>
                      <Input
                        value={v.price}
                        onChange={(e) =>
                          updateVariation(v.id, 'price', e.target.value)
                        }
                        placeholder="0,00"
                        className="h-9"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVariationToDelete(v.id)}
                      className="text-slate-400 hover:text-brand-red hover:bg-red-50 shrink-0 h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    className={cn(
                      'text-sm font-semibold',
                      hasVariations ? 'text-slate-400' : 'text-slate-700',
                    )}
                  >
                    Preço Base (R$) {hasVariations ? '(Desativado)' : '*'}
                  </Label>
                  <div className="relative">
                    <span
                      className={cn(
                        'absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-sm',
                        hasVariations ? 'text-slate-300' : 'text-slate-400',
                      )}
                    >
                      R$
                    </span>
                    <Input
                      disabled={hasVariations}
                      className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-brand-red h-11 font-medium disabled:opacity-50 disabled:bg-slate-100"
                      placeholder="0,00"
                      value={hasVariations ? '' : editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                  {hasVariations && (
                    <p className="text-[10px] text-slate-400 font-medium">
                      O preço base é definido pelas variações acima.
                    </p>
                  )}
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

              {/* Grupos de Complementos */}
              <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100 space-y-5">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-brand-orange" />
                  <h3 className="font-bold text-slate-800">
                    Grupos de Complementos
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ofereça opções extras para este produto, como ingredientes
                  adicionais ou escolhas obrigatórias.
                </p>

                {editingProduct.complementGroups?.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white rounded-xl border border-orange-200 p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                            Nome do Grupo
                          </Label>
                          <Input
                            value={g.name}
                            onChange={(e) =>
                              updateComplementGroup(
                                g.id,
                                'name',
                                e.target.value,
                              )
                            }
                            placeholder="Ex: Escolha o ponto da carne"
                            className="border-slate-200 h-10 font-medium"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                              Tipo de Seleção
                            </Label>
                            <Select
                              value={g.selectionType}
                              onValueChange={(v) =>
                                updateComplementGroup(g.id, 'selectionType', v)
                              }
                            >
                              <SelectTrigger className="h-9 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">
                                  Escolha Única
                                </SelectItem>
                                <SelectItem value="multiple">
                                  Múltipla Escolha
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                              Mínimo Obrigatório
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              className="h-9 bg-white"
                              value={g.min}
                              onChange={(e) =>
                                updateComplementGroup(
                                  g.id,
                                  'min',
                                  e.target.value,
                                )
                              }
                              onBlur={(e) => {
                                const minVal = parseInt(e.target.value) || 0
                                const maxVal = parseInt(g.max) || 0
                                updateComplementGroup(
                                  g.id,
                                  'min',
                                  minVal.toString(),
                                )
                                if (maxVal < minVal) {
                                  updateComplementGroup(
                                    g.id,
                                    'max',
                                    minVal.toString(),
                                  )
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                              Máximo Permitido
                            </Label>
                            <Input
                              type="number"
                              min={g.min}
                              className="h-9 bg-white"
                              value={g.max}
                              onChange={(e) =>
                                updateComplementGroup(
                                  g.id,
                                  'max',
                                  e.target.value,
                                )
                              }
                              onBlur={(e) => {
                                const maxVal = parseInt(e.target.value) || 0
                                const minVal = parseInt(g.min) || 0
                                if (maxVal < minVal) {
                                  updateComplementGroup(
                                    g.id,
                                    'max',
                                    minVal.toString(),
                                  )
                                } else {
                                  updateComplementGroup(
                                    g.id,
                                    'max',
                                    maxVal.toString(),
                                  )
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setGroupToDelete(g.id)}
                        className="shrink-0 text-slate-400 hover:text-brand-red hover:bg-red-50 h-8 w-8 -mt-1 -mr-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Opções do Grupo
                      </Label>
                      <div className="space-y-2">
                        {g.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-2 items-center"
                          >
                            <Input
                              className="h-9 text-sm border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                              placeholder="Nome do adicional"
                              value={item.name}
                              onChange={(e) =>
                                updateComplementItem(
                                  g.id,
                                  item.id,
                                  'name',
                                  e.target.value,
                                )
                              }
                            />
                            <Input
                              className="h-9 text-sm w-28 shrink-0 border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                              placeholder="R$ 0,00"
                              value={item.price}
                              onChange={(e) =>
                                updateComplementItem(
                                  g.id,
                                  item.id,
                                  'price',
                                  e.target.value,
                                )
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 shrink-0 text-slate-400 hover:text-brand-red hover:bg-red-50"
                              onClick={() =>
                                removeComplementItem(g.id, item.id)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addComplementItem(g.id)}
                        className="text-brand-orange hover:text-orange-700 hover:bg-orange-50 h-8 px-3"
                      >
                        <Plus className="h-3 w-3 mr-1.5" /> Adicionar Opção
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addComplementGroup}
                  className="w-full bg-white border-dashed border-orange-200 text-brand-orange hover:text-orange-700 hover:border-orange-400 hover:bg-orange-50 h-12"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="font-semibold">
                    Adicionar novo grupo de adicionais
                  </span>
                </Button>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-slate-200 bg-white grid grid-cols-2 gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            {isEditingMode ? (
              <>
                <Button
                  variant="outline"
                  className="w-full font-bold border-brand-red/30 text-brand-red hover:bg-red-50 h-12"
                  onClick={() => setProductToDelete(editingProduct.id)}
                >
                  Excluir
                </Button>
                <Button
                  className="w-full bg-brand-red hover:bg-red-700 text-white font-bold shadow-sm h-12 transition-transform active:scale-95"
                  onClick={handleFinalize}
                >
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Category Confirmation */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja excluir esta categoria?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os produtos associados a
              esta categoria também serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-red text-white hover:bg-red-700"
              onClick={() =>
                categoryToDelete && handleDeleteCategory(categoryToDelete)
              }
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Product Confirmation */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja excluir este produto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá o produto permanentemente do seu cardápio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-red text-white hover:bg-red-700"
              onClick={() =>
                productToDelete && handleDeleteProduct(productToDelete)
              }
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Variation Confirmation */}
      <AlertDialog
        open={!!variationToDelete}
        onOpenChange={(open) => !open && setVariationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Variação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta variação de preço será removida do produto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-red text-white hover:bg-red-700"
              onClick={() =>
                variationToDelete && removeVariation(variationToDelete)
              }
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Group Confirmation */}
      <AlertDialog
        open={!!groupToDelete}
        onOpenChange={(open) => !open && setGroupToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Grupo de Complementos?</AlertDialogTitle>
            <AlertDialogDescription>
              Este grupo e todas as suas opções serão removidos do produto
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-red text-white hover:bg-red-700"
              onClick={() =>
                groupToDelete && removeComplementGroup(groupToDelete)
              }
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleAddToCart = (product: Product) => {
    if (product.status !== 'Ativo') {
      toast({
        title: 'Item indisponível',
        description: 'Este produto não pode ser adicionado no momento.',
        variant: 'destructive',
      })
      return
    }

    const variation =
      product.variations && product.variations.length > 0
        ? product.variations[0]
        : undefined

    const complements = []
    if (product.complementGroups && product.complementGroups.length > 0) {
      const group = product.complementGroups[0]
      if (group.items && group.items.length > 0) {
        complements.push({
          groupName: group.name,
          item: group.items[0],
        })
      }
    }

    const newItem: CartItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      product,
      variation,
      complements,
      quantity: 1,
    }

    setCartItems((prev) => [...prev, newItem])

    toast({
      title: 'Adicionado à sacola',
      description: `${product.name} foi adicionado para teste.`,
    })
  }

  const removeCartItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const getItemTotal = (item: CartItem) => {
    const basePrice = item.variation
      ? parsePrice(item.variation.price)
      : parsePrice(item.product.price)
    const compsPrice = item.complements.reduce(
      (sum, c) => sum + parsePrice(c.item.price),
      0,
    )
    return (basePrice + compsPrice) * item.quantity
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + getItemTotal(item),
    0,
  )

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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
          <p className="text-red-100 text-xs mt-1.5 relative z-10 font-medium">
            Clique nos itens para simular o pedido
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
                      onClick={() => handleAddToCart(p)}
                      className={cn(
                        'flex gap-3 group relative bg-white p-3 rounded-2xl shadow-sm border border-slate-100/50 transition-all',
                        p.status === 'Ativo'
                          ? 'cursor-pointer hover:border-brand-red/50 hover:shadow-md'
                          : 'opacity-70',
                      )}
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
                        <div className="font-bold text-slate-800 text-sm mt-3 flex flex-wrap items-center gap-2">
                          {getDisplayPrice(p)}
                          {p.status === 'Em falta' && (
                            <span className="text-[9px] text-brand-red uppercase font-black bg-red-50 px-1.5 py-0.5 rounded-sm">
                              Esgotado
                            </span>
                          )}
                          {p.complementGroups &&
                            p.complementGroups.length > 0 && (
                              <span className="text-[9px] text-brand-orange bg-orange-50 px-1.5 py-0.5 rounded-sm border border-orange-100 font-semibold">
                                + Opções
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

        {/* Active Cart Summary Button */}
        {products.filter((p) => p.status !== 'Inativo').length > 0 && (
          <div className="sticky bottom-6 left-0 right-0 px-5 mt-auto z-20">
            <div
              className={cn(
                'text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer transition-all active:scale-95',
                totalItems > 0
                  ? 'bg-brand-red hover:bg-red-700'
                  : 'bg-slate-800 hover:bg-slate-700',
              )}
              onClick={() => setIsCartOpen(true)}
            >
              <span className="bg-black/20 px-2.5 py-1 rounded-lg text-xs font-bold shadow-inner">
                {totalItems} itens
              </span>
              <span className="font-bold text-sm">Ver Resumo do Pedido</span>
              <span className="font-bold text-sm shadow-sm">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Order Summary Modal */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-slate-50 border-l border-slate-200">
          <div className="p-6 border-b border-slate-200 bg-white shadow-sm z-10">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <ShoppingBag className="h-5 w-5 text-brand-red" />
                Resumo do Pedido
              </SheetTitle>
              <SheetDescription className="text-slate-500">
                Revise os itens selecionados antes de finalizar.
              </SheetDescription>
            </SheetHeader>
          </div>

          <ScrollArea className="flex-1 p-6 relative">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                <ShoppingBag className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600 font-medium">
                  Sua sacola está vazia.
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Clique em um produto no cardápio para adicionar.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm">
                          {item.quantity}x {item.product.name}
                        </h4>

                        {item.variation && (
                          <p className="text-xs text-slate-500 mt-1">
                            Variação:{' '}
                            <span className="font-semibold text-slate-700">
                              {item.variation.name}
                            </span>
                          </p>
                        )}

                        {item.complements.length > 0 && (
                          <div className="mt-3 space-y-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Adicionais
                            </p>
                            {item.complements.map((c, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center text-xs text-slate-600"
                              >
                                <span>+ {c.item.name}</span>
                                <span className="text-slate-500 font-medium">
                                  R$ {c.item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end">
                        <p className="font-bold text-brand-green text-sm">
                          R$ {getItemTotal(item).toFixed(2).replace('.', ',')}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCartItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2 mt-2 -mr-2 text-xs font-semibold"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 shrink-0">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-slate-800">
                <span>Total</span>
                <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            <Button
              className="w-full bg-brand-red hover:bg-red-700 text-white font-bold h-12 text-lg rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
              disabled={cartItems.length === 0}
              onClick={() => {
                toast({
                  title: 'Pedido Finalizado!',
                  description:
                    'Esta é uma simulação. O pedido foi enviado com sucesso.',
                })
                setCartItems([])
                setIsCartOpen(false)
              }}
            >
              Finalizar Pedido
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
