import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages'de "/yol-hesap/" gibi alt dizinlerde çalıştığında 
  // kaynakların doğru yüklenmesi için base ayarını relative yapıyoruz.
  base: './',
})
