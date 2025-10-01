export interface Note {
  id: string
  title: string
  content: string
  folderId: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
  isFavorite?: boolean
  linkedNotes?: string[]
  template?: string
  wordCount?: number
}

export interface Folder {
  id: string
  name: string
  color: string
  icon: string
}

export interface AppSettings {
  theme: "light" | "dark"
  fontSize: "small" | "medium" | "large"
  focusMode: boolean
  autoSave: boolean
  showWordCount: boolean
  sidebarCollapsed?: boolean
  reduceAnimations?: boolean
  fontSizeValue?: number
  graphViewMode?: "visual" | "list"
  tasksViewMode?: "kanban" | "list"
}

export interface NoteTemplate {
  id: string
  name: string
  content: string
  icon: string
}

export type ViewType = "editor" | "search" | "settings" | "templates" | "graph" | "tasks" | "journal" | "focus"

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  linkedNotes: string[]
  createdAt: string
  updatedAt: string
  dueDate?: string
}

export interface JournalEntry {
  id: string
  date: string
  content: string
  mood?: "positive" | "neutral" | "negative"
  tags: string[]
  linkedNotes: string[]
}

export interface GraphNode {
  id: string
  label: string
  type: "note" | "concept" | "tag"
  color: string
  size: number
  x?: number
  y?: number
  recentlyViewed?: boolean
}

export interface GraphEdge {
  source: string
  target: string
  strength: number
}
