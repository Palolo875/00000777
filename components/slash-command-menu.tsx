"use client"

import { useState, useEffect, useRef } from "react"
import { Type, Heading1, Heading2, List, ListOrdered, CheckSquare, Code, Quote, Minus } from "lucide-react"

interface SlashCommandMenuProps {
  position: { top: number; left: number }
  onSelect: (command: string, content: string) => void
  onClose: () => void
}

const commands = [
  { id: "text", label: "Texte", icon: Type, content: "" },
  { id: "h1", label: "Titre 1", icon: Heading1, content: "# " },
  { id: "h2", label: "Titre 2", icon: Heading2, content: "## " },
  { id: "bullet", label: "Liste à puces", icon: List, content: "- " },
  { id: "numbered", label: "Liste numérotée", icon: ListOrdered, content: "1. " },
  { id: "todo", label: "Liste de tâches", icon: CheckSquare, content: "- [ ] " },
  { id: "quote", label: "Citation", icon: Quote, content: "> " },
  { id: "divider", label: "Séparateur", icon: Minus, content: "\n---\n" },
  { id: "code", label: "Bloc de code", icon: Code, content: "```\n\n```" },
]

export function SlashCommandMenu({ position, onSelect, onClose }: SlashCommandMenuProps) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  const filteredCommands = commands.filter((cmd) => cmd.label.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          const cmd = filteredCommands[selectedIndex]
          onSelect(cmd.id, cmd.content)
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, filteredCommands, onSelect, onClose])

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-80 bg-white/95 backdrop-blur-xl border border-[#E8E3DB] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top duration-200"
      style={{ top: position.top, left: position.left }}
    >
      <div className="p-2 border-b border-[#E8E3DB]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un bloc..."
          className="w-full px-3 py-2 text-sm bg-transparent border-none outline-none text-[#2C2416] placeholder:text-[#B8B0A0]"
          autoFocus
        />
      </div>
      <div className="max-h-80 overflow-y-auto p-1">
        {filteredCommands.map((cmd, index) => {
          const Icon = cmd.icon
          return (
            <button
              key={cmd.id}
              onClick={() => onSelect(cmd.id, cmd.content)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                index === selectedIndex
                  ? "bg-gradient-to-r from-[#E8B4A0]/20 to-[#D4C5A0]/20 text-[#2C2416]"
                  : "text-[#6B6456] hover:bg-[#FAF8F5]"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{cmd.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
