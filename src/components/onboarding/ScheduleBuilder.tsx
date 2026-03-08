import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export type DaySchedule = {
  isOpen: boolean
  openTime: string
  closeTime: string
}

export type WeeklySchedule = Record<string, DaySchedule>

const DAYS = [
  { id: 'monday', label: 'Segunda-feira' },
  { id: 'tuesday', label: 'Terça-feira' },
  { id: 'wednesday', label: 'Quarta-feira' },
  { id: 'thursday', label: 'Quinta-feira' },
  { id: 'friday', label: 'Sexta-feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
] as const

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2)
    .toString()
    .padStart(2, '0')
  const minutes = i % 2 === 0 ? '00' : '30'
  return `${hours}:${minutes}`
})

export const DEFAULT_SCHEDULE: WeeklySchedule = DAYS.reduce((acc, day) => {
  acc[day.id] = { isOpen: true, openTime: '08:00', closeTime: '18:00' }
  return acc
}, {} as WeeklySchedule)

interface ScheduleBuilderProps {
  value: WeeklySchedule
  onChange: (value: WeeklySchedule) => void
}

export function ScheduleBuilder({ value, onChange }: ScheduleBuilderProps) {
  const updateDay = (dayId: string, field: keyof DaySchedule, val: any) => {
    onChange({
      ...value,
      [dayId]: { ...value[dayId], [field]: val },
    })
  }

  return (
    <div className="space-y-3">
      <Label className="text-slate-700 font-semibold text-sm">
        Horário de Funcionamento
      </Label>
      <div className="space-y-2">
        {DAYS.map((day) => {
          const s = value[day.id]
          return (
            <div
              key={day.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 transition-colors hover:bg-slate-100/50"
            >
              <div className="w-full sm:w-36 flex items-center justify-between sm:justify-start gap-3">
                <Switch
                  checked={s.isOpen}
                  onCheckedChange={(c) => updateDay(day.id, 'isOpen', c)}
                />
                <span
                  className={cn(
                    'text-sm font-medium',
                    !s.isOpen && 'text-slate-400',
                  )}
                >
                  {day.label}
                </span>
              </div>
              <div
                className={cn(
                  'flex-1 flex items-center gap-2',
                  !s.isOpen && 'opacity-50 pointer-events-none',
                )}
              >
                <Select
                  disabled={!s.isOpen}
                  value={s.openTime}
                  onValueChange={(v) => updateDay(day.id, 'openTime', v)}
                >
                  <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {TIME_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-slate-400 text-xs font-medium">até</span>
                <Select
                  disabled={!s.isOpen}
                  value={s.closeTime}
                  onValueChange={(v) => updateDay(day.id, 'closeTime', v)}
                >
                  <SelectTrigger className="h-9 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {TIME_OPTIONS.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
