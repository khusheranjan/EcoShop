export interface CoinTransaction {
  id: string
  type: "earned" | "spent"
  amount: number
  source: "low_carbon_purchase" | "achievement_bonus" | "daily_streak" | "checkout_discount"
  description: string
  productId?: string
  productName?: string
  timestamp: Date
}

export interface CoinBalance {
  total: number
  earned: number
  spent: number
  transactions: CoinTransaction[]
}

export interface CoinEarningRate {
  low: number // EcoCoins per low-carbon product
  medium: number // EcoCoins per medium-carbon product
  high: number // EcoCoins per high-carbon product
}

export interface CoinReward {
  id: string
  title: string
  description: string
  coinValue: number
  trigger: "first_low_carbon" | "daily_streak" | "carbon_milestone" | "perfect_week"
  claimed: boolean
}
