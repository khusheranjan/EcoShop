"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, ShoppingCart } from "lucide-react"
import type { Product } from "../types/product"
import { CarbonBadge } from "./carbon-badge"
import { CarbonModal } from "./carbon-modal"
import { useCarbonSettings } from "../hooks/use-carbon-settings"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { settings } = useCarbonSettings()

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {settings.showCarbonData && (
            <div className="absolute top-2 right-2">
              <CarbonModal product={product}>
                <button className="cursor-pointer">
                  <CarbonBadge impact={product.carbonImpact} score={product.carbonScore} size="sm" />
                </button>
              </CarbonModal>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          </div>

          <p className="text-sm text-gray-600">{product.brand}</p>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 ml-1">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {settings.showCarbonData && (
              <CarbonModal product={product}>
                <button className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                  {product.carbonScore} kg CO₂e
                </button>
              </CarbonModal>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onAddToCart(product)} className="w-full" disabled={!product.inStock}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  )
}
