import { CITIES, VEHICLE_CLASSES, ROUTES } from './data.js';

const sourceSelect = document.getElementById('source');
const vehicleClassSelect = document.getElementById('vehicle_class');

const setupSection = document.getElementById('setup-section');
const routeBuilderSection = document.getElementById('route-builder-section');
const routeStepsContainer = document.getElementById('route-steps-container');
const totalCostEl = document.getElementById('total-cost');
const nextRouteSelect = document.getElementById('next_route');
const undoBtn = document.getElementById('undo-btn');
const resetBtn = document.getElementById('reset-btn');
const nextRouteGroup = document.getElementById('next-route-group');

let currentCityId = null;
let routeSteps = []; // elemanlar: { startCityId, destinationCityId, routeData, cost }
let currentVehicleClass = 1;

function populateSelects() {
  CITIES.forEach(city => {
    sourceSelect.add(new Option(city.name, city.id));
  });

  VEHICLE_CLASSES.forEach(vc => {
    vehicleClassSelect.add(new Option(vc.name, vc.id));
  });
}

// Graph Oluştur
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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(amount);
};

const getCityName = (id) => {
  const city = CITIES.find(c => c.id === id);
  return city ? city.name : id;
};

const updateUI = () => {
  if (!currentCityId) {
    setupSection.classList.remove('hidden');
    routeBuilderSection.classList.add('hidden');
    return;
  }

  setupSection.classList.add('hidden');
  routeBuilderSection.classList.remove('hidden');

  let totalCost = 0;
  let stepsHTML = '';

  const startCityName = getCityName(routeSteps.length > 0 ? routeSteps[0].startCityId : currentCityId);
  
  stepsHTML += `
    <div class="route-segment" style="margin-bottom: 0.75rem; color: var(--text-main); font-weight: 600;">
      <div class="segment-bullet" style="background: var(--success)"></div>
      <div class="segment-name">Kalkış: ${startCityName}</div>
    </div>
  `;

  routeSteps.forEach((step, idx) => {
    totalCost += step.cost;
    const isFree = step.cost === 0;
    const priceDisplay = isFree ? 'Ücretsiz / Ekstra Gişe Yok' : formatCurrency(step.cost);
    
    stepsHTML += `
      <div class="route-segment" style="padding-left: 1.25rem; border-left: 2px dashed rgba(255,255,255,0.1); margin-left: 3px; padding-bottom: 0.75rem; ${isFree ? 'opacity: 0.7;' : ''}">
        <div class="segment-name" style="font-size: 0.9rem; padding-bottom: 0.4rem;">
          <span style="color: var(--primary-color);">↳</span> <span style="font-style: italic;">${step.routeData.name}</span>
        </div>
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <div style="color: var(--text-main); font-weight: 600;">Varış: ${getCityName(step.destinationCityId)}</div>
            <div class="segment-price">${priceDisplay}</div>
        </div>
      </div>
    `;
  });

  routeStepsContainer.innerHTML = stepsHTML;
  totalCostEl.textContent = formatCurrency(totalCost);

  // Sıradaki Yönler
  nextRouteSelect.innerHTML = `<option value="" disabled selected>Lütfen Sıradaki Adımınızı Seçin</option>`;
  
  const neighbors = graph[currentCityId] || [];
  
  // Önceki geldiğimiz düğümü (hemen bir adım gerisini) U-Dönüşünü engellemek için filtreleyelim
  let previousCityId = null;
  if (routeSteps.length > 0) {
      previousCityId = routeSteps[routeSteps.length - 1].startCityId;
  }
  
  const validNeighbors = neighbors.filter(edge => {
      const toll = edge.routeData.tolls[currentVehicleClass];
      const isNotUTurn = edge.target !== previousCityId;
      return toll !== null && toll !== undefined && isNotUTurn;
  });

  if (validNeighbors.length > 0) {
      nextRouteGroup.style.display = 'block';
      validNeighbors.forEach((edge, idx) => {
        const toll = edge.routeData.tolls[currentVehicleClass];
        const isFree = toll === 0;
        const priceLabel = isFree ? 'Ücretsiz' : formatCurrency(toll);
        
        let displayRouteName = edge.routeData.name;
        // Eğer hedef node source değilse ve undirected olarak ters geliyorsak isim biraz garip olabilir, ama mantık aynı
        
        const val = JSON.stringify({
            targetId: edge.target,
            routeName: edge.routeData.name,
            cost: toll
        });

        nextRouteSelect.add(new Option(`${displayRouteName} -> ${getCityName(edge.target)} (${priceLabel})`, val));
      });
  } else {
      nextRouteGroup.style.display = 'none';
      stepsHTML += `<div style="margin-top: 1.5rem; color: var(--danger); font-size: 0.9rem; text-align: center; background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 8px;">Bulunduğunuz noktadan bu araç sınıfı için gidilebilecek veya U-dönüşü yapmadan ilerlenebilecek sekilde başka bir otoyol/köprü bağlantısı bulunmuyor.</div>`;
      routeStepsContainer.innerHTML = stepsHTML;
  }

  undoBtn.disabled = routeSteps.length === 0;
  undoBtn.style.opacity = routeSteps.length === 0 ? '0.5' : '1';
  undoBtn.style.cursor = routeSteps.length === 0 ? 'not-allowed' : 'pointer';
};

