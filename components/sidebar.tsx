"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import type { Note, Folder } from "@/types"
import {
  Plus,
  FolderIcon,
  FileText,
  Trash2,
  MoreVertical,
  Star,
  Download,
  Upload,
  Settings,
  ChevronLeft,
  Network,
  CheckSquare,
  BookOpen,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface SidebarProps {
  notes: Note[]
  folders: Folder[]
  activeNote: Note | null
  onNoteSelect: (note: Note) => void
  onCreateNote: (folderId?: string) => void
  onCreateFolder: (name: string, color: string) => void
  onDeleteNote: (id: string) => void
  onExportNotes?: () => void
  onImportNotes?: () => void
  onOpenSettings?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onNavigateToGraph?: () => void
  onNavigateToTasks?: () => void
  onNavigateToJournal?: () => void
  onNavigateToFocus?: () => void
}

export function Sidebar({
  notes,
  folders,
  activeNote,
  onNoteSelect,
  onCreateNote,
  onCreateFolder,
  onDeleteNote,
  onExportNotes,
  onImportNotes,
  onOpenSettings,
  isCollapsed = false,
  onToggleCollapse,
  onNavigateToGraph,
  onNavigateToTasks,
  onNavigateToJournal,
  onNavigateToFocus,
}: SidebarProps) {
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const colors = ["#E8B4A0", "#A0C4E8", "#D4C5A0", "#C5A0D4", "#A0D4C5"]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      onCreateFolder(newFolderName, randomColor)
      setNewFolderName("")
      setShowNewFolder(false)
    }
  }

  const getNotesForFolder = (folderId: string | null) => {
    return notes.filter((note) => note.folderId === folderId)
  }

  const favoriteNotes = notes.filter((note) => note.isFavorite)

  if (isCollapsed) {
    return (
      <aside
        className="w-16 bg-[#F5F2ED] border-r border-[#E8E3DB] flex flex-col items-center py-6 gap-4"
        aria-label="Barre latérale réduite"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          aria-label="Développer la barre latérale"
          aria-expanded="false"
          className="h-10 w-10 p-0 hover:bg-[#E8E3DB] transition-all duration-200 rotate-180"
        >
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </Button>
        <Button
          onClick={() => onCreateNote()}
          size="sm"
          aria-label="Créer une nouvelle note"
          className="h-10 w-10 p-0 bg-[#2C2416] hover:bg-[#3D3220] text-[#FAF8F5] rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
        </Button>
        {onNavigateToGraph && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToGraph}
            className="h-10 w-10 p-0 hover:bg-[#E8E3DB] transition-all duration-200"
            aria-label="Ouvrir le graphe de connaissances"
            title="Graphe"
          >
            <Network className="w-5 h-5" aria-hidden="true" />
          </Button>
        )}
        {onNavigateToTasks && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToTasks}
            className="h-10 w-10 p-0 hover:bg-[#E8E3DB] transition-all duration-200"
            aria-label="Ouvrir les tâches"
            title="Tâches"
          >
            <CheckSquare className="w-5 h-5" aria-hidden="true" />
          </Button>
        )}
        {onNavigateToJournal && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToJournal}
            className="h-10 w-10 p-0 hover:bg-[#E8E3DB] transition-all duration-200"
            aria-label="Ouvrir le journal"
            title="Journal"
          >
            <BookOpen className="w-5 h-5" aria-hidden="true" />
          </Button>
        )}
        <div className="flex-1" />
        {onOpenSettings && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="h-10 w-10 p-0 hover:bg-[#E8E3DB] transition-all duration-200"
            aria-label="Ouvrir les paramètres"
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </Button>
        )}
      </aside>
    )
  }

  return (
    <aside className="w-72 bg-[#F5F2ED] border-r border-[#E8E3DB] flex flex-col" aria-label="Barre latérale">
      {/* Header */}
      <header className="p-6 border-b border-[#E8E3DB]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-serif font-semibold text-[#2C2416]">SmartNote AI</h1>
          <div className="flex items-center gap-1">
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                aria-label="Réduire la barre latérale"
                aria-expanded="true"
                className="h-8 w-8 p-0 hover:bg-[#E8E3DB] transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-[#E8E3DB] transition-all duration-200"
                  aria-label="Menu des options"
                >
                  <MoreVertical className="w-4 h-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onExportNotes && (
                  <DropdownMenuItem onClick={onExportNotes}>
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                    Exporter les notes
                  </DropdownMenuItem>
                )}
                {onImportNotes && (
                  <DropdownMenuItem onClick={onImportNotes}>
                    <Upload className="w-4 h-4 mr-2" aria-hidden="true" />
                    Importer des notes
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {onOpenSettings && (
                  <DropdownMenuItem onClick={onOpenSettings}>
                    <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                    Paramètres
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Button
          onClick={() => onCreateNote()}
          className="w-full bg-[#2C2416] hover:bg-[#3D3220] text-[#FAF8F5] rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
          aria-label="Créer une nouvelle note"
        >
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          Nouvelle note
        </Button>
      </header>

      {/* Navigation Section */}
      <nav className="px-4 py-4 border-b border-[#E8E3DB]" aria-label="Navigation des vues">
        <div className="space-y-1">
          {onNavigateToGraph && (
            <Button
              variant="ghost"
              onClick={onNavigateToGraph}
              className="w-full justify-start text-[#6B6456] hover:text-[#2C2416] hover:bg-[#E8E3DB]"
              aria-label="Naviguer vers le graphe de connaissances"
            >
              <Network className="w-4 h-4 mr-3" aria-hidden="true" />
              Graphe de Connaissances
            </Button>
          )}
          {onNavigateToTasks && (
            <Button
              variant="ghost"
              onClick={onNavigateToTasks}
              className="w-full justify-start text-[#6B6456] hover:text-[#2C2416] hover:bg-[#E8E3DB]"
              aria-label="Naviguer vers les tâches et projets"
            >
              <CheckSquare className="w-4 h-4 mr-3" aria-hidden="true" />
              Tâches et Projets
            </Button>
          )}
          {onNavigateToJournal && (
            <Button
              variant="ghost"
              onClick={onNavigateToJournal}
              className="w-full justify-start text-[#6B6456] hover:text-[#2C2416] hover:bg-[#E8E3DB]"
              aria-label="Naviguer vers le journal"
            >
              <BookOpen className="w-4 h-4 mr-3" aria-hidden="true" />
              Journal
            </Button>
          )}
        </div>
      </nav>

      {/* Folders and Notes */}
      <ScrollArea className="flex-1 px-4 py-4" role="region" aria-label="Liste des notes et dossiers">
        {/* Favorites */}
        {favoriteNotes.length > 0 && (
          <section className="mb-6" aria-labelledby="favorites-heading">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                showFavorites ? "bg-[#E8E3DB] text-[#2C2416]" : "text-[#6B6456] hover:bg-[#E8E3DB]/50"
              }`}
              aria-expanded={showFavorites}
              aria-controls="favorites-list"
            >
              <Star className="w-4 h-4 fill-[#E8B4A0] text-[#E8B4A0]" aria-hidden="true" />
              <span id="favorites-heading" className="font-medium">
                Favoris
              </span>
              <span className="ml-auto text-sm" aria-label={`${favoriteNotes.length} notes favorites`}>
                {favoriteNotes.length}
              </span>
            </button>

            {showFavorites && (
              <ul id="favorites-list" className="mt-2 space-y-1" role="list">
                {favoriteNotes.map((note) => (
                  <li key={note.id}>
                    <NoteItem
                      note={note}
                      isActive={activeNote?.id === note.id}
                      onSelect={() => onNoteSelect(note)}
                      onDelete={() => onDeleteNote(note.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* All Notes */}
        <section className="mb-6" aria-labelledby="all-notes-heading">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
              selectedFolder === null ? "bg-[#E8E3DB] text-[#2C2416]" : "text-[#6B6456] hover:bg-[#E8E3DB]/50"
            }`}
            aria-expanded={selectedFolder === null}
            aria-controls="all-notes-list"
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span id="all-notes-heading" className="font-medium">
              Toutes les notes
            </span>
            <span className="ml-auto text-sm" aria-label={`${notes.length} notes au total`}>
              {notes.length}
            </span>
          </button>

          {selectedFolder === null && (
            <ul id="all-notes-list" className="mt-2 space-y-1" role="list">
              {getNotesForFolder(null).map((note) => (
                <li key={note.id}>
                  <NoteItem
                    note={note}
                    isActive={activeNote?.id === note.id}
                    onSelect={() => onNoteSelect(note)}
                    onDelete={() => onDeleteNote(note.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Folders */}
        <section className="space-y-2" aria-labelledby="folders-heading">
          <div className="flex items-center justify-between px-3 mb-2">
            <span id="folders-heading" className="text-xs font-semibold text-[#6B6456] uppercase tracking-wider">
              Dossiers
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewFolder(!showNewFolder)}
              className="h-6 w-6 p-0 hover:bg-[#E8E3DB] transition-all duration-200"
              aria-label="Créer un nouveau dossier"
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
            </Button>
          </div>

          {showNewFolder && (
            <div className="px-3 mb-2 animate-in slide-in-from-top duration-200">
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder()
                  if (e.key === "Escape") setShowNewFolder(false)
                }}
                placeholder="Nom du dossier"
                className="h-8 text-sm bg-white border-[#E8E3DB] focus:border-[#2C2416] transition-colors duration-200"
                aria-label="Nom du nouveau dossier"
                autoFocus
              />
            </div>
          )}

          {folders.map((folder) => (
            <div key={folder.id} className="animate-in fade-in duration-300">
              <button
                onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  selectedFolder === folder.id ? "bg-[#E8E3DB] text-[#2C2416]" : "text-[#6B6456] hover:bg-[#E8E3DB]/50"
                }`}
                aria-expanded={selectedFolder === folder.id}
                aria-controls={`folder-${folder.id}-notes`}
                aria-label={`Dossier ${folder.name}, ${getNotesForFolder(folder.id).length} notes`}
              >
                <div
                  className="w-3 h-3 rounded-full transition-transform duration-200 hover:scale-110"
                  style={{ backgroundColor: folder.color }}
                  aria-hidden="true"
                />
                <FolderIcon className="w-4 h-4" aria-hidden="true" />
                <span className="font-medium flex-1 text-left">{folder.name}</span>
                <span className="text-sm" aria-label={`${getNotesForFolder(folder.id).length} notes`}>
                  {getNotesForFolder(folder.id).length}
                </span>
              </button>

              {selectedFolder === folder.id && (
                <ul
                  id={`folder-${folder.id}-notes`}
                  className="mt-2 space-y-1 ml-6 animate-in slide-in-from-top duration-200"
                  role="list"
                >
                  {getNotesForFolder(folder.id).map((note) => (
                    <li key={note.id}>
                      <NoteItem
                        note={note}
                        isActive={activeNote?.id === note.id}
                        onSelect={() => onNoteSelect(note)}
                        onDelete={() => onDeleteNote(note.id)}
                      />
                    </li>
                  ))}
                  <li>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCreateNote(folder.id)}
                      className="w-full justify-start text-[#6B6456] hover:text-[#2C2416] hover:bg-[#E8E3DB]/50 h-8 transition-all duration-200"
                      aria-label={`Ajouter une note au dossier ${folder.name}`}
                    >
                      <Plus className="w-3 h-3 mr-2" aria-hidden="true" />
                      Ajouter une note
                    </Button>
                  </li>
                </ul>
              )}
            </div>
          ))}
        </section>
      </ScrollArea>
    </aside>
  )
}

function NoteItem({
  note,
  isActive,
  onSelect,
  onDelete,
}: {
  note: Note
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  return (
    <article
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive ? "bg-white shadow-sm border border-[#E8E3DB] scale-[1.02]" : "hover:bg-white/50 hover:scale-[1.01]"
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Note: ${note.title || "Sans titre"}. ${note.isFavorite ? "Favori. " : ""}${note.content.substring(0, 50) || "Note vide"}`}
      aria-current={isActive ? "page" : undefined}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[#2C2416] truncate">{note.title || "Sans titre"}</p>
          {note.isFavorite && (
            <Star className="w-3 h-3 fill-[#E8B4A0] text-[#E8B4A0] flex-shrink-0" aria-label="Favori" />
          )}
        </div>
        <p className="text-xs text-[#6B6456] truncate">{note.content.substring(0, 50) || "Note vide"}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Options pour ${note.title || "Sans titre"}`}
          >
            <MoreVertical className="w-3 h-3" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-red-600"
          >
            <Trash2 className="w-3 h-3 mr-2" aria-hidden="true" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  )
}
