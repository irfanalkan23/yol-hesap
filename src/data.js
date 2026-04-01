export const VEHICLE_CLASSES = [
  { id: 1, name: "Sınıf 1 - Otomobil" },
  { id: 2, name: "Sınıf 2 - Minibüs / Hafif Ticari" },
  { id: 3, name: "Sınıf 3 - Yolcu Otobüsü" },
  { id: 4, name: "Sınıf 4 - Kamyon" },
  { id: 5, name: "Sınıf 5 - Tır / Treyler" },
  { id: 6, name: "Sınıf 6 - Motosiklet" }
];

export const CITIES = [
  // İstanbul İçi Temel Kalkış Noktaları
  { id: "ist_avr_tem", name: "İstanbul - Avrupa (E5 / TEM Yönü)" },
  { id: "ist_avr_kmo", name: "İstanbul - Avrupa (Kuzey Marmara Otoyolu Yönü)" },
  { id: "ist_ana_tem", name: "İstanbul - Anadolu (E5 / TEM Yönü)" },
  { id: "ist_ana_kmo", name: "İstanbul - Anadolu (Kuzey Marmara Otoyolu Yönü)" },

  // Anadolu İstikametindeki Şehirler
  { id: "bursa_kuzey", name: "Bursa (Kuzey Girişi)" },
  { id: "izmir", name: "İzmir (Işıkkent / Merkez)" },
  { id: "ankara_akinci", name: "Ankara (Anadolu Otoyolu Yönü)" },
  { id: "ankara_golbasi", name: "Ankara (Niğde Otoyolu Yönü)" },
  { id: "nigde", name: "Niğde Merkez" },

  // Trakya ve Ege İstikametleri
  { id: "edirne", name: "Edirne (Merkez)" },
  { id: "canakkale_gelibolu", name: "Çanakkale - Gelibolu (Avrupa Yönü)" },
  { id: "canakkale_lapseki", name: "Çanakkale - Lapseki (Asya Yönü)" }
];

export const ROUTES = [
  // ================= İSTANBUL İÇİ / KITA GEÇİŞLERİ =================
  // Anadolu ve Avrupa Kendi İçindeki Çapraz Geçiş Esneklikleri (0 TL)
  { source: "ist_avr_tem", target: "ist_avr_kmo", name: "Şehir İçi Bağlantı Güzargahı (Avrupa)", tolls: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } },
  { source: "ist_ana_tem", target: "ist_ana_kmo", name: "Şehir İçi Bağlantı Güzargahı (Anadolu)", tolls: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } },

  // 1. ve 2. Köprüler (E5 ve TEM üzerinden gelir)
  { source: "ist_avr_tem", target: "ist_ana_tem", name: "15 Temmuz Şehitler / FSM Köprüsü", tolls: { 1: 59, 2: 75, 3: 165, 4: 325, 5: 430, 6: 24 } },
  
  // Avrasya Tüneli
  { source: "ist_avr_tem", target: "ist_ana_tem", name: "Avrasya Tüneli (Gündüz Tarifesi)", tolls: { 1: 280, 2: 420, 3: null, 4: null, 5: null, 6: 218.40 } },

  // 3. Köprü (Kuzey Marmara üzerinden gelir)
  { source: "ist_avr_kmo", target: "ist_ana_kmo", name: "Yavuz Sultan Selim Köprüsü", tolls: { 1: 95, 2: 121, 3: 230, 4: 580, 5: 729, 6: 67 } },


  // ================= BURSA VE İZMİR YÖNÜ =================
  // Osmangazi Köprüsü Kullanılarak
  { source: "ist_ana_kmo", target: "bursa_kuzey", name: "Otoyol 5 (Osmangazi Köprüsü Geçişi)", tolls: { 1: 995, 2: 1595, 3: 1895, 4: 2500, 5: 3150, 6: 695 } },
  { source: "ist_ana_tem", target: "bursa_kuzey", name: "Otoyol 5 (Osmangazi Köprüsü Geçişi)", tolls: { 1: 995, 2: 1595, 3: 1895, 4: 2500, 5: 3150, 6: 695 } },
  
  // Körfezi Dolaşarak (Osmangazi Kullanılmadan - Sadece Kısmi TEM Geçiş Ücreti)
  { source: "ist_ana_tem", target: "bursa_kuzey", name: "İzmit Körfezi'ni Dolaşarak (Osmangazi Haricî)", tolls: { 1: 45, 2: 60, 3: 80, 4: 100, 5: 120, 6: 20 } },

  // Bursa - İzmir Kalıntısı
  { source: "bursa_kuzey", target: "izmir", name: "Otoyol 5 (Bursa - İzmir Işıkkent Gişesi)", tolls: { 1: 1450, 2: 2300, 3: 2750, 4: 3680, 5: 4600, 6: 1025 } },


  // ================= İSTANBUL - ANKARA YÖNÜ =================
  // Anadolu Otoyolu
  { source: "ist_ana_tem", target: "ankara_akinci", name: "Anadolu Otoyolu (TEM - Akıncı Kesimi)", tolls: { 1: 310, 2: 360, 3: 420, 4: 550, 5: 650, 6: 110 } },
  // Kuzey Marmara -> Anadolu Otoyolu
  { source: "ist_ana_kmo", target: "ankara_akinci", name: "KMO Asya + Anadolu Otoyolu Güzargahı", tolls: { 1: 440, 2: 520, 3: 615, 4: 830, 5: 1040, 6: 165 } },


  // ================= NİĞDE - GÜNEY YÖNÜ =================
  // Çevre Yolu Bağlantısı (Ücretsiz)
  { source: "ankara_akinci", target: "ankara_golbasi", name: "Ankara Çevre Yolu (Ücretsiz Geçiş)", tolls: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } },
  { source: "ankara_golbasi", target: "nigde", name: "Ankara - Niğde Otoyolu (Gölbaşı - Niğde)", tolls: { 1: 720, 2: 835, 3: 1010, 4: 1335, 5: 1610, 6: 275 } },


  // ================= TRAKYA VE EGE/ÇANAKKALE YÖNÜ =================
  { source: "ist_avr_tem", target: "edirne", name: "Avrupa Otoyolu (Mahmutbey - Edirne Kesimi)", tolls: { 1: 95, 2: 110, 3: 135, 4: 185, 5: 220, 6: 35 } },
  { source: "ist_avr_kmo", target: "canakkale_gelibolu", name: "Kınalı - Malkara - Gelibolu Otoyolu", tolls: { 1: 710, 2: 860, 3: 1025, 4: 1685, 5: 2125, 6: 200 } },
  { source: "ist_avr_tem", target: "canakkale_gelibolu", name: "Avrupa Otoyolu + Kınalı - Malkara Otoyolu", tolls: { 1: 745, 2: 900, 3: 1080, 4: 1750, 5: 2200, 6: 215 } },

  // Çanakkale Köprüsü ve İzmir
  { source: "canakkale_gelibolu", target: "canakkale_lapseki", name: "1915 Çanakkale Köprüsü", tolls: { 1: 995, 2: 1245, 3: 2245, 4: 2495, 5: 3540, 6: 250 } },
  { source: "canakkale_lapseki", target: "izmir", name: "Ege - İzmir Otoyol Bağlantıları (Tahmini Parçalı)", tolls: { 1: 525, 2: 650, 3: 775, 4: 1125, 5: 1375, 6: 225 } },
];
