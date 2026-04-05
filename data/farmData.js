// ============================================================
// KisanMitra v2 — Extended Farm Data
// All 10 farming types + rich task & guide data
// ============================================================

const FARM_TYPES = {
  crop:        { id:'crop',        label:'Crop Farming',       emoji:'🌾', color:'#16a34a', desc:'Wheat, Rice, Vegetables, Pulses' },
  cattle:      { id:'cattle',      label:'Livestock / Dairy',  emoji:'🐄', color:'#a86c1e', desc:'Cows, Buffaloes, Goats, Dairy' },
  poultry:     { id:'poultry',     label:'Poultry',            emoji:'🐔', color:'#f97316', desc:'Broiler, Layer, Desi Hens' },
  fish:        { id:'fish',        label:'Fish / Aquaculture', emoji:'🐟', color:'#0284c7', desc:'Catfish, Tilapia, Rohu, Prawn' },
  bees:        { id:'bees',        label:'Beekeeping',         emoji:'🐝', color:'#d97706', desc:'Honey, Pollination Services' },
  plants:      { id:'plants',      label:'Medicinal Plants',   emoji:'🌿', color:'#7c3aed', desc:'Tulsi, Aloe, Ashwagandha' },
  organic:     { id:'organic',     label:'Organic Farming',    emoji:'♻️',  color:'#15803d', desc:'Chemical-free, certified organic' },
  hydroponics: { id:'hydroponics', label:'Hydroponics',        emoji:'💧', color:'#0d9488', desc:'Soil-less, water-based growing' },
  urban:       { id:'urban',       label:'Urban Farming',      emoji:'🏙️', color:'#4f46e5', desc:'Terrace, balcony, vertical farms' },
  sustainable: { id:'sustainable', label:'Sustainable Systems',emoji:'🌍', color:'#059669', desc:'Permaculture, zero-waste farming' },
};

// ── 4 User Personas ──
const PERSONAS = [
  { id:'generational', label:'Generational Farmer', desc:'Low-income, traditional, inherited land. Needs simple local language advice.', emoji:'👴', tag:'Low-income / Traditional', color:'#16a34a' },
  { id:'wealthy',      label:'Wealthy / Large Farmer',desc:'Multiple farms, machinery, market access. Needs efficiency and profit data.', emoji:'🧑‍💼', tag:'Scale & Optimization', color:'#0284c7' },
  { id:'new-entrant',  label:'New Entrant',          desc:'Engineer/student with no farming background. Needs full step-by-step guidance.', emoji:'🎓', tag:'Beginner / Learner', color:'#d97706' },
  { id:'agripreneur',  label:'Agripreneur / Startup', desc:'Funded tech-driven farmer. Needs analytics, automation, market linkage.', emoji:'🚀', tag:'Scale / Analytics', color:'#7c3aed' },
];

const EXPERIENCE_LEVELS = [
  { id:'beginner',     label:'New Farmer',           desc:'Just starting out — need step-by-step help', emoji:'🌱' },
  { id:'intermediate', label:'Some Experience',       desc:'1–5 years of farming experience',             emoji:'🌿' },
  { id:'expert',       label:'Experienced Farmer',    desc:'5+ years, know the basics well',             emoji:'🌳' },
];

const BUDGET_LEVELS = [
  { id:'low',    label:'Low Budget',    desc:'Limited funds, need cost-effective tips',   emoji:'💰' },
  { id:'medium', label:'Medium Budget', desc:'Moderate investment possible',              emoji:'💳' },
  { id:'high',   label:'High Budget',   desc:'Open to machinery and technology',          emoji:'🏦' },
];

