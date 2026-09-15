const API_URL = 'https://fakestoreapi.com/products';

export async function fetchProducts() {
  try {
    const cached = localStorage.getItem('products_cache');
    const cacheTime = localStorage.getItem('products_cache_time');
    if (cached && cacheTime && Date.now() - cacheTime < 1000*60*10) {
      return JSON.parse(cached);
    }
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    localStorage.setItem('products_cache', JSON.stringify(data));
    localStorage.setItem('products_cache_time', Date.now());
    return data;
  } catch (err) {
    throw err;
  }
}
