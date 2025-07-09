export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  brand: string
  carbonImpact: "low" | "medium" | "high"
  carbonScore: number // kg CO2e
  carbonBreakdown: {
    manufacturing: number
    transportation: number
    packaging: number
    disposal: number
  }
  verified: boolean
  verifiedBy: string
  description: string
  inStock: boolean
  rating: number
  reviews: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface CarbonSettings {
  showCarbonData: boolean
  defaultView: "minimal" | "detailed"
}
