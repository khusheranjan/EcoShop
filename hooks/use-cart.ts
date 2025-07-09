"use client"

import { useState, useEffect } from "react"
import type { CartItem, Product } from "../types/product"

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("cart-items")
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems)
    localStorage.setItem("cart-items", JSON.stringify(newItems))
  }

  const addItem = (product: Product) => {
    const existingItem = items.find((item) => item.id === product.id)
    if (existingItem) {
      saveCart(items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      saveCart([...items, { ...product, quantity: 1 }])
    }
  }

  const removeItem = (productId: string) => {
    saveCart(items.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      saveCart(items.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const getTotalCarbonImpact = () => {
    return items.reduce((total, item) => total + item.carbonScore * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalCarbonImpact,
    getItemCount,
    getTotalPrice,
  }
}
