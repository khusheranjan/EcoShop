import type { Achievement, LevelInfo } from "../types/rewards"

export const achievementTemplates: Omit<Achievement, "unlocked" | "unlockedAt" | "requirement">[] = [
  // Carbon Reduction Achievements
  {
    id: "first_low_carbon",
    title: "Eco Warrior",
    description: "Purchase your first low-carbon product",
    icon: "🌱",
    category: "carbon",
    points: 50,
    rarity: "common",
  },
  {
    id: "carbon_saver_10",
    title: "Carbon Conscious",
    description: "Save 10kg of CO₂ through sustainable choices",
    icon: "🌍",
    category: "carbon",
    points: 100,
    rarity: "common",
  },
  {
    id: "carbon_saver_50",
    title: "Planet Protector",
    description: "Save 50kg of CO₂ through sustainable choices",
    icon: "🛡️",
    category: "carbon",
    points: 250,
    rarity: "rare",
  },
  {
    id: "carbon_saver_100",
    title: "Climate Champion",
    description: "Save 100kg of CO₂ through sustainable choices",
    icon: "🏆",
    category: "carbon",
    points: 500,
    rarity: "epic",
  },

  // Purchase Achievements
  {
    id: "verified_shopper",
    title: "Trust Builder",
    description: "Purchase 5 products with verified carbon data",
    icon: "✅",
    category: "purchases",
    points: 75,
    rarity: "common",
  },
  {
    id: "sustainable_spender",
    title: "Green Investor",
    description: "Spend $500 on sustainable products",
    icon: "💚",
    category: "purchases",
    points: 200,
    rarity: "rare",
  },

  // Streak Achievements
  {
    id: "week_streak",
    title: "Consistency King",
    description: "Make sustainable purchases for 7 days straight",
    icon: "🔥",
    category: "streaks",
    points: 150,
    rarity: "rare",
  },
  {
    id: "month_streak",
    title: "Habit Master",
    description: "Make sustainable purchases for 30 days straight",
    icon: "⚡",
    category: "streaks",
    points: 400,
    rarity: "epic",
  },

  // Milestone Achievements
  {
    id: "first_purchase",
    title: "Welcome Aboard",
    description: "Make your first sustainable purchase",
    icon: "🎉",
    category: "milestones",
    points: 25,
    rarity: "common",
  },
  {
    id: "level_5",
    title: "Rising Star",
    description: "Reach level 5 in the rewards program",
    icon: "⭐",
    category: "milestones",
    points: 300,
    rarity: "rare",
  },
  {
    id: "perfect_cart",
    title: "Zero Waste Hero",
    description: "Complete a purchase with only low-carbon products",
    icon: "🎯",
    category: "carbon",
    points: 100,
    rarity: "rare",
  },
]

export const levelInfo: LevelInfo[] = [
  {
    level: 1,
    title: "Eco Newcomer",
    pointsRequired: 0,
    benefits: ["Welcome bonus", "Basic rewards access"],
    color: "text-gray-600",
  },
  {
    level: 2,
    title: "Green Explorer",
    pointsRequired: 100,
    benefits: ["5% bonus points", "Early access to sales"],
    color: "text-green-600",
  },
  {
    level: 3,
    title: "Sustainability Advocate",
    pointsRequired: 300,
    benefits: ["10% bonus points", "Free carbon offsetting"],
    color: "text-blue-600",
  },
  {
    level: 4,
    title: "Climate Guardian",
    pointsRequired: 600,
    benefits: ["15% bonus points", "Exclusive products"],
    color: "text-purple-600",
  },
  {
    level: 5,
    title: "Planet Champion",
    pointsRequired: 1000,
    benefits: ["20% bonus points", "VIP customer support"],
    color: "text-yellow-600",
  },
]
