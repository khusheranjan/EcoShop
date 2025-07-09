import type { Reward } from "../types/rewards"

export const availableRewards: Reward[] = [
  {
    id: "discount_5",
    title: "5% Off Next Purchase",
    description: "Get 5% off your next order of sustainable products",
    pointsCost: 100,
    type: "discount",
    value: 5,
    available: true,
  },
  {
    id: "discount_10",
    title: "10% Off Next Purchase",
    description: "Get 10% off your next order of sustainable products",
    pointsCost: 200,
    type: "discount",
    value: 10,
    available: true,
  },
  {
    id: "free_shipping",
    title: "Free Shipping",
    description: "Free shipping on your next order",
    pointsCost: 150,
    type: "free_shipping",
    value: 0,
    available: true,
  },
  {
    id: "carbon_offset_10",
    title: "10kg Carbon Offset",
    description: "We'll offset 10kg of CO₂ on your behalf",
    pointsCost: 250,
    type: "carbon_offset",
    value: 10,
    available: true,
  },
  {
    id: "carbon_offset_25",
    title: "25kg Carbon Offset",
    description: "We'll offset 25kg of CO₂ on your behalf",
    pointsCost: 500,
    type: "carbon_offset",
    value: 25,
    available: true,
  },
  {
    id: "early_access",
    title: "Early Access Pass",
    description: "Get early access to new sustainable product launches",
    pointsCost: 300,
    type: "exclusive_access",
    value: 0,
    available: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
]
