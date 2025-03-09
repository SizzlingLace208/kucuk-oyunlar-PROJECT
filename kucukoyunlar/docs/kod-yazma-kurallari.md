# KüçükOyunlar Platformu - Kod Yazma Kuralları

## 1. Genel Prensipler

### 1.1 Kod Okunabilirliği
- Kod, açık ve anlaşılır olmalıdır.
- Değişken ve fonksiyon isimleri, ne işe yaradıklarını açıkça belirtmelidir.
- Karmaşık mantık için açıklayıcı yorumlar eklenmelidir.
- Fonksiyonlar tek bir sorumluluk ilkesine (SRP) uygun olmalıdır.

### 1.2 DRY (Don't Repeat Yourself)
- Tekrarlanan kodlar, yeniden kullanılabilir fonksiyonlar veya bileşenler olarak çıkarılmalıdır.
- Ortak mantık, hooks veya utility fonksiyonlarında toplanmalıdır.

### 1.3 KISS (Keep It Simple, Stupid)
- Karmaşık çözümler yerine basit çözümler tercih edilmelidir.
- Gereksiz soyutlamalardan kaçınılmalıdır.

### 1.4 Performans Odaklı Geliştirme
- Büyük veri yapıları ve ağır hesaplamalar için performans optimizasyonları yapılmalıdır.
- Gereksiz render'lardan kaçınılmalıdır.
- Next.js'in sunduğu optimization özelliklerinden faydalanılmalıdır.

## 2. TypeScript Kuralları

### 2.1 Tip Tanımlamaları
- Tüm fonksiyonların parametre ve dönüş değerleri için tip tanımlamaları yapılmalıdır.
- `any` tipi kullanımından kaçınılmalıdır.
- Interface ve Type kullanımında tutarlı olunmalıdır (tercihen interface kullanılmalıdır).

```typescript
// Kötü örnek
function getUser(id) {
  return fetchUser(id);
}

// İyi örnek
interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

function getUser(id: string): Promise<User> {
  return fetchUser(id);
}
```

### 2.2 Tip Dosyaları
- Genel tipler `types/` klasöründe tutulmalıdır.
- Komponent-spesifik tipler, ilgili komponent dosyasında tanımlanmalıdır.
- Supabase tabloları için tipler `types/database.ts` dosyasında tanımlanmalıdır.

### 2.3 Type Guards
- Union tiplerle çalışırken type guard kullanılmalıdır.

```typescript
type AdminUser = User & { role: 'admin'; permissions: string[] };
type RegularUser = User & { role: 'user' };

function isAdmin(user: AdminUser | RegularUser): user is AdminUser {
  return user.role === 'admin';
}
```

## 3. React/Next.js Kuralları

### 3.1 Komponent Yapısı
- Komponentler, fonksiyonel komponentler olarak yazılmalıdır.
- Props için destructuring kullanılmalıdır.
- Default prop değerleri belirtilmelidir.

```tsx
// Önerilen yapı
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  text,
  onClick,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn-${variant}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
```

### 3.2 Server vs Client Komponentleri
- Varsayılan olarak Server komponent kullanılmalıdır.
- Client-side state veya event handler'lar gerektiren komponentler için 'use client' direktifi kullanılmalıdır.
- Props olarak geçirilen fonksiyonlarda "use server" veya "use client" direktifleri belirtilmelidir.

### 3.3 Hook Kuralları
- Custom hook isimleri "use" ile başlamalıdır.
- Hooks, komponent veya diğer hook'ların en üst seviyesinde çağrılmalıdır.
- Büyük state mantığı custom hook'lara çıkarılmalıdır.

```typescript
// Custom hook örneği
function useGameScores(gameId: string) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchScores() {
      try {
        const data = await fetchGameScores(gameId);
        setScores(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, [gameId]);

  return { scores, loading, error };
}
```

## 4. Tailwind CSS Kuralları

### 4.1 Utility-First Yaklaşımı
- Inline sınıflar, komponentlerin yapısını doğrudan yansıtmalıdır.
- Karmaşık veya tekrarlanan stil blokları için `@apply` direktifi kullanılmalıdır.