const INDIAN_LOCATIONS = [
  'Amritsar, Punjab','Ludhiana, Punjab','Chandigarh','Patiala, Punjab',
  'Jaipur, Rajasthan','Udaipur, Rajasthan','Jodhpur, Rajasthan','Kota, Rajasthan',
  'Mumbai, Maharashtra','Pune, Maharashtra','Nashik, Maharashtra','Nagpur, Maharashtra','Aurangabad, Maharashtra',
  'Bengaluru, Karnataka','Mysuru, Karnataka','Hubli, Karnataka','Belagavi, Karnataka',
  'Chennai, Tamil Nadu','Coimbatore, Tamil Nadu','Madurai, Tamil Nadu','Thanjavur, Tamil Nadu',
  'Hyderabad, Telangana','Warangal, Telangana','Nizamabad, Telangana',
  'Kolkata, West Bengal','Siliguri, West Bengal','Bardhaman, West Bengal',
  'Patna, Bihar','Muzaffarpur, Bihar','Gaya, Bihar',
  'Lucknow, UP','Varanasi, UP','Agra, UP','Kanpur, UP','Meerut, UP','Gorakhpur, UP',
  'Bhopal, MP','Indore, MP','Jabalpur, MP','Gwalior, MP',
  'Ahmedabad, Gujarat','Surat, Gujarat','Rajkot, Gujarat','Vadodara, Gujarat',
  'Bhubaneswar, Odisha','Cuttack, Odisha','Guwahati, Assam','Jorhat, Assam',
  'Raipur, Chhattisgarh','Ranchi, Jharkhand','Shimla, Himachal Pradesh',
  'Dehradun, Uttarakhand','Srinagar, J&K','Imphal, Manipur','Shillong, Meghalaya',
];

