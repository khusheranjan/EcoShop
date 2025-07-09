"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, TrendingUp, Calendar, ShoppingBag, Target, Leaf, Award, DollarSign } from "lucide-react"
import { useEcoCoins } from "../hooks/use-ecocoins"

export function EcoCoinDashboard() {
  const {
    balance,
    getRecentTransactions,
    getTodayEarnings,
    getWeeklyEarnings,
    getCoinsValue,
    COIN_RATES,
    COIN_TO_DOLLAR_RATE,
  } = useEcoCoins()

  const [selectedTab, setSelectedTab] = useState("overview")

  const todayEarnings = getTodayEarnings()
  const weeklyEarnings = getWeeklyEarnings()
  const recentTransactions = getRecentTransactions(20)

  const earnedTransactions = recentTransactions.filter((t) => t.type === "earned")
  const spentTransactions = recentTransactions.filter((t) => t.type === "spent")

  const getTransactionIcon = (source: string) => {
    switch (source) {
      case "low_carbon_purchase":
        return <Leaf className="w-4 h-4 text-green-600" />
      case "achievement_bonus":
        return <Award className="w-4 h-4 text-yellow-600" />
      case "daily_streak":
        return <Calendar className="w-4 h-4 text-blue-600" />
      case "checkout_discount":
        return <DollarSign className="w-4 h-4 text-purple-600" />
      default:
        return <Coins className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Coins className="w-8 h-8 text-yellow-600" />
          EcoCoin Dashboard
        </h1>
        <p className="text-gray-600">Earn coins by shopping sustainably, spend them on future purchases</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-6 h-6 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-900">{balance.total}</span>
              </div>
              <p className="text-sm text-yellow-700">Available EcoCoins</p>
              <p className="text-xs text-yellow-600 mt-1">Worth ${getCoinsValue(balance.total).toFixed(2)}</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{balance.earned}</div>
              <p className="text-sm text-gray-600">Total Earned</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{balance.spent}</div>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{todayEarnings}</div>
            <div className="text-sm text-gray-600">Earned Today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{weeklyEarnings}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{earnedTransactions.length}</div>
            <div className="text-sm text-gray-600">Earning Events</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">How It Works</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="earning">Earning Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How EcoCoins Work */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  How EcoCoins Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Buy Low-Carbon Products</p>
                      <p className="text-sm text-green-700">Earn {COIN_RATES.low} EcoCoins per item</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Perfect Eco-Cart</p>
                      <p className="text-sm text-yellow-700">+25 bonus coins for all low-carbon purchases</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Spend & Save</p>
                      <p className="text-sm text-blue-700">{COIN_TO_DOLLAR_RATE} coins = $1 discount</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Earning Potential */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Earning Potential
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Low-Carbon Product</p>
                      <p className="text-sm text-gray-600">Best choice for environment</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+{COIN_RATES.low} coins</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Medium-Carbon Product</p>
                      <p className="text-sm text-gray-600">Moderate environmental impact</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">+{COIN_RATES.medium} coins</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg opacity-60">
                    <div>
                      <p className="font-medium">High-Carbon Product</p>
                      <p className="text-sm text-gray-600">Higher environmental impact</p>
                    </div>
                    <Badge variant="outline">+{COIN_RATES.high} coins</Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                  <p className="font-medium text-green-900 mb-1">💡 Pro Tip</p>
                  <p className="text-sm text-green-700">
                    Fill your cart with only low-carbon products to earn the perfect eco-cart bonus!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Earnings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  Recent Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {earnedTransactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No earnings yet. Start shopping sustainably!</p>
                  ) : (
                    earnedTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                      >
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.source)}
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-green-600 font-bold">+{transaction.amount}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Spending */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <ShoppingBag className="w-5 h-5" />
                  Recent Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {spentTransactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No spending yet. Use your coins for discounts!</p>
                  ) : (
                    spentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                      >
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.source)}
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                          </div>
                        </div>
                        <div className="text-blue-600 font-bold">-{transaction.amount}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="earning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Maximize Your EcoCoin Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Earning Strategies</h3>

                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Focus on Low-Carbon Products</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Each low-carbon product earns you {COIN_RATES.low} EcoCoins. Look for the green badges!
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium">Go for Perfect Carts</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        When all items in your cart are low-carbon, you get an extra 25 coin bonus!
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Shop Consistently</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Regular sustainable shopping helps build habits and maximizes your earnings over time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Spending Your Coins</h3>

                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Checkout Discounts</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">Use your EcoCoins at checkout for instant discounts.</p>
                      <div className="bg-gray-50 p-2 rounded text-sm">
                        <strong>{COIN_TO_DOLLAR_RATE} EcoCoins = $1.00 discount</strong>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Save for Bigger Purchases</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Accumulate coins over time to get significant discounts on larger sustainable purchases.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
