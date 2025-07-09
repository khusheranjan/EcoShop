"use client"

import { useState, useEffect, useCallback } from "react"
import type { CoinBalance, CoinTransaction, CoinEarningRate } from "../types/coins"
import type { CartItem } from "../types/product"

const COIN_RATES: CoinEarningRate = {
  low: 10, // 10 EcoCoins per low-carbon product
  medium: 5, // 5 EcoCoins per medium-carbon product
  high: 0, // 0 EcoCoins per high-carbon product
}

const COIN_TO_DOLLAR_RATE = 100 // 100 EcoCoins = $1

const INITIAL_BALANCE: CoinBalance = {
  total: 0,
  earned: 0,
  spent: 0,
  transactions: [],
}

export function useEcoCoins() {
  const [balance, setBalance] = useState<CoinBalance>(INITIAL_BALANCE)
  const [newEarnings, setNewEarnings] = useState<CoinTransaction[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("ecocoin-balance")
    if (saved) {
      const parsed = JSON.parse(saved)
      // Convert timestamp strings back to Date objects
      parsed.transactions = parsed.transactions.map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp),
      }))
      setBalance(parsed)
    }
  }, [])

  const saveBalance = useCallback((newBalance: CoinBalance) => {
    setBalance(newBalance)
    localStorage.setItem("ecocoin-balance", JSON.stringify(newBalance))
  }, [])

  const generateTransactionId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const addTransaction = useCallback(
    (transaction: Omit<CoinTransaction, "id" | "timestamp">) => {
      const newTransaction: CoinTransaction = {
        ...transaction,
        id: generateTransactionId(),
        timestamp: new Date(),
      }

      const updatedBalance: CoinBalance = {
        total: balance.total + (transaction.type === "earned" ? transaction.amount : -transaction.amount),
        earned: balance.earned + (transaction.type === "earned" ? transaction.amount : 0),
        spent: balance.spent + (transaction.type === "spent" ? transaction.amount : 0),
        transactions: [newTransaction, ...balance.transactions].slice(0, 100), // Keep last 100 transactions
      }

      saveBalance(updatedBalance)

      if (transaction.type === "earned") {
        setNewEarnings([newTransaction])
      }

      return newTransaction
    },
    [balance, saveBalance],
  )

  const calculateCoinsFromPurchase = useCallback((items: CartItem[]) => {
    let totalCoins = 0
    const earningDetails: Array<{ item: CartItem; coins: number }> = []

    items.forEach((item) => {
      const coinsPerItem = COIN_RATES[item.carbonImpact]
      const totalCoinsForItem = coinsPerItem * item.quantity
      totalCoins += totalCoinsForItem

      if (totalCoinsForItem > 0) {
        earningDetails.push({ item, coins: totalCoinsForItem })
      }
    })

    // Bonus coins for perfect low-carbon cart
    const allLowCarbon = items.every((item) => item.carbonImpact === "low")
    const bonusCoins = allLowCarbon && items.length > 0 ? 25 : 0
    totalCoins += bonusCoins

    return { totalCoins, earningDetails, bonusCoins }
  }, [])

  const processPurchaseEarnings = useCallback(
    (items: CartItem[]) => {
      const { totalCoins, earningDetails, bonusCoins } = calculateCoinsFromPurchase(items)

      const transactions: CoinTransaction[] = []

      // Add transaction for each earning type
      if (earningDetails.length > 0) {
        const mainTransaction = addTransaction({
          type: "earned",
          amount: totalCoins - bonusCoins,
          source: "low_carbon_purchase",
          description: `Earned from ${earningDetails.length} sustainable product${earningDetails.length > 1 ? "s" : ""}`,
        })
        transactions.push(mainTransaction)
      }

      // Add bonus transaction if applicable
      if (bonusCoins > 0) {
        const bonusTransaction = addTransaction({
          type: "earned",
          amount: bonusCoins,
          source: "achievement_bonus",
          description: "Perfect eco-cart bonus!",
        })
        transactions.push(bonusTransaction)
      }

      return {
        totalEarned: totalCoins,
        transactions,
        earningDetails,
        bonusCoins,
      }
    },
    [addTransaction, calculateCoinsFromPurchase],
  )

  const spendCoins = useCallback(
    (amount: number, description: string) => {
      if (balance.total < amount) {
        return false
      }

      addTransaction({
        type: "spent",
        amount,
        source: "checkout_discount",
        description,
      })

      return true
    },
    [balance.total, addTransaction],
  )

  const getCoinsValue = useCallback((coins: number) => {
    return coins / COIN_TO_DOLLAR_RATE
  }, [])

  const getRequiredCoinsForDiscount = useCallback((dollarAmount: number) => {
    return Math.ceil(dollarAmount * COIN_TO_DOLLAR_RATE)
  }, [])

  const dismissNewEarnings = useCallback(() => {
    setNewEarnings([])
  }, [])

  const getRecentTransactions = useCallback(
    (limit = 10) => {
      return balance.transactions.slice(0, limit)
    },
    [balance.transactions],
  )

  const getTodayEarnings = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return balance.transactions
      .filter((t) => t.type === "earned" && t.timestamp >= today)
      .reduce((sum, t) => sum + t.amount, 0)
  }, [balance.transactions])

  const getWeeklyEarnings = useCallback(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    return balance.transactions
      .filter((t) => t.type === "earned" && t.timestamp >= weekAgo)
      .reduce((sum, t) => sum + t.amount, 0)
  }, [balance.transactions])

  return {
    balance,
    newEarnings,
    processPurchaseEarnings,
    spendCoins,
    getCoinsValue,
    getRequiredCoinsForDiscount,
    dismissNewEarnings,
    getRecentTransactions,
    getTodayEarnings,
    getWeeklyEarnings,
    calculateCoinsFromPurchase,
    COIN_RATES,
    COIN_TO_DOLLAR_RATE,
  }
}
