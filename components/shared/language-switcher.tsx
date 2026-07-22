"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/components/providers/I18nProvider";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe size={18} />
        <span className="sr-only">Toggle language</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl border border-border bg-popover shadow-lg focus:outline-none z-50 animate-in fade-in-0 zoom-in-95">
          <div className="p-1">
            <button
              onClick={() => {
                setLocale("en");
                setIsOpen(false);
              }}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${
                locale === "en" ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLocale("hi");
                setIsOpen(false);
              }}
              className={`flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted mt-1 ${
                locale === "hi" ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
