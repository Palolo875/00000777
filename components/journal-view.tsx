"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, TrendingUp } from "lucide-react"
import type { JournalEntry } from "@/types"

interface JournalViewProps {
  onClose: () => void
}

export function JournalView({ onClose }: JournalViewProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentEntry, setCurrentEntry] = useState("")

  useEffect(() => {
    const savedEntries = localStorage.getItem("smartnote-journal")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("smartnote-journal", JSON.stringify(entries))
    }
  }, [entries])

  useEffect(() => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    const entry = entries.find((e) => e.date === dateStr)
    setCurrentEntry(entry?.content || "")
  }, [selectedDate, entries])

  const saveEntry = () => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    const existingEntry = entries.find((e) => e.date === dateStr)

    if (existingEntry) {
      setEntries(entries.map((e) => (e.date === dateStr ? { ...e, content: currentEntry } : e)))
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: dateStr,
        content: currentEntry,
        tags: [],
        linkedNotes: [],
        mood: "neutral",
      }
      setEntries([...entries, newEntry])
    }
  }

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "positive":
        return "#FFB4A0"
      case "negative":
        return "#A0C4E8"
      default:
        return "#D4C5A0"
    }
  }

  return (
    <div className="flex-1 bg-[#FAF8F5] p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-[#2C2416] mb-8">Journal et Réflexion</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="bg-white/60 backdrop-blur-sm border border-[#E8E3DB] rounded-2xl p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-xl"
              modifiers={{
                hasEntry: entries.map((e) => new Date(e.date)),
              }}
              modifiersStyles={{
                hasEntry: {
                  backgroundColor: "#E8B4A0",
                  color: "white",
                  borderRadius: "12px",
                },
              }}
            />

            {/* Emotional Timeline */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#E8B4A0]" />
                <h3 className="text-lg font-semibold text-[#2C2416]">Timeline Émotionnelle</h3>
              </div>
              <div className="flex gap-2 h-12 rounded-xl overflow-hidden">
                {entries.slice(-7).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex-1 transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: getMoodColor(entry.mood) }}
                    title={new Date(entry.date).toLocaleDateString("fr-FR")}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Entry Editor */}
          <div className="bg-white/60 backdrop-blur-sm border border-[#E8E3DB] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold text-[#2C2416]">
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
            </div>

            <Textarea
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              onBlur={saveEntry}
              placeholder="Écrivez vos pensées du jour..."
              className="min-h-[400px] border-[#E8E3DB] focus:border-[#2C2416] resize-none text-base leading-relaxed"
            />

            <div className="mt-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E8B4A0]" />
              <p className="text-sm text-[#6B6456]">
                L'IA peut suggérer des sujets de réflexion basés sur vos notes récentes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
