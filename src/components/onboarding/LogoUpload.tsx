import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Store } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface LogoUploadProps {
  onFileSelect: (file: File | null) => void
}

export function LogoUpload({ onFileSelect }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 2MB.',
        })
        return
      }
      setPreview(URL.createObjectURL(file))
      onFileSelect(file)
    } else {
      setPreview(null)
      onFileSelect(null)
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-slate-700 font-semibold text-sm">
        Logo do Estabelecimento
      </Label>
      <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
        <div className="h-16 w-16 rounded-xl bg-white border border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
          {preview ? (
            <img
              src={preview}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <Store className="h-6 w-6 text-slate-400" />
          )}
        </div>
        <div className="flex-1">
          <Input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleChange}
            className="text-xs file:bg-brand-red/10 file:text-brand-red file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:font-medium file:cursor-pointer cursor-pointer hover:file:bg-brand-red/20 h-9 bg-white transition-colors"
          />
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
            Formatos: JPG, PNG. Tamanho Máx: 2MB.
          </p>
        </div>
      </div>
    </div>
  )
}
