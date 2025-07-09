"use client"

import { useState, useMemo } from "react"
import { Header } from "./components/header"
import { ProductCard } from "./components/product-card"
import { Filters, type FilterState } from "./components/filters"
import { CartSidebar } from "./components/cart-sidebar"
import { products } from "./data/products"
import { useCart } from "./hooks/use-cart"
import { RewardsDashboard } from "./components/rewards-dashboard"
import { AchievementNotification } from "./components/achievement-notification"
import { useRewards } from "./hooks/use-rewards"
import { Button } from "./components/ui/button"
import { EcoCoinDashboard } from "./components/ecocoin-dashboard"
import { CoinNotification } from "./components/coin-notification"
import { useEcoCoins } from "./hooks/use-ecocoins"

export default function ShoppingWebsite() {
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    carbonImpact: [],
    priceRange: [0, 500],
    verified: false,
    inStock: true,
  })

  const { addItem } = useCart()
  const [rewardsDashboardOpen, setRewardsDashboardOpen] = useState(false)
  const [coinDashboardOpen, setCoinDashboardOpen] = useState(false)
  const { newAchievements, dismissNewAchievements } = useRewards()
  const { newEarnings, dismissNewEarnings } = useEcoCoins()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Carbon impact filter
      if (filters.carbonImpact.length > 0 && !filters.carbonImpact.includes(product.carbonImpact)) {
        return false
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false
      }

      // Verified filter
      if (filters.verified && !product.verified) {
        return false
      }

      return true
    })
  }, [searchQuery, filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCartClick={() => setCartOpen(true)}
        onSearchChange={setSearchQuery}
        onRewardsDashboardClick={() => setRewardsDashboardOpen(true)}
        onCoinDashboardClick={() => setCoinDashboardOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Filters onFiltersChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Sustainable Products</h1>
              <p className="text-gray-600">
                {filteredProducts.length} products found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addItem} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Rewards Dashboard */}
      {rewardsDashboardOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Rewards Dashboard</h1>
              <Button variant="outline" onClick={() => setRewardsDashboardOpen(false)}>
                Close
              </Button>
            </div>
            <RewardsDashboard />
          </div>
        </div>
      )}

      {/* Coin Dashboard */}
      {coinDashboardOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">EcoCoin Dashboard</h1>
              <Button variant="outline" onClick={() => setCoinDashboardOpen(false)}>
                Close
              </Button>
            </div>
            <EcoCoinDashboard />
          </div>
        </div>
      )}

      {/* Achievement Notifications */}
      <AchievementNotification achievements={newAchievements} onDismiss={dismissNewAchievements} />

      {/* Coin Earning Notifications */}
      <CoinNotification earnings={newEarnings} onDismiss={dismissNewEarnings} />
    </div>
  )
}
