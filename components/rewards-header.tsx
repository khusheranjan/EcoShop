"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Trophy, Star, TrendingUp } from "lucide-react"
import { useRewards } from "../hooks/use-rewards"

interface RewardsHeaderProps {
  onDashboardClick: () => void
}

export function RewardsHeader({ onDashboardClick }: RewardsHeaderProps) {
  const { rewards, getCurrentLevelInfo, getNextLevelInfo, getProgressToNextLevel } = useRewards()

  const currentLevel = getCurrentLevelInfo()
  const nextLevel = getNextLevelInfo()
  const progressToNext = getProgressToNextLevel()
  const unlockedAchievements = rewards.achievements.filter((a) => a.unlocked).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className={`p-1 rounded-full ${currentLevel.color} bg-opacity-10`}>
            <Star className={`w-4 h-4 ${currentLevel.color}`} />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">{rewards.totalPoints} pts</div>
            <div className="text-xs text-gray-500">Level {currentLevel.level}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Rewards Summary</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-4 space-y-4">
          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{currentLevel.title}</span>
              <Badge variant="outline">Level {currentLevel.level}</Badge>
            </div>
            {nextLevel && (
              <>
                <Progress value={progressToNext} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {Math.round(progressToNext)}% to {nextLevel.title}
                  </span>
                  <span>{nextLevel.pointsRequired - rewards.totalPoints} pts needed</span>
                </div>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{rewards.totalCarbonSaved.toFixed(1)}</div>
              <div className="text-xs text-gray-500">kg CO₂ Saved</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{rewards.currentStreak}</div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{unlockedAchievements}</div>
              <div className="text-xs text-gray-500">Achievements</div>
            </div>
          </div>

          {/* Recent Achievement */}
          {unlockedAchievements > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Latest Achievement</span>
              </div>
              {(() => {
                const latest = rewards.achievements
                  .filter((a) => a.unlocked)
                  .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())[0]
                return latest ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{latest.icon}</span>
                    <span className="text-sm text-yellow-700">{latest.title}</span>
                  </div>
                ) : null
              })()}
            </div>
          )}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDashboardClick}>
          <TrendingUp className="w-4 h-4 mr-2" />
          View Full Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
