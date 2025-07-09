"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Minus, Plus, Trash2, Leaf, Coins } from "lucide-react"
import Image from "next/image"
import { useCart } from "../hooks/use-cart"
import { useCarbonSettings } from "../hooks/use-carbon-settings"
import { CarbonBadge } from "./carbon-badge"
import { CartEcoScore } from "./cart-eco-score"
import { useRewards } from "../hooks/use-rewards"
import { CoinCheckoutPanel } from "./coin-checkout-panel"
import { useEcoCoins } from "../hooks/use-ecocoins"
import { useState } from "react"

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalCarbonImpact } = useCart()
  const { settings } = useCarbonSettings()
  const { processPurchase } = useRewards()
  const { processPurchaseEarnings } = useEcoCoins()

  const [coinDiscount, setCoinDiscount] = useState(0)
  const [coinsUsed, setCoinsUsed] = useState(0)

  const handleCheckout = () => {
    if (items.length > 0) {
      const rewardResult = processPurchase(items)
      const coinResult = processPurchaseEarnings(items)
      console.log(`Earned ${rewardResult.pointsEarned} points and ${coinResult.totalEarned} EcoCoins!`)
      // Here you would normally proceed with actual checkout
    }
  }

  const handleCoinDiscount = (discount: number, coins: number) => {
    setCoinDiscount(discount)
    setCoinsUsed(coins)
  }

  const subtotal = getTotalPrice()
  const finalTotal = Math.max(0, subtotal - coinDiscount)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({items.length})</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6">
            {settings.showCarbonData && <CartEcoScore />}

            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <p className="text-xs text-gray-600">{item.brand}</p>

                      {settings.showCarbonData && (
                        <CarbonBadge
                          impact={item.carbonImpact}
                          score={item.carbonScore * item.quantity}
                          size="sm"
                          showScore
                        />
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              {/* Add CoinCheckoutPanel */}
              <CoinCheckoutPanel orderTotal={getTotalPrice()} onCoinDiscount={handleCoinDiscount} />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {coinDiscount > 0 && (
                  <div className="flex justify-between text-yellow-600">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      EcoCoin Discount ({coinsUsed} coins)
                    </span>
                    <span>-${coinDiscount.toFixed(2)}</span>
                  </div>
                )}

                {settings.showCarbonData && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      Total Carbon Impact
                    </span>
                    <span>{getTotalCarbonImpact().toFixed(1)} kg CO₂e</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Checkout - ${finalTotal.toFixed(2)}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
