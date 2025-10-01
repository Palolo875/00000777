"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { NoteEditor } from "@/components/note-editor"
import { AISuggestionsPanel } from "@/components/ai-suggestions-panel"
import { SearchBar } from "@/components/search-bar"
import { GlobalSearchModal } from "@/components/global-search-modal"
import { GraphView } from "@/components/graph-view"
import { TasksView } from "@/components/tasks-view"
import { JournalView } from "@/components/journal-view"
import { FocusWidget } from "@/components/focus-widget"
import { SettingsView } from "@/components/settings-view"
import { OnboardingView } from "@/components/onboarding-view"
import type { Note, Folder, ViewType } from "@/types"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SmartNotePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [focusMode, setFocusMode] = useState(false)
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>("editor")
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const savedNotes = localStorage.getItem("smartnote-notes")
    const savedFolders = localStorage.getItem("smartnote-folders")
    const hasCompletedOnboarding = localStorage.getItem("smartnote-onboarding-complete")

    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes)
      setNotes(parsedNotes)
      if (parsedNotes.length > 0) {
        setActiveNote(parsedNotes[0])
      }
    } else {
      const welcomeNote: Note = {
        id: "1",
        title: "Bienvenue dans SmartNote AI",
        content:
          "# Bienvenue dans SmartNote AI\n\nCommencez à écrire vos idées ici. L'IA vous assistera intelligemment.\n\n## Fonctionnalités\n\n- **Assistance IA contextuelle** : Obtenez des suggestions intelligentes basées sur votre contenu\n- **Organisation flexible** : Créez des dossiers et utilisez des tags pour organiser vos notes\n- **Formatage riche** : Utilisez Markdown pour formater votre texte\n- **Mode focus** : Concentrez-vous sur l'écriture sans distractions\n- **Favoris** : Marquez vos notes importantes\n- **Commande slash** : Tapez / pour insérer des blocs\n- **Recherche globale** : Appuyez sur Cmd+K pour rechercher\n\n## Raccourcis clavier\n\n- `Cmd+N` : Nouvelle note\n- `Cmd+K` : Recherche globale\n- `Cmd+B` : Gras\n- `Cmd+I` : Italique\n- `F` : Mode focus\n- `/` : Menu de commandes\n\nBonne écriture ! ✨",
        folderId: null,
        tags: ["bienvenue", "guide"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: true,
        linkedNotes: [],
        wordCount: 0,
      }
      setNotes([welcomeNote])
      setActiveNote(welcomeNote)
    }

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders))
    } else {
      const defaultFolders: Folder[] = [
        { id: "1", name: "Personnel", color: "#E8B4A0", icon: "user" },
        { id: "2", name: "Travail", color: "#A0C4E8", icon: "briefcase" },
        { id: "3", name: "Idées", color: "#D4C5A0", icon: "lightbulb" },
      ]
      setFolders(defaultFolders)
    }

    if (!hasCompletedOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("smartnote-notes", JSON.stringify(notes))
    }
  }, [notes])

  useEffect(() => {
    if (folders.length > 0) {
      localStorage.setItem("smartnote-folders", JSON.stringify(folders))
    }
  }, [folders])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCurrentView("search")
        setShowGlobalSearch(true)
      } else if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault()
        createNote()
      } else if (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault()
          setFocusMode(!focusMode)
        }
      } else if (e.key === "Escape") {
        if (focusMode) setFocusMode(false)
        if (showAIPanel) setShowAIPanel(false)
        if (showGlobalSearch) {
          setShowGlobalSearch(false)
          setCurrentView("editor")
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusMode, showAIPanel, showGlobalSearch])

  const createNote = (folderId?: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Nouvelle note",
      content: "",
      folderId: folderId || null,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      linkedNotes: [],
      wordCount: 0,
    }
    setNotes([newNote, ...notes])
    setActiveNote(newNote)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note)),
    )
    if (activeNote?.id === id) {
      setActiveNote({ ...activeNote, ...updates, updatedAt: new Date().toISOString() })
    }
  }

  const deleteNote = (id: string) => {
    const filtered = notes.filter((note) => note.id !== id)
    setNotes(filtered)
    if (activeNote?.id === id) {
      setActiveNote(filtered[0] || null)
    }
  }

  const createFolder = (name: string, color: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      color,
      icon: "folder",
    }
    setFolders([...folders, newFolder])
  }

  const exportNotes = () => {
    const dataStr = JSON.stringify({ notes, folders }, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `smartnote-export-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importNotes = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string)
            if (data.notes) setNotes(data.notes)
            if (data.folders) setFolders(data.folders)
          } catch (error) {
            console.error("Error importing notes:", error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const filteredNotes = searchQuery
    ? notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : notes

  const handleCompleteOnboarding = () => {
    localStorage.setItem("smartnote-onboarding-complete", "true")
    setShowOnboarding(false)
  }

  if (showOnboarding) {
    return <OnboardingView onComplete={handleCompleteOnboarding} />
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <a href="#sidebar-nav" className="skip-link">
        Aller à la navigation
      </a>

      <div className="flex h-screen bg-[#FAF8F5] overflow-hidden">
        {!focusMode && (
          <nav id="sidebar-nav" aria-label="Navigation principale">
            <Sidebar
              notes={filteredNotes}
              folders={folders}
              activeNote={activeNote}
              onNoteSelect={(note) => {
                setActiveNote(note)
                setCurrentView("editor")
              }}
              onCreateNote={createNote}
              onCreateFolder={createFolder}
              onDeleteNote={deleteNote}
              onExportNotes={exportNotes}
              onImportNotes={importNotes}
              onOpenSettings={() => setCurrentView("settings")}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              onNavigateToGraph={() => setCurrentView("graph")}
              onNavigateToTasks={() => setCurrentView("tasks")}
              onNavigateToJournal={() => setCurrentView("journal")}
            />
          </nav>
        )}

        {!focusMode && sidebarCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(false)}
            aria-label="Ouvrir la barre latérale"
            className="absolute left-16 top-6 z-10 h-8 w-8 p-0 bg-[#F5F2ED] hover:bg-[#E8E3DB] border border-[#E8E3DB] rounded-lg shadow-sm transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        )}

        <main id="main-content" className="flex-1 flex flex-col" role="main" aria-label="Contenu principal">
          {currentView === "graph" && (
            <GraphView
              notes={notes}
              onSelectNote={(note) => {
                setActiveNote(note)
                setCurrentView("editor")
              }}
              onClose={() => setCurrentView("editor")}
            />
          )}

          {currentView === "tasks" && <TasksView onClose={() => setCurrentView("editor")} />}

          {currentView === "journal" && <JournalView onClose={() => setCurrentView("editor")} />}

          {currentView === "editor" && (
            <>
              {!focusMode && (
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onToggleAI={() => setShowAIPanel(!showAIPanel)}
                  showAIPanel={showAIPanel}
                />
              )}

              <div className="flex-1 flex overflow-hidden">
                <NoteEditor
                  note={activeNote}
                  onUpdateNote={updateNote}
                  onToggleAI={() => setShowAIPanel(!showAIPanel)}
                  focusMode={focusMode}
                  onToggleFocusMode={() => setFocusMode(!focusMode)}
                />

                {showAIPanel && !focusMode && (
                  <AISuggestionsPanel
                    note={activeNote}
                    onClose={() => setShowAIPanel(false)}
                    onApplySuggestion={(suggestion) => {
                      if (activeNote) {
                        updateNote(activeNote.id, {
                          content: activeNote.content + suggestion,
                        })
                      }
                    }}
                  />
                )}
              </div>
            </>
          )}

          {currentView === "search" && (
            <div className="flex-1 flex items-center justify-center">
              <GlobalSearchModal
                notes={notes}
                folders={folders}
                onSelectNote={(note) => {
                  setActiveNote(note)
                  setCurrentView("editor")
                  setShowGlobalSearch(false)
                }}
                onClose={() => {
                  setCurrentView("editor")
                  setShowGlobalSearch(false)
                }}
              />
            </div>
          )}

          {currentView === "settings" && <SettingsView onClose={() => setCurrentView("editor")} />}
        </main>

        {!focusMode && currentView === "editor" && <FocusWidget />}
      </div>
    </>
  )
}
