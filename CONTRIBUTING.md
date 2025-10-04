# Panduan Menambahkan Tool Baru

## Langkah-langkah:

### 1. Buat Folder Tool Baru

Buat folder baru di `app/tools/` dengan nama tool Anda (gunakan kebab-case):

```bash
mkdir app/tools/nama-tool-anda
```

### 2. Buat File page.tsx

Buat file `page.tsx` di dalam folder tersebut. Anda bisa copy dari template di `app/tools/_example/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import ToolLayout from "@/app/components/ToolLayout";

export default function NamaToolPage() {
  // State management di sini
  
  return (
    <ToolLayout 
      title="Nama Tool Anda" 
      description="Deskripsi singkat tool Anda"
    >
      {/* Content tool Anda di sini */}
    </ToolLayout>
  );
}
```

### 3. Tambahkan ke Homepage

Edit file `app/page.tsx` dan tambahkan tool Anda ke array `tools`:

```tsx
const tools = [
  { 
    name: "Nama Tool", 
    description: "Deskripsi tool", 
    path: "/tools/nama-tool-anda" 
  },
  // ... tools lainnya
];
```

### 4. Test di Browser

Jalankan development server:

```bash
npm run dev
```

Buka `http://localhost:3000` untuk melihat tool Anda di homepage.

## Tips:

- Gunakan `"use client"` directive jika tool Anda butuh interaktivity (state, events, etc)
- Gunakan ToolLayout component untuk konsistensi UI
- Simpan state lokal di component (tidak perlu database untuk tools sederhana)
- Gunakan Tailwind CSS untuk styling
- Test responsiveness di berbagai ukuran layar

## Contoh Tool Ideas:

1. **JSON Formatter** - Format & beautify JSON
2. **Base64 Encoder/Decoder** - Encode/decode base64
3. **URL Encoder/Decoder** - Encode/decode URLs
4. **Color Picker** - Pick colors dan convert format
5. **Password Generator** - Generate random passwords
6. **Lorem Ipsum Generator** - Generate placeholder text
7. **Markdown Preview** - Preview markdown in real-time
8. **QR Code Generator** - Generate QR codes
9. **Text Diff Checker** - Compare two texts
10. **UUID Generator** - Generate UUIDs

Selamat coding! 🚀
