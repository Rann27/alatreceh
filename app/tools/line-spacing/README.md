# Line Spacing Tool

Tool untuk menggandakan atau mengurangi spacing antar baris dalam teks.

## Fitur

### 🔼 Mode Gandakan (Double)
- Mengubah single line-break menjadi double
- Contoh: `\n` → `\n\n` atau `^p` → `^p^p`

### 🔽 Mode Kurangi (Halve)
- Mengubah double line-break menjadi single
- Contoh: `\n\n` → `\n` atau `^p^p` → `^p`

## Mode yang Tersedia

### 1. Newline (Default)
- Auto-detect format newline:
  - **CRLF** (`\r\n`) - Windows
  - **LF** (`\n`) - Unix/macOS/Linux
- Mempertahankan format asli saat menggandakan/mengurangi

### 2. MS Word (`^p`)
- Khusus untuk teks dari Microsoft Word
- Menggunakan token `^p` sebagai penanda paragraph break

### 3. Token Kustom
- Anda bisa define token sendiri
- Contoh: `<br>`, `||`, `===`, dll.
- Berguna untuk format khusus

## Use Cases

### Penggandaan
1. **Single to Double Spacing**: Untuk membuat teks lebih readable
2. **Format Email**: Banyak email client butuh double spacing
3. **Markdown**: Convert single to double spacing untuk paragraph breaks

### Pengurangan
1. **Remove Extra Spacing**: Bersihkan teks yang terlalu banyak spacing
2. **Compact Format**: Untuk menghemat space
3. **Clean up Copy-Paste**: Teks dari PDF sering punya extra line breaks

## Tips

- Tool ini preserve line break style asli (Windows vs Unix)
- Counter menunjukkan berapa banyak operasi yang dilakukan
- Hasil langsung muncul real-time saat mengetik
- Tombol copy/paste terintegrasi dengan clipboard

## Keyboard Shortcuts

- `Ctrl/Cmd + V`: Paste (di textarea input)
- `Ctrl/Cmd + C`: Copy (select output textarea terlebih dahulu)
- `Ctrl/Cmd + A`: Select all (di textarea yang active)

## Technical Notes

- Client-side only, tidak ada data yang dikirim ke server
- Supports clipboard API untuk modern browsers
- Fallback ke execCommand untuk browser lama
- Auto-detection menggunakan regex pattern matching
