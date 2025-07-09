"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Coins, TrendingUp, Eye } from "lucide-react"
import { useEcoCoins } from "../hooks/use-ecocoins"

interface CoinBalanceDisplayProps {
  onDashboardClick: () => void
}

export function CoinBalanceDisplay({ onDashboardClick }: CoinBalanceDisplayProps) {
  const { balance, getTodayEarnings, getCoinsValue } = useEcoCoins()

  const todayEarnings = getTodayEarnings()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-yellow-100">
            <Coins className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">{balance.total}</div>
            <div className="text-xs text-gray-500">EcoCoins</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>EcoCoin Balance</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-4 space-y-4">
          {/* Balance Overview */}
          <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-6 h-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-900">{balance.total}</span>
            </div>
            <p className="text-sm text-yellow-700">Available EcoCoins</p>
            <p className="text-xs text-yellow-600 mt-1">
              Worth ${getCoinsValue(balance.total).toFixed(2)} in discounts
            </p>
          </div>

          {/* Today's Stats */}
          {todayEarnings > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Today's Earnings</span>
              </div>
              <p className="text-lg font-bold text-green-700">+{todayEarnings} EcoCoins</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div>
              <div className="font-bold text-green-600">{balance.earned}</div>
              <div className="text-xs text-gray-500">Total Earned</div>
            </div>
            <div>
              <div className="font-bold text-blue-600">{balance.spent}</div>
              <div className="text-xs text-gray-500">Total Spent</div>
            </div>
          </div>

          {/* How to Earn More */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900 mb-1">💡 Earn More Coins</p>
            <p className="text-xs text-blue-700">
              Buy low-carbon products to earn 10 coins each. Fill your cart with only eco-friendly items for bonus
              coins!
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDashboardClick}>
          <Eye className="w-4 h-4 mr-2" />
          View Full Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
