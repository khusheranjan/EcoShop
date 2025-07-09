export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "carbon" | "purchases" | "streaks" | "milestones" | "community"
  points: number
  requirement: {
    type: "carbon_saved" | "low_carbon_purchases" | "streak_days" | "total_purchases" | "verified_purchases"
    target: number
    current?: number
  }
  unlocked: boolean
  unlockedAt?: Date
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface UserRewards {
  totalPoints: number
  level: number
  currentStreak: number
  longestStreak: number
  totalCarbonSaved: number
  lowCarbonPurchases: number
  verifiedPurchases: number
  totalPurchases: number
  achievements: Achievement[]
  availableRewards: Reward[]
  redeemedRewards: RedeemedReward[]
}

export interface Reward {
  id: string
  title: string
  description: string
  pointsCost: number
  type: "discount" | "free_shipping" | "carbon_offset" | "exclusive_access"
  value: number
  available: boolean
  expiresAt?: Date
}

export interface RedeemedReward extends Reward {
  redeemedAt: Date
  used: boolean
  usedAt?: Date
}

export interface LevelInfo {
  level: number
  title: string
  pointsRequired: number
  benefits: string[]
  color: string
}
