"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, DollarSign, Sparkles } from "lucide-react"
import { useEcoCoins } from "../hooks/use-ecocoins"

interface CoinCheckoutPanelProps {
  orderTotal: number
  onCoinDiscount: (discount: number, coinsUsed: number) => void
}

export function CoinCheckoutPanel({ orderTotal, onCoinDiscount }: CoinCheckoutPanelProps) {
  const { balance, getCoinsValue, getRequiredCoinsForDiscount, spendCoins } = useEcoCoins()
  const [coinsToUse, setCoinsToUse] = useState(0)

  const maxUsableCoins = Math.min(balance.total, Math.floor(orderTotal * 100)) // Can't use more than order total
  const discountAmount = getCoinsValue(coinsToUse)

  const handleApplyDiscount = () => {
    if (coinsToUse > 0 && coinsToUse <= balance.total) {
      const success = spendCoins(coinsToUse, `Checkout discount: $${discountAmount.toFixed(2)}`)
      if (success) {
        onCoinDiscount(discountAmount, coinsToUse)
      }
    }
  }

  const handleUseAllCoins = () => {
    setCoinsToUse(maxUsableCoins)
  }

  const handleUseHalfCoins = () => {
    setCoinsToUse(Math.floor(maxUsableCoins / 2))
  }

  if (balance.total === 0) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="text-center">
            <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-yellow-800 font-medium">Start earning EcoCoins!</p>
            <p className="text-xs text-yellow-700 mt-1">Buy low-carbon products to earn coins for future discounts</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Coins className="w-5 h-5 text-yellow-600" />
          Use Your EcoCoins
        </CardTitle>
        <p className="text-sm text-gray-600">
          You have {balance.total} EcoCoins (${getCoinsValue(balance.total).toFixed(2)} value)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coins-input">EcoCoins to use</Label>
          <div className="flex gap-2">
            <Input
              id="coins-input"
              type="number"
              value={coinsToUse}
              onChange={(e) => setCoinsToUse(Math.min(Number.parseInt(e.target.value) || 0, maxUsableCoins))}
              max={maxUsableCoins}
              min={0}
              placeholder="Enter coins"
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={handleUseHalfCoins}>
              Use 50%
            </Button>
            <Button variant="outline" size="sm" onClick={handleUseAllCoins}>
              Use All
            </Button>
          </div>
        </div>

        {coinsToUse > 0 && (
          <div className="bg-white/50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Discount Amount:</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-600">${discountAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Coins Used:</span>
              <span>{coinsToUse} EcoCoins</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleApplyDiscount}
          disabled={coinsToUse === 0 || coinsToUse > balance.total}
          className="w-full bg-yellow-600 hover:bg-yellow-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Apply EcoCoin Discount
        </Button>

        <div className="text-xs text-center text-gray-500">
          100 EcoCoins = $1.00 discount • Max {maxUsableCoins} coins usable for this order
        </div>
      </CardContent>
    </Card>
  )
}
