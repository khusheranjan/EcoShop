"use client"

import { useState, useEffect } from "react"
import type { CarbonSettings } from "../types/product"

export function useCarbonSettings() {
  const [settings, setSettings] = useState<CarbonSettings>({
    showCarbonData: true,
    defaultView: "minimal",
  })

  useEffect(() => {
    const saved = localStorage.getItem("carbon-settings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const updateSettings = (newSettings: Partial<CarbonSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem("carbon-settings", JSON.stringify(updated))
  }

  return { settings, updateSettings }
}
