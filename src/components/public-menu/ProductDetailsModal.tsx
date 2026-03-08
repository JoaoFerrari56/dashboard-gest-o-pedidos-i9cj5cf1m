import { useState, useMemo } from 'react'
import { Plus, Minus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { Product, ComplementItem } from '@/types/cardapio'
import { parsePrice } from '@/utils/cardapio'
import type { CartItem } from '@/pages/PublicMenu'

const formatPrice = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: {
  product: Product
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: CartItem) => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    product.variations?.[0]?.id || null,
  )
  const [selectedComplements, setSelectedComplements] = useState<
    Record<string, string[]>
  >({})

  const basePrice =
    selectedVariationId && product.variations
      ? parsePrice(
          product.variations.find((v) => v.id === selectedVariationId)?.price,
        )
      : parsePrice(product.price)

  const complementsPrice = Object.entries(selectedComplements).reduce(
    (sum, [groupId, itemIds]) => {
      const group = product.complementGroups?.find((g) => g.id === groupId)
      if (!group) return sum
      const itemsTotal = itemIds.reduce((itemSum, itemId) => {
        const item = group.items.find((i) => i.id === itemId)
        return itemSum + (item ? parsePrice(item.price) : 0)
      }, 0)
      return sum + itemsTotal
    },
    0,
  )

  const totalPrice = (basePrice + complementsPrice) * quantity

  const isValid = useMemo(() => {
    if (product.variations?.length && !selectedVariationId) return false
    if (product.complementGroups) {
      for (const group of product.complementGroups) {
        const min = parseInt(group.min) || 0
        if ((selectedComplements[group.id] || []).length < min) return false
      }
    }
    return true
  }, [product, selectedVariationId, selectedComplements])

  const handleToggleMultiple = (
    groupId: string,
    itemId: string,
    max: number,
  ) => {
    const current = selectedComplements[groupId] || []
    if (current.includes(itemId)) {
      setSelectedComplements((prev) => ({
        ...prev,
        [groupId]: current.filter((id) => id !== itemId),
      }))
    } else if (current.length < max) {
      setSelectedComplements((prev) => ({
        ...prev,
        [groupId]: [...current, itemId],
      }))
    }
  }

  const handleAdd = () => {
    if (!isValid) return
    const variation = product.variations?.find(
      (v) => v.id === selectedVariationId,
    )
    const complements: { groupName: string; item: ComplementItem }[] = []
    Object.entries(selectedComplements).forEach(([groupId, itemIds]) => {
      const group = product.complementGroups?.find((g) => g.id === groupId)
      if (group) {
        itemIds.forEach((itemId) => {
          const item = group.items.find((i) => i.id === itemId)
          if (item) complements.push({ groupName: group.name, item })
        })
      }
    })
    onAddToCart({
      id: Date.now().toString(),
      product,
      variation,
      complements,
      quantity,
      totalPrice,
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[90vh] sm:h-auto sm:max-h-[90vh] p-0 flex flex-col bg-slate-50 rounded-t-[2rem] sm:rounded-2xl sm:max-w-xl mx-auto border-none shadow-2xl"
      >
        <div className="absolute top-4 left-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow-sm text-slate-700 hover:bg-white"
            onClick={onClose}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 overflow-y-auto no-scrollbar relative">
          {product.image && (
            <div className="h-64 w-full bg-slate-200 relative shrink-0">
              <img
                src={product.image}
                className="w-full h-full object-cover"
                alt={product.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          )}
          <div
            className={cn(
              'p-6 bg-white shrink-0 relative',
              product.image ? '-mt-6 rounded-t-3xl' : '',
            )}
          >
            <h2 className="text-2xl font-black text-slate-800 leading-tight">
              {product.name}
            </h2>
            <p className="text-slate-500 mt-2 leading-relaxed text-sm">
              {product.description}
            </p>
            {!product.variations?.length && (
              <div className="mt-4 font-black text-xl text-brand-green">
                {formatPrice(parsePrice(product.price))}
              </div>
            )}
          </div>
          <div className="p-4 space-y-4 pb-8 bg-slate-50">
            {product.variations && product.variations.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Escolha o tamanho
                    </h3>
                    <p className="text-xs text-slate-500">Obrigatório</p>
                  </div>
                  <Badge className="bg-slate-800 uppercase text-[10px] px-2 font-bold">
                    Obrigatório
                  </Badge>
                </div>
                <RadioGroup
                  value={selectedVariationId || ''}
                  onValueChange={setSelectedVariationId}
                  className="space-y-3"
                >
                  {product.variations.map((v) => (
                    <label
                      key={v.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-red/50 cursor-pointer transition-colors has-[:checked]:border-brand-red has-[:checked]:bg-red-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value={v.id}
                          className="border-slate-300 text-brand-red"
                        />
                        <span className="font-medium text-slate-700">
                          {v.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {formatPrice(parsePrice(v.price))}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}
            {product.complementGroups?.map((group) => {
              const min = parseInt(group.min) || 0
              const max = parseInt(group.max) || 0
              const currentSelected = selectedComplements[group.id] || []
              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60"
                >
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">
                        {group.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {min === max
                          ? `Escolha ${max} opção`
                          : `Escolha de ${min} até ${max} opções`}
                      </p>
                    </div>
                    {min > 0 ? (
                      <Badge className="bg-slate-800 uppercase text-[10px] px-2 font-bold shrink-0">
                        Obrigatório
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="uppercase text-[10px] px-2 font-bold shrink-0"
                      >
                        Opcional
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-3">
                    {group.selectionType === 'single' ? (
                      <RadioGroup
                        value={currentSelected[0] || ''}
                        onValueChange={(v) =>
                          setSelectedComplements((prev) => ({
                            ...prev,
                            [group.id]: [v],
                          }))
                        }
                        className="space-y-3"
                      >
                        {group.items.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-brand-red/50 cursor-pointer transition-colors has-[:checked]:border-brand-red has-[:checked]:bg-red-50/50"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem
                                value={item.id}
                                className="border-slate-300 text-brand-red"
                              />
                              <span className="font-medium text-slate-700">
                                {item.name}
                              </span>
                            </div>
                            {parsePrice(item.price) > 0 && (
                              <span className="font-bold text-slate-600">
                                + {formatPrice(parsePrice(item.price))}
                              </span>
                            )}
                          </label>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-3">
                        {group.items.map((item) => {
                          const isChecked = currentSelected.includes(item.id)
                          const isDisabled =
                            !isChecked && currentSelected.length >= max
                          return (
                            <label
                              key={item.id}
                              className={cn(
                                'flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer',
                                isChecked
                                  ? 'border-brand-red bg-red-50/50'
                                  : 'border-slate-100 hover:border-brand-red/50',
                                isDisabled
                                  ? 'opacity-50 cursor-not-allowed hover:border-slate-100'
                                  : '',
                              )}
                              onClick={(e) => isDisabled && e.preventDefault()}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() =>
                                    handleToggleMultiple(group.id, item.id, max)
                                  }
                                  disabled={isDisabled}
                                  className="border-slate-300 data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
                                />
                                <span className="font-medium text-slate-700">
                                  {item.name}
                                </span>
                              </div>
                              {parsePrice(item.price) > 0 && (
                                <span className="font-bold text-slate-600">
                                  + {formatPrice(parsePrice(item.price))}
                                </span>
                              )}
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        <div className="bg-white p-4 sm:p-6 border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 shrink-0 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center justify-center gap-4 bg-slate-100 p-2 rounded-xl sm:w-auto w-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-600 hover:bg-white rounded-lg shadow-sm"
              onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg w-6 text-center text-slate-800">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-brand-red hover:bg-white rounded-lg shadow-sm"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold h-14 rounded-xl text-lg flex items-center justify-between px-6 shadow-md transition-all active:scale-95 disabled:opacity-50"
            disabled={!isValid}
            onClick={handleAdd}
          >
            <span>Adicionar</span>
            <span>{formatPrice(totalPrice)}</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
