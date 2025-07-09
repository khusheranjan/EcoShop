"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Gift, TrendingUp, Leaf, Zap, Target, Award, Sparkles } from "lucide-react"
import { useRewards } from "../hooks/use-rewards"

export function RewardsDashboard() {
  const { rewards, redeemReward, getCurrentLevelInfo, getNextLevelInfo, getProgressToNextLevel } = useRewards()

  const [selectedTab, setSelectedTab] = useState("overview")

  const currentLevel = getCurrentLevelInfo()
  const nextLevel = getNextLevelInfo()
  const progressToNext = getProgressToNextLevel()

  const unlockedAchievements = rewards.achievements.filter((a) => a.unlocked)
  const lockedAchievements = rewards.achievements.filter((a) => !a.unlocked)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleRedeemReward = (rewardId: string) => {
    const success = redeemReward(rewardId)
    if (success) {
      // Could add a toast notification here
      console.log("Reward redeemed successfully!")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Rewards Dashboard</h1>
        <p className="text-gray-600">Track your sustainable shopping journey</p>
      </div>

      {/* Level Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${currentLevel.color} bg-opacity-10`}>
                <Star className={`w-6 h-6 ${currentLevel.color}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentLevel.title}</h2>
                <p className="text-gray-600">Level {currentLevel.level}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{rewards.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>

          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextLevel.title}</span>
                <span>{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <p className="text-xs text-gray-500">
                {nextLevel.pointsRequired - rewards.totalPoints} points to next level
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{rewards.totalCarbonSaved.toFixed(1)}</div>
            <div className="text-sm text-gray-600">kg CO₂ Saved</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{rewards.currentStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
            <div className="text-sm text-gray-600">Achievements</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{rewards.redeemedRewards.length}</div>
            <div className="text-sm text-gray-600">Rewards Used</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unlockedAchievements.slice(-3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg mb-2 last:mb-0">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                  </div>
                ))}
                {unlockedAchievements.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No achievements yet. Start shopping sustainably!</p>
                )}
              </CardContent>
            </Card>

            {/* Impact Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Low Carbon Purchases</span>
                  <span className="font-medium">{rewards.lowCarbonPurchases}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified Products</span>
                  <span className="font-medium">{rewards.verifiedPurchases}</span>
                </div>
                <div className="flex justify-between">
                  <span>Longest Streak</span>
                  <span className="font-medium">{rewards.longestStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spent</span>
                  <span className="font-medium">${rewards.totalPurchases.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unlocked Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Unlocked ({unlockedAchievements.length})
              </h3>
              <div className="space-y-3">
                {unlockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">+{achievement.points} points</span>
                            {achievement.unlockedAt && (
                              <span className="text-xs text-gray-500 ml-auto">
                                {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Locked Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-600" />
                In Progress ({lockedAchievements.length})
              </h3>
              <div className="space-y-3">
                {lockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl grayscale">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-700">{achievement.title}</h4>
                            <Badge variant="outline">{achievement.rarity}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>
                                {achievement.requirement.current || 0} / {achievement.requirement.target}
                              </span>
                            </div>
                            <Progress
                              value={((achievement.requirement.current || 0) / achievement.requirement.target) * 100}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.availableRewards.map((reward) => (
              <Card key={reward.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{reward.title}</h4>
                      <Badge variant="outline">{reward.pointsCost} pts</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                    {reward.expiresAt && (
                      <p className="text-xs text-orange-600">
                        Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                    <Button
                      onClick={() => handleRedeemReward(reward.id)}
                      disabled={rewards.totalPoints < reward.pointsCost}
                      className="w-full"
                      size="sm"
                    >
                      {rewards.totalPoints < reward.pointsCost ? "Not Enough Points" : "Redeem"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {rewards.redeemedRewards.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Your Redeemed Rewards</h3>
              <div className="space-y-2">
                {rewards.redeemedRewards.map((reward, index) => (
                  <Card key={index} className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{reward.title}</h4>
                          <p className="text-sm text-gray-600">
                            Redeemed: {new Date(reward.redeemedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={reward.used ? "secondary" : "default"}>
                          {reward.used ? "Used" : "Available"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
