"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, FileText, Tag, Clock } from "lucide-react"
import type { Note, Folder as FolderType } from "@/types"

interface GlobalSearchModalProps {
  notes: Note[]
  folders: FolderType[]
  onSelectNote: (note: Note) => void
  onClose: () => void
}

export function GlobalSearchModal({ notes, folders, onSelectNote, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Note[]>([])

  useEffect(() => {
    if (query.trim()) {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      )
      setResults(filtered)
    } else {
      setResults(notes.slice(0, 5))
    }
  }, [query, notes])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSelectNote = (note: Note) => {
    onSelectNote(note)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-[#2C2416]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top duration-300">
        {/* Search Input */}
        <div className="p-6 border-b border-[#E8E3DB]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6456]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher des notes, tags, ou contenu..."
              className="pl-12 pr-4 py-6 text-lg bg-[#FAF8F5] border-[#E8E3DB] focus:border-[#D4C5A0] rounded-2xl"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className="w-full p-4 bg-[#FAF8F5] hover:bg-gradient-to-r hover:from-[#E8B4A0]/10 hover:to-[#D4C5A0]/10 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-white rounded-xl group-hover:bg-gradient-to-br group-hover:from-[#E8B4A0]/20 group-hover:to-[#D4C5A0]/20 transition-all duration-200">
                      <FileText className="w-4 h-4 text-[#6B6456]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#2C2416] mb-1 truncate">{note.title}</h3>
                      <p className="text-sm text-[#6B6456] line-clamp-2 mb-2">
                        {note.content.substring(0, 150) || "Note vide"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#B8B0A0]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(note.updatedAt).toLocaleDateString("fr-FR")}
                        </span>
                        {note.tags.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {note.tags.slice(0, 2).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-[#B8B0A0]" />
              <p className="text-[#6B6456]">Aucun résultat trouvé</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E3DB] bg-[#FAF8F5]/50 flex items-center justify-between text-xs text-[#6B6456]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Recherche sémantique
            </span>
          </div>
          <span>ESC pour fermer</span>
        </div>
      </div>
    </div>
  )
}
