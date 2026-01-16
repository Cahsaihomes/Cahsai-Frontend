import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

export function FilterChip({ label, isSelected, onClick }: FilterChipProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "rounded-full px-4 py-2 text-sm transition-colors",
        isSelected
          ? "bg-[#968470] text-white hover:bg-[#7a6d5e]"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200",
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
