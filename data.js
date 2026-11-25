/* ============================================================
   MOCK DATA LAYER
   In production this is replaced by real API calls to your
   Flask/FastAPI backend, e.g.:
     fetch('/api/products').then(r => r.json())
   Every function below is written so that swap is a one-line change.
   ============================================================ */

const FARMERS = [
  { id: 'f1', name: 'Murugan K.', location: 'Thanjavur, TN', farmSize: '4.2 acres', verified: true, phone: '98xxxxxx01' },
  { id: 'f2', name: 'Lakshmi R.', location: 'Coimbatore, TN', farmSize: '2.8 acres', verified: true, phone: '98xxxxxx02' },
  { id: 'f3', name: 'Suresh P.', location: 'Salem, TN', farmSize: '6.0 acres', verified: true, phone: '98xxxxxx03' },
];

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Leafy Greens'];

const PRODUCTS = [
  { id: 'p1', farmerId: 'f1', name: 'Tomato', category: 'Vegetables', emoji: '🍅', basePrice: 25, unit: 'kg', stock: 180, harvest: '2 days ago' },
  { id: 'p2', farmerId: 'f1', name: 'Carrot', category: 'Vegetables', emoji: '🥕', basePrice: 40, unit: 'kg', stock: 95, harvest: '1 day ago' },
  { id: 'p3', farmerId: 'f2', name: 'Spinach', category: 'Leafy Greens', emoji: '🥬', basePrice: 18, unit: 'bunch', stock: 60, harvest: 'today' },
  { id: 'p4', farmerId: 'f2', name: 'Cucumber', category: 'Vegetables', emoji: '🥒', basePrice: 22, unit: 'kg', stock: 140, harvest: '3 days ago' },
  { id: 'p5', farmerId: 'f3', name: 'Mango (Alphonso)', category: 'Fruits', emoji: '🥭', basePrice: 120, unit: 'kg', stock: 50, harvest: '1 day ago' },
  { id: 'p6', farmerId: 'f3', name: 'Banana', category: 'Fruits', emoji: '🍌', basePrice: 45, unit: 'dozen', stock: 110, harvest: 'today' },
  { id: 'p7', farmerId: 'f1', name: 'Brinjal', category: 'Vegetables', emoji: '🍆', basePrice: 30, unit: 'kg', stock: 70, harvest: '2 days ago' },
  { id: 'p8', farmerId: 'f2', name: 'Rice (Ponni)', category: 'Grains', emoji: '🌾', basePrice: 55, unit: 'kg', stock: 400, harvest: '5 days ago' },
  { id: 'p9', farmerId: 'f3', name: 'Papaya', category: 'Fruits', emoji: '🍈', basePrice: 28, unit: 'kg', stock: 65, harvest: '4 days ago' },
];

// crude "market signal" table the AI heuristics read from — stands in
// for the historical-price / demand dataset a real model would train on.
const MARKET_SIGNALS = {
  Tomato:   { demandTrend: 0.14, seasonFactor: 1.06, supplyPressure: -0.05 },
  Carrot:   { demandTrend: 0.05, seasonFactor: 1.00, supplyPressure: 0.02 },
  Spinach:  { demandTrend: 0.09, seasonFactor: 1.02, supplyPressure: -0.03 },
  Cucumber: { demandTrend: -0.02, seasonFactor: 0.98, supplyPressure: 0.08 },
  'Mango (Alphonso)': { demandTrend: 0.22, seasonFactor: 1.12, supplyPressure: -0.06 },
  Banana:   { demandTrend: 0.03, seasonFactor: 1.00, supplyPressure: 0.01 },
  Brinjal:  { demandTrend: 0.01, seasonFactor: 0.99, supplyPressure: 0.04 },
  'Rice (Ponni)': { demandTrend: 0.02, seasonFactor: 1.00, supplyPressure: 0.00 },
  Papaya:   { demandTrend: -0.06, seasonFactor: 0.95, supplyPressure: 0.10 },
};

const ORDERS = [
  { id: 'o1', productId: 'p1', farmerId: 'f1', qty: 20, unit: 'kg', total: 560, status: 'pending', customer: 'Anitha S.', date: '2026-08-28' },
  { id: 'o2', productId: 'p5', farmerId: 'f3', qty: 8, unit: 'kg', total: 1040, status: 'confirmed', customer: 'Ravi K.', date: '2026-08-27' },
  { id: 'o3', productId: 'p3', farmerId: 'f2', qty: 15, unit: 'bunch', total: 285, status: 'delivered', customer: 'Priya M.', date: '2026-08-25' },
  { id: 'o4', productId: 'p6', farmerId: 'f3', qty: 6, unit: 'dozen', total: 276, status: 'confirmed', customer: 'Deepak V.', date: '2026-08-28' },
  { id: 'o5', productId: 'p2', farmerId: 'f1', qty: 12, unit: 'kg', total: 456, status: 'pending', customer: 'Kavya R.', date: '2026-08-29' },
];

function findProduct(id) { return PRODUCTS.find(p => p.id === id); }
function findFarmer(id) { return FARMERS.find(f => f.id === id); }
