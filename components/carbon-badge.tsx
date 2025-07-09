import { Badge } from "@/components/ui/badge"
import { Leaf, AlertTriangle, Zap } from "lucide-react"

interface CarbonBadgeProps {
  impact: "low" | "medium" | "high"
  score: number
  size?: "sm" | "md" | "lg"
  showScore?: boolean
}

export function CarbonBadge({ impact, score, size = "md", showScore = false }: CarbonBadgeProps) {
  const getImpactConfig = (impact: string) => {
    switch (impact) {
      case "low":
        return {
          icon: Leaf,
          color: "bg-green-100 text-green-800 hover:bg-green-200",
          label: "Low Carbon",
        }
      case "medium":
        return {
          icon: AlertTriangle,
          color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
          label: "Medium Carbon",
        }
      case "high":
        return {
          icon: Zap,
          color: "bg-red-100 text-red-800 hover:bg-red-200",
          label: "High Carbon",
        }
      default:
        return {
          icon: Leaf,
          color: "bg-gray-100 text-gray-800",
          label: "Unknown",
        }
    }
  }

  const config = getImpactConfig(impact)
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1.5",
    lg: "text-base px-3 py-2",
  }

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} flex items-center gap-1 font-medium`}>
      <Icon className="w-3 h-3" />
      {config.label}
      {showScore && <span className="ml-1">({score} kg CO₂e)</span>}
    </Badge>
  )
}
