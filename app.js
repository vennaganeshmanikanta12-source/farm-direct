/* ============================================================
   SHARED APP UTILITIES — cart, toast, mock session
   ============================================================ */

const Store = {
  getCart() {
    try { return JSON.parse(localStorage.getItem('khet_cart') || '[]'); }
    catch { return []; }
  },
  saveCart(cart) { localStorage.setItem('khet_cart', JSON.stringify(cart)); },
  addToCart(productId, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(c => c.productId === productId);
    if (existing) existing.qty += qty;
    else cart.push({ productId, qty });
    this.saveCart(cart);
    return cart;
  },
  updateQty(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) cart = cart.filter(c => c.productId !== productId);
    else {
      const item = cart.find(c => c.productId === productId);
      if (item) item.qty = qty;
    }
    this.saveCart(cart);
    return cart;
  },
  cartCount() { return this.getCart().reduce((s, c) => s + c.qty, 0); },
  clearCart() { this.saveCart([]); },

  getSession() {
    try { return JSON.parse(localStorage.getItem('khet_session') || 'null'); }
    catch { return null; }
  },
  setSession(session) { localStorage.setItem('khet_session', JSON.stringify(session)); },
  clearSession() { localStorage.removeItem('khet_session'); },
};

function toast(msg, icon = '✓') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2400);
}

function requireSession(role) {
  const s = Store.getSession();
  if (!s || (role && s.role !== role)) {
    window.location.href = 'login.html';
    return null;
  }
  return s;
}

function renderCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    const n = Store.cartCount();
    badge.textContent = n;
    badge.style.display = n > 0 ? 'inline-flex' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', renderCartBadge);
