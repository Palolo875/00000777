"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sparkles } from "lucide-react"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleAI: () => void
  showAIPanel: boolean
}

export function SearchBar({ searchQuery, onSearchChange, onToggleAI, showAIPanel }: SearchBarProps) {
  return (
    <div className="border-b border-[#E8E3DB] px-8 py-4 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6456]" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher dans vos notes..."
            className="pl-10 bg-[#FAF8F5] border-[#E8E3DB] focus:border-[#D4C5A0] focus:ring-[#D4C5A0]/20 rounded-xl"
          />
        </div>
        <Button
          onClick={onToggleAI}
          variant={showAIPanel ? "default" : "outline"}
          className={
            showAIPanel
              ? "bg-gradient-to-r from-[#E8B4A0] to-[#D4C5A0] hover:from-[#E0A890] hover:to-[#CCC098] text-[#2C2416] border-none rounded-xl"
              : "border-[#E8E3DB] text-[#2C2416] hover:bg-[#FAF8F5] hover:border-[#D4C5A0] rounded-xl"
          }
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Assistant IA
        </Button>
      </div>
    </div>
  )
}
