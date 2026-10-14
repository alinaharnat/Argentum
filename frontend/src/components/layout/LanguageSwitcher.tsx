import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const languages = [
    { code: "uk", label: "Українська"},
    { code: "en", label: "English"},
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = i18n.language?.slice(0, 2) || "uk";

    // Закриття меню при кліку зовні
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
              dropdownRef.current &&
              !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            )}
            aria-label="Select language"
          >
              <Globe className="h-4 w-4 text-muted-foreground" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md transition-all z-50">
                {languages.map((lang) => {
                    const isSelected = currentLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleSelect(lang.code)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isSelected
                            ? "bg-accent font-medium text-accent-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                <span className="flex items-center gap-2">
                  <span>{lang.label}</span>
                </span>
                          {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                })}
            </div>
          )}
      </div>
    );
}