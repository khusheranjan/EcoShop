"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Trophy, Sparkles } from "lucide-react"
import type { Achievement } from "../types/rewards"

interface AchievementNotificationProps {
  achievements: Achievement[]
  onDismiss: () => void
}

export function AchievementNotification({ achievements, onDismiss }: AchievementNotificationProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (achievements.length > 0) {
      setVisible(true)
    }
  }, [achievements])

  if (!visible || achievements.length === 0) return null

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800"
      case "rare":
        return "bg-blue-100 text-blue-800"
      case "epic":
        return "bg-purple-100 text-purple-800"
      case "legendary":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card
        className={`max-w-md w-full transform transition-all duration-300 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold">Achievement Unlocked!</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="border rounded-lg p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-700">+{achievement.points} points</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleDismiss} className="w-full mt-4">
            Awesome!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
