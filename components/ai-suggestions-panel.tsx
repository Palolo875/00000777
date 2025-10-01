"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Note } from "@/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Sparkles, Lightbulb, ArrowRight, RefreshCw, Zap, BookOpen, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AISuggestionsPanelProps {
  note: Note | null
  onClose: () => void
  onApplySuggestion: (suggestion: string) => void
}

interface Suggestion {
  text: string
  type: "expand" | "structure" | "creative" | "action"
  icon: React.ReactNode
}

export function AISuggestionsPanel({ note, onClose, onApplySuggestion }: AISuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<"suggestions" | "templates">("suggestions")

  useEffect(() => {
    generateSuggestions()
  }, [note])

  const generateSuggestions = () => {
    setIsGenerating(true)

    // Simulate AI suggestions based on note content
    setTimeout(() => {
      const contextualSuggestions = getContextualSuggestions(note?.content || "")
      setSuggestions(contextualSuggestions)
      setIsGenerating(false)
    }, 1000)
  }

  const getContextualSuggestions = (content: string): Suggestion[] => {
    const suggestions: Suggestion[] = []

    // Analyze content and provide contextual suggestions
    if (content.length < 50) {
      suggestions.push(
        {
          text: "Développez votre idée principale en ajoutant des exemples concrets et des détails spécifiques.",
          type: "expand",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          text: "Structurez votre pensée avec des sous-sections claires pour une meilleure organisation.",
          type: "structure",
          icon: <Target className="w-4 h-4" />,
        },
        {
          text: "Ajoutez un contexte historique ou des références pour enrichir votre note.",
          type: "expand",
          icon: <Lightbulb className="w-4 h-4" />,
        },
      )
    } else if (content.includes("?")) {
      suggestions.push(
        {
          text: "Explorez différentes réponses possibles à cette question avec une analyse comparative.",
          type: "creative",
          icon: <Lightbulb className="w-4 h-4" />,
        },
        {
          text: "Recherchez des sources académiques ou professionnelles pour approfondir ce sujet.",
          type: "action",
          icon: <Zap className="w-4 h-4" />,
        },
        {
          text: "Créez une liste de points à investiguer avec des priorités et des échéances.",
          type: "structure",
          icon: <Target className="w-4 h-4" />,
        },
      )
    } else if (content.includes("idée") || content.includes("projet")) {
      suggestions.push(
        {
          text: "Définissez les étapes concrètes pour réaliser ce projet avec des jalons mesurables.",
          type: "action",
          icon: <Zap className="w-4 h-4" />,
        },
        {
          text: "Identifiez les ressources nécessaires (humaines, financières, matérielles).",
          type: "structure",
          icon: <Target className="w-4 h-4" />,
        },
        {
          text: "Établissez un calendrier réaliste avec des dates clés et des points de contrôle.",
          type: "action",
          icon: <Zap className="w-4 h-4" />,
        },
      )
    } else {
      suggestions.push(
        {
          text: "Ajoutez une conclusion synthétique qui résume vos points clés et ouvre des perspectives.",
          type: "structure",
          icon: <Target className="w-4 h-4" />,
        },
        {
          text: "Créez des liens avec d'autres notes connexes pour construire un réseau de connaissances.",
          type: "creative",
          icon: <Lightbulb className="w-4 h-4" />,
        },
        {
          text: "Enrichissez avec des références bibliographiques ou des sources vérifiables.",
          type: "expand",
          icon: <BookOpen className="w-4 h-4" />,
        },
      )
    }

    // Add creative suggestions
    suggestions.push(
      {
        text: "Transformez cette note en checklist actionnable avec des cases à cocher.",
        type: "action",
        icon: <Zap className="w-4 h-4" />,
      },
      {
        text: "Créez un mind map visuel à partir de ces idées pour mieux les visualiser.",
        type: "creative",
        icon: <Lightbulb className="w-4 h-4" />,
      },
    )

    return suggestions.slice(0, 6)
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "expand":
        return "text-[#A0C4E8]"
      case "structure":
        return "text-[#D4C5A0]"
      case "creative":
        return "text-[#E8B4A0]"
      case "action":
        return "text-[#C5A0D4]"
      default:
        return "text-[#6B6456]"
    }
  }

  const templates = [
    {
      name: "Réunion",
      content:
        "# Réunion - [Date]\n\n## Participants\n- \n\n## Ordre du jour\n1. \n\n## Notes\n\n## Actions à suivre\n- [ ] ",
      icon: "📋",
    },
    {
      name: "Projet",
      content:
        "# Projet: [Nom]\n\n## Objectif\n\n## Contexte\n\n## Étapes\n1. \n\n## Ressources nécessaires\n\n## Timeline\n",
      icon: "🎯",
    },
    {
      name: "Idée",
      content:
        "# Idée: [Titre]\n\n## Description\n\n## Pourquoi c'est intéressant\n\n## Prochaines étapes\n- \n\n## Références\n",
      icon: "💡",
    },
    {
      name: "Apprentissage",
      content:
        "# Apprentissage: [Sujet]\n\n## Ce que j'ai appris\n\n## Points clés\n- \n\n## Questions restantes\n- \n\n## À approfondir\n",
      icon: "📚",
    },
  ]

  return (
    <div className="w-96 bg-white border-l border-[#E8E3DB] flex flex-col animate-in slide-in-from-right duration-300 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-[#E8E3DB]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8B4A0] to-[#D4C5A0] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-[#2C2416]" />
            </div>
            <h2 className="text-lg font-semibold text-[#2C2416]">Assistant IA</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-[#F5F2ED] transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-[#6B6456]">Suggestions intelligentes pour enrichir votre note</p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={activeTab === "suggestions" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("suggestions")}
            className={`flex-1 transition-all duration-200 ${
              activeTab === "suggestions"
                ? "bg-[#2C2416] text-[#FAF8F5] hover:bg-[#3D3220]"
                : "text-[#6B6456] hover:bg-[#F5F2ED]"
            }`}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Suggestions
          </Button>
          <Button
            variant={activeTab === "templates" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("templates")}
            className={`flex-1 transition-all duration-200 ${
              activeTab === "templates"
                ? "bg-[#2C2416] text-[#FAF8F5] hover:bg-[#3D3220]"
                : "text-[#6B6456] hover:bg-[#F5F2ED]"
            }`}
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Modèles
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6">
        {activeTab === "suggestions" ? (
          <div className="space-y-4">
            {isGenerating ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 text-[#E8B4A0] animate-spin" />
                  <p className="text-sm text-[#6B6456]">Génération de suggestions...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#2C2416] flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[#E8B4A0]" />
                    Suggestions contextuelles
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateSuggestions}
                    className="h-7 text-xs text-[#6B6456] hover:text-[#2C2416] transition-all duration-200"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Actualiser
                  </Button>
                </div>

                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="group p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DB] hover:border-[#D4C5A0] hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                    onClick={() => onApplySuggestion(suggestion.text)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`${getSuggestionColor(suggestion.type)} mt-0.5`}>{suggestion.icon}</div>
                      <p className="text-sm text-[#2C2416] leading-relaxed flex-1">{suggestion.text}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs bg-[#E8E3DB] text-[#6B6456] hover:bg-[#DDD8CC]">
                        {suggestion.type === "expand" && "Développer"}
                        {suggestion.type === "structure" && "Structurer"}
                        {suggestion.type === "creative" && "Créatif"}
                        {suggestion.type === "action" && "Action"}
                      </Badge>
                      <span className="text-xs text-[#6B6456] group-hover:text-[#2C2416] flex items-center gap-1 transition-colors">
                        Appliquer
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#2C2416] mb-4">Modèles de notes</h3>
            {templates.map((template, index) => (
              <div
                key={index}
                className="group p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DB] hover:border-[#D4C5A0] hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                onClick={() => onApplySuggestion(template.content)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#2C2416]">{template.name}</p>
                    <p className="text-xs text-[#6B6456] mt-1">Cliquez pour utiliser ce modèle</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6B6456] group-hover:text-[#2C2416] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {activeTab === "suggestions" && !isGenerating && (
          <div className="mt-8 pt-6 border-t border-[#E8E3DB]">
            <h3 className="text-sm font-semibold text-[#2C2416] mb-3">Actions rapides</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-[#2C2416] border-[#E8E3DB] hover:bg-[#FAF8F5] hover:border-[#D4C5A0] bg-transparent transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onApplySuggestion("\n\n## Points clés\n\n- \n- \n- ")}
              >
                <Sparkles className="w-4 h-4 mr-2 text-[#E8B4A0]" />
                Créer une liste de points clés
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-[#2C2416] border-[#E8E3DB] hover:bg-[#FAF8F5] hover:border-[#D4C5A0] bg-transparent transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onApplySuggestion("\n\n## Prochaines étapes\n\n1. \n2. \n3. ")}
              >
                <Sparkles className="w-4 h-4 mr-2 text-[#E8B4A0]" />
                Ajouter des prochaines étapes
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-[#2C2416] border-[#E8E3DB] hover:bg-[#FAF8F5] hover:border-[#D4C5A0] bg-transparent transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onApplySuggestion("\n\n## Réflexions\n\n")}
              >
                <Sparkles className="w-4 h-4 mr-2 text-[#E8B4A0]" />
                Ajouter une section réflexion
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
