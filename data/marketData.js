// ============================================================
// KisanMitra v2 — Market, Weather & Mandi Data
// ============================================================

// ── MARKET PRICES ──
const MARKET_PRICES = {
  wheat:      { name:'Wheat',           emoji:'🌾',  price:2275, unit:'per quintal', trend:'up',     change:'+₹45 (2%)',   msp:2275 },
  rice:       { name:'Rice (Paddy)',    emoji:'🍚',  price:2183, unit:'per quintal', trend:'stable', change:'₹0 (0%)',     msp:2183 },
  tomato:     { name:'Tomato',          emoji:'🍅',  price:1850, unit:'per quintal', trend:'up',     change:'+₹200 (12%)', msp:null },
  onion:      { name:'Onion',           emoji:'🧅',  price:2200, unit:'per quintal', trend:'down',   change:'-₹150 (6%)',  msp:null },
  cotton:     { name:'Cotton',          emoji:'💠',  price:6620, unit:'per quintal', trend:'up',     change:'+₹120',       msp:6620 },
  soybean:    { name:'Soybean',         emoji:'🟡',  price:4600, unit:'per quintal', trend:'stable', change:'±₹10',        msp:4600 },
  turmeric:   { name:'Turmeric',        emoji:'🟠',  price:9500, unit:'per quintal', trend:'up',     change:'+₹800 (9%)',  msp:null },
  aloe:       { name:'Aloe Vera',       emoji:'🌿',  price:18,   unit:'per kg leaf', trend:'up',     change:'+₹2 (12%)',   msp:null },
  shatavari:  { name:'Shatavari Root',  emoji:'🌱',  price:120,  unit:'per kg',      trend:'up',     change:'+₹15 (14%)',  msp:null },
  fish_rohu:  { name:'Rohu Fish',       emoji:'🐟',  price:130,  unit:'per kg live', trend:'stable', change:'±₹5',         msp:null },
  catfish:    { name:'Catfish',         emoji:'🐠',  price:160,  unit:'per kg',      trend:'up',     change:'+₹10 (7%)',   msp:null },
  honey:      { name:'Honey (raw)',     emoji:'🍯',  price:350,  unit:'per kg',      trend:'up',     change:'+₹20 (6%)',   msp:null },
  honey_btl:  { name:'Bottled Honey',   emoji:'🫙',  price:550,  unit:'per kg',      trend:'up',     change:'+₹30',        msp:null },
  milk:       { name:'Cow Milk',        emoji:'🥛',  price:36,   unit:'per litre',   trend:'up',     change:'+₹2 (5%)',    msp:null },
  egg:        { name:'Egg (layer)',     emoji:'🥚',  price:6.2,  unit:'per egg',     trend:'up',     change:'+₹0.4',       msp:null },
  lettuce:    { name:'Lettuce (hydro)', emoji:'🥬',  price:120,  unit:'per kg',      trend:'up',     change:'+₹15',        msp:null },
  microgreens:{ name:'Microgreens',     emoji:'🌿',  price:600,  unit:'per kg',      trend:'up',     change:'+₹50',        msp:null },
};

function getMarketPricesForType(farmTypes) {
  const keyMap = {
    crop:['wheat','rice','tomato','onion','cotton','soybean'],
    fish:['fish_rohu','catfish'],
    cattle:['milk'],
    poultry:['egg'],
    bees:['honey','honey_btl'],
    plants:['aloe','shatavari','turmeric'],
    hydroponics:['lettuce','microgreens'],
    organic:['wheat','tomato','turmeric'],
    urban:['lettuce','microgreens'],
    sustainable:['wheat','rice'],
  };
  const keys = [];
  farmTypes.forEach(t => { if (keyMap[t]) keys.push(...keyMap[t]); });
  const unique = [...new Set(keys)];
  if (!unique.length) unique.push('wheat','rice','tomato','onion');
  return unique.map(k => MARKET_PRICES[k]).filter(Boolean).slice(0,6);
}

// ── NEARBY MANDIS & BUYERS ──
const MANDIS = [
  { icon:'🏢', name:'Nashik Agricultural Produce Market',  location:'APMC Yard, Nashik',  dist:'4.2 km', crops:'Grapes, Onion, Tomato, Garlic',   phone:'0253-2310567', type:'mandi' },
  { icon:'🏢', name:'Pune Market Yard',                    location:'Gultekdi, Pune',     dist:'12 km',  crops:'Vegetables, Fruits, Pulses',       phone:'020-24261520', type:'mandi' },
  { icon:'🏢', name:'Ludhiana Grain Market',               location:'Focal Point, Ludhiana', dist:'3.1 km', crops:'Wheat, Rice, Maize',           phone:'0161-2408620', type:'mandi' },
  { icon:'🏢', name:'Azadpur Mandi, Delhi',                location:'Azadpur, Delhi',     dist:'18 km',  crops:'All vegetables and fruits',        phone:'011-27218012', type:'mandi' },
  { icon:'🏢', name:'Hyderabad APMC',                      location:'Bowenpally, Hyd.',   dist:'8.5 km', crops:'Rice, Vegetables, Turmeric',       phone:'040-27684520', type:'mandi' },
];
const BUYERS = [
  { icon:'🏭', name:'Amul Dairy Co-op',      type:'Cooperative', crops:'Milk, dairy products', price:'₹36/litre — Collection daily 5 AM & 5 PM', phone:'1800-258-3333' },
  { icon:'🏬', name:'Ninjacart',             type:'AgriTech',    crops:'Fresh vegetables & fruits', price:'Market + 5–10% premium, same-day pickup', phone:'1800-102-NINJA' },
  { icon:'🏬', name:'BigBasket Farm',         type:'E-commerce',  crops:'Organic vegetables, herbs', price:'Certified organic premium 30–40%',       phone:'1800-102-6667' },
  { icon:'🏭', name:'Patanjali Herbal Buyer', type:'FMCG',        crops:'Aloe Vera, Ashwagandha, Shatavari', price:'Direct contract: ₹18/kg Aloe, ₹120/kg Shatavari', phone:'01334-240008' },
  { icon:'🐟', name:'Captain Fresh',          type:'AgriTech',    crops:'Fresh fish, shrimp, prawns', price:'Market + 15%, doorstep collection',      phone:'1800-10-FISH' },
  { icon:'🍯', name:'Apis India (Honey Co)',  type:'Cooperative', crops:'Raw honey, beeswax',         price:'₹350–380/kg minimum guaranteed purchase', phone:'011-24647012' },
];

