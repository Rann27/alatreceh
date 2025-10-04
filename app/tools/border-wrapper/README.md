# Border Wrapper

Tool untuk membungkus teks dengan ASCII box drawing characters. Mendukung berbagai gaya border dan mode wrap, termasuk handling untuk emoji dan unicode characters.

## Fitur Utama

### 🎨 Dua Mode Box
1. **Full Box**: Border lengkap di semua sisi
   ```
   ╔════════════════╗
   ║  Contoh teks  ║
   ╚════════════════╝
   ```

2. **Without Right Border**: Tanpa border kanan (NEW!)
   ```
   ╔═════════════════════════
   ║  Contoh teks
   ║  Baris kedua
   ╚═════════════════════════
   ```

### 📏 Border Styles
- **Single**: `┌─┐│└┘` - Border tipis
- **Double**: `╔═╗║╚╝` - Border tebal

### 🔤 Wrap Modes
1. **Normal**: Word-based wrapping (default)
2. **Hard**: Character-based wrapping (potong di tengah kata)
3. **CJK**: Khusus untuk Chinese/Japanese/Korean (2-width characters)

### 🌐 Unicode & Emoji Support
- **Ambiguous Width Detection**: Otomatis detect karakter lebar 2 seperti ▶, ◆, ➜
- **Emoji Support**: Handle emoji dengan benar (🎉, 💡, dll)
- **CJK Characters**: Full support untuk huruf Asia Timur

## Konfigurasi

### Lebar & Padding
- **Max Width**: Lebar total box (termasuk border)
- **Padding**: Top, Right, Bottom, Left (dalam karakter)

### Space Character
- **NBSP (default)**: Non-breaking space, anti-trim
- **Space**: Spasi biasa

### Opsi Tambahan
- ✅ **Trim lines**: Hapus spasi berlebih di setiap baris
- ✅ **Collapse blank**: Gabung baris kosong berturut-turut
- ✅ **Ambiguous wide**: Treat simbol ambigu sebagai lebar 2

## Use Cases

### 1. Code Comments Box
```
╔════════════════════════════════════════╗
║  TODO: Implement feature               ║
║  - Add validation                      ║
║  - Update documentation                ║
╚════════════════════════════════════════╝
```

### 2. Terminal Output Highlight
```
╔═══════════════════════════════════════
║  ⚠️  WARNING: This action cannot be undone
║  
║  Are you sure you want to continue?
╚═══════════════════════════════════════
```

### 3. ASCII Art Frames
```
┌────────────────────────────────────┐
│  ✨ Welcome to My App ✨           │
│                                    │
│  Select an option to continue...  │
└────────────────────────────────────┘
```

### 4. Chat Bubbles (No Right Border)
```
╔═════════════════════════════════════
║  Hey! How are you doing?
║  
║  Let's catch up sometime! 😊
╚═════════════════════════════════════
```

## Technical Details

### Character Width Detection

Tool ini menggunakan Unicode ranges untuk detect lebar karakter:

1. **CJK Wide** (lebar 2):
   - Hangul: U+1100 - U+115F, U+AC00 - U+D7A3
   - CJK Unified: U+2E80 - U+A4CF
   - Fullwidth forms: U+FF00 - U+FF60

2. **Ambiguous Wide** (lebar 2 jika enabled):
   - Arrows: U+2190 - U+21FF (→, ↑, ⇒)
   - Geometric shapes: U+25A0 - U+25FF (▶, ◆, ●)
   - Dingbats: U+2700 - U+27BF (✓, ✗, ➜)
   - Emoji: U+1F300 - U+1FAFF (🎉, 💡, 🚀)

### Wrap Algorithm

1. **Normal Mode**: Wrap berdasarkan kata, preserve spaces
2. **Hard Mode**: Wrap strict di max width, potong kata jika perlu
3. **CJK Mode**: Special handling untuk karakter lebar 2

### NBSP vs Space

- **NBSP (`\u00A0`)**: Tidak akan di-trim oleh text editor/terminal
- **Space**: Bisa di-trim, tergantung environment

## Tips

💡 **For Code**: Gunakan Single border + Normal wrap  
💡 **For Chat**: Gunakan No-right border + Double style  
💡 **For Emoji**: Enable "Ambiguous wide" untuk alignment yang benar  
💡 **For Asian Text**: Gunakan CJK mode untuk karakter China/Jepang/Korea  

## Keyboard Shortcuts

- `Ctrl/Cmd + V`: Paste di input textarea
- `Ctrl/Cmd + A`: Select all output

## Known Limitations

- Emoji dengan kombinasi (skin tone, gender) mungkin tidak 100% akurat
- Terminal/font yang berbeda bisa render width yang berbeda
- Gunakan monospace font untuk hasil terbaik
