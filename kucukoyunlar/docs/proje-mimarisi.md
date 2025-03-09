# KüçükOyunlar Platformu - Proje Mimarisi

## 1. Genel Bakış

KüçükOyunlar, Next.js, TypeScript ve Supabase kullanılarak geliştirilmiş modern bir oyun platformudur. Bu doküman, projenin teknik mimarisini detaylandırmaktadır.

## 2. Teknoloji Stack'i

### Frontend
- **Next.js 14 (App Router)**: SEO optimizasyonu ve server-side rendering için
- **TypeScript**: Tip güvenliği sağlamak için
- **Tailwind CSS**: Hızlı UI geliştirme için
- **React Query**: Server state yönetimi için
- **Zustand**: Client state yönetimi için

### Backend
- **Supabase**: BaaS (Backend as a Service) çözümü
  - **Auth**: Kimlik doğrulama sistemi
  - **PostgreSQL**: Veritabanı
  - **Storage**: Oyun assetleri ve kullanıcı avatarları için
  - **Realtime**: Anlık skor tabloları ve bildirimler için

### Deployment
- **Vercel**: Frontend deployment için
- **Supabase**: Backend servisleri için

## 3. Uygulama Mimarisi

### Klasör Yapısı

```
kücükoyunlar/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Kimlik doğrulama ile ilgili sayfalar
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/          # Kullanıcı dashboard'u
│   │   ├── games/
│   │   ├── profile/
│   │   └── scores/
│   ├── games/              # Oyun sayfaları
│   │   ├── [id]/
│   │   └── category/[category]/
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # Yeniden kullanılabilir komponentler
│   ├── auth/               # Auth ile ilgili komponentler
│   ├── games/              # Oyun ile ilgili komponentler
│   ├── layout/             # Layout komponentleri
│   ├── ui/                 # UI komponentleri
│   └── dashboard/          # Dashboard komponentleri
├── lib/                    # Yardımcı fonksiyonlar ve hooks
│   ├── supabase/           # Supabase client ve helpers
│   ├── utils/              # Genel yardımcı fonksiyonlar
│   └── hooks/              # Custom hooks
├── types/                  # TypeScript tipleri
├── public/                 # Statik dosyalar
└── styles/                 # Global stiller
```

## 4. Veritabanı Şeması

### Tablolar

#### 1. profiles
| Alan       | Tip      | Açıklama                       |
|------------|----------|--------------------------------|
| id         | uuid     | Birincil anahtar (auth.users'a referans) |
| username   | text     | Kullanıcı adı                  |
| avatar_url | text     | Profil resmi URL'si            |
| created_at | timestamp| Oluşturulma zamanı             |
| updated_at | timestamp| Güncellenme zamanı             |

#### 2. games
| Alan        | Tip      | Açıklama                      |
|-------------|----------|------------------------------ |
| id          | uuid     | Birincil anahtar              |
| title       | text     | Oyun başlığı                  |
| description | text     | Oyun açıklaması               |
| thumbnail_url| text    | Kapak görselinin URL'si       |
| game_url     | text    | Oyunun iframe URL'si veya path|
| category     | text    | Oyun kategorisi               |
| created_at   | timestamp| Oluşturulma zamanı           |
| is_featured  | boolean | Öne çıkarılmış oyun mu?       |

#### 3. scores
| Alan       | Tip      | Açıklama                      |
|------------|----------|------------------------------ |
| id         | uuid     | Birincil anahtar              |
| user_id    | uuid     | profiles tablosuna referans   |
| game_id    | uuid     | games tablosuna referans      |
| score      | integer  | Oyun skoru                    |
| created_at | timestamp| Skor oluşturulma zamanı       |

#### 4. game_comments
| Alan       | Tip      | Açıklama                      |
|------------|----------|------------------------------ |
| id         | uuid     | Birincil anahtar              |
| user_id    | uuid     | profiles tablosuna referans   |
| game_id    | uuid     | games tablosuna referans      |
| comment    | text     | Yorum içeriği                 |
| created_at | timestamp| Yorum oluşturulma zamanı      |

#### 5. favorites
| Alan       | Tip      | Açıklama                      |
|------------|----------|------------------------------ |
| id         | uuid     | Birincil anahtar              |
| user_id    | uuid     | profiles tablosuna referans   |
| game_id    | uuid     | games tablosuna referans      |
| created_at | timestamp| Favori ekleme zamanı          |

## 5. API Routes

### Auth
- `POST /api/auth/login`: Kullanıcı girişi
- `POST /api/auth/register`: Kullanıcı kaydı
- `GET /api/auth/logout`: Çıkış yapma
- `GET /api/auth/session`: Aktif session bilgisi

### Games
- `GET /api/games`: Tüm oyunları listele
- `GET /api/games/[id]`: Belirli bir oyunun detayları
- `GET /api/games/category/[category]`: Kategoriye göre oyunları listele
- `GET /api/games/featured`: Öne çıkan oyunları listele

### User
- `GET /api/user/profile`: Kullanıcı profili
- `PUT /api/user/profile`: Kullanıcı profilini güncelle
- `GET /api/user/scores`: Kullanıcının skorları
- `GET /api/user/favorites`: Kullanıcının favori oyunları

### Scores
- `POST /api/scores`: Yeni skor kaydetme
- `GET /api/scores/game/[id]`: Oyuna göre skor listesi
- `GET /api/scores/leaderboard/[game_id]`: Oyun için lider tablosu

### Comments
- `POST /api/comments`: Yeni yorum ekleme
- `GET /api/comments/game/[id]`: Oyuna göre yorumları listele

## 6. Oyun Entegrasyonu

### Oyun Container
- HTML5 Canvas veya iframe tabanlı oyun entegrasyonu
- PostMessage API ile oyun-platform iletişimi
- Skorların otomatik gönderilmesi

### Oyun SDK
- Oyun geliştiricileri için JavaScript SDK
- Skorları kaydetme
- Kullanıcı bilgilerini alma
- Platform stillerini entegre etme

## 7. Authentication Akışı

1. **Kayıt Olma**
   - Email/Password veya Google/GitHub OAuth
   - Profil bilgilerinin oluşturulması

2. **Giriş Yapma**
   - Token bazlı authentication
   - JWT kullanımı

3. **Session Yönetimi**
   - Refresh token stratejisi
   - Güvenli cookie kullanımı

## 8. Performans Optimizasyonu

- Next.js Image Optimization
- Code Splitting
- Lazy Loading
- Server Components
- Edge Functions

## 9. Güvenlik Önlemleri

- CSRF koruması
- XSS koruması
- Rate limiting
- Güvenli header'lar
- Content Security Policy

## 10. Ölçeklenebilirlik

- Stateless architecture
- CDN kullanımı
- Edge caching
- Veritabanı indeksleme
- Veritabanı partition stratejisi

Bu mimari dokümanı, KüçükOyunlar platformunun geliştirilmesi sırasında referans olarak kullanılacaktır ve gerektiğinde güncellenecektir. 