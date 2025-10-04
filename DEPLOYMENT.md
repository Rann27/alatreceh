# Panduan Deploy ke Vercel

## Persiapan

1. Buat akun di [Vercel](https://vercel.com) (bisa pakai GitHub login)
2. Install Vercel CLI (opsional):
   ```bash
   npm install -g vercel
   ```

## Method 1: Deploy via GitHub (Recommended)

1. **Push ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/repo-name.git
   git push -u origin main
   ```

2. **Connect ke Vercel**:
   - Login ke [Vercel Dashboard](https://vercel.com/dashboard)
   - Klik "Add New Project"
   - Import repository GitHub Anda
   - Vercel akan auto-detect Next.js project
   - Klik "Deploy"

3. **Auto Deploy**:
   - Setiap kali push ke main branch, Vercel otomatis deploy ulang
   - Vercel akan provide URL production (e.g., `your-project.vercel.app`)

## Method 2: Deploy via CLI

1. **Login ke Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy**:
   ```bash
   cd f:\Ftl3\tools\ToolsReceh
   vercel
   ```

3. **Deploy Production**:
   ```bash
   vercel --prod
   ```

## Environment Variables

Jika nanti ada environment variables:

1. Di Vercel Dashboard → Settings → Environment Variables
2. Tambahkan variables yang diperlukan
3. Redeploy project

## Custom Domain (Opsional)

1. Di Vercel Dashboard → Settings → Domains
2. Add domain Anda
3. Update DNS settings sesuai instruksi

## Tips

- Development: `npm run dev` (localhost:3000)
- Production Build Test: `npm run build && npm start`
- Vercel memberikan:
  - SSL certificate otomatis
  - CDN global
  - Auto scaling
  - Preview deployments untuk setiap PR

## Troubleshooting

Jika ada error saat deploy:

1. Test build locally dulu:
   ```bash
   npm run build
   ```

2. Cek error di Vercel deployment logs
3. Pastikan semua dependencies ada di `package.json`
4. Cek environment variables

## Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
