// Tipe untuk tool item
export interface Tool {
  name: string;
  description: string;
  path: string;
  icon?: string; // Emoji or icon name
}

// Daftar semua tools yang tersedia
// Tambahkan tool baru di sini setelah membuatnya
export const tools: Tool[] = [
  {
    name: "Line Spacing Tool",
    description: "Gandakan atau kurangi spacing antar baris (\\n, ^p, custom token)",
    path: "/tools/line-spacing",
    icon: "📏"
  },
  {
    name: "TxtCombiner",
    description: "Gabungkan chapter content & glossary dengan template separator",
    path: "/tools/txt-combiner",
    icon: "🔗"
  },
  {
    name: "Border Wrapper",
    description: "Bungkus teks dengan ASCII box drawing characters (full/without right)",
    path: "/tools/border-wrapper",
    icon: "📦"
  },
];
