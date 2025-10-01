"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Filter, Calendar, Sparkles, List, Network } from "lucide-react"
import type { Note, GraphNode, GraphEdge } from "@/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface GraphViewProps {
  notes: Note[]
  onSelectNote: (note: Note) => void
  onClose: () => void
}

export function GraphView({ notes, onSelectNote, onClose }: GraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"visual" | "list">("visual")

  useEffect(() => {
    const graphNodes: GraphNode[] = notes.map((note, index) => ({
      id: note.id,
      label: note.title,
      type: "note" as const,
      color: note.isFavorite ? "#E8B4A0" : "#A0C4E8",
      size: 20 + note.content.length / 100,
      x: Math.random() * 800,
      y: Math.random() * 600,
      recentlyViewed: index < 3,
    }))

    const graphEdges: GraphEdge[] = []
    notes.forEach((note) => {
      note.linkedNotes?.forEach((linkedId) => {
        if (notes.find((n) => n.id === linkedId)) {
          graphEdges.push({
            source: note.id,
            target: linkedId,
            strength: 1,
          })
        }
      })

      // Create connections based on shared tags
      notes.forEach((otherNote) => {
        if (note.id !== otherNote.id) {
          const sharedTags = note.tags.filter((tag) => otherNote.tags.includes(tag))
          if (sharedTags.length > 0) {
            graphEdges.push({
              source: note.id,
              target: otherNote.id,
              strength: sharedTags.length * 0.5,
            })
          }
        }
      })
    })

    setNodes(graphNodes)
    setEdges(graphEdges)
  }, [notes])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stardust background effect
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const opacity = Math.random() * 0.3
        ctx.fillStyle = `rgba(160, 196, 232, ${opacity})`
        ctx.fillRect(x, y, 1, 1)
      }

      // Draw edges (comets)
      edges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source)
        const targetNode = nodes.find((n) => n.id === edge.target)

        if (sourceNode && targetNode && sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
          const gradient = ctx.createLinearGradient(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y)
          gradient.addColorStop(0, "rgba(160, 196, 232, 0.1)")
          gradient.addColorStop(0.5, `rgba(160, 196, 232, ${edge.strength * 0.3})`)
          gradient.addColorStop(1, "rgba(160, 196, 232, 0.1)")

          ctx.strokeStyle = gradient
          ctx.lineWidth = edge.strength * 2
          ctx.beginPath()
          ctx.moveTo(sourceNode.x, sourceNode.y)
          ctx.lineTo(targetNode.x, targetNode.y)
          ctx.stroke()
        }
      })

      // Draw nodes (orbs)
      nodes.forEach((node) => {
        if (!node.x || !node.y) return

        // Pulsing halo for recently viewed nodes
        if (node.recentlyViewed) {
          const pulseSize = node.size + Math.sin(Date.now() / 500) * 5
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseSize)
          gradient.addColorStop(0, "rgba(232, 180, 160, 0.3)")
          gradient.addColorStop(1, "rgba(232, 180, 160, 0)")
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
          ctx.fill()
        }

        // Main orb
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size)
        gradient.addColorStop(0, node.color)
        gradient.addColorStop(1, `${node.color}80`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        ctx.shadowBlur = 20
        ctx.shadowColor = node.color
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [nodes, edges])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find clicked node
    const clickedNode = nodes.find((node) => {
      if (!node.x || !node.y) return false
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      return distance <= node.size
    })

    if (clickedNode) {
      const note = notes.find((n) => n.id === clickedNode.id)
      if (note) {
        onSelectNote(note)
      }
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hoveredNode = nodes.find((node) => {
      if (!node.x || !node.y) return false
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
      return distance <= node.size
    })

    setHoveredNode(hoveredNode || null)
  }

  const buildHierarchy = () => {
    const noteMap = new Map(notes.map((note) => [note.id, note]))
    const hierarchy: { note: Note; connections: Note[] }[] = []

    notes.forEach((note) => {
      const connections: Note[] = []
      note.linkedNotes?.forEach((linkedId) => {
        const linkedNote = noteMap.get(linkedId)
        if (linkedNote) connections.push(linkedNote)
      })

      // Add notes with shared tags
      notes.forEach((otherNote) => {
        if (note.id !== otherNote.id) {
          const sharedTags = note.tags.filter((tag) => otherNote.tags.includes(tag))
          if (sharedTags.length > 0 && !connections.find((c) => c.id === otherNote.id)) {
            connections.push(otherNote)
          }
        }
      })

      hierarchy.push({ note, connections })
    })

    return hierarchy
  }

  return (
    <div className="fixed inset-0 bg-[#27272A] z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-serif font-bold text-white">La Nébuleuse de Connaissances</h2>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
            <Button
              variant={viewMode === "visual" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("visual")}
              className="h-8 px-3 rounded-lg"
              aria-label="Vue graphique visuelle"
            >
              <Network className="w-4 h-4 mr-2" />
              Visuel
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3 rounded-lg"
              aria-label="Vue liste hiérarchique"
            >
              <List className="w-4 h-4 mr-2" />
              Liste
            </Button>
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 transition-all duration-200"
          aria-label="Fermer la vue graphe"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {viewMode === "visual" ? (
        <>
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-full cursor-pointer"
            aria-label="Graphe interactif des notes"
          />

          {/* Hovered node tooltip */}
          {hoveredNode && (
            <div
              className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 text-white animate-in fade-in duration-200"
              role="tooltip"
            >
              <p className="font-medium">{hoveredNode.label}</p>
            </div>
          )}
        </>
      ) : (
        <ScrollArea className="flex-1 mt-20 px-6 pb-24">
          <div className="max-w-4xl mx-auto space-y-4">
            {buildHierarchy().map(({ note, connections }) => (
              <div
                key={note.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white"
              >
                <button
                  onClick={() => onSelectNote(note)}
                  className="w-full text-left group"
                  aria-label={`Ouvrir la note ${note.title}`}
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[#E8B4A0] transition-colors">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
                    <span>{new Date(note.updatedAt).toLocaleDateString("fr-FR")}</span>
                    {note.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{note.tags.join(", ")}</span>
                      </>
                    )}
                  </div>
                </button>

                {connections.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-white/20">
                    <p className="text-sm text-white/60 mb-2">Connexions ({connections.length}):</p>
                    <ul className="space-y-2" role="list">
                      {connections.map((connectedNote) => (
                        <li key={connectedNote.id}>
                          <button
                            onClick={() => onSelectNote(connectedNote)}
                            className="text-sm hover:text-[#A0C4E8] transition-colors underline"
                            aria-label={`Naviguer vers ${connectedNote.title}`}
                          >
                            → {connectedNote.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Floating tools button */}
      <div className="absolute bottom-6 right-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="h-14 w-14 rounded-full bg-[#E8E3DB] hover:bg-[#D4CFC4] text-[#2C2416] shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Outils du graphe"
            >
              <Filter className="w-6 h-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Outils du Graphe
            </h3>
            <div className="space-y-3">
              <Button
                variant={selectedFilter === "all" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFilter("all")}
              >
                Toutes les notes
              </Button>
              <Button
                variant={selectedFilter === "favorites" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFilter("favorites")}
              >
                Favoris uniquement
              </Button>
              <Button
                variant={selectedFilter === "recent" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFilter("recent")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Notes récentes
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Stats */}
      <div
        className="absolute top-24 left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 text-white text-sm"
        role="status"
        aria-live="polite"
      >
        {nodes.length} notes • {edges.length} connexions
      </div>
    </div>
  )
}
