import { fetchProducts } from './api.js';

const grid = document.getElementById('productGrid');
const skeleton = document.getElementById('skeleton');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const tabsContainer = document.getElementById('categoryTabs');
const errorBanner = document.getElementById('errorBanner');
const cartCount = document.getElementById('cartCount');

let allProducts = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let activeCategory = 'all';

function showSkeleton() {
  skeleton.innerHTML = Array(8).fill(0).map(()=> `<div class="card skeleton-card"></div>`).join('');
  skeleton.classList.remove('hidden');
  grid.classList.add('hidden');
}
function hideSkeleton() {
  skeleton.classList.add('hidden');
  grid.classList.remove('hidden');
}
function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.classList.remove('hidden');
}

function renderTabs() {
  const categories = ['all', ...new Set(allProducts.map(p=>p.category))];
  tabsContainer.innerHTML = categories.map(cat=> 
    `<button class="tab ${activeCategory===cat?'active':''}" data-cat="${cat}">${cat}</button>`
  ).join('');
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      activeCategory = btn.dataset.cat;
      applyFilters();
      renderTabs();
    });
  });
}

function renderProducts(products) {
  grid.innerHTML = products.map(p=> `
    <div class="card">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title.slice(0,40)}...</h3>
      <p class="price">$${p.price}</p>
      <p class="cat">${p.category}</p>
      <button class="add-cart" data-id="${p.id}">Add to Cart</button>
    </div>
  `).join('');
  document.querySelectorAll('.add-cart').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      cart.push(btn.dataset.id);
      localStorage.setItem('cart', JSON.stringify(cart));
      cartCount.textContent = cart.length;
    });
  });
}

function applyFilters() {
  let result = [...allProducts];
  if (activeCategory !== 'all') result = result.filter(p=>p.category===activeCategory);
  const q = searchInput.value.toLowerCase();
  if (q) result = result.filter(p=>p.title.toLowerCase().includes(q));
  if (sortSelect.value==='low-high') result.sort((a,b)=>a.price-b.price);
  if (sortSelect.value==='high-low') result.sort((a,b)=>b.price-a.price);
  filteredProducts = result;
  renderProducts(filteredProducts);
}

async function init() {
  showSkeleton();
  cartCount.textContent = cart.length;
  try {
    allProducts = await fetchProducts();
    hideSkeleton();
    renderTabs();
    applyFilters();
  } catch (e) {
    hideSkeleton();
    showError('⚠️ Failed to load products. Please check internet & try again.');
  }
}

searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);
init();
