import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/cardapio'
import { getDisplayPrice } from '@/utils/cardapio'

export function ProductCard({
  product,
  onClick,
}: {
  product: Product
  onClick: () => void
}) {
  const isAvailable =
    product.status !== 'Em falta' && product.status !== 'Inativo'
  const hasOptions =
    (product.variations && product.variations.length > 0) ||
    (product.complementGroups && product.complementGroups.length > 0)

  return (
    <div
      onClick={() => isAvailable && onClick()}
      className={cn(
        'flex gap-4 bg-white p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all',
        isAvailable
          ? 'cursor-pointer hover:border-brand-red/30 hover:shadow-md active:scale-[0.98]'
          : 'opacity-60 grayscale-[0.5]',
      )}
    >
      <div className="flex-1 flex flex-col justify-between">
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
      {product.image && (
        <div className="h-[90px] w-[90px] rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-100 relative">
          <img
            src={product.image}
            className="w-full h-full object-cover"
            alt={product.name}
          />
        </div>
      )}
    </div>
  )
}
