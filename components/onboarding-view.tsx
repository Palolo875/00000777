"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Slash, MousePointer2, Zap } from "lucide-react"

interface OnboardingViewProps {
  onComplete: () => void
}

export function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      title: "Bienvenue dans SmartNote AI",
      description: "Votre espace de pensée augmenté par l'intelligence artificielle",
      icon: Sparkles,
      color: "#E8B4A0",
      task: "Cliquez sur 'Suivant' pour commencer votre voyage",
    },
    {
      title: "Commande Slash",
      description: "Tapez / pour insérer des blocs rapidement",
      icon: Slash,
      color: "#A0C4E8",
      task: "Essayez de taper / dans une note pour voir le menu",
    },
    {
      title: "Sélection de Texte",
      description: "Sélectionnez du texte pour voir la barre d'outils flottante",
      icon: MousePointer2,
      color: "#D4C5A0",
      task: "Sélectionnez du texte pour formater instantanément",
    },
    {
      title: "Curseur Augmenté",
      description: "L'IA vous suggère des idées pendant que vous écrivez",
      icon: Zap,
      color: "#C5A0D4",
      task: "Commencez à écrire et observez les suggestions",
    },
  ]

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep])
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = steps[currentStep]
  const Icon = step.icon

  return (
    <div className="flex-1 bg-gradient-to-br from-[#FAF8F5] via-[#F5F2ED] to-[#FAF8F5] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="flex items-center justify-center gap-3 mb-12">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentStep
                  ? "w-12 bg-[#2C2416]"
                  : completedSteps.includes(index)
                    ? "w-8 bg-[#A0C4E8]"
                    : "w-8 bg-[#E8E3DB]"
              }`}
            />
          ))}
        </div>

        <div
          className="bg-white rounded-3xl p-12 border border-[#E8E3DB] shadow-2xl transform transition-all duration-500 hover:scale-[1.02]"
          style={{
            animation: "fadeIn 0.5s ease-out",
          }}
        >
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transform transition-transform duration-300 hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
            }}
          >
            <Icon className="w-10 h-10 text-white" />
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#2C2416] mb-3">{step.title}</h2>
            <p className="text-lg text-[#6B6456] mb-6">{step.description}</p>

            {/* Task card */}
            <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E3DB] inline-block">
              <p className="text-sm font-medium text-[#2C2416] mb-2">À essayer :</p>
              <p className="text-[#6B6456]">{step.task}</p>
            </div>
          </div>

          {/* Completion indicator */}
          {completedSteps.includes(currentStep) && (
            <div className="flex items-center justify-center gap-2 mb-6 text-[#A0C4E8] animate-in fade-in duration-300">
              <Check className="w-5 h-5" />
              <span className="font-medium">Étape complétée !</span>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="rounded-xl border-[#E8E3DB] text-[#2C2416] disabled:opacity-50 bg-transparent"
            >
              Précédent
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? "bg-[#2C2416] scale-125" : "bg-[#E8E3DB] hover:bg-[#D4C5A0]"
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} className="bg-[#2C2416] hover:bg-[#3D3220] text-white rounded-xl px-8">
              {currentStep === steps.length - 1 ? "Commencer" : "Suivant"}
            </Button>
          </div>
        </div>

        {/* Skip button */}
        <div className="text-center mt-6">
          <button
            onClick={onComplete}
            className="text-sm text-[#6B6456] hover:text-[#2C2416] transition-colors duration-200"
          >
            Passer l'introduction
          </button>
        </div>
      </div>
    </div>
  )
}
