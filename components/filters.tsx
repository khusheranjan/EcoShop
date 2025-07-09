"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { useCarbonSettings } from "../hooks/use-carbon-settings"

interface FiltersProps {
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  categories: string[]
  carbonImpact: string[]
  priceRange: [number, number]
  verified: boolean
  inStock: boolean
}

const categories = [
  { id: "clothing", label: "Clothing" },
  { id: "electronics", label: "Electronics" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "accessories", label: "Accessories" },
]

const carbonImpacts = [
  { id: "low", label: "Low Carbon", color: "bg-green-100 text-green-800" },
  { id: "medium", label: "Medium Carbon", color: "bg-yellow-100 text-yellow-800" },
  { id: "high", label: "High Carbon", color: "bg-red-100 text-red-800" },
]

export function Filters({ onFiltersChange }: FiltersProps) {
  const { settings } = useCarbonSettings()
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    carbonImpact: [],
    priceRange: [0, 500],
    verified: false,
    inStock: true,
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    const cleared: FilterState = {
      categories: [],
      carbonImpact: [],
      priceRange: [0, 500],
      verified: false,
      inStock: true,
    }
    setFilters(cleared)
    onFiltersChange(cleared)
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.carbonImpact.length > 0 ||
    filters.verified ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-medium mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateFilters({
                        categories: [...filters.categories, category.id],
                      })
                    } else {
                      updateFilters({
                        categories: filters.categories.filter((c) => c !== category.id),
                      })
                    }
                  }}
                />
                <Label htmlFor={category.id} className="text-sm">
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Carbon Impact */}
        {settings.showCarbonData && (
          <>
            <div>
              <h3 className="font-medium mb-3">Carbon Impact</h3>
              <div className="space-y-2">
                {carbonImpacts.map((impact) => (
                  <div key={impact.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={impact.id}
                      checked={filters.carbonImpact.includes(impact.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilters({
                            carbonImpact: [...filters.carbonImpact, impact.id],
                          })
                        } else {
                          updateFilters({
                            carbonImpact: filters.carbonImpact.filter((c) => c !== impact.id),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={impact.id} className="text-sm flex items-center gap-2">
                      <Badge className={`${impact.color} text-xs px-2 py-1`}>{impact.label}</Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={500}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Other Filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
            />
            <Label htmlFor="inStock" className="text-sm">
              In Stock Only
            </Label>
          </div>

          {settings.showCarbonData && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={filters.verified}
                onCheckedChange={(checked) => updateFilters({ verified: !!checked })}
              />
              <Label htmlFor="verified" className="text-sm">
                Verified Carbon Data
              </Label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
