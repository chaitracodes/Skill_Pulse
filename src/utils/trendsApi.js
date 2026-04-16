/**
 * SkillPulse — Trends API client
 * Fetches real Google Trends data from FastAPI backend.
 * Falls back to unique per-keyword mock data if backend is unreachable.
 */

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Deterministic seed from keyword string ────────────────────────────────────
// This ensures the same keyword always seeds the same "mock" data visually,
// but different keywords produce visibly different charts.
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Unique mock OHLC per keyword ──────────────────────────────────────────────
function mockOHLCForKeyword(keyword, count) {
  // Add more entropy to the seed based on keyword characteristics
  const seed = hashCode(keyword) ^ (keyword.length << 16) ^ (keyword.charCodeAt(keyword.length - 1) << 8);
  const rand = seededRand(seed);
  const data = [];

  // Wider starting price range (30-120) and unique trend bias per keyword
  let price = 30 + (seed % 90);
  const bias = (rand() - 0.5) * 2; // Fixed bias for this specific series
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (count - i));

    // Higher volatility (up to 12% moves) and price-action logic
    const move = (rand() - 0.5 + bias * 0.1) * 12;
    const open = price;
    const close = price + move;
    const high = Math.max(open, close) + rand() * 5;
    const low = Math.min(open, close) - rand() * 5;
    const volume = Math.round(500 + rand() * 8000);

    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      open: +open.toFixed(2),
      close: +close.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      volume,
      interest: +close.toFixed(1),
    });
    price = close;
  }
  return data;
}

function mockIntradayForKeyword(keyword) {
  const rand = seededRand(hashCode(keyword + "_intraday"));
  let price = 40 + (hashCode(keyword) % 45);
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  return hours.map(h => {
    const open = price + (rand() - 0.5) * 3;
    const close = open + (rand() - 0.5) * 4;
    const high = Math.max(open, close) + rand() * 2;
    const low = Math.min(open, close) - rand() * 2;
    price = close;
    return {
      date: h,
      open: +open.toFixed(2), close: +close.toFixed(2),
      high: +high.toFixed(2), low: +low.toFixed(2),
      volume: Math.round(300 + rand() * 2500),
    };
  });
}

const COUNT_MAP = {
  "1D":  null,   // uses intraday
  "1W":  7,
  "1M":  30,
  "6M":  180,
  "1Y":  365,
  "ALL": 1825,
};

function getMockData(keyword, timeframe) {
  if (timeframe === "1D") return mockIntradayForKeyword(keyword);
  return mockOHLCForKeyword(keyword, COUNT_MAP[timeframe] ?? 30);
}

// ── Live fetch ────────────────────────────────────────────────────────────────
export async function fetchTrends(keyword = "data scientist", timeframe = "1M") {
  if (!keyword || keyword.trim() === "") {
    return { candles: getMockData("default", timeframe), source: "mock" };
  }

  try {
    const res = await fetch(
      `${BASE}/api/trends?skill=${encodeURIComponent(keyword)}&timeframe=${timeframe}`,
      { signal: AbortSignal.timeout(15000) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    // If backend returned data, use it; but if candles are empty, fall back
    if (json.candles && json.candles.length > 0) {
      return { candles: json.candles, source: json.source };
    }
    throw new Error("Empty candles from backend");

  } catch (err) {
    console.warn(`[SkillPulse] Trends API: ${err.message} → falling back to mock for "${keyword}"`);
    return { candles: getMockData(keyword, timeframe), source: "mock" };
  }
}

export async function checkBackend() {
  try {
    const res = await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
