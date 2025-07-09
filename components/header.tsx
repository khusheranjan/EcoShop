"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, ShoppingCart, Settings, Leaf, User } from "lucide-react"
import { useCart } from "../hooks/use-cart"
import { useCarbonSettings } from "../hooks/use-carbon-settings"
import { RewardsHeader } from "./rewards-header"
import { CoinBalanceDisplay } from "./coin-balance-display"

interface HeaderProps {
  onCartClick: () => void
  onSearchChange: (query: string) => void
  onRewardsDashboardClick: () => void
  onCoinDashboardClick: () => void
}

export function Header({ onCartClick, onSearchChange, onRewardsDashboardClick, onCoinDashboardClick }: HeaderProps) {
  const { getItemCount } = useCart()
  const { settings, updateSettings } = useCarbonSettings()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold">EcoShop</span>
          </div>

          <div className="relative w-96 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search sustainable products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Carbon Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Carbon Transparency Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="carbon-toggle" className="text-sm font-medium">
                      Show Carbon Data
                    </Label>
                    <p className="text-xs text-gray-500">Display carbon footprint information on products</p>
                  </div>
                  <Switch
                    id="carbon-toggle"
                    checked={settings.showCarbonData}
                    onCheckedChange={(checked) => updateSettings({ showCarbonData: checked })}
                  />
                </div>

                <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-900 mb-1">Why Carbon Data?</p>
                  <p>
                    Make informed choices about your environmental impact. All data is verified by third-party
                    organizations.
                  </p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Rewards */}
          <RewardsHeader onDashboardClick={onRewardsDashboardClick} />

          {/* EcoCoins */}
          <CoinBalanceDisplay onDashboardClick={onCoinDashboardClick} />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Orders</DropdownMenuItem>
              <DropdownMenuItem>Carbon Dashboard</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Button variant="ghost" size="icon" onClick={onCartClick} className="relative">
            <ShoppingCart className="w-4 h-4" />
            {getItemCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {getItemCount()}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
