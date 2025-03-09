#!/usr/bin/env node

/**
 * Pre-commit hook
 * 
 * Bu script, her commit öncesinde TypeScript hatalarını kontrol eder ve düzeltmeye çalışır.
 * Eğer düzeltilemeyen hatalar varsa, commit işlemini durdurur.
 * 
 * Kurulum:
 * 1. package.json'a şu script'i ekleyin:
 *    "prepare": "node scripts/pre-commit.js install"
 * 
 * 2. npm run prepare komutunu çalıştırın
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Pre-commit hook'u yükle
if (process.argv[2] === 'install') {
  const gitHooksPath = path.resolve('.git', 'hooks');
  const preCommitPath = path.resolve(gitHooksPath, 'pre-commit');
  
  // .git/hooks klasörü var mı kontrol et
  if (!fs.existsSync(gitHooksPath)) {
    console.error('.git/hooks klasörü bulunamadı. Git reposu başlatılmış mı?');
    process.exit(1);
  }
  
  // pre-commit hook'u oluştur
  const hookContent = `#!/bin/sh
# TypeScript hatalarını kontrol et ve düzelt
node scripts/fix-types.js

# Eğer hatalar düzeltilemediyse, commit işlemini durdur
npm run type-check
if [ $? -ne 0 ]; then
  echo "TypeScript hataları var. Lütfen düzeltin ve tekrar deneyin."
  exit 1
fi
`;
  
  fs.writeFileSync(preCommitPath, hookContent);
  fs.chmodSync(preCommitPath, '755'); // Çalıştırılabilir yap
  
  console.log('Pre-commit hook başarıyla yüklendi!');
  process.exit(0);
}

// TypeScript hatalarını kontrol et
try {
  console.log('TypeScript hatalarını kontrol ediyor...');
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('TypeScript hataları yok. Commit işlemi devam ediyor...');
} catch (error) {
  console.log('TypeScript hataları bulundu. Düzeltmeye çalışılıyor...');
  
  try {
    execSync('npm run fix-types', { stdio: 'inherit' });
    
    // Tekrar kontrol et
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('TypeScript hataları düzeltildi. Commit işlemi devam ediyor...');
    } catch (error) {
      console.error('TypeScript hataları düzeltilemedi. Lütfen manuel olarak düzeltin.');
      process.exit(1);
    }
  } catch (error) {
    console.error('TypeScript hatalarını düzeltme işlemi başarısız oldu.');
    process.exit(1);
  }
} 