import { useState } from 'react'
import {
  Plus,
  Image as ImageIcon,
  Upload,
  Layers,
  Tags,
  Trash2,
  X,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
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
import { cn } from '@/lib/utils'
import type {
  Category,
  Product,
  Variation,
  ComplementGroup,
  ComplementItem,
  ProductStatus,
} from '@/types/cardapio'

interface ProductDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  onProductChange: (product: Product) => void
  categories: Category[]
  onSave: () => void
  onSaveAndAddAnother: () => void
  onDeleteRequest: (id: string) => void
}

export function ProductDrawer({
  isOpen,
  onOpenChange,
  product,
  onProductChange,
  categories,
  onSave,
  onSaveAndAddAnother,
  onDeleteRequest,
}: ProductDrawerProps) {
  const isEditingMode = !!product.id
  const hasVariations = product.variations && product.variations.length > 0
  const [variationToDelete, setVariationToDelete] = useState<string | null>(
    null,
  )
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null)

  const addVariation = () =>
    onProductChange({
      ...product,
      variations: [
        ...(product.variations || []),
        { id: Date.now().toString(), name: '', price: '' },
      ],
    })
  const updateVariation = (id: string, field: keyof Variation, value: string) =>
    onProductChange({
      ...product,
      variations:
        product.variations?.map((v) =>
          v.id === id ? { ...v, [field]: value } : v,
        ) || [],
    })
  const removeVariation = (id: string) => {
    onProductChange({
      ...product,
      variations: product.variations?.filter((v) => v.id !== id) || [],
    })
    setVariationToDelete(null)
  }

  const addComplementGroup = () =>
    onProductChange({
      ...product,
      complementGroups: [
        ...(product.complementGroups || []),
        {
          id: Date.now().toString(),
          name: '',
          selectionType: 'single',
          min: '0',
          max: '1',
          items: [],
        },
      ],
    })
  const updateComplementGroup = (
    id: string,
    field: keyof ComplementGroup,
    value: string,
  ) =>
    onProductChange({
      ...product,
      complementGroups:
        product.complementGroups?.map((g) =>
          g.id === id ? { ...g, [field]: value } : g,
        ) || [],
    })
  const removeComplementGroup = (id: string) => {
    onProductChange({
      ...product,
      complementGroups:
        product.complementGroups?.filter((g) => g.id !== id) || [],
    })
    setGroupToDelete(null)
  }

  const addComplementItem = (groupId: string) =>
    onProductChange({
      ...product,
      complementGroups:
        product.complementGroups?.map((g) =>
          g.id === groupId
            ? {
                ...g,
                items: [
                  ...g.items,
                  { id: Date.now().toString(), name: '', price: '' },
                ],
              }
            : g,
        ) || [],
    })
  const updateComplementItem = (
    groupId: string,
    itemId: string,
    field: keyof ComplementItem,
    value: string,
  ) =>
    onProductChange({
      ...product,
      complementGroups:
        product.complementGroups?.map((g) =>
          g.id === groupId
            ? {
                ...g,
                items: g.items.map((i) =>
                  i.id === itemId ? { ...i, [field]: value } : i,
                ),
              }
            : g,
        ) || [],
    })
  const removeComplementItem = (groupId: string, itemId: string) =>
    onProductChange({
      ...product,
      complementGroups:
        product.complementGroups?.map((g) =>
          g.id === groupId
            ? { ...g, items: g.items.filter((i) => i.id !== itemId) }
            : g,
        ) || [],
    })

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md lg:max-w-xl p-0 flex flex-col bg-white border-l border-slate-200">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-slate-800">
                {isEditingMode ? 'Editar Produto' : 'Novo Produto'}
              </SheetTitle>
              <SheetDescription className="text-slate-500">
                {isEditingMode
                  ? 'Modifique os detalhes deste produto.'
                  : 'Preencha as informações para adicionar um item ao cardápio.'}
              </SheetDescription>
            </SheetHeader>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 pb-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">
                  Status do Produto
                </Label>
                <ToggleGroup
                  type="single"
                  value={product.status}
                  onValueChange={(v) =>
                    v &&
                    onProductChange({ ...product, status: v as ProductStatus })
                  }
                  className="justify-start bg-slate-50 p-1.5 rounded-xl border border-slate-200 inline-flex"
                >
                  <ToggleGroupItem
                    value="Ativo"
                    className="rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-brand-green font-semibold px-5 text-slate-500 h-9"
                  >
                    Ativo
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="Inativo"
                    className="rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-slate-800 font-semibold px-5 text-slate-500 h-9"
                  >
                    Inativo
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="Em falta"
                    className="rounded-lg data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-brand-orange font-semibold px-5 text-slate-500 h-9"
                  >
                    Em falta
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-4 bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Nome do Produto *
                  </Label>
                  <Input
                    placeholder="Ex: X-Burger"
                    value={product.name}
                    onChange={(e) =>
                      onProductChange({ ...product, name: e.target.value })
                    }
                    className="bg-white h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Descrição
                  </Label>
                  <Textarea
                    placeholder="Descreva os ingredientes..."
                    value={product.description}
                    onChange={(e) =>
                      onProductChange({
                        ...product,
                        description: e.target.value,
                      })
                    }
                    className="bg-white min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Categoria *
                  </Label>
                  <Select
                    value={product.category_id}
                    onValueChange={(v) =>
                      onProductChange({ ...product, category_id: v })
                    }
                  >
                    <SelectTrigger className="bg-white h-11">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
                {product.variations?.map((v) => (
                  <div
                    key={v.id}
                    className="flex gap-3 items-end bg-white p-3 rounded-lg border border-slate-200"
                  >
                    <div className="flex-1 space-y-1.5">
                      <Label className="text-xs text-slate-500 font-semibold">
                        Nome
                      </Label>
                      <Input
                        value={v.name}
                        onChange={(e) =>
                          updateVariation(v.id, 'name', e.target.value)
                        }
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
                      className="text-slate-400 hover:text-brand-red shrink-0 h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    className={cn(
                      'text-sm font-semibold',
                      hasVariations ? 'text-slate-400' : 'text-slate-700',
                    )}
                  >
                    Preço Base (R$) {!hasVariations && '*'}
                  </Label>
                  <Input
                    disabled={hasVariations}
                    value={hasVariations ? '' : product.price}
                    onChange={(e) =>
                      onProductChange({ ...product, price: e.target.value })
                    }
                    className="h-11"
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Tamanho/Porção
                  </Label>
                  <Input
                    value={product.size}
                    onChange={(e) =>
                      onProductChange({ ...product, size: e.target.value })
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Serve até X pessoas
                  </Label>
                  <Input
                    type="number"
                    value={product.serves}
                    onChange={(e) =>
                      onProductChange({ ...product, serves: e.target.value })
                    }
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">
                  Imagem do Produto
                </Label>
                <div
                  onClick={() =>
                    onProductChange({
                      ...product,
                      image: 'https://img.usecurling.com/p/400/400?q=food',
                    })
                  }
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-red-50 hover:border-brand-red/50 transition-colors group"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      className="h-40 w-40 object-cover rounded-xl shadow-md border border-slate-100"
                      alt="Preview"
                    />
                  ) : (
                    <>
                      <div className="h-14 w-14 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-brand-red">
                        Clique para fazer upload
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-100 space-y-5">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-brand-orange" />
                  <h3 className="font-bold text-slate-800">
                    Grupos de Complementos
                  </h3>
                </div>
                {product.complementGroups?.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white rounded-xl border border-orange-200 p-5 space-y-4 shadow-sm"
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
                            className="h-10"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold text-slate-500 uppercase">
                              Tipo
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
                                <SelectItem value="single">Única</SelectItem>
                                <SelectItem value="multiple">
                                  Múltipla
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold text-slate-500 uppercase">
                              Mínimo
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              value={g.min}
                              onChange={(e) =>
                                updateComplementGroup(
                                  g.id,
                                  'min',
                                  e.target.value,
                                )
                              }
                              className="h-9 bg-white"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[11px] font-semibold text-slate-500 uppercase">
                              Máximo
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              value={g.max}
                              onChange={(e) =>
                                updateComplementGroup(
                                  g.id,
                                  'max',
                                  e.target.value,
                                )
                              }
                              className="h-9 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setGroupToDelete(g.id)}
                        className="shrink-0 text-slate-400 hover:text-brand-red h-8 w-8"
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
                              className="h-9 bg-slate-50"
                              placeholder="Nome"
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
                              className="h-9 w-28 bg-slate-50"
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
                              onClick={() =>
                                removeComplementItem(g.id, item.id)
                              }
                              className="h-9 w-9 text-slate-400 hover:text-brand-red"
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
                        className="text-brand-orange"
                      >
                        <Plus className="h-3 w-3 mr-1.5" /> Adicionar Opção
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addComplementGroup}
                  className="w-full bg-white border-dashed border-orange-200 text-brand-orange hover:text-orange-700 h-12"
                >
                  <Plus className="h-4 w-4 mr-2" /> Adicionar grupo de
                  adicionais
                </Button>
              </div>
            </div>
          </ScrollArea>
          <div className="p-6 border-t border-slate-200 bg-white grid grid-cols-2 gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
            {isEditingMode ? (
              <>
                <Button
                  variant="outline"
                  className="w-full text-brand-red h-12"
                  onClick={() => onDeleteRequest(product.id)}
                >
                  Excluir
                </Button>
                <Button
                  className="w-full bg-brand-red hover:bg-red-700 text-white h-12"
                  onClick={onSave}
                >
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={onSave}
                >
                  Finalizar
                </Button>
                <Button
                  className="w-full bg-brand-red hover:bg-red-700 text-white h-12"
                  onClick={onSaveAndAddAnother}
                >
                  Salvar e Outro
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!variationToDelete}
        onOpenChange={(open) => !open && setVariationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Variação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta variação de preço será removida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-red text-white"
              onClick={() =>
                variationToDelete && removeVariation(variationToDelete)
              }
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!groupToDelete}
        onOpenChange={(open) => !open && setGroupToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Grupo?</AlertDialogTitle>
            <AlertDialogDescription>
              Este grupo será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-brand-red text-white"
              onClick={() =>
                groupToDelete && removeComplementGroup(groupToDelete)
              }
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
