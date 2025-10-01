"use client"

import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, Strikethrough, Link2, Highlighter } from "lucide-react"

interface TextSelectionToolbarProps {
  position: { top: number; left: number }
  onFormat: (format: string) => void
}

export function TextSelectionToolbar({ position, onFormat }: TextSelectionToolbarProps) {
  return (
    <div
      className="fixed z-50 flex items-center gap-1 bg-[#2C2416]/95 backdrop-blur-xl rounded-xl shadow-2xl p-1.5 animate-in fade-in slide-in-from-top duration-200"
      style={{ top: position.top - 50, left: position.left }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("bold")}
        className="h-8 w-8 p-0 text-white hover:bg-white/20 transition-all duration-200"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("italic")}
        className="h-8 w-8 p-0 text-white hover:bg-white/20 transition-all duration-200"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("underline")}
        className="h-8 w-8 p-0 text-white hover:bg-white/20 transition-all duration-200"
      >
        <Underline className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("strikethrough")}
        className="h-8 w-8 p-0 text-white hover:bg-white/20 transition-all duration-200"
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-white/20 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("link")}
        className="h-8 w-8 p-0 text-white hover:bg-white/20 transition-all duration-200"
      >
        <Link2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat("highlight")}
        className="h-8 w-8 p-0 text-white hover:bg-white/20 transition-all duration-200"
      >
        <Highlighter className="w-4 h-4" />
      </Button>
    </div>
  )
}