// ── DISEASE ALERTS ──
const DISEASE_ALERTS = [
  { type:'danger',  icon:'🦠', title:'Lumpy Skin Disease — UP & Punjab', desc:'Active cattle outbreak. Vaccinate ALL cattle within 7 days. Isolate sick animals. Report to local veterinary office.', affectedTypes:['cattle'], time:'Active now', action:'Vaccinate all cattle this week', gap:'pred' },
  { type:'warning', icon:'🐛', title:'Fall Armyworm — Maize & Sorghum', desc:'FAW detected in Maharashtra. Spray Spinetoram or Chlorantraniliprole at 7-day intervals. Scout fields at 6 AM.', affectedTypes:['crop'], time:'Next 2 weeks', action:'Scout fields; spray if >10% damage', gap:'pred' },
  { type:'warning', icon:'🐟', title:'EUS Disease Alert — Fish Ponds', desc:'Epizootic Ulcerative Syndrome reported in Andhra ponds. Red ulcers on fish. Improve water quality and remove dead fish immediately.', affectedTypes:['fish'], time:'Watch', action:'Lime ponds; check fish daily', gap:'pred' },
  { type:'info',    icon:'🦟', title:'Mosquito Season — Poultry Fowl Pox', desc:'Fowl pox spreads through mosquito bites April–June. Vaccinate now. Install mosquito nets at shed entry.', affectedTypes:['poultry'], time:'Apr–Jun', action:'Vaccinate for Fowl Pox before May', gap:'pred' },
  { type:'warning', icon:'🐝', title:'Varroa Mite Peak Season', desc:'Spring hive growth means varroa populations explode. Check mite count now. Treat if >2 per 100 bees.', affectedTypes:['bees'], time:'April–May', action:'Check all hives this week', gap:'pred' },
];

// ── RESOURCE TIPS ──
const RESOURCE_TIPS = {
  low:[
    { icon:'💧', title:'Use Drip Tape', text:'Low-cost drip tape saves 40% water. Available at ₹2/metre. Payback in 1 season.' },
    { icon:'🌿', title:'Make Jeevamrut', text:'Cow dung-based liquid fertilizer — zero cost. Proven 15–20% yield improvement.' },
    { icon:'🤝', title:'Join FPO / SHG', text:'Sell collectively for better prices. Buy inputs in bulk — 20–30% cheaper.' },
    { icon:'📱', title:'Register for PM-KISAN', text:'₹6,000/year direct benefit. Check pmkisan.gov.in — 3-minute registration.' },
  ],
  medium:[
    { icon:'⚡', title:'Solar Pump (90% Subsidy)', text:'PM-KUSUM scheme. Eliminate fuel/electricity cost forever. One-time setup, lifetime savings.' },
    { icon:'🌾', title:'Zero-Till Farming', text:'Save ₹4,000–6,000/acre on tillage. Better stubble management. Use Happy Seeder.' },
    { icon:'🧪', title:'Free Soil Test at KVK', text:'Apply only needed nutrients. Save 25% fertilizer cost. Know your soil before spending.' },
    { icon:'📦', title:'Cold Storage Planning', text:'Store and sell at better price. District cold storage: ₹15–25/quintal/month.' },
  ],
  high:[
    { icon:'🚁', title:'Drone Spraying Service', text:'1 acre in 15 minutes. Reduce labour 70%. Cost: ₹400–500/acre. Contact local FPO.' },
    { icon:'📡', title:'IoT Soil + Weather Sensors', text:'Real-time irrigation decisions. Reduce water use 30–40%. Auto-alerts to phone.' },
    { icon:'🏭', title:'Agri Processing Unit Setup', text:'Grind, dry, package produce. Triple income per unit. PMFME scheme covers 35% cost.' },
    { icon:'🛒', title:'Direct Market Contracts', text:'Partner with BigBasket, Ninjacart, Jiomart. Premium price, guaranteed offtake.' },
  ],
};

window.MARKET_DATA     = { MARKET_PRICES, getMarketPricesForType, DISEASE_ALERTS, RESOURCE_TIPS, MANDIS, BUYERS };
