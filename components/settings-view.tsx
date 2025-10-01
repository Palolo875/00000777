"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { X, Palette, Brain, Database, Puzzle, Zap, Shield, Download, Upload, Eye } from "lucide-react"

interface SettingsViewProps {
  onClose: () => void
}

export function SettingsView({ onClose }: SettingsViewProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [fontSize, setFontSize] = useState(17)
  const [aiSentience, setAiSentience] = useState(50)
  const [autoSave, setAutoSave] = useState(true)
  const [showWordCount, setShowWordCount] = useState(true)
  const [aiProactivity, setAiProactivity] = useState(50)
  const [reduceAnimations, setReduceAnimations] = useState(false)

  return (
    <div className="flex-1 bg-[#FAF8F5] overflow-hidden">
      <div className="h-16 border-b border-[#E8E3DB] flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2C2416]">Paramètres</h1>
          <p className="text-sm text-[#6B6456]">Le Système d'Exploitation de la Pensée</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-10 w-10 p-0 rounded-full hover:bg-[#E8E3DB] transition-all duration-200"
          aria-label="Fermer les paramètres"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto p-8 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-[#E8E3DB] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A0C4E8] to-[#8AB4D8] flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2C2416]">Intelligence Artificielle</h2>
                <p className="text-sm text-[#6B6456]">Contrôlez la "sentience" de votre assistant</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-[#2C2416]">Niveau de sentience</p>
                    <p className="text-sm text-[#6B6456]">
                      {aiSentience < 30 ? "Discret" : aiSentience < 70 ? "Équilibré" : "Proactif"}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-[#2C2416]">{aiSentience}%</span>
                </div>
                <Slider
                  value={[aiSentience]}
                  onValueChange={(value) => setAiSentience(value[0])}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                  aria-label="Ajuster le niveau de sentience"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-[#2C2416]">Proactivité des suggestions</p>
                    <p className="text-sm text-[#6B6456]">Fréquence des suggestions automatiques</p>
                  </div>
                  <span className="text-lg font-semibold text-[#2C2416]">{aiProactivity}%</span>
                </div>
                <Slider
                  value={[aiProactivity]}
                  onValueChange={(value) => setAiProactivity(value[0])}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                  aria-label="Ajuster la proactivité des suggestions"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <p className="font-medium text-[#2C2416] mb-3">Modèle d'IA</p>
                <div className="space-y-2">
                  {["GPT-4 (Recommandé)", "GPT-3.5 (Rapide)", "Claude (Créatif)"].map((model) => (
                    <button
                      key={model}
                      className="w-full text-left px-4 py-3 rounded-xl bg-white border border-[#E8E3DB] hover:border-[#2C2416] transition-all duration-200"
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8E3DB] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4C5A0] to-[#C4B590] flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2C2416]">Données & Sécurité</h2>
                <p className="text-sm text-[#6B6456]">Gérez vos données en toute transparence</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <div>
                  <p className="font-medium text-[#2C2416]">Sauvegarde automatique</p>
                  <p className="text-sm text-[#6B6456]">Enregistrez vos modifications en temps réel</p>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                  aria-label="Activer la sauvegarde automatique"
                />
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-[#F5F2ED] border border-[#E8E3DB]">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#2C2416]" />
                  <p className="font-medium text-[#2C2416]">Coffre-Fort de Données</p>
                </div>
                <div className="space-y-3 text-sm text-[#6B6456]">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#A0C4E8] mt-1.5" />
                    <p>Vos données sont stockées localement dans votre navigateur</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#A0C4E8] mt-1.5" />
                    <p>Aucune donnée n'est envoyée à des serveurs externes</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#A0C4E8] mt-1.5" />
                    <p>Vous pouvez exporter vos données à tout moment</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-[#2C2416] hover:bg-[#3D3220] text-white rounded-xl h-12">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="outline" className="border-[#2C2416] text-[#2C2416] rounded-xl h-12 bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8E3DB] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C5A0D4] to-[#B590C4] flex items-center justify-center">
                <Puzzle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2C2416]">Modules</h2>
                <p className="text-sm text-[#6B6456]">Activez ou désactivez les fonctionnalités</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: "Graphe de Connaissances", enabled: true },
                { name: "Gestionnaire de Tâches", enabled: true },
                { name: "Journal & Réflexion", enabled: true },
                { name: "Mode Focus Pomodoro", enabled: true },
                { name: "Suggestions IA", enabled: true },
              ].map((module) => (
                <div
                  key={module.name}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200"
                >
                  <p className="font-medium text-[#2C2416]">{module.name}</p>
                  <Switch checked={module.enabled} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8E3DB] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A0D4C5] to-[#90C4B5] flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2C2416]">Avancé</h2>
                <p className="text-sm text-[#6B6456]">Options pour utilisateurs expérimentés</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <div>
                  <p className="font-medium text-[#2C2416]">Afficher le compteur de mots</p>
                  <p className="text-sm text-[#6B6456]">Compteur en temps réel dans l'éditeur</p>
                </div>
                <Switch
                  checked={showWordCount}
                  onCheckedChange={setShowWordCount}
                  aria-label="Activer le compteur de mots"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <div>
                  <p className="font-medium text-[#2C2416]">Mode développeur</p>
                  <p className="text-sm text-[#6B6456]">Accès aux fonctionnalités expérimentales</p>
                </div>
                <Switch aria-label="Activer le mode développeur" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8E3DB] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E8B4A0] to-[#D4A890] flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2C2416]">Apparence</h2>
                <p className="text-sm text-[#6B6456]">Personnalisez l'interface à votre goût</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <div>
                  <p className="font-medium text-[#2C2416]">Thème sombre</p>
                  <p className="text-sm text-[#6B6456]">Activez le mode sombre pour réduire la fatigue oculaire</p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  aria-label="Activer le thème sombre"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-[#2C2416]">Taille de police</p>
                    <p className="text-sm text-[#6B6456]">Ajustez la taille du texte pour une meilleure lisibilité</p>
                  </div>
                  <span className="text-lg font-semibold text-[#2C2416]" aria-live="polite">
                    {fontSize}px
                  </span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={14}
                  max={24}
                  step={1}
                  className="w-full"
                  aria-label="Ajuster la taille de police"
                />
                <p className="text-xs text-[#6B6456] mt-2">
                  Respecte également les préférences de votre système d'exploitation
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <p className="font-medium text-[#2C2416] mb-3">Couleur d'accent</p>
                <div className="flex gap-3" role="radiogroup" aria-label="Sélectionner une couleur d'accent">
                  {["#E8B4A0", "#A0C4E8", "#D4C5A0", "#C5A0D4", "#A0D4C5"].map((color) => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform duration-200 focus:ring-2 focus:ring-[#E8B4A0] focus:ring-offset-2"
                      style={{ backgroundColor: color }}
                      aria-label={`Couleur ${color}`}
                      role="radio"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8E3DB] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A0C4E8] to-[#8AB4D8] flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2C2416]">Accessibilité</h2>
                <p className="text-sm text-[#6B6456]">Options pour une meilleure expérience</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F2ED] transition-all duration-200">
                <div>
                  <p className="font-medium text-[#2C2416]">Réduire les animations</p>
                  <p className="text-sm text-[#6B6456]">
                    Désactivez les animations complexes pour une interface plus sobre
                  </p>
                </div>
                <Switch
                  checked={reduceAnimations}
                  onCheckedChange={setReduceAnimations}
                  aria-label="Réduire les animations"
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
