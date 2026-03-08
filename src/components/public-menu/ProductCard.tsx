import { Plus, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/cardapio'
import { getDisplayPrice } from '@/utils/cardapio'

export function ProductCard({
  product,
  cartQuantity,
  onIncrement,
  onDecrement,
  onClick,
}: {
  product: Product
  cartQuantity: number
  onIncrement: () => void
  onDecrement: () => void
  onClick: () => void
}) {
  const isAvailable =
    product.status !== 'Em falta' && product.status !== 'Inativo'
  const hasOptions =
    (product.variations && product.variations.length > 0) ||
    (product.complementGroups && product.complementGroups.length > 0)

  return (
    <div
      className={cn(
        'flex gap-4 bg-white p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all',
        isAvailable
          ? 'hover:border-brand-red/30 hover:shadow-md'
          : 'opacity-60 grayscale-[0.5]',
      )}
    >
      <div
        className={cn(
          'flex-1 flex flex-col justify-between',
          isAvailable && 'cursor-pointer active:scale-[0.98]',
        )}
        onClick={() => isAvailable && onClick()}
      >
        <div>
          <h3 className="font-bold text-slate-800 text-[15px] leading-tight mb-1.5">
            {product.name}
          </h3>
          <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed pr-2">
            {product.description}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-800 text-[15px]">
            {getDisplayPrice(product)}
          </span>
          {!isAvailable && (
            <Badge className="bg-red-50 text-brand-red border-none hover:bg-red-50 font-bold uppercase tracking-wider text-[10px]">
              Esgotado
            </Badge>
          )}
          {isAvailable && hasOptions && (
            <span className="text-[11px] font-semibold text-[#d97706] bg-orange-50 border border-orange-100/80 px-2.5 py-[3px] rounded-md">
              + Opções
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between shrink-0 ml-2">
        {product.image && (
          <div
            className={cn(
              'h-[90px] w-[90px] rounded-xl overflow-hidden shadow-sm border border-slate-100 mb-3',
              isAvailable && 'cursor-pointer active:scale-[0.98]',
            )}
            onClick={(e) => {
              e.stopPropagation()
              if (isAvailable) onClick()
            }}
          >
            <img
              src={product.image}
              className="w-full h-full object-cover"
              alt={product.name}
            />
          </div>
        )}
        {isAvailable && (
          <div
            className={cn(
              'flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-100',
              !product.image && 'mt-auto',
            )}
          >
            {cartQuantity > 0 ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDecrement()
                  }}
                  className="h-7 w-7 flex items-center justify-center rounded-md bg-white text-brand-red shadow-sm hover:bg-red-50 active:scale-95 transition-all"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-slate-800 text-sm w-4 text-center">
                  {cartQuantity}
                </span>
              </>
            ) : null}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onIncrement()
              }}
              className="h-7 w-7 flex items-center justify-center rounded-md bg-brand-red text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
