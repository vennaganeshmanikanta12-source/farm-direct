/* ============================================================
   AI ENGINE (prototype / heuristic layer)

   These functions simulate what your real Python models will
   return. Each is written as a pure function so that later you
   can literally replace the body with:

     async function predictPrice(product) {
       const res = await fetch('/api/ai/price-prediction', {
         method: 'POST',
         headers: {'Content-Type':'application/json'},
         body: JSON.stringify({ product_id: product.id })
       });
       return res.json();
     }

   and nothing else in the app needs to change.
   ============================================================ */

const AI = {

  /* ---------- Module 1: Price Prediction ----------
     recommended_price = base_price
                        * (1 + demand_trend)
                        * season_factor
                        * (1 - supply_pressure)
     This mirrors the framework in the brief:
     historical price + demand + season + location + supply -> price */
  predictPrice(product) {
    const sig = MARKET_SIGNALS[product.name] || { demandTrend: 0, seasonFactor: 1, supplyPressure: 0 };
    const raw = product.basePrice * (1 + sig.demandTrend) * sig.seasonFactor * (1 - sig.supplyPressure);
    const low = Math.round(raw * 0.96);
    const high = Math.round(raw * 1.06);
    const direction = raw >= product.basePrice ? 'up' : 'down';
    const pct = Math.abs(((raw - product.basePrice) / product.basePrice) * 100).toFixed(1);
    return { low, high, mid: Math.round(raw), direction, pct };
  },

  /* ---------- Module 2: Demand Forecasting ----------
     Expected demand bucket derived from demand trend + season factor. */
  forecastDemand(product) {
    const sig = MARKET_SIGNALS[product.name] || { demandTrend: 0, seasonFactor: 1 };
    const score = sig.demandTrend * 100 + (sig.seasonFactor - 1) * 100;
    let level = 'Medium';
    if (score > 12) level = 'High';
    else if (score < -3) level = 'Low';
    const expectedKg = Math.max(20, Math.round(product.stock * (0.5 + score / 100)));
    return { level, expectedKg, score: Math.round(score) };
  },

  /* ---------- Module 3: Produce Quality Detection ----------
     Prototype note: this simulates an image-classification model's
     OUTPUT LABEL from an uploaded photo. It does not actually run
     computer vision here, and should never be presented as a food
     safety determination — only a freshness/appearance classifier
     assisting the farmer's own judgement. */
  classifyQuality(fileNameHint) {
    const labels = ['fresh', 'average', 'poor'];
    // deterministic-ish pseudo result so repeat uploads feel stable in a demo
    let seed = 0;
    for (const ch of (fileNameHint || 'produce')) seed += ch.charCodeAt(0);
    const weighted = seed % 10;
    const label = weighted < 6 ? 'fresh' : weighted < 9 ? 'average' : 'poor';
    const confidence = 78 + (seed % 18);
    return { label, confidence };
  },

  /* ---------- Module 4: Recommendation Engine ---------- */
  recommend(query, limit = 4) {
    const q = (query || '').toLowerCase();
    let pool = PRODUCTS.slice();
    if (q) {
      pool = pool.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (q.includes('organic') || q.includes('fresh') ? p.quality === 'fresh' : true)
      );
    }
    // rank by demand score, prefer fresh quality
    pool.sort((a, b) => {
      const da = this.forecastDemand(a).score;
      const db = this.forecastDemand(b).score;
      const qa = a.quality === 'fresh' ? 5 : a.quality === 'average' ? 0 : -5;
      const qb = b.quality === 'fresh' ? 5 : b.quality === 'average' ? 0 : -5;
      return (db + qb) - (da + qa);
    });
    if (pool.length === 0) pool = PRODUCTS.slice().sort(() => Math.random() - 0.5);
    return pool.slice(0, limit);
  },

  /* ---------- Module 5: AI Farmer Assistant ----------
     Simple intent-matching chatbot. Swap for an LLM call against
     your backend once you have one (e.g. POST /api/assistant). */
  assistantReply(message, farmerProducts) {
    const m = message.toLowerCase();

    if (m.includes('price') || m.includes('sell')) {
      const target = farmerProducts.find(p => m.includes(p.name.toLowerCase())) || farmerProducts[0];
      if (!target) return "Add a product first and I can suggest a price for it.";
      const pred = this.predictPrice(target);
      return `For ${target.name}, current market conditions suggest ₹${pred.low}–₹${pred.high}/${target.unit} ` +
             `(around ₹${pred.mid}). That's ${pred.direction === 'up' ? 'above' : 'below'} your listed price of ₹${target.basePrice} ` +
             `by about ${pred.pct}%, based on recent demand and seasonal trend.`;
    }
    if (m.includes('demand') || m.includes('high demand') || m.includes('trend')) {
      const ranked = farmerProducts
        .map(p => ({ p, d: this.forecastDemand(p) }))
        .sort((a, b) => b.d.score - a.d.score);
      if (ranked.length === 0) return "You don't have any products listed yet, so I can't forecast demand.";
      const top = ranked[0];
      return `${top.p.name} is showing the strongest demand right now (${top.d.level}, ~${top.d.expectedKg} ${top.p.unit} expected this week). ` +
             `Worth prioritising if you're deciding what to harvest or list next.`;
    }
    if (m.includes('how many') || m.includes('list') || m.includes('quantity')) {
      const target = farmerProducts[0];
      if (!target) return "List a product and I can suggest a quantity based on expected demand.";
      const d = this.forecastDemand(target);
      return `Based on this week's forecast, listing around ${d.expectedKg} ${target.unit} of ${target.name} matches expected demand without overstocking.`;
    }
    return "I can help with pricing, demand trends, or how much to list — try asking \"what price should I sell my tomatoes for?\"";
  }
};
