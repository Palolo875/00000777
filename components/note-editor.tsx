"use client"

import { useState, useEffect, useRef } from "react"
import type { Note } from "@/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Tag, X, Star, Maximize2, Type, FileText, MoreVertical, Download, Copy, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SlashCommandMenu } from "@/components/slash-command-menu"
import { TextSelectionToolbar } from "@/components/text-selection-toolbar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NoteEditorProps {
  note: Note | null
  onUpdateNote: (id: string, updates: Partial<Note>) => void
  onToggleAI: () => void
  focusMode?: boolean
  onToggleFocusMode?: () => void
}

export function NoteEditor({ note, onUpdateNote, onToggleAI, focusMode, onToggleFocusMode }: NoteEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [newTag, setNewTag] = useState("")
  const [showTagInput, setShowTagInput] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 })
  const [showSelectionToolbar, setShowSelectionToolbar] = useState(false)
  const [selectionToolbarPosition, setSelectionToolbarPosition] = useState({ top: 0, left: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const slashPositionRef = useRef(0)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      updateWordCount(note.content)
    }
  }, [note])

  const updateWordCount = (text: string) => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (note) {
      onUpdateNote(note.id, { title: value })
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    updateWordCount(value)
    if (note) {
      onUpdateNote(note.id, {
        content: value,
        wordCount: value
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length,
      })
    }

    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart
      const textBeforeCursor = value.substring(0, cursorPos)
      const lastChar = textBeforeCursor[textBeforeCursor.length - 1]

      if (lastChar === "/") {
        const rect = textareaRef.current.getBoundingClientRect()
        setSlashMenuPosition({
          top: rect.top + 30,
          left: rect.left + 20,
        })
        setShowSlashMenu(true)
        slashPositionRef.current = cursorPos
      }
    }
  }

  const handleTextSelection = () => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd

    if (start !== end) {
      const rect = textareaRef.current.getBoundingClientRect()
      setSelectionToolbarPosition({
        top: rect.top,
        left: rect.left + (start + end) / 2,
      })
      setShowSelectionToolbar(true)
    } else {
      setShowSelectionToolbar(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && note) {
      const updatedTags = [...note.tags, newTag.trim()]
      onUpdateNote(note.id, { tags: updatedTags })
      setNewTag("")
      setShowTagInput(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (note) {
      const updatedTags = note.tags.filter((tag) => tag !== tagToRemove)
      onUpdateNote(note.id, { tags: updatedTags })
    }
  }

  const toggleFavorite = () => {
    if (note) {
      onUpdateNote(note.id, { isFavorite: !note.isFavorite })
    }
  }

  const handleSlashCommand = (commandId: string, commandContent: string) => {
    if (!textareaRef.current) return

    const newContent =
      content.substring(0, slashPositionRef.current - 1) + commandContent + content.substring(slashPositionRef.current)
    handleContentChange(newContent)
    setShowSlashMenu(false)

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const newPos = slashPositionRef.current - 1 + commandContent.length
        textareaRef.current.setSelectionRange(newPos, newPos)
      }
    }, 0)
  }

  const handleFormat = (format: string) => {
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = selectedText
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        break
      case "strikethrough":
        formattedText = `~~${selectedText}~~`
        break
      case "link":
        formattedText = `[${selectedText}](url)`
        break
      case "highlight":
        formattedText = `==${selectedText}==`
        break
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    handleContentChange(newContent)
    setShowSelectionToolbar(false)

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }

  if (!note) {
    return (
      <div
        className="flex-1 flex items-center justify-center text-[#6B6456] bg-[#FAF8F5]"
        role="status"
        aria-live="polite"
      >
        <div className="text-center animate-in fade-in duration-500">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" aria-hidden="true" />
          <p className="text-lg font-medium">Sélectionnez une note ou créez-en une nouvelle</p>
          <p className="text-sm text-[#B8B0A0] mt-2">Utilisez Cmd+N pour créer une nouvelle note</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 flex flex-col bg-[#FAF8F5] transition-all duration-300`}>
      <header className="border-b border-[#E8E3DB] px-8 py-4 transition-all duration-300" role="banner">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 flex items-center gap-3">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Titre de la note"
              className="text-3xl font-serif font-bold border-none bg-transparent px-0 focus-visible:ring-0 text-[#2C2416] placeholder:text-[#B8B0A0]"
              aria-label="Titre de la note"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFavorite}
                    className={`h-9 w-9 p-0 transition-all duration-200 ${
                      note.isFavorite ? "text-[#E8B4A0] hover:text-[#D4A890]" : "text-[#B8B0A0] hover:text-[#6B6456]"
                    }`}
                    aria-label={note.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    aria-pressed={note.isFavorite}
                  >
                    <Star className={`w-5 h-5 ${note.isFavorite ? "fill-current" : ""}`} aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{note.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-[#6B6456] hover:text-[#2C2416] hover:bg-[#E8E3DB] transition-all duration-200 opacity-60 hover:opacity-100"
                  aria-label="Options de la note"
                >
                  <MoreVertical className="w-5 h-5" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white/95 backdrop-blur-xl border-[#E8E3DB] rounded-2xl shadow-2xl"
              >
                <DropdownMenuItem className="rounded-xl">
                  <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                  Dupliquer la note
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl">
                  <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                  Exporter en Markdown
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#E8E3DB]" />
                <DropdownMenuItem className="rounded-xl text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                  Supprimer la note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {onToggleFocusMode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleFocusMode}
                      className={`h-9 px-3 transition-all duration-200 ${
                        focusMode ? "bg-[#E8E3DB] text-[#2C2416]" : "text-[#6B6456] hover:bg-[#E8E3DB]"
                      }`}
                      aria-label={focusMode ? "Désactiver le mode focus" : "Activer le mode focus"}
                      aria-pressed={focusMode}
                    >
                      <Maximize2 className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mode focus (F)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <Button
              onClick={onToggleAI}
              className="bg-gradient-to-r from-[#E8B4A0] to-[#D4C5A0] hover:from-[#E0A890] hover:to-[#CCC098] text-[#2C2416] rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
              aria-label="Ouvrir l'assistant IA"
            >
              <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
              Assistant IA
            </Button>
          </div>
        </div>

        <section className="flex items-center gap-2 flex-wrap" aria-label="Tags de la note">
          {note.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#E8E3DB] text-[#2C2416] hover:bg-[#DDD8CC] rounded-full px-3 py-1 group transition-all duration-200 hover:scale-105"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label={`Retirer le tag ${tag}`}
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </Badge>
          ))}

          {showTagInput ? (
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTag()
                if (e.key === "Escape") setShowTagInput(false)
              }}
              onBlur={handleAddTag}
              placeholder="Nouveau tag"
              className="h-7 w-32 text-sm bg-white border-[#E8E3DB] focus:border-[#D4C5A0] transition-colors duration-200"
              aria-label="Nouveau tag"
              autoFocus
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTagInput(true)}
              className="h-7 text-[#6B6456] hover:text-[#2C2416] hover:bg-[#E8E3DB] rounded-full transition-all duration-200"
              aria-label="Ajouter un tag"
            >
              <Tag className="w-3 h-3 mr-1" aria-hidden="true" />
              Ajouter un tag
            </Button>
          )}
        </section>
      </header>

      <article className="flex-1 overflow-auto px-8 py-6" role="article" aria-label="Contenu de la note">
        <div className="max-w-[800px] mx-auto">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onSelect={handleTextSelection}
            placeholder="Commencez à écrire... Tapez / pour insérer un bloc."
            className="min-h-full w-full border-none bg-transparent resize-none focus-visible:ring-0 text-[#2C2416] text-[17px] leading-[1.7] placeholder:text-[#B8B0A0] font-sans transition-all duration-200"
            style={{ fontFamily: "var(--font-inter)" }}
            aria-label="Contenu de la note"
          />
        </div>
      </article>

      <footer
        className="border-t border-[#E8E3DB] px-8 py-3 text-xs text-[#6B6456] flex items-center justify-between bg-[#F5F2ED]/30 backdrop-blur-sm"
        role="contentinfo"
      >
        <span>
          Créé le{" "}
          {new Date(note.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1" role="status" aria-live="polite" aria-atomic="true">
            <Type className="w-3 h-3" aria-hidden="true" />
            <span aria-label={`${wordCount} mots`}>{wordCount} mots</span>
          </span>
          <span>
            Modifié le{" "}
            {new Date(note.updatedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </footer>

      {showSlashMenu && (
        <SlashCommandMenu
          position={slashMenuPosition}
          onSelect={handleSlashCommand}
          onClose={() => setShowSlashMenu(false)}
        />
      )}

      {showSelectionToolbar && <TextSelectionToolbar position={selectionToolbarPosition} onFormat={handleFormat} />}
    </div>
  )
}
