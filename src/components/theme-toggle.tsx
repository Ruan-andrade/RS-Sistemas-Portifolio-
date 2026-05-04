"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full hover:bg-gray-200 dark:hover:bg-card"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 scale-100 text-muted-foreground transition-all hover:text-primary dark:scale-0" />
      <Moon className="absolute h-5 w-5 scale-0 text-muted-foreground transition-all hover:text-primary dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
