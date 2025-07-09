"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Sparkles, X } from "lucide-react"
import type { CoinTransaction } from "../types/coins"

interface CoinNotificationProps {
  earnings: CoinTransaction[]
  onDismiss: () => void
}

export function CoinNotification({ earnings, onDismiss }: CoinNotificationProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (earnings.length > 0) {
      setVisible(true)
    }
  }, [earnings])

  if (!visible || earnings.length === 0) return null

  const totalEarned = earnings.reduce((sum, earning) => sum + earning.amount, 0)

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card
        className={`w-80 transform transition-all duration-500 ${
          visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Coins className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-yellow-900">EcoCoins Earned!</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            {earnings.map((earning) => (
              <div key={earning.id} className="flex justify-between items-center">
                <span className="text-sm text-gray-700">{earning.description}</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <span className="font-medium text-yellow-700">+{earning.amount}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-yellow-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-yellow-900">Total Earned</span>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="font-bold text-lg text-yellow-700">{totalEarned}</span>
              </div>
            </div>
            <p className="text-xs text-yellow-600 mt-1">Use your EcoCoins for discounts on future purchases!</p>
          </div>

          <Button onClick={handleDismiss} size="sm" className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700">
            Awesome!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