// ─────────────────────────────────────────────────────────────
// TASKS — All 10 farming types + gap labels
// gap: 'info' | 'pred' | 'access' | 'exec'
// ─────────────────────────────────────────────────────────────
const ALL_TASKS = {
  crop_wheat:[
    { id:'wt1', text:'Water the wheat field today', icon:'💧', time:'Tomorrow 6 AM', priority:'high', type:'crop', gap:'exec', detail:'Wheat at heading stage. Flood irrigation for 2–3 hrs. Do not irrigate in afternoon — evaporation loss increases 40%.' },
    { id:'wt2', text:'Add urea fertilizer to the soil', icon:'🌱', time:'After irrigation', priority:'high', type:'crop', gap:'info', detail:'Broadcast urea on moist soil. Avoid if rain expected in next 4 hours. Cost: ₹1000–1200/acre.' },
    { id:'wt3', text:'Check leaves for yellow spots', icon:'🔍', time:'This week', priority:'medium', type:'crop', gap:'pred', detail:'Yellow stripes on leaf = yellow rust. Spray Mancozeb 0.2% if found. Disease risk HIGH this week (humidity 65%+).' },
    { id:'wt4', text:'Remove weeds around the borders', icon:'🌾', time:'This weekend', priority:'low', type:'crop', gap:'exec', detail:'Hand pull or spray Isoproturon. Weeds compete for 20–30% of applied nutrients.' },
  ],
  crop_rice:[
    { id:'rt1', text:'Keep a little water standing in the field', icon:'💧', time:'Check daily', priority:'high', type:'crop', gap:'exec', detail:'Drain if level exceeds 5 cm. Below 1 cm causes moisture stress. Critical for tillering stage.' },
    { id:'rt2', text:'Add potash fertilizer', icon:'🌱', time:'Within 3 days', priority:'medium', type:'crop', gap:'info', detail:'Apply before heading stage for better grain quality and disease resistance.' },
    { id:'rt3', text:'Check stems for insect damage', icon:'🔍', time:'This week', priority:'medium', type:'crop', gap:'pred', detail:"Dead hearts = stem borer. >5% incidence: apply Cartap hydrochloride 4G @ 8 kg/acre." },
  ],
  crop_vegetables:[
    { id:'vt1', text:'Run the drip pipes for 45 mins', icon:'💧', time:'Today 7 AM', priority:'high', type:'crop', gap:'exec', detail:'Each plant needs ~2 litres. Check drip emitters for blockage. Avoid midday irrigation.' },
    { id:'vt2', text:'Do not spray pesticide today (Rain coming)', icon:'🚫', time:'Today', priority:'high', type:'crop', gap:'pred', detail:'Rain tomorrow will wash off any spray. Postponed spraying saves ₹500–800 and reduces environmental impact.' },
    { id:'vt3', text:'Pick the red tomatoes this morning', icon:'🍅', time:'This morning', priority:'high', type:'crop', gap:'exec', detail:'Harvest pink-to-red stage tomatoes before sun peak. Market price today: ₹1850/quintal — GOOD DAY TO SELL.' },
    { id:'vt4', text:'Put cow-dung compost near the roots', icon:'♻️', time:'This week', priority:'low', type:'crop', gap:'info', detail:'Vermicompost boosts yield 15–20%. Free if you have cattle. Reduces fertilizer cost by ₹3000–5000/acre.' },
  ],
  cattle:[
    { id:'ct1', text:'Get the cows vaccinated', icon:'💉', time:'This week', priority:'high', type:'cattle', gap:'pred', detail:'FMD vaccine every 6 months. Contact local vet. Cost: ₹30–50 per dose. Disease outbreak reported nearby.' },
    { id:'ct2', text:'Milk cows early at 5:30 AM', icon:'🥛', time:'Daily 5:30 AM', priority:'high', type:'cattle', gap:'exec', detail:'Milk within 12 hours of previous milking. Clean udder with warm water. Record today\'s yield.' },
    { id:'ct3', text:'Give cows fresh green grass & minerals', icon:'🌿', time:'Morning & Evening', priority:'high', type:'cattle', gap:'exec', detail:'Add 50g mineral mixture to feed. Improves milk fat content by 0.2–0.5%. Cost: ₹15/day, benefit: ₹40+.' },
    { id:'ct4', text:'Check cow udders for swelling', icon:'🔍', time:'During milking', priority:'medium', type:'cattle', gap:'pred', detail:'Signs: swollen udder, watery milk, pain on touch. Isolate affected cow. Call vet immediately.' },
    { id:'ct5', text:'Give deworming medicine to calves', icon:'💊', time:'This month', priority:'medium', type:'cattle', gap:'info', detail:'Dose by weight: 7.5 mg/kg. Deworming every 3 months improves weight gain by 10–15%.' },
    { id:'ct6', text:'Clean up the cow shed', icon:'🧹', time:'Today', priority:'low', type:'cattle', gap:'exec', detail:'Remove manure (use for biogas or crop compost). Spray 2% bleach. Good hygiene prevents disease spread.' },
  ],
  poultry:[
    { id:'polt1', text:'Keep the chicken shed cool', icon:'🌡️', time:'Check 3x daily', priority:'high', type:'poultry', gap:'exec', detail:'Activate foggers if >32°C. Heat stress kills 2–5 birds/1000/day. Check fan operation every morning.' },
    { id:'polt2', text:'ALERT: Keep visitors away from birds', icon:'🚨', time:'Immediate', priority:'high', type:'poultry', gap:'pred', detail:'Restrict visitor access. Vaccinate with R2B immediately. Enhance biosecurity. Sanitize entry points.' },
    { id:'polt3', text:'Give feed and fresh water', icon:'🐔', time:'Twice daily', priority:'high', type:'poultry', gap:'exec', detail:'Layer feed: 120g/bird/day. Broiler phase 2: 180g/bird/day. Ensure constant fresh water. Record FCR.' },
    { id:'polt4', text:'Count and write down today\'s eggs', icon:'🥚', time:'Evening', priority:'medium', type:'poultry', gap:'info', detail:'Target: >90% production. Drop >5% may indicate disease, stress, or nutritional deficiency.' },
    { id:'polt5', text:'Change any wet bedding on the floor', icon:'🪣', time:'This week', priority:'low', type:'poultry', gap:'exec', detail:'Wet litter causes ammonia and foot disease. Add fresh rice husk (2 kg/10 sq m).' },
  ],
  fish:[
    { id:'ft1', text:'Feed the fish', icon:'🐟', time:'6 AM & 6 PM daily', priority:'high', type:'fish', gap:'exec', detail:'Use floating pellets. Split into 2 feedings. Reduce by 20% on cloudy days (low oxygen slows digestion).' },
    { id:'ft2', text:'Check if fish are coming to the surface', icon:'🌊', time:'Morning 7 AM', priority:'high', type:'fish', gap:'pred', detail:'Below 4 ppm: run aerator IMMEDIATELY. Fish gulping at surface = emergency. Use DO meter daily.' },
    { id:'ft3', text:'Add lime to pond water if needed', icon:'🧪', time:'Every morning', priority:'medium', type:'fish', gap:'info', detail:'pH below 6.5: apply quicklime 100–150 kg/acre. pH above 9: partial water change needed.' },
    { id:'ft4', text:'Turn on the water fan (aerator) tonight', icon:'💨', time:'Tonight', priority:'medium', type:'fish', gap:'exec', detail:'Cloudy weather today reduces photosynthesis. Oxygen levels drop at night. Pre-emptive aeration.' },
    { id:'ft5', text:'Weigh a few fish to check growth', icon:'⚖️', time:'This week', priority:'low', type:'fish', gap:'info', detail:'Net 30 fish, weigh, calculate average. Compare to growth chart. Adjust feed rate if behind target.' },
  ],
  bees:[
    { id:'bt1', text:'Look inside the hive for overcrowding', icon:'🐝', time:'Morning this week', priority:'high', type:'bees', gap:'pred', detail:'Open during warm dry morning (9–11 AM). Queen cells on brood frame edge = swarm risk. Remove or split colony.' },
    { id:'bt2', text:'Put an empty box on top for honey', icon:'🍯', time:'Today', priority:'high', type:'bees', gap:'exec', detail:'Mustard flowering nearby. Add super for honey storage. Remove when 80%+ cells are capped.' },
    { id:'bt3', text:'Keep the sugar syrup full', icon:'🍬', time:'Every 2 days', priority:'medium', type:'bees', gap:'exec', detail:'1:1 sugar:water ratio. DO NOT use honey — risk of disease. Essential during dearth periods.' },
    { id:'bt4', text:'Check the bees for mites', icon:'🔬', time:'This month', priority:'medium', type:'bees', gap:'pred', detail:'Count mites on 100 bees. >2 mites per 100 bees: treat with oxalic acid strips. Cost: ₹120/strip.' },
    { id:'bt5', text:'Move the bee boxes to the mustard fields', icon:'🌼', time:'Next week', priority:'low', type:'bees', gap:'access', detail:'Mustard bloom = best nectar source. Expect 25–35 kg honey/colony. Contact local farmer for placement.' },
  ],
  plants:[
    { id:'plt1', text:'Cut the thick Aloe leaves for sale', icon:'🌿', time:'This week', priority:'high', type:'plants', gap:'access', detail:'Harvest mature outer leaves (18+ months old). Market: ₹18/kg (up 12%). Contact Patanjali/Dabur buyer directly.' },
    { id:'plt2', text:'Water the plants only if soil is completely dry', icon:'💧', time:'Every 10 days', priority:'medium', type:'plants', gap:'info', detail:'Drought-tolerant crop. Water only when soil dry at 5 cm depth. Overwatering causes root rot.' },
    { id:'plt3', text:'Put neem powder near the roots', icon:'🌱', time:'This week', priority:'medium', type:'plants', gap:'exec', detail:'500 kg/acre. Suppresses soil pests, adds nitrogen. Cost ₹20/kg — cheaper than chemical fertilizer.' },
    { id:'plt4', text:'SELL ALERT: Sell your root crops today', icon:'📈', time:'This week', priority:'high', type:'plants', gap:'access', detail:'Shatavari at ₹120/kg in Nashik. Seasonal high. Contact herbal company buyers for direct sale listing.' },
  ],
  hydroponics:[
    { id:'ht1', text:'Add plant food to the water tank', icon:'🧪', time:'Morning daily', priority:'high', type:'hydroponics', gap:'info', detail:'High EC causes salt stress. Low EC causes deficiency. Adjust by adding nutrients or water.' },
    { id:'ht2', text:'Check and balance water acidity', icon:'⚗️', time:'Twice daily', priority:'high', type:'hydroponics', gap:'exec', detail:'pH drift is fast in hydroponics. Use pH Up or Down solution. Record readings per shift.' },
    { id:'ht3', text:'Check plant roots for brown slime', icon:'🌱', time:'Weekly', priority:'medium', type:'hydroponics', gap:'pred', detail:'Brown slimy roots = root rot. Use H2O2 0.5% solution flush. Ensure adequate aeration.' },
    { id:'ht4', text:'Cut and collect the ready lettuce', icon:'🥬', time:'Today', priority:'high', type:'hydroponics', gap:'exec', detail:'Lettuce ready at 25–35 days. Cut at base, sell to restaurants or local market. Price: ₹80–120/kg.' },
  ],
  organic:[
    { id:'ot1', text:'Mix seeds with natural fertilizer before sowing', icon:'🦠', time:'Before sowing', priority:'high', type:'organic', gap:'info', detail:'Mix with seeds before sowing pulses. Fixes atmospheric nitrogen. Saves ₹2000–3000/acre on fertilizer.' },
    { id:'ot2', text:'Make the natural liquid manure mixture', icon:'🪣', time:'Today', priority:'medium', type:'organic', gap:'exec', detail:'Mix: 10L cow urine, 10kg cow dung, 250g jaggery, 250g besan, 250g soil in 200L water. Ferment 48 hrs.' },
    { id:'ot3', text:'Hang sticky papers to catch bugs', icon:'🟡', time:'This week', priority:'medium', type:'organic', gap:'pred', detail:'Count insects daily. >10 pests per trap = take action. Replace trap every 2 weeks. Cost: ₹10/trap.' },
  ],
  urban:[
    { id:'ut1', text:'Water the pots if soil feels dry', icon:'💧', time:'Morning daily', priority:'high', type:'urban', gap:'exec', detail:'Container soil dries faster. Stick finger 2 inches deep — if dry, water fully until drainage.' },
    { id:'ut2', text:'Add liquid compost to the pots', icon:'🌱', time:'Every 2 weeks', priority:'medium', type:'urban', gap:'info', detail:'Use diluted vermicompost tea (1:10 ratio) or commercial liquid NPK. Feed in morning, not peak heat.' },
    { id:'ut3', text:'Cut the small green veggies for cooking/sale', icon:'🌿', time:'Today', priority:'high', type:'urban', gap:'exec', detail:'Cut above root zone. Rinse and sell/use fresh. Sell to restaurants: ₹400–800/tray. Next batch sow tonight.' },
  ],
  sustainable:[
    { id:'sust1', text:'Decide which crops to plant next season', icon:'🔄', time:'This month', priority:'medium', type:'sustainable', gap:'info', detail:'Rotate legumes after cereals. Builds soil nitrogen naturally. Reduces fertilizer cost by 20–30%.' },
    { id:'sust2', text:'Check if rainwater tanks are full', icon:'🌧️', time:'Weekly', priority:'medium', type:'sustainable', gap:'exec', detail:'Rain expected this week. Clean tank inlet filter. Harvested water saves ₹200–500/acre in irrigation cost.' },
    { id:'sust3', text:'Make compost from old dry plants', icon:'♻️', time:'This week', priority:'low', type:'sustainable', gap:'exec', detail:'Layer green and brown material 1:2 ratio. Ready in 45–60 days. DO NOT burn — burning causes ₹5000+ loss in organic matter.' },
  ],
};