sourceSelect.addEventListener('change', (e) => {
  if (!vehicleClassSelect.value) {
    alert("Lütfen önce bir araç sınıfı belirleyin.");
    sourceSelect.value = "";
    return;
  }
  currentCityId = e.target.value;
  currentVehicleClass = parseInt(vehicleClassSelect.value) || 1;
  routeSteps = [];
  updateUI();
});

vehicleClassSelect.addEventListener('change', (e) => {
  currentVehicleClass = parseInt(e.target.value);
  
  let invalidRouteFound = false;

  // Sınıf değiştiğinde mevcut yolu baştan hesapla
  routeSteps = routeSteps.filter(step => {
     const toll = step.routeData.tolls[currentVehicleClass];
     if (toll === null || toll === undefined) {
         invalidRouteFound = true;
         return false; 
     }
     step.cost = toll;
     return true;
  });

  if (invalidRouteFound) {
      alert("Seçtiğiniz araç sınıfı ile mevcut rotanızın bazı kısımlarından geçiş yapılamadığından güzergahınız yeniden hesaplandı/kırpıldı.");
      // Son geçerli noktaya dön
      if (routeSteps.length > 0) {
          currentCityId = routeSteps[routeSteps.length - 1].destinationCityId;
      } else {
          // Hiç yol kalmadıysa tamamen sıfırla
          currentCityId = null;
          sourceSelect.value = '';
      }
  }
  
  if (currentCityId) updateUI();
});

nextRouteSelect.addEventListener('change', (e) => {
  const selectedEdge = JSON.parse(e.target.value);
  
  const neighbors = graph[currentCityId];
  const matchedEdge = neighbors.find(n => n.target === selectedEdge.targetId && n.routeData.name === selectedEdge.routeName);
  
  if (matchedEdge) {
      routeSteps.push({
          startCityId: currentCityId,
          destinationCityId: matchedEdge.target,
          routeData: matchedEdge.routeData,
          cost: selectedEdge.cost
      });
      currentCityId = matchedEdge.target;
      updateUI();
  }
});

undoBtn.addEventListener('click', () => {
    if (routeSteps.length > 0) {
        const lastStep = routeSteps.pop();
        currentCityId = lastStep.startCityId;
        updateUI();
    }
});

resetBtn.addEventListener('click', () => {
    currentCityId = null;
    routeSteps = [];
    sourceSelect.value = '';
    updateUI();
});

populateSelects();

// Lightbox Modal Logic (Interactive Zoom & Pan)
const mapImage = document.getElementById('map-image');
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-image');
const closeModal = document.querySelector('.close-modal');
const modalContainer = document.querySelector('.modal-content-container');

let scale = 1;
let panning = false;
let pointX = 0;
let pointY = 0;
let startX = 0;
let startY = 0;

function setTransform() {
  modalImg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
}

function resetZoom() {
  scale = 1;
  pointX = 0;
  pointY = 0;
  modalImg.style.transition = 'transform 0.3s ease';
  setTransform();
  setTimeout(() => { modalImg.style.transition = 'none'; }, 300);
}

if (mapImage) {
  mapImage.addEventListener('click', function() {
    modal.classList.remove('hidden');
    modalImg.src = this.src;
    resetZoom();
  });
}

// Close Modal
const closeAction = () => {
  modal.classList.add('hidden');
  resetZoom();
};

closeModal.addEventListener('click', closeAction);

// Close when clicking outside the image
modal.addEventListener('click', function(e) {
  if (e.target === modal || e.target.classList.contains('modal-content-container')) {
    closeAction();
  }
});

// Pan and Zoom Logic
modalContainer.addEventListener('wheel', (e) => {
  e.preventDefault();
  
  const xs = (e.clientX - pointX) / scale;
  const ys = (e.clientY - pointY) / scale;
  
  if (e.deltaY < 0) {
    scale *= 1.2;
  } else {
    scale /= 1.2;
  }
  
  if (scale < 1) scale = 1;
  if (scale > 8) scale = 8;
  
  if (scale === 1) {
    pointX = 0;
    pointY = 0;
  } else {
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;
  }
  
  modalImg.style.transition = 'none';
  setTransform();
}, { passive: false });

modalImg.addEventListener('mousedown', (e) => {
  e.preventDefault();
  if (scale > 1) {
    panning = true;
    startX = e.clientX - pointX;
    startY = e.clientY - pointY;
    modalImg.style.cursor = 'grabbing';
  }
});

window.addEventListener('mouseup', () => {
  panning = false;
  modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
});

window.addEventListener('mousemove', (e) => {
  if (!panning) return;
  e.preventDefault();
  pointX = e.clientX - startX;
  pointY = e.clientY - startY;
  setTransform();
});

// Click to zoom in if not zoomed, or reset if zoomed
modalImg.addEventListener('click', (e) => {
  if (scale > 1) {
    resetZoom();
  } else {
    scale = 1.8; // Daha az yakınlaştır (önceki: 3)
    const rect = modalImg.getBoundingClientRect();
    const xs = (e.clientX - rect.left) / 1; 
    const ys = (e.clientY - rect.top) / 1;
    
    // Daha basit merkezleme yaklaşımı
    pointX = (window.innerWidth / 2) - e.clientX;
    pointY = (window.innerHeight / 2) - e.clientY;
    
    pointX *= scale;
    pointY *= scale;

    modalImg.style.transition = 'transform 0.3s ease';
    setTransform();
    setTimeout(() => { modalImg.style.transition = 'none'; }, 300);
  }
});
