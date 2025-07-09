"use client"

import { useState, useEffect, useCallback } from "react"
import type { UserRewards, Achievement, RedeemedReward } from "../types/rewards"
import { achievementTemplates, levelInfo } from "../data/achievements"
import { availableRewards } from "../data/rewards"
import type { CartItem } from "../types/product"

const INITIAL_REWARDS: UserRewards = {
  totalPoints: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  totalCarbonSaved: 0,
  lowCarbonPurchases: 0,
  verifiedPurchases: 0,
  totalPurchases: 0,
  achievements: [],
  availableRewards: availableRewards,
  redeemedRewards: [],
}

export function useRewards() {
  const [rewards, setRewards] = useState<UserRewards>(INITIAL_REWARDS)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("user-rewards")
    if (saved) {
      const parsed = JSON.parse(saved)
      // Initialize achievements if not present
      if (!parsed.achievements || parsed.achievements.length === 0) {
        parsed.achievements = initializeAchievements()
      }
      setRewards(parsed)
    } else {
      const initialWithAchievements = {
        ...INITIAL_REWARDS,
        achievements: initializeAchievements(),
      }
      setRewards(initialWithAchievements)
    }
  }, [])

  const saveRewards = useCallback((newRewards: UserRewards) => {
    setRewards(newRewards)
    localStorage.setItem("user-rewards", JSON.stringify(newRewards))
  }, [])

  const initializeAchievements = (): Achievement[] => {
    return achievementTemplates.map((template) => ({
      ...template,
      unlocked: false,
      requirement: getRequirementForAchievement(template.id),
    }))
  }

  const getRequirementForAchievement = (id: string) => {
    const requirements: Record<string, any> = {
      first_low_carbon: { type: "low_carbon_purchases", target: 1, current: 0 },
      carbon_saver_10: { type: "carbon_saved", target: 10, current: 0 },
      carbon_saver_50: { type: "carbon_saved", target: 50, current: 0 },
      carbon_saver_100: { type: "carbon_saved", target: 100, current: 0 },
      verified_shopper: { type: "verified_purchases", target: 5, current: 0 },
      sustainable_spender: { type: "total_purchases", target: 500, current: 0 },
      week_streak: { type: "streak_days", target: 7, current: 0 },
      month_streak: { type: "streak_days", target: 30, current: 0 },
      first_purchase: { type: "total_purchases", target: 1, current: 0 },
      level_5: { type: "total_purchases", target: 1000, current: 0 },
      perfect_cart: { type: "low_carbon_purchases", target: 1, current: 0 },
    }
    return requirements[id] || { type: "total_purchases", target: 1, current: 0 }
  }

  const calculateLevel = (points: number): number => {
    for (let i = levelInfo.length - 1; i >= 0; i--) {
      if (points >= levelInfo[i].pointsRequired) {
        return levelInfo[i].level
      }
    }
    return 1
  }

  const checkAchievements = useCallback((updatedRewards: UserRewards): Achievement[] => {
    const newlyUnlocked: Achievement[] = []

    const updatedAchievements = updatedRewards.achievements.map((achievement) => {
      if (achievement.unlocked) return achievement

      let currentProgress = 0
      switch (achievement.requirement.type) {
        case "carbon_saved":
          currentProgress = updatedRewards.totalCarbonSaved
          break
        case "low_carbon_purchases":
          currentProgress = updatedRewards.lowCarbonPurchases
          break
        case "verified_purchases":
          currentProgress = updatedRewards.verifiedPurchases
          break
        case "total_purchases":
          currentProgress = updatedRewards.totalPurchases
          break
        case "streak_days":
          currentProgress = updatedRewards.currentStreak
          break
      }

      const updatedAchievement = {
        ...achievement,
        requirement: {
          ...achievement.requirement,
          current: currentProgress,
        },
      }

      if (currentProgress >= achievement.requirement.target && !achievement.unlocked) {
        updatedAchievement.unlocked = true
        updatedAchievement.unlockedAt = new Date()
        newlyUnlocked.push(updatedAchievement)
      }

      return updatedAchievement
    })

    return newlyUnlocked
  }, [])

  const processPurchase = useCallback(
    (items: CartItem[]) => {
      const totalSpent = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalCarbonImpact = items.reduce((sum, item) => sum + item.carbonScore * item.quantity, 0)
      const lowCarbonItems = items.filter((item) => item.carbonImpact === "low").length
      const verifiedItems = items.filter((item) => item.verified).length
      const isAllLowCarbon = items.every((item) => item.carbonImpact === "low")

      // Calculate carbon saved (assuming average product has 10kg CO2e)
      const averageCarbonPerProduct = 10
      const carbonSaved = Math.max(0, averageCarbonPerProduct * items.length - totalCarbonImpact)

      // Calculate points earned
      let pointsEarned = Math.floor(totalSpent * 2) // Base: 2 points per dollar
      if (lowCarbonItems > 0) pointsEarned += lowCarbonItems * 25 // Bonus for low carbon
      if (verifiedItems > 0) pointsEarned += verifiedItems * 15 // Bonus for verified
      if (isAllLowCarbon) pointsEarned += 50 // Perfect cart bonus

      const updatedRewards: UserRewards = {
        ...rewards,
        totalPoints: rewards.totalPoints + pointsEarned,
        totalCarbonSaved: rewards.totalCarbonSaved + carbonSaved,
        lowCarbonPurchases: rewards.lowCarbonPurchases + lowCarbonItems,
        verifiedPurchases: rewards.verifiedPurchases + verifiedItems,
        totalPurchases: rewards.totalPurchases + totalSpent,
        currentStreak: rewards.currentStreak + 1,
        longestStreak: Math.max(rewards.longestStreak, rewards.currentStreak + 1),
        level: calculateLevel(rewards.totalPoints + pointsEarned),
      }

      const newlyUnlocked = checkAchievements(updatedRewards)

      // Add points for newly unlocked achievements
      const achievementPoints = newlyUnlocked.reduce((sum, achievement) => sum + achievement.points, 0)
      updatedRewards.totalPoints += achievementPoints
      updatedRewards.level = calculateLevel(updatedRewards.totalPoints)

      updatedRewards.achievements = updatedRewards.achievements.map((achievement) => {
        const unlocked = newlyUnlocked.find((a) => a.id === achievement.id)
        return unlocked || achievement
      })

      saveRewards(updatedRewards)
      setNewAchievements(newlyUnlocked)

      return { pointsEarned: pointsEarned + achievementPoints, newAchievements: newlyUnlocked }
    },
    [rewards, checkAchievements, saveRewards],
  )

  const redeemReward = useCallback(
    (rewardId: string) => {
      const reward = rewards.availableRewards.find((r) => r.id === rewardId)
      if (!reward || rewards.totalPoints < reward.pointsCost) {
        return false
      }

      const redeemedReward: RedeemedReward = {
        ...reward,
        redeemedAt: new Date(),
        used: false,
      }

      const updatedRewards: UserRewards = {
        ...rewards,
        totalPoints: rewards.totalPoints - reward.pointsCost,
        redeemedRewards: [...rewards.redeemedRewards, redeemedReward],
      }

      saveRewards(updatedRewards)
      return true
    },
    [rewards, saveRewards],
  )

  const dismissNewAchievements = useCallback(() => {
    setNewAchievements([])
  }, [])

  const getCurrentLevelInfo = () => {
    return levelInfo.find((info) => info.level === rewards.level) || levelInfo[0]
  }

  const getNextLevelInfo = () => {
    return levelInfo.find((info) => info.level === rewards.level + 1)
  }

  const getProgressToNextLevel = () => {
    const nextLevel = getNextLevelInfo()
    if (!nextLevel) return 100

    const currentLevelInfo = getCurrentLevelInfo()
    const pointsInCurrentLevel = rewards.totalPoints - currentLevelInfo.pointsRequired
    const pointsNeededForNext = nextLevel.pointsRequired - currentLevelInfo.pointsRequired

    return Math.min((pointsInCurrentLevel / pointsNeededForNext) * 100, 100)
  }

  return {
    rewards,
    newAchievements,
    processPurchase,
    redeemReward,
    dismissNewAchievements,
    getCurrentLevelInfo,
    getNextLevelInfo,
    getProgressToNextLevel,
  }
}
