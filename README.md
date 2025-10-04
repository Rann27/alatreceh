# 🛠️ Tools RecehThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



Website untuk meng-host berbagai tools receh yang mungkin berguna.## Getting Started



## 🚀 Tech StackFirst, run the development server:



- **Framework**: Next.js 15 (App Router)```bash

- **Styling**: Tailwind CSS v4npm run dev

- **Language**: TypeScript# or

- **Deployment**: Vercelyarn dev

# or

## 🏃 Getting Startedpnpm dev

# or

Pertama, jalankan development server:bun dev

```

```bash

npm run devOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📁 Struktur Folder

## Learn More

```

ToolsReceh/To learn more about Next.js, take a look at the following resources:

├── app/

│   ├── tools/           # Folder untuk semua tools- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

│   │   └── [tool-name]/ # Setiap tool punya foldernya sendiri- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

│   ├── layout.tsx

│   └── page.tsx         # Homepage dengan daftar toolsYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

├── public/              # Static assets

└── package.json## Deploy on Vercel

```

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## ➕ Menambahkan Tool Baru

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

1. Buat folder baru di `app/tools/[nama-tool]`
2. Buat file `page.tsx` di dalam folder tersebut
3. Tambahkan tool ke array `tools` di `app/page.tsx`

Contoh:

```tsx
// app/page.tsx
const tools = [
  { 
    name: "JSON Formatter", 
    description: "Format dan beautify JSON", 
    path: "/tools/json-formatter" 
  }
];
```

## 🌐 Deployment

Deploy dengan mudah menggunakan Vercel:

```bash
npm run build
```

Atau push ke GitHub dan connect dengan Vercel untuk auto-deployment.

## 📝 License

MIT
