// Tema altyapisi ilk asamada dark kullanir, ileride light/system secimi eklenebilir.
export const themeConfig = {
  defaultTheme: "dark",
  supportedThemes: ["dark", "light", "system"],
  colors: {
    background: "#06080f",
    surface: "#111820",
    accent: "#8bd3dd",
    success: "#9bd0b8",
    warning: "#d5b46a"
  }
} as const;
