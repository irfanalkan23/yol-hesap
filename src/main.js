import { CITIES, VEHICLE_CLASSES, ROUTES } from './data.js';

const sourceSelect = document.getElementById('source');
const targetSelect = document.getElementById('target');
const vehicleClassSelect = document.getElementById('vehicle_class');
const form = document.getElementById('calc-form');
const swapBtn = document.getElementById('swap-btn');
const resultsSection = document.getElementById('results');
const routesList = document.getElementById('routes-list');

function populateSelects() {
  CITIES.forEach(city => {
    sourceSelect.add(new Option(city.name, city.id));
    targetSelect.add(new Option(city.name, city.id));
  });

  VEHICLE_CLASSES.forEach(vc => {
    vehicleClassSelect.add(new Option(vc.name, vc.id));
  });
}

swapBtn.addEventListener('click', () => {
  if(!sourceSelect.value || !targetSelect.value) return;
  const temp = sourceSelect.value;
  sourceSelect.value = targetSelect.value;
  targetSelect.value = temp;
});

const buildGraph = () => {
  const graph = {};
  CITIES.forEach(c => graph[c.id] = []);
  
  ROUTES.forEach(route => {
    graph[route.source].push({ target: route.target, routeData: route });
    graph[route.target].push({ target: route.source, routeData: route }); 
  });
  
  return graph;
};

const graph = buildGraph();

function findPaths(startId, endId, vehicleClassId) {
  const paths = [];
  const visited = new Set();
  
  function dfs(currentId, currentPath, currentCost) {
    if (currentId === endId) {
      if (currentPath.length > 0) {
        paths.push({ path: [...currentPath], totalCost: currentCost });
      }
      return;
    }
    
    // Şehir içi (ücretsiz) bağlantılar vs olduğu için limiti bir tık artırdık
    if (currentPath.length > 6) return; 

    visited.add(currentId);
    
    const neighbors = graph[currentId] || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.target)) {
        const toll = edge.routeData.tolls[vehicleClassId];
        if (toll !== null && toll !== undefined) {
          currentPath.push({ ...edge.routeData, cost: toll });
          dfs(edge.target, currentPath, currentCost + toll);
          currentPath.pop();
        }
      }
    }
    visited.delete(currentId);
  }
  
  dfs(startId, [], 0);
  return paths;
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(amount);
};

const renderRouteCard = (routeInfo, index, totalPaths) => {
  const { path, totalCost } = routeInfo;
  
  const isBest = index === 0 && totalPaths > 1; 
  const badgeHTML = isBest ? `<span class="route-badge best-route-badge">💰 En Ucuz Seçenek</span>` : '';
  
  let segmentsHTML = `<div class="route-segments-container">`;
  path.forEach(segment => {
    // 0 TL olan (şehir içi ücretsiz vb.) yolları listelerken sadece ara bağlantı gibi göster
    const isFree = segment.cost === 0;
    const priceDisplay = isFree ? 'Ücretsiz / Ekstra Gişe Yok' : formatCurrency(segment.cost);
    
    segmentsHTML += `
      <div class="route-segment" style="${isFree ? 'opacity: 0.7; font-size: 0.85rem;' : ''}">
        <div class="segment-bullet" style="${isFree ? 'background: #64748b' : ''}"></div>
        <div class="segment-name" style="${isFree ? 'font-style: italic' : ''}">${segment.name}</div>
        <div class="segment-price">${priceDisplay}</div>
      </div>
    `;
  });
  segmentsHTML += `</div>`;

  return `
    <div class="route-card">
      <div class="route-header">
        <div>${badgeHTML}</div>
        <div class="route-price">${formatCurrency(totalCost)}</div>
      </div>
      ${segmentsHTML}
    </div>
  `;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const src = sourceSelect.value;
  const tgt = targetSelect.value;
  const vc = vehicleClassSelect.value;

  if (src === tgt) {
    alert("Kalkış ve varış noktası aynı olamaz!");
    return;
  }

  let paths = findPaths(src, tgt, parseInt(vc));
  resultsSection.classList.remove('hidden');
  
  if (paths.length === 0) {
    routesList.innerHTML = `<div class="empty-state">Bu güzergah için geçerli bir otoyol rotası bulunamadı.</div>`;
    return;
  }

  paths.sort((a, b) => a.totalCost - b.totalCost);

  const minHops = Math.min(...paths.map(p => p.path.length));
  
  // En ucuz maliyeti referans alarak aşırı dolambaçlıları (Çanakkale'den dolaşıp İzmir'e giden vs.) ele
  const minCost = paths[0].totalCost;

  paths = paths.filter(p => {
    // İstanbul içi köprü geçiş serbestisini yakalamak için hop limiti +3
    if (p.path.length > minHops + 3) return false;
    
    // Eğer maliyet, en ucuz rotadan 1500 TL den daha yüksekse, muhtemelen Türkiye turu atıyordur.
    // Osmangazi Köprüsü vs. gösterilebilmesi için Oransal (2x vb.) yerine Mutlak (1500 TL) fark koyduk.
    if (p.totalCost > minCost + 1500) return false;

    return true;
  });

  // Olası mantıklı tüm körfez ve köprü opsiyonlarının dökülebilmesi için limiti 6-7 ye çıkarıyoruz
  paths = paths.slice(0, 6);

  routesList.innerHTML = paths.map((path, index) => renderRouteCard(path, index, paths.length)).join('');
  resultsSection.scrollIntoView({ behavior: 'smooth' });
});

populateSelects();
