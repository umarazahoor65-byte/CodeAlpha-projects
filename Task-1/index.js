
const IMAGES = [
  { id:1, title:'BMW', category:'M2', src:'./BMW-M2poster.jpg'},
  { id:2, title:'BMW', category:'M2', src:'./BMW-M2.jpg' },
  { id:3, title:'BMW', category:'M2', src:'./BMW-M2_3.jpg'},
  { id:4, title:'BMW', category:'M2', src:'./BMW-M2_4.jpg'},
  { id:5, title:'BMW', category:'M2', src:'./BMW-M2_5.jpg'},
  { id:6, title:'BMW', category:'M2', src:'./BMW-M2_6.jpg'},
  { id:7, title:'BMW', category:'M3', src:'./BMW-M3.jpg'},
  { id:8, title:'BMW', category:'M3', src:'./BMW-M3_2.jpg'},
  { id:9, title:'BMW', category:'M3', src:'./BMW-M3_3.jpg'},
  { id:10, title:'BMW', category:'M3', src:'./BMW-M3_4.jpg'},
  { id:11, title:'BMW', category:'M3', src:'./BMW-M3_5.jpg'},
  { id:12, title:'BMW', category:'M3', src:'./BMW-M3_6.jpg'},
  { id:13, title:'BMW', category:'M4', src:'./BMW-M4.jpg'},
  { id:14, title:'BMW', category:'M4', src:'./BMW-M4_2.jpg'},
  { id:15, title:'BMW', category:'M4', src:'./BMW-M4_3.jpg'},
  { id:16, title:'BMW', category:'M4', src:'./BMW-M4_4.jpg'},
  { id:17, title:'BMW', category:'M4', src:'./BMW-M4_5.jpg'},
  { id:18, title:'BMW', category:'M5', src:'./BMW-M5.jpg'},
  { id:19, title:'BMW', category:'M5', src:'./BMW-M5_2.jpg'},
  { id:20, title: 'BMW', category:'M5', src:'./BMW-M5_3.jpg'},
  { id:21, title:'BMW', category: 'M5', src:'./BMW-M5_4.jpg'},
  { id:22, title: 'BMW', category:'M5', src:'./BMW-M5_5.jpg'},

];

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbTitle = document.getElementById('lb-title');
const lbTag = document.getElementById('lb-tag');
const lbCounter = document.getElementById('lb-counter');
const emptyState = document.getElementById('empty-state');
const visibleCountEl = document.getElementById('visible-count');

let currentFilter = 'all';
let currentIndex = 0;
let visibleItems = [];

function getVisible() {
  return currentFilter === 'all'
    ? IMAGES
    : IMAGES.filter(img => img.category === currentFilter);
}

function renderGallery() {
  gallery.innerHTML = '';
  visibleItems = getVisible();

  visibleCountEl.textContent = visibleItems.length;
  document.getElementById('total-count').textContent = visibleItems.length + ' images';

  if (visibleItems.length === 0) {
    emptyState.classList.add('show');
    return;
  }

  emptyState.classList.remove('show');

  visibleItems.forEach((img, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Open ${img.title}`);
    item.innerHTML = `
      <img src="${img.src}" alt="${img.title}" loading="lazy" />
      <div class="item-overlay">
        <div class="item-title">${img.title}</div>
        <div class="item-tag">${img.category}</div>
      </div>
      <div class="expand-icon" aria-hidden="true">
        <svg viewBox="0 0 14 14"><polyline points="9,1 13,1 13,5"/><polyline points="5,13 1,13 1,9"/><line x1="13" y1="1" x2="8" y2="6"/><line x1="1" y1="13" x2="6" y2="8"/></svg>
      </div>
    `;
    item.addEventListener('click', () => openLightbox(idx));
    item.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') openLightbox(idx); });
    gallery.appendChild(item);
  });
}

function openLightbox(idx) {
  currentIndex = idx;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbImg.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const img = visibleItems[currentIndex];
  lbImg.style.opacity = '0';
  lbImg.style.transform = 'scale(0.97)';
  setTimeout(() => {
    lbImg.src = img.src.replace('w=800', 'w=1400');
    lbImg.alt = img.title;
    lbTitle.textContent = img.title;
    lbTag.textContent = img.category;
    lbCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    lbImg.style.opacity = '1';
    lbImg.style.transform = 'scale(1)';
  }, 80);
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
  updateLightbox();
}

document.getElementById('lb-prev').addEventListener('click', () => navigate(-1));
document.getElementById('lb-next').addEventListener('click', () => navigate(1));
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-backdrop').addEventListener('click', closeLightbox);

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'Escape') closeLightbox();
});

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderGallery();
  });
});

// Layout toggle
document.querySelectorAll('.layout-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    gallery.className = 'gallery ' + btn.dataset.layout;
  });
});

renderGallery();