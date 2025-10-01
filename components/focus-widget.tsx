"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

export function FocusWidget() {
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      setIsBreak(!isBreak)
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, isBreak])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(25 * 60)
    setIsBreak(false)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div
      className={`fixed bottom-6 left-6 bg-white/90 backdrop-blur-xl border border-[#E8E3DB] rounded-full px-6 py-3 shadow-lg transition-all duration-300 ${
        isActive ? "shadow-[0_0_30px_rgba(232,180,160,0.4)]" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl font-mono font-bold text-[#2C2416] tabular-nums">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleTimer}
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-[#E8B4A0] hover:bg-[#D09C88] text-white"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
          <Button
            onClick={resetTimer}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full hover:bg-[#E8E3DB]"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {isBreak && <div className="text-xs text-[#6B6456] text-center mt-1">Pause</div>}
    </div>
  )
}
