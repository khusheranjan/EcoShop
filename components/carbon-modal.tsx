"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Info, Shield, ExternalLink } from "lucide-react"
import type { Product } from "../types/product"

interface CarbonModalProps {
  product: Product
  children: React.ReactNode
}

export function CarbonModal({ product, children }: CarbonModalProps) {
  const totalScore = product.carbonScore
  const breakdown = product.carbonBreakdown

  const getPercentage = (value: number) => (value / totalScore) * 100

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Carbon Impact Breakdown
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{totalScore} kg CO₂e</div>
            <p className="text-sm text-gray-600 mt-1">Total carbon footprint for this product</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Impact Sources</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Manufacturing</span>
                  <span>{breakdown.manufacturing} kg CO₂e</span>
                </div>
                <Progress value={getPercentage(breakdown.manufacturing)} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Transportation</span>
                  <span>{breakdown.transportation} kg CO₂e</span>
                </div>
                <Progress value={getPercentage(breakdown.transportation)} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Packaging</span>
                  <span>{breakdown.packaging} kg CO₂e</span>
                </div>
                <Progress value={getPercentage(breakdown.packaging)} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>End of Life</span>
                  <span>{breakdown.disposal} kg CO₂e</span>
                </div>
                <Progress value={getPercentage(breakdown.disposal)} className="h-2" />
              </div>
            </div>
          </div>

          {product.verified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Verified Data</span>
              </div>
              <p className="text-sm text-green-800">Carbon calculations verified by {product.verifiedBy}</p>
              <Button variant="link" className="p-0 h-auto text-green-700 text-sm mt-2">
                View methodology <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What this means</h4>
            <p className="text-sm text-blue-800">
              This is equivalent to driving approximately {Math.round(totalScore * 2.3)} miles in an average car.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