### 4.2 Tema ve Değişkenler
- Tailwind config içinde tema değişkenleri tanımlanmalıdır.
- Hard-coded renkler veya ölçüler yerine tema değişkenleri kullanılmalıdır.

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ...
          900: '#0c4a6e',
        },
        // ...
      },
      // ...
    },
  },
};
```

### 4.3 Responsive Tasarım
- Mobile-first yaklaşımı kullanılmalıdır.
- Breakpoint'ler tutarlı şekilde kullanılmalıdır.

```html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- İçerik -->
</div>
```

## 5. Supabase Kuralları

### 5.1 Güvenli Veri Erişimi
- Row-level security (RLS) politikaları uygulanmalıdır.
- Kullanıcı verilerine erişimde her zaman yetkilendirme kontrolleri yapılmalıdır.

### 5.2 Veritabanı Sorgulama
- Tip güvenliği için TypeScript ile entegre edilmiş sorgu fonksiyonları kullanılmalıdır.
- `supabase-js` clientı için type-safe sorgular yazılmalıdır.

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getGameScores(gameId: string) {
  const { data, error } = await supabase
    .from('scores')
    .select('*, profiles(username, avatar_url)')
    .eq('game_id', gameId)
    .order('score', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}
```

### 5.3 Realtime Abonelikleri
- Realtime aboneliklerini düzgün şekilde cleanup etmek için useEffect'te return kullanılmalıdır.

```typescript
useEffect(() => {
  const subscription = supabase
    .channel('scores')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'scores',
      filter: `game_id=eq.${gameId}`
    }, (payload) => {
      // Handle new score
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, [gameId]);
```

## 6. Dosya İsimlendirme Kuralları

### 6.1 Komponent Dosyaları
- Komponent isimleri PascalCase olmalıdır.
- İlgili komponentler, bir klasör altında toplanmalıdır.
- İndeks dosyası, public API'yi dışa aktarmalıdır.

```
components/
└── Button/
    ├── Button.tsx
    ├── Button.test.tsx
    └── index.ts
```

### 6.2 Utility Fonksiyonlar
- Utility fonksiyon dosyaları camelCase olmalıdır.
- İlgili fonksiyonlar, mantıklı kategorilere ayrılmalıdır.

```
lib/
├── utils/
│   ├── date.ts
│   ├── string.ts
│   └── validation.ts
└── hooks/
    ├── useLocalStorage.ts
    └── useWindowSize.ts
```

## 7. Test Standartları

### 7.1 Birim Testler
- Kritik utility fonksiyonları için birim testler yazılmalıdır.
- Testler, farklı input koşullarını kapsamalıdır.

### 7.2 Komponent Testleri
- Karmaşık mantık içeren komponentler için testler yazılmalıdır.
- Kullanıcı etkileşimleri test edilmelidir.

### 7.3 E2E Testler
- Kritik kullanıcı akışları için E2E testler yazılmalıdır.
- Auth, oyun oynama, ve skor kaydetme gibi önemli işlevler test edilmelidir.

## 8. Kod İnceleme Kuralları

### 8.1 PR Süreci
- Her özellik bir PR üzerinden incelenmelidir.
- PR açıklaması, yapılan değişiklikleri açıkça belirtmelidir.
- PR'lar, küçük ve odaklanmış olmalıdır.

### 8.2 İnceleme Kriterleri
- Kod standartlarına uygunluk
- Performans etkileri
- Güvenlik sorunları
- Genel mimari ile uyum
- Tekrar eden kod olmaması

## 9. Git Commit Kuralları

### 9.1 Commit Mesajları
- Commit mesajları, yapılan değişiklikleri açıkça belirtmelidir.
- Conventional Commits standardı takip edilmelidir:
  - `feat:` - Yeni özellik
  - `fix:` - Hata düzeltme
  - `docs:` - Dokümantasyon değişiklikleri
  - `style:` - Kod formatlaması, noktalama vb.
  - `refactor:` - Kod reorganizasyonu
  - `test:` - Test eklemek veya düzeltmek
  - `chore:` - Yapılandırma değişiklikleri

```
feat: add leaderboard component to game page
fix: correct score submission API endpoint
docs: update README with setup instructions
```

## 10. Erişilebilirlik Standartları

### 10.1 Semantik HTML
- Uygun HTML elementleri kullanılmalıdır (button, nav, header, footer vb.).
- ARIA attribute'ları, gerektiğinde eklenmelidir.

### 10.2 Klavye Navigasyonu
- Tüm interaktif elementler klavye ile erişilebilir olmalıdır.
- Odaklanma göstergeleri belirgin olmalıdır.

### 10.3 Renk Kontrastı
- WCAG AA standardına uygun kontrast oranları kullanılmalıdır.

Bu kurallar, KüçükOyunlar Platformu'nun geliştirme sürecinde kalite ve tutarlılığı sağlamak için uygulanacaktır. Tüm takım üyeleri bu standartlara uymakla yükümlüdür. 