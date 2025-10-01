"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, GripVertical, Sparkles, LayoutGrid, List } from "lucide-react"
import type { Task } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TasksViewProps {
  onClose: () => void
}

export function TasksView({ onClose }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [sortBy, setSortBy] = useState<"date" | "priority" | "status">("date")

  useEffect(() => {
    const savedTasks = localStorage.getItem("smartnote-tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("smartnote-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const createTask = (status: Task["status"]) => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      status,
      priority: "medium",
      linkedNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle("")
    setNewTaskDescription("")
    setShowNewTaskDialog(false)
  }

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status)
  }

  const getSortedTasks = () => {
    const sorted = [...tasks]
    switch (sortBy) {
      case "date":
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      case "status":
        const statusOrder = { "in-progress": 0, todo: 1, done: 2 }
        return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
      default:
        return sorted
    }
  }

  const columns: { status: Task["status"]; title: string; color: string }[] = [
    { status: "todo", title: "À Faire", color: "#A0C4E8" },
    { status: "in-progress", title: "En Cours", color: "#E8B4A0" },
    { status: "done", title: "Terminé", color: "#D4C5A0" },
  ]

  const getStatusLabel = (status: Task["status"]) => {
    return columns.find((col) => col.status === status)?.title || status
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "#FFB4A0"
      case "medium":
        return "#E8B4A0"
      case "low":
        return "#D4C5A0"
    }
  }

  return (
    <div className="flex-1 bg-[#FAF8F5] p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-serif font-bold text-[#2C2416]">Gestionnaire de Tâches</h1>
            <div className="flex items-center gap-2 bg-white border border-[#E8E3DB] rounded-xl p-1">
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="h-8 px-3 rounded-lg"
                aria-label="Vue Kanban"
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 px-3 rounded-lg"
                aria-label="Vue liste"
              >
                <List className="w-4 h-4 mr-2" />
                Liste
              </Button>
            </div>
          </div>
          <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#2C2416] hover:bg-[#3D3220] text-[#FAF8F5] rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle tâche
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-xl border border-[#E8E3DB] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif font-bold text-[#2C2416]">Créer une tâche</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Titre de la tâche"
                  className="border-[#E8E3DB] focus:border-[#2C2416]"
                  aria-label="Titre de la tâche"
                />
                <Textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Description (optionnelle)"
                  className="border-[#E8E3DB] focus:border-[#2C2416] min-h-[100px]"
                  aria-label="Description de la tâche"
                />
                <div className="flex gap-2">
                  <Button onClick={() => createTask("todo")} className="flex-1 bg-[#A0C4E8] hover:bg-[#8FB0D0]">
                    À Faire
                  </Button>
                  <Button onClick={() => createTask("in-progress")} className="flex-1 bg-[#E8B4A0] hover:bg-[#D09C88]">
                    En Cours
                  </Button>
                  <Button onClick={() => createTask("done")} className="flex-1 bg-[#D4C5A0] hover:bg-[#BCAD88]">
                    Terminé
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div
                key={column.status}
                className="bg-white/40 backdrop-blur-sm border border-[#E8E3DB] rounded-2xl p-6 min-h-[600px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#2C2416]">{column.title}</h2>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: column.color }}
                    aria-label={`${getTasksByStatus(column.status).length} tâches`}
                  >
                    {getTasksByStatus(column.status).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {getTasksByStatus(column.status).map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-[#E8E3DB] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group"
                      draggable
                    >
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-4 h-4 text-[#6B6456] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1">
                          <h3 className="font-medium text-[#2C2416] mb-1">{task.title}</h3>
                          {task.description && <p className="text-sm text-[#6B6456] mb-2">{task.description}</p>}
                          <div className="flex items-center gap-2 text-xs text-[#6B6456]">
                            <span>{new Date(task.createdAt).toLocaleDateString("fr-FR")}</span>
                            {task.priority === "high" && (
                              <span className="px-2 py-0.5 bg-[#FFB4A0] text-[#2C2416] rounded-full animate-pulse">
                                Prioritaire
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-[#6B6456]">Trier par:</span>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === "date" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("date")}
                  className="rounded-xl"
                >
                  Date
                </Button>
                <Button
                  variant={sortBy === "priority" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("priority")}
                  className="rounded-xl"
                >
                  Priorité
                </Button>
                <Button
                  variant={sortBy === "status" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("status")}
                  className="rounded-xl"
                >
                  Statut
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-3">
                {getSortedTasks().map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border border-[#E8E3DB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#2C2416]">{task.title}</h3>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: columns.find((c) => c.status === task.status)?.color }}
                          >
                            {getStatusLabel(task.status)}
                          </span>
                          {task.priority === "high" && (
                            <span className="px-2 py-0.5 bg-[#FFB4A0] text-[#2C2416] rounded-full text-xs animate-pulse">
                              Prioritaire
                            </span>
                          )}
                        </div>
                        {task.description && <p className="text-sm text-[#6B6456] mb-3">{task.description}</p>}
                        <div className="flex items-center gap-4 text-xs text-[#6B6456]">
                          <span>Créée le {new Date(task.createdAt).toLocaleDateString("fr-FR")}</span>
                          <span
                            className="px-2 py-1 rounded-full"
                            style={{ backgroundColor: getPriorityColor(task.priority) + "40" }}
                          >
                            Priorité:{" "}
                            {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {columns.map((col) => (
                          <Button
                            key={col.status}
                            variant="outline"
                            size="sm"
                            onClick={() => updateTaskStatus(task.id, col.status)}
                            disabled={task.status === col.status}
                            className="rounded-xl"
                            aria-label={`Changer le statut à ${col.title}`}
                          >
                            {col.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="mt-8 bg-white/60 backdrop-blur-sm border border-[#E8E3DB] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#E8B4A0]" />
            <h3 className="text-lg font-semibold text-[#2C2416]">Suggestions IA</h3>
          </div>
          <p className="text-[#6B6456]">
            L'IA peut suggérer des sous-tâches ou des ressources pertinentes basées sur vos notes et projets.
          </p>
        </div>
      </div>
    </div>
  )
}
