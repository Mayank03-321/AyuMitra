import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { LanguageCode } from "../../types";
import { SUPPORTED_LANGUAGES } from "../../data/initialData";

export interface LanguageItem {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguageSelectorDropdownProps {
  value?: LanguageCode;
  onChange?: (lang: LanguageCode) => void;
  className?: string;
}

export const Component: React.FC<LanguageSelectorDropdownProps> = ({
  value,
  onChange,
  className,
}) => {
  const defaultSelected =
    SUPPORTED_LANGUAGES.find((l) => l.code === value) || SUPPORTED_LANGUAGES[0];

  const [selected, setSelected] = useState<LanguageItem>(defaultSelected);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal state when controlled value prop changes
  useEffect(() => {
    if (value) {
      const match = SUPPORTED_LANGUAGES.find((l) => l.code === value);
      if (match) setSelected(match);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: LanguageItem) => {
    setSelected(lang);
    setOpen(false);
    if (onChange) {
      onChange(lang.code);
    }
  };

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="btn-language-selector"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold cursor-pointer",
          "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xs",
          "border-slate-200 dark:border-slate-700",
          "text-slate-900 dark:text-white",
          "hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-98"
        )}
      >
        <span className="text-sm leading-none">{selected.flag}</span>
        <span className="font-bold text-slate-900 dark:text-white">{selected.nativeName}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-slate-600 dark:text-white transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={cn(
            "absolute right-0 sm:left-0 mt-2 w-48 rounded-2xl overflow-hidden z-50",
            "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl",
            "shadow-xl border border-slate-200 dark:border-slate-700 p-1.5",
            "animate-fade-in"
          )}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = (value ? value === lang.code : selected.code === lang.code);
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded-xl text-left transition-colors cursor-pointer",
                  isSelected
                    ? "font-bold text-emerald-800 bg-emerald-100/80 dark:text-white dark:bg-emerald-700"
                    : "text-slate-800 dark:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800"
                )}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1 font-medium text-slate-900 dark:text-white">{lang.nativeName} ({lang.name})</span>
                {isSelected && (
                  <Check className="h-4 w-4 text-emerald-600 dark:text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const LanguageSelectorDropdown = Component;
export default Component;
