# KüçükOyunlar Platformu

Eğlenceli küçük oyunlar oynayabileceğiniz, skorlarınızı kaydedebileceğiniz ve arkadaşlarınızla yarışabileceğiniz modern oyun platformu.

## 🚀 Özellikler

- Modern ve duyarlı (responsive) tasarım
- Kullanıcı kimlik doğrulama ve yetkilendirme
- Oyun favorileme ve paylaşma
- Skor tablosu ve liderlik sıralaması
- Kategori bazlı oyun filtreleme
- Kullanıcı profili ve istatistikler

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Deployment**: Vercel

## 🔧 Kurulum

### Gereksinimler

- Node.js 18.0.0 veya üstü
- npm veya yarn

### Yerel Geliştirme

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/kullanici-adi/kucukoyunlar.git
   cd kucukoyunlar
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   # veya
   yarn install
   ```

3. `.env.local` dosyasını oluşturun:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://pvektksaywklwuxymhhr.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2ZWt0a3NheXdrbHd1eHltaGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NDI4OTAsImV4cCI6MjA1NzExODg5MH0.m89njLr3kMhcMqJqAX_18aekdEly8ywveY2bkFuHF7o
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2ZWt0a3NheXdrbHd1eHltaGhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU0Mjg5MCwiZXhwIjoyMDU3MTE4ODkwfQ.2CpiUGsq4HaDGOu-QdoDRU-zmNIOsR102izE9FCZaYs
   SUPABASE_JWT_SECRET=4qGnCJDORdzQZ6OOU18C4I/If5pcg1c/ZkxctreMsHpdYIxEcGqGnbavYb1cJqnTWLAYlY27avPgPWVzN/ZVWQ==
   NEXT_PUBLIC_SUPABASE_PROJECT_ID=pvektksaywklwuxymhhr
   ```

4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   # veya
   yarn dev
   ```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🌐 Vercel Deployment

Projeyi Vercel'e deploy etmek için aşağıdaki adımları izleyin:

1. [Vercel](https://vercel.com) hesabınıza giriş yapın.
2. "New Project" butonuna tıklayın.
3. GitHub reponuzu seçin.
4. Environment değişkenlerini ayarlayın:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_JWT_SECRET`
   - `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
5. "Deploy" butonuna tıklayın.

Deployment tamamlandıktan sonra, Supabase Auth ayarlarından "Site URL" ve "Redirect URLs" ayarlarını Vercel URL'inize göre güncellemeyi unutmayın.

## 📝 Proje Yapısı

```
kucukoyunlar/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Auth sayfaları (login, register, vb.)
│   ├── api/              # API rotaları
│   ├── dashboard/        # Kullanıcı dashboard sayfaları
│   ├── games/            # Oyun sayfaları
│   └── ...
├── components/           # React bileşenleri
│   ├── games/            # Oyunlarla ilgili bileşenler
│   ├── layout/           # Layout bileşenleri
│   └── ui/               # UI bileşenleri
├── lib/                  # Yardımcı fonksiyonlar ve kütüphaneler
│   ├── context/          # React context'leri
│   └── supabase/         # Supabase istemcisi ve yardımcıları
├── public/               # Statik dosyalar
├── styles/               # Global stiller
└── types/                # TypeScript tip tanımlamaları
```

## 📊 Proje İlerleme Durumu

Proje ilerleme durumu hakkında detaylı bilgi için [proje-ilerleme.md](./docs/proje-ilerleme.md) dosyasına bakabilirsiniz.

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## İletişim

Your Name - your.email@example.com

Project Link: [https://github.com/your-username/kucukoyunlar](https://github.com/your-username/kucukoyunlar) 