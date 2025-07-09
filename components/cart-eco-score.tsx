"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Leaf, TreePine, Car } from "lucide-react"
import { useCart } from "../hooks/use-cart"
import { useCarbonSettings } from "../hooks/use-carbon-settings"

export function CartEcoScore() {
  const { getTotalCarbonImpact, items } = useCart()
  const { settings } = useCarbonSettings()

  if (!settings.showCarbonData || items.length === 0) return null

  const totalCarbon = getTotalCarbonImpact()
  const averageCarbon = totalCarbon / items.reduce((sum, item) => sum + item.quantity, 0)

  const getImpactLevel = (carbon: number) => {
    if (carbon < 5) return { level: "low", color: "text-green-600", bgColor: "bg-green-100" }
    if (carbon < 15) return { level: "medium", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    return { level: "high", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const impact = getImpactLevel(totalCarbon)
  const drivingEquivalent = Math.round(totalCarbon * 2.3)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Leaf className="w-5 h-5 text-green-600" />
          Cart Eco Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Carbon Impact</span>
          <span className={`font-bold ${impact.color}`}>{totalCarbon.toFixed(1)} kg CO₂e</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low Impact</span>
            <span>High Impact</span>
          </div>
          <Progress value={Math.min((totalCarbon / 50) * 100, 100)} className="h-2" />
        </div>

        <div className={`${impact.bgColor} rounded-lg p-3 space-y-2`}>
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            <span className="text-sm font-medium">Equivalent to driving {drivingEquivalent} miles</span>
          </div>

          <div className="flex items-center gap-2">
            <TreePine className="w-4 h-4" />
            <span className="text-sm">Plant {Math.ceil(totalCarbon / 22)} trees to offset this impact</span>
          </div>
        </div>

        {impact.level === "low" && (
          <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
            🎉 Great job! Your cart has a low carbon footprint.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