// Get tasks for a profile
function getTasksForProfile(profile) {
  let tasks = [];
  const { farmTypes, cropType, experience } = profile;

  farmTypes.forEach(type => {
    switch(type) {
      case 'crop':
        const key = `crop_${cropType || 'vegetables'}`;
        tasks = [...tasks, ...(ALL_TASKS[key] || ALL_TASKS.crop_vegetables)];
        break;
      case 'cattle':     tasks = [...tasks, ...ALL_TASKS.cattle];     break;
      case 'poultry':    tasks = [...tasks, ...ALL_TASKS.poultry];    break;
      case 'fish':       tasks = [...tasks, ...ALL_TASKS.fish];       break;
      case 'bees':       tasks = [...tasks, ...ALL_TASKS.bees];       break;
      case 'plants':     tasks = [...tasks, ...ALL_TASKS.plants];     break;
      case 'hydroponics':tasks = [...tasks, ...ALL_TASKS.hydroponics];break;
      case 'organic':    tasks = [...tasks, ...ALL_TASKS.organic];    break;
      case 'urban':      tasks = [...tasks, ...ALL_TASKS.urban];      break;
      case 'sustainable':tasks = [...tasks, ...ALL_TASKS.sustainable];break;
    }
  });

  // Beginner: Show ALL basic steps
  if (experience === 'beginner') {
    return tasks.slice(0, 6);
  }
  
  // Experienced: Show ONLY high priority optimization/warnings
  if (experience === 'expert') {
    return tasks.filter(t => t.priority === 'high' && (t.gap === 'pred' || t.gap === 'access')).slice(0, 4);
  }

  // Intermediate
  return tasks.filter(t => t.priority !== 'low').slice(0, 5);
}

