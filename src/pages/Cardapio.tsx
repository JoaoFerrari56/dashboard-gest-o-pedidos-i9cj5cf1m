import { useState, useEffect } from 'react'
import {
  Plus,
  Settings2,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  LinkIcon,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { getDisplayPrice } from '@/utils/cardapio'
import type { Category, Product, ProductStatus } from '@/types/cardapio'
import { PreviewPanel } from '@/components/cardapio/PreviewPanel'
import { ProductDrawer } from '@/components/cardapio/ProductDrawer'

const defaultProduct: Product = {
  id: '',
  name: '',
  description: '',
  category_id: '',
  price: '',
  size: '',
  serves: '',
  status: 'Ativo',
  image: '',
  variations: [],
  complementGroups: [],
}

export default function Cardapio() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [establishmentId, setEstablishmentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuName, setMenuName] = useState('Meu Cardápio')
  const [menuStatus, setMenuStatus] = useState('Visível')

  const [categories, setCategories] = useState<Category[]>([])
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [renamingCat, setRenamingCat] = useState<string | null>(null)
  const [newCatName, setNewCatName] = useState('')

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product>(defaultProduct)

  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    async function loadData() {
      try {
        const { data: est } = await supabase
          .from('establishments')
          .select('id, name')
          .eq('user_id', user!.id)
          .single()
        if (est) {
          setEstablishmentId(est.id)
          if (est.name) setMenuName(est.name)
          const { data: cats } = await supabase
            .from('menu_categories')
            .select('*')
            .eq('establishment_id', est.id)
            .order('sort_order')
          if (cats) {
            setCategories(cats)
            setOpenCategories(cats.map((c) => c.id))
          }
          const { data: items } = await supabase
            .from('menu_items')
            .select('*')
            .eq('establishment_id', est.id)
            .order('sort_order')
          if (items) {
            setProducts(
              items.map((i) => ({
                id: i.id,
                category_id: i.category_id,
                name: i.name,
                description: i.description || '',
                price: i.price || '',
                size: i.size || '',
                serves: i.serves || '',
                status: i.status as ProductStatus,
                image: i.image_url || '',
                variations: Array.isArray(i.variations) ? i.variations : [],
                complementGroups: Array.isArray(i.complement_groups)
                  ? i.complement_groups
                  : [],
              })),
            )
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const handleCopyLink = () => {
    if (!establishmentId) return
    navigator.clipboard.writeText(
      `${window.location.origin}/visualizacao-cardapio?id=${establishmentId}`,
    )
    toast({ title: 'Link copiado!' })
  }

  const handleAddCategory = async () => {
    const trimmed = newCategoryName.trim()
    if (!trimmed || !establishmentId) return
    if (categories.some((c) => c.name === trimmed)) {
      return toast({ title: 'Categoria já existe', variant: 'destructive' })
    }

    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert({
          establishment_id: establishmentId,
          name: trimmed,
          sort_order: categories.length,
        })
        .select()
        .single()
      if (error) throw error
      setCategories([...categories, { id: data.id, name: data.name }])
      setOpenCategories([...openCategories, data.id])
      setNewCategoryName('')
      setIsAddingCategory(false)
      toast({ title: 'Categoria criada' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const saveRenamedCat = async () => {
    const trimmed = newCatName.trim()
    if (
      !trimmed ||
      !renamingCat ||
      trimmed === categories.find((c) => c.id === renamingCat)?.name
    ) {
      return setRenamingCat(null)
    }
    try {
      const { error } = await supabase
        .from('menu_categories')
        .update({ name: trimmed })
        .eq('id', renamingCat)
      if (error) throw error
      setCategories(
        categories.map((c) =>
          c.id === renamingCat ? { ...c, name: trimmed } : c,
        ),
      )
      setRenamingCat(null)
      toast({ title: 'Renomeada' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', id)
      if (error) throw error
      setCategories(categories.filter((c) => c.id !== id))
      setProducts(products.filter((p) => p.category_id !== id))
      setCategoryToDelete(null)
      toast({ title: 'Excluída' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id)
      if (error) throw error
      setProducts(products.filter((p) => p.id !== id))
      setProductToDelete(null)
      toast({ title: 'Produto excluído' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const saveProduct = async () => {
    if (!editingProduct.name || !editingProduct.category_id) {
      toast({
        title: 'Preencha os campos obrigatórios',
        variant: 'destructive',
      })
      return false
    }
    try {
      const itemData = {
        establishment_id: establishmentId,
        category_id: editingProduct.category_id,
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        size: editingProduct.size,
        serves: editingProduct.serves,
        status: editingProduct.status,
        image_url: editingProduct.image,
        variations: editingProduct.variations,
        complement_groups: editingProduct.complementGroups,
        sort_order: products.length,
      }
      if (editingProduct.id) {
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingProduct.id)
        if (error) throw error
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
        )
        toast({ title: 'Produto atualizado' })
      } else {
        const { data, error } = await supabase
          .from('menu_items')
          .insert(itemData)
          .select()
          .single()
        if (error) throw error
        setProducts((prev) => [...prev, { ...editingProduct, id: data.id }])
        toast({ title: 'Produto criado' })
      }
      return true
    } catch (e: any) {
      toast({
        title: 'Erro ao salvar',
        description: e.message,
        variant: 'destructive',
      })
      return false
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin h-8 w-8 border-4 border-brand-red border-t-transparent rounded-full" />
      </div>
    )
  if (!establishmentId)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Estabelecimento não encontrado
        </h2>
        <p className="text-slate-500">
          Configure seu estabelecimento primeiro.
        </p>
      </div>
    )

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-0 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 shrink-0 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestão do Cardápio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize seu menu digital
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="bg-white"
            onClick={handleCopyLink}
          >
            <LinkIcon className="h-4 w-4 mr-2" /> Copiar Link
          </Button>
          <Button
            className="bg-brand-red text-white"
            onClick={() =>
              window.open(
                `/visualizacao-cardapio?id=${establishmentId}`,
                '_blank',
              )
            }
          >
            <ExternalLink className="h-4 w-4 mr-2" /> Ver Cardápio
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
          <Card className="border-none shadow-sm rounded-xl overflow-hidden shrink-0">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-brand-red" /> Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nome do Cardápio</Label>
                <Input
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={menuStatus} onValueChange={setMenuStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visível">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-brand-green" /> Visível
                      </div>
                    </SelectItem>
                    <SelectItem value="Oculto">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-slate-400" /> Oculto
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
                className="text-brand-red border-brand-red/30"
              >
                <Plus className="h-4 w-4 mr-2" /> Nova Categoria
              </Button>
            </div>
            {isAddingCategory && (
              <Card className="border-brand-red/50 shadow-sm animate-in fade-in zoom-in duration-200">
                <CardContent className="p-4 flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Nome</Label>
                    <Input
                      autoFocus
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleAddCategory()
                      }
                    />
                  </div>
                  <Button
                    onClick={handleAddCategory}
                    className="bg-brand-red text-white"
                  >
                    Salvar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsAddingCategory(false)}
                  >
                    Cancelar
                  </Button>
                </CardContent>
              </Card>
            )}
            {categories.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 mb-4">Nenhuma categoria criada.</p>
                <Button
                  onClick={() => setIsAddingCategory(true)}
                  className="bg-brand-red text-white"
                >
                  <Plus className="h-4 w-4 mr-2" /> Criar Categoria
                </Button>
              </div>
            ) : (
              <Accordion
                type="multiple"
                value={openCategories}
                onValueChange={setOpenCategories}
                className="space-y-4"
              >
                {categories.map((cat) => {
                  const catProducts = products.filter(
                    (p) => p.category_id === cat.id,
                  )
                  return (
                    <AccordionItem
                      key={cat.id}
                      value={cat.id}
                      className="bg-white border rounded-xl shadow-sm px-1"
                    >
                      {renamingCat === cat.id ? (
                        <div className="flex items-center gap-3 px-5 py-4 w-full bg-slate-50/50 border-b">
                          <Input
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            className="max-w-[250px]"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRenamedCat()
                              if (e.key === 'Escape') setRenamingCat(null)
                            }}
                          />
                          <Button
                            onClick={saveRenamedCat}
                            className="bg-brand-red text-white"
                          >
                            Salvar
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setRenamingCat(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <AccordionTrigger className="px-5 hover:no-underline group py-4">
                          <div className="flex items-center gap-3 flex-1 pr-4">
                            <h3 className="font-bold text-slate-800 text-lg group-hover:text-brand-red">
                              {cat.name}
                            </h3>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 ml-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setRenamingCat(cat.id)
                                  setNewCatName(cat.name)
                                }}
                              >
                                <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setCategoryToDelete(cat.id)
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                              </Button>
                            </div>
                            <Badge variant="secondary" className="ml-auto">
                              {catProducts.length} itens
                            </Badge>
                          </div>
                        </AccordionTrigger>
                      )}
                      <AccordionContent className="px-5 pb-5 pt-2 border-t">
                        <div className="flex flex-col gap-3">
                          {catProducts.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between p-3 rounded-xl border bg-slate-50/30 group/item"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-lg bg-white border relative overflow-hidden">
                                  {p.image ? (
                                    <img
                                      src={p.image}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="h-6 w-6 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800">
                                    {p.name}
                                  </h4>
                                  <p className="text-xs text-slate-500">
                                    {p.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className="font-bold text-brand-green text-sm">
                                      {getDisplayPrice(p)}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px]"
                                    >
                                      {p.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover/item:opacity-100">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingProduct(p)
                                    setIsDrawerOpen(true)
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setProductToDelete(p.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            className="mt-2 border-2 border-dashed h-14 rounded-xl text-slate-500 hover:text-brand-red"
                            onClick={() => {
                              setEditingProduct({
                                ...defaultProduct,
                                category_id: cat.id,
                              })
                              setIsDrawerOpen(true)
                            }}
                          >
                            <Plus className="h-5 w-5 mr-2" />{' '}
                            <span className="font-semibold">
                              Adicionar Item
                            </span>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </div>
        </div>
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

      <ProductDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        product={editingProduct}
        onProductChange={setEditingProduct}
        categories={categories}
        onSave={async () => {
          const s = await saveProduct()
          if (s) setIsDrawerOpen(false)
        }}
        onSaveAndAddAnother={async () => {
          const s = await saveProduct()
          if (s)
            setEditingProduct({
              ...defaultProduct,
              category_id: editingProduct.category_id,
            })
        }}
        onDeleteRequest={(id) => {
          setIsDrawerOpen(false)
          setProductToDelete(id)
        }}
      />

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(o) => !o && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Produtos associados também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-red"
              onClick={() =>
                categoryToDelete && handleDeleteCategory(categoryToDelete)
              }
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(o) => !o && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              O produto será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-red"
              onClick={() =>
                productToDelete && handleDeleteProduct(productToDelete)
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
