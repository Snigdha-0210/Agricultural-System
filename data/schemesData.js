// ============================================================
// KisanMitra v2 — Government Schemes Data
// ============================================================
const SCHEMES = [
  {
    id:'pm-kisan', type:'central', icon:'🏛️',
    title:'PM-KISAN Samman Nidhi',
    badge:'Central',
    benefit:'₹6,000/year (₹2,000 every 4 months)',
    desc:'Direct income support for all landholding farmer families across India.',
    eligibility:'All farmers with cultivable land. Exclude income taxpayers.',
    action:'Register at pmkisan.gov.in',
    farmTypes:['crop','cattle','organic','sustainable'],
  },
  {
    id:'pmfby', type:'insurance', icon:'🛡️',
    title:'PM Fasal Bima Yojana (PMFBY)',
    badge:'Insurance',
    benefit:'Up to 2% premium for Kharif, 1.5% for Rabi crops',
    desc:'Crop insurance protecting farmers against yield loss due to natural calamities, pests & disease.',
    eligibility:'All farmers growing notified crops (mandatory for loanee farmers).',
    action:'Apply via your bank before sowing cutoff date',
    farmTypes:['crop','organic'],
  },
  {
    id:'pm-kusum', type:'subsidy', icon:'⚡',
    title:'PM-KUSUM Solar Pump Scheme',
    badge:'Subsidy',
    benefit:'Up to 90% subsidy on solar pump installation',
    desc:'Replace diesel pumps with solar-powered irrigation. Zero fuel cost for lifetime.',
    eligibility:'Individual farmers, water user associations, cooperatives.',
    action:'Apply via state DISCOM or agriculture department portal',
    farmTypes:['crop','organic','sustainable','hydroponics'],
  },
  {
    id:'kcc', type:'central', icon:'💳',
    title:'Kisan Credit Card (KCC)',
    badge:'Central',
    benefit:'Loan up to ₹3 lakh at 4% interest (subsidized)',
    desc:'Short-term credit for crop production, maintenance and allied activities.',
    eligibility:'All farmers, sharecroppers, oral lessees, and SHG members.',
    action:'Apply at nearest bank branch with land documents',
    farmTypes:['crop','cattle','poultry','fish','bees','plants','organic'],
  },
  {
    id:'nm-fisheries', type:'central', icon:'🐟',
    title:'PM Matsya Sampada Yojana',
    badge:'Central',
    benefit:'Subsidy up to 60% for SC/ST/women fish farmers',
    desc:'₹20,050 crore scheme for development of fisheries sector. Covers pond, hatchery, feed mills.',
    eligibility:'Fish farmers, SHGs, fisheries cooperatives.',
    action:'Apply at state fisheries department office',
    farmTypes:['fish'],
  },
  {
    id:'beekeeping', type:'central', icon:'🐝',
    title:'National Beekeeping & Honey Mission',
    badge:'Central',
    benefit:'Subsidy on hive boxes, equipment, honey extractor',
    desc:'Free training and subsidized equipment for new beekeepers. Promotes "sweet revolution".',
    eligibility:'Individual farmers and beekeeping societies.',
    action:'Contact National Bee Board or state horticulture dept.',
    farmTypes:['bees'],
  },
  {
    id:'paramparagat', type:'central', icon:'♻️',
    title:'Paramparagat Krishi Vikas Yojana (PKVY)',
    badge:'Central',
    benefit:'₹50,000/hectare over 3 years for organic certification',
    desc:'Promotes cluster-based organic farming with certification support and direct market linkage.',
    eligibility:'Group of minimum 50 farmers with 50 acres minimum.',
    action:'Contact district agriculture office for cluster formation',
    farmTypes:['organic','sustainable'],
  },
  {
    id:'rkvy', type:'state', icon:'🌱',
    title:'Rashtriya Krishi Vikas Yojana (RKVY)',
    badge:'State',
    benefit:'District-specific grants and infrastructure support',
    desc:'Flexible state-specific agriculture development grants for machinery, cold storage, market infrastructure.',
    eligibility:'Farmers registered with state agriculture department.',
    action:'Submit project proposal at block level agriculture office',
    farmTypes:['crop','cattle','fish','poultry','organic','hydroponics'],
  },
  {
    id:'enam', type:'central', icon:'⚖️',
    title:'e-NAM (National Agriculture Market)',
    badge:'Central Market',
    benefit:'Direct online trading with buyers across India',
    desc:'Pan-India electronic trading portal uniting existing APMC mandis to create a unified national market.',
    eligibility:'All farmers with valid ID and bank account can register.',
    action:'Register at enam.gov.in or via the mandis',
    farmTypes:['crop', 'organic', 'plants'],
  }
];

function getSchemesForTypes(farmTypes) {
  return SCHEMES.filter(s => s.farmTypes.some(t => farmTypes.includes(t)));
}

window.SCHEMES_DATA = { SCHEMES, getSchemesForTypes };
