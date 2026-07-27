import { defineStore } from "pinia";

const STORAGE_KEY = "boulder-tracker-theme";
type ThemePreference = "light" | "dark";

function getSystemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getStoredPreference(): ThemePreference | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

function applyDarkClass(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: false,
    // true, sobald der Nutzer den Switch mindestens einmal bedient hat --
    // ab dann folgt die App nicht mehr automatisch der Systemeinstellung.
    hasExplicitPreference: false
  }),
  actions: {
    /**
     * Ermittelt den Startzustand (gespeicherte Praeferenz, sonst
     * Betriebssystem-Einstellung) und haengt einen Listener an, der bei
     * fehlender expliziter Praeferenz auf Systemwechsel reagiert.
     */
    init() {
      const stored = getStoredPreference();
      this.hasExplicitPreference = stored !== null;
      this.isDark = stored ? stored === "dark" : getSystemPrefersDark();
      applyDarkClass(this.isDark);

      const media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", (event) => {
        if (!this.hasExplicitPreference) {
          this.isDark = event.matches;
          applyDarkClass(this.isDark);
        }
      });
    },
    toggle() {
      this.setDark(!this.isDark);
    },
    setDark(isDark: boolean) {
      this.isDark = isDark;
      this.hasExplicitPreference = true;
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
      applyDarkClass(this.isDark);
    }
  }
});
