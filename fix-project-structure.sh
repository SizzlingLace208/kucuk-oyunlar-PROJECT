#!/bin/bash

# Bu script, proje yapısını düzeltmek için kullanılır
echo "Proje yapısını düzeltme işlemi başlatılıyor..."

# Ana dizindeki node_modules ve package.json dosyalarını kaldır
echo "Ana dizindeki gereksiz dosyaları kaldırıyorum..."
rm -rf node_modules
rm package.json
rm package-lock.json

# Proje dizinine geç
echo "Proje dizinine geçiyorum..."
cd kucukoyunlar

# Next.js önbelleğini temizle
echo "Next.js önbelleğini temizliyorum..."
rm -rf .next

# Bağımlılıkları yeniden yükle
echo "Bağımlılıkları yeniden yüklüyorum..."
npm install

echo "İşlem tamamlandı! Artık 'cd kucukoyunlar && npm run dev' komutu ile uygulamayı çalıştırabilirsiniz." 