// ─────────────────────────────────────────────────────────────
// LEARN FROM EXPERTS (SOCIAL LEARNING VIDEOS)
// ─────────────────────────────────────────────────────────────
const LEARN_VIDEOS = [
  { type:'crop', title:'How to identify Yellow Rust in Wheat early', platform:'YouTube', icon:'▶️', tag:'Expert Tip', duration:'1:45' },
  { type:'crop', title:'Drip irrigation maintenance full guide', platform:'YouTube', icon:'▶️', tag:'Step-by-step', duration:'4:20' },
  { type:'cattle', title:'Detecting Mastitis during milking', platform:'Instagram', icon:'📱', tag:'Quick Tip', duration:'0:30' },
  { type:'cattle', title:'Ideal mineral mix ratio for high milk yield', platform:'YouTube', icon:'▶️', tag:'Nutrition', duration:'2:15' },
  { type:'hydroponics', title:'How to grow lettuce using hydroponics', platform:'YouTube', icon:'▶️', tag:'Complete Guide', duration:'10:05' },
  { type:'hydroponics', title:'Fixing pH drift in NFT systems', platform:'Instagram', icon:'📱', tag:'Troubleshooting', duration:'0:45' },
  { type:'fish', title:'Fish farming oxygen management', platform:'YouTube', icon:'▶️', tag:'Critical', duration:'3:50' },
  { type:'organic', title:'Organic pest control methods that work!', platform:'Snapchat', icon:'👻', tag:'DIY', duration:'0:55' },
  { type:'poultry', title:'Preventing heat stress in broilers', platform:'YouTube', icon:'▶️', tag:'Summer Care', duration:'5:10' },
  { type:'bees', title:'When exactly to add a honey super', platform:'Instagram', icon:'📱', tag:'Timing', duration:'0:40' },
  { type:'urban', title:'Balcony microgreens - Seed to harvest', platform:'YouTube', icon:'▶️', tag:'Beginner', duration:'6:30' },
];

function getLearnVideos(farmTypes) {
  let videos = LEARN_VIDEOS.filter(v => farmTypes.includes(v.type));
  if (videos.length === 0) videos = LEARN_VIDEOS.slice(0, 3); // Fallback
  return videos.slice(0, 4); // return top 4
}

// ─────────────────────────────────────────────────────────────
// PROFIT OPPORTUNITIES
// ─────────────────────────────────────────────────────────────
const PROFIT_OPPORTUNITIES = {
  crop:[
    { icon:'🍅', title:'Sell tomatoes NOW — price peaked', text:'Tomato at ₹1850/quintal (12% above average). Price will drop next week. Contact local mandi today.', badge:'high-opp', amount:'↑ +₹200/quintal vs last week', gap:'access' },
    { icon:'🌾', title:'Summer crop on vacant land', text:'April is ideal for okra, bitter gourd, sesame. One extra crop can earn ₹30,000–45,000/acre.', badge:'medium-opp', amount:'Est. ₹30,000–45,000/acre', gap:'info' },
    { icon:'🧪', title:'Soil test → save 25% fertilizer cost', text:'Free soil test at KVK. Apply only what\'s needed. Saves ₹3,000–5,000/acre this season.', badge:'low-opp', amount:'Save ₹3,000–5,000', gap:'info' },
  ],
  cattle:[
    { icon:'🥛', title:'Dairy cooperative price up this week', text:'AMUL accepting at ₹36/litre (vs ₹34 last week). Increase milk output with mineral mixture.', badge:'high-opp', amount:'↑ ₹2/litre premium', gap:'access' },
    { icon:'♻️', title:'Sell cattle dung as organic compost', text:'Dry dung cakes sell at ₹4–6/kg. 5 cattle can generate ₹5,000–8,000/month extra income.', badge:'medium-opp', amount:'₹5,000–8,000/month extra', gap:'access' },
  ],
  fish:[
    { icon:'🐟', title:'Market gap — catfish demand high in city', text:'Catfish (1 kg+) selling at ₹160/kg in Bangalore. Courier arrangement available. Harvest ready fish now.', badge:'high-opp', amount:'₹160/kg city price', gap:'access' },
  ],
  poultry:[
    { icon:'🥚', title:'Egg price rise expected this weekend', text:'Festival season demand increases. National price tracker shows 8% rise projected. Hold stock 3 more days.', badge:'high-opp', amount:'Predicted +8% in 3 days', gap:'pred' },
  ],
  plants:[
    { icon:'🌿', title:'Shatavari root buyer arriving next week', text:'Herbal company buyer from Pune visiting. Direct sale saves 15–20% mandi commission.', badge:'high-opp', amount:'Save 15–20% commission', gap:'access' },
  ],
  hydroponics:[
    { icon:'🥬', title:'Restaurant supply contract opportunity', text:'Local farm-to-table restaurant seeking weekly lettuce supply. ₹120/kg direct purchase.', badge:'high-opp', amount:'₹120/kg premium', gap:'access' },
  ],
  bees:[
    { icon:'🍯', title:'Bottle and sell honey — packaging ready?', text:'Raw honey at ₹350/kg. Branded bottled honey fetches ₹500–600/kg. FSSAI license fast-track available.', badge:'medium-opp', amount:'₹150–250/kg premium branded', gap:'access' },
  ],
  organic:[
    { icon:'📜', title:'Apply for organic certification now', text:'PGS-India certification is FREE for small farmers. Certified organic fetches 30–50% premium price.', badge:'high-opp', amount:'+30–50% price premium', gap:'access' },
  ],
};

function getProfitOpps(farmTypes) {
  let opps = [];
  farmTypes.forEach(t => { if (PROFIT_OPPORTUNITIES[t]) opps = [...opps, ...PROFIT_OPPORTUNITIES[t]]; });
  if (!opps.length) opps = PROFIT_OPPORTUNITIES.crop;
  return opps.slice(0, 4);
}

// ─────────────────────────────────────────────────────────────
// BEGINNER GUIDES
// ─────────────────────────────────────────────────────────────
const BEGINNER_GUIDES = {
  crop:{
    title:'Rice Farming — 120 Day Journey',emoji:'🌾',
    steps:[
      { day:'Day 1–5',   title:'Land Preparation',   desc:'Plough 2–3 times. Apply farmyard manure 5 tonnes/acre.',                  actions:['Rent tractor (₹500–800/hr)','Buy FYM from gaushala','Build 30 cm bunds to hold water'] },
      { day:'Day 6–10',  title:'Nursery Preparation', desc:'Prepare raised nursery beds. Sow soaked seeds.',                         actions:['Buy certified seed (IR-64 or Swarna)','Soak 24h, drain 24h, sow 25 kg for 1 acre','Maintain moisture — don\'t let bed dry out'] },
      { day:'Day 25–30', title:'Transplanting',       desc:'Transplant 25-day seedlings. Flood field 5 cm.',                         actions:['2 seedlings per hill, 20×15 cm spacing','Apply 40 kg urea at transplanting','Keep 2–3 cm water for 7 days after'] },
      { day:'Day 35–50', title:'Tillering Stage',     desc:'Critical growth. Maintain water, control weeds.',                        actions:['Apply second urea dose (40 kg/acre at day 35)','Weed with cono weeder between rows','Watch for blast disease — yellowish leaf lesions'] },
      { day:'Day 60–80', title:'Panicle Initiation',  desc:'Maximum nutrition needed. Monitor pest closely.',                        actions:['Apply potash MOP 40 kg/acre','Keep 5 cm standing water during flowering','Spray pesticide only if >3 pests per hill'] },
      { day:'Day 95–110','title':'Grain Filling',     desc:'Reduce irrigation. Monitor for neck blast.',                             actions:['Reduce water to 2–3 cm','No nitrogen now — delays maturity','Watch for brown plant hopper in humid weather'] },
      { day:'Day 110–120','title':'Harvesting',       desc:'Harvest when 80% grains are golden.',                                    actions:['Drain water 7–10 days before harvest','Check grain moisture: 20–22% ideal','Sun dry to 14% before storage or sale'] },
    ]
  },
  fish:{
    title:'Fish Farming — First 90 Days',emoji:'🐟',
    steps:[
      { day:'Week 0',    title:'Pond Preparation',   desc:'Drain, lime, refill with fresh water.',                                  actions:['Apply quicklime 200 kg/acre','Rest 7 days before stocking','Test pH: 7.5–8.5 before adding fish'] },
      { day:'Week 1–2',  title:'Stocking Fish',      desc:'Add fingerlings at measured density.',                                   actions:['Stock 2,000–3,000 fingerlings/acre','Rohu + Catla + Mrigal composite stocking','Add in morning when water is cool'] },
      { day:'Week 2–4',  title:'Initial Feeding',    desc:'Feed rice bran + groundnut oil cake.',                                   actions:['Feed 2% body weight, twice daily','Monitor DO daily — must be >4 ppm','Do NOT overfeed — uneaten food pollutes water'] },
      { day:'Monthly',   title:'Monitoring',         desc:'Regular checks ensure healthy growth.',                                  actions:['Net-sample 30 fish every 2 weeks','Add lime monthly for pH','Fish jumping/gulping = emergency low oxygen'] },
    ]
  },
  hydroponics:{
    title:'Hydroponics — First Setup',emoji:'💧',
    steps:[
      { day:'Day 1–5',   title:'System Setup',       desc:'Set up grow channel, reservoir, pump.',                                  actions:['Clean system with 0.5% H2O2 solution','Fill reservoir with clean water','Install net pots and clay pebble growing medium'] },
      { day:'Day 5–7',   title:'Nutrient Solution',  desc:'Mix base nutrients to correct strength.',                               actions:['Target EC: 1.2 mS/cm for seedlings','Target pH: 5.8–6.2','Check every 12 hours first week'] },
      { day:'Day 7–14',  title:'Sowing/Transplant',  desc:'Germinate seeds in rockwool, move to system.',                          actions:['Sow in moistened rockwool cubes','Transfer at 1–2 inch height to net pots','Keep lights on 16 hrs/day for leafy greens'] },
      { day:'Day 25–35', title:'Harvest',            desc:'First harvest! Lettuce in 28–35 days.',                                  actions:['Cut at soil level, leave roots','Sell to restaurants, premium price ₹100–120/kg','Replant immediately — continuous cycle'] },
    ]
  },
};

