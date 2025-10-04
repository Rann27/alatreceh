# TxtCombiner

Tool sederhana untuk menggabungkan chapter content dan glossary dengan template separator.

## Template Output

```
=separator=
<content>
=separator=
<glossary>
=separator=
```

## Fitur

- ✅ **Auto-combine**: Output otomatis ter-update saat mengetik
- ✅ **3-column layout**: Content, Glossary, dan Output sejajar
- ✅ **No scroll**: Layout pas dengan tinggi browser
- ✅ **Copy button**: Satu klik untuk copy output
- ✅ **Real-time**: Tidak perlu tombol submit

## Cara Pakai

1. **Paste/ketik Content** di kolom kiri
2. **Paste/ketik Glossary** di kolom tengah
3. **Output otomatis muncul** di kolom kanan dengan format template
4. **Klik "Copy Output"** untuk menyalin hasil

## Use Cases

### 1. Chapter & Glossary Preparation
Untuk menyiapkan chapter dengan glossary terpisah dalam format tertentu

### 2. Documentation Formatting
Menggabungkan main content dan terminology definitions

### 3. Translation Projects
Mengkombinasikan translated text dengan glossary terms

## Layout

```
┌─────────────┬─────────────┬─────────────┐
│   Content   │  Glossary   │   Output    │
│             │             │             │
│    30%      │    30%      │    30%      │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

## Tips

- Output akan selalu memiliki separator di awal dan akhir
- Kolom output read-only, tidak bisa diedit
- Format separator: `=separator=`
- Tool ini client-side only, tidak ada data yang dikirim ke server

## Keyboard Shortcuts

- `Ctrl/Cmd + V`: Paste di textarea aktif
- `Ctrl/Cmd + C`: Copy (pilih textarea output dulu)
- `Tab`: Pindah antar textarea

## Technical Notes

- Menggunakan React hooks (useState, useEffect)
- Auto-update dengan dependency tracking
- Clipboard API untuk copy functionality
- Fallback ke execCommand untuk browser lama
- Full-height layout dengan flexbox