// ─────────────────────────────────────────────────────────────
// INTEGRATED FARMING TIPS
// ─────────────────────────────────────────────────────────────
const INTEGRATED_TIPS = [
  { icon:'♻️', title:'Cattle Dung → Crop Compost', text:'5 cows produce 250 kg dung/day. Convert to vermicompost — saves ₹5,000–8,000/acre on fertilizer.' },
  { icon:'🐟', title:'Paddy-Fish Integration', text:'Keep fish in paddy fields. Fish eat pests and weeds. Reduces pesticide cost by 60% and adds ₹30,000 fish income/acre.' },
  { icon:'🐝', title:'Bees + Crops = 30% Yield Boost', text:'Place 2 hives per acre near vegetable or fruit crop. Pollination boosts yield 20–35% at zero extra cost.' },
  { icon:'🌿', title:'Poultry Droppings → Vegetable Compost', text:'Chicken droppings are 10× richer in nitrogen than cattle dung. Use diluted for vegetable beds.' },
  { icon:'🌾', title:'Crop Residue → Cattle Feed', text:'Wheat straw and rice straw as dry fodder cuts feed cost by ₹2,000–3,000/month per 5 cattle.' },
  { icon:'💧', title:'Fishpond Water → Crop Irrigation', text:'Fish pond water is nutrient-rich. Use for crop irrigation — reduces fertilizer need by 20%.' },
];

window.FARM_DATA = {
  FARM_TYPES, PERSONAS, EXPERIENCE_LEVELS, BUDGET_LEVELS, INDIAN_LOCATIONS,
  ALL_TASKS, getTasksForProfile, PROFIT_OPPORTUNITIES, getProfitOpps,
  BEGINNER_GUIDES, INTEGRATED_TIPS,
  LEARN_VIDEOS, getLearnVideos
};
