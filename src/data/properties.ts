export type PropertyType = "house" | "villa" | "land" | "commercial";
export type ListingType = "sale" | "rent";

export interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string;
  whatsapp: string;
  email: string;
  photo: string;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  address: string;
  city: string;
  neighborhood: string;
  lat: number;
  lng: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number;
  yearBuilt: number;
  images: string[];
  description: string;
  amenities: string[];
  agent: Agent;
  isFeatured?: boolean;
  walkability?: number;
  schoolRating?: number;
  crimeScore?: number;
}

const AGENTS: Agent[] = [
  {
    id: "a1",
    name: "Eleanor Whitfield",
    title: "Senior Estate Director",
    phone: "+1 (310) 555-0182",
    whatsapp: "13105550182",
    email: "eleanor@luxestate.com",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "a2",
    name: "Marcus Aldridge",
    title: "Private Client Advisor",
    phone: "+1 (212) 555-0144",
    whatsapp: "12125550144",
    email: "marcus@luxestate.com",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "a3",
    name: "Saoirse Lévesque",
    title: "International Properties Lead",
    phone: "+33 1 55 55 0166",
    whatsapp: "33155550166",
    email: "saoirse@luxestate.com",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop",
  },
];

// Curated Unsplash architecture/interior photos
const IMG = {
  villa1: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80&auto=format&fit=crop",
  villa2: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80&auto=format&fit=crop",
  villa3: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop",
  villa4: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80&auto=format&fit=crop",
  villa5: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80&auto=format&fit=crop",
  villa6: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80&auto=format&fit=crop",
  villa7: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80&auto=format&fit=crop",
  villa8: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600&q=80&auto=format&fit=crop",
  villa9: "https://images.unsplash.com/photo-1605114294813-a8a8b40bce40?w=1600&q=80&auto=format&fit=crop",
  villa10: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1600&q=80&auto=format&fit=crop",
  villa11: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=80&auto=format&fit=crop",
  villa12: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80&auto=format&fit=crop",
  villa13: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80&auto=format&fit=crop",
  villa14: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&q=80&auto=format&fit=crop",
  villa15: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1600&q=80&auto=format&fit=crop",
  villa16: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80&auto=format&fit=crop",
  villa17: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1600&q=80&auto=format&fit=crop",
  villa18: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80&auto=format&fit=crop",
  land1: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&auto=format&fit=crop",
  land2: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80&auto=format&fit=crop",
  land3: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80&auto=format&fit=crop",
  commercial1: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80&auto=format&fit=crop",
  commercial2: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop",
  commercial3: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=1600&q=80&auto=format&fit=crop",
  interior1: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1600&q=80&auto=format&fit=crop",
  interior2: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80&auto=format&fit=crop",
  interior3: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1600&q=80&auto=format&fit=crop",
  pool1: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1600&q=80&auto=format&fit=crop",
};

const ALL_AMENITIES = [
  "Pool", "Garage", "Garden", "Gym", "Wine Cellar", "Home Theater",
  "Smart Home", "Ocean View", "Mountain View", "Concierge", "Spa", "Tennis Court",
  "Private Beach", "Helipad", "Solar", "Elevator", "Fireplace", "Chef's Kitchen",
];

function pickAmenities(seed: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < 6; i++) {
    out.push(ALL_AMENITIES[(seed * 7 + i * 13) % ALL_AMENITIES.length]);
  }
  return Array.from(new Set(out)).slice(0, 4 + (seed % 3));
}

interface Spec {
  title: string;
  type: PropertyType;
  listingType: ListingType;
  price: number;
  address: string;
  city: string;
  neighborhood: string;
  lat: number;
  lng: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number;
  yearBuilt: number;
  imgs: string[];
  desc: string;
  featured?: boolean;
}

/*
 * All properties are located in Benslimane, Morocco – Shems Al Madina & surrounding neighborhoods.
 * Center: ~33.6181°N, ~-7.1200°W
 */
const SPECS: Spec[] = [
  { title: "Villa Shems Royale",            type: "villa",       listingType: "sale", price: 4_800_000, address: "Lot 12, Shems Al Madina",                city: "Benslimane", neighborhood: "Shems Al Madina",   lat: 33.6210, lng: -7.1185, beds: 6, baths: 7, sqft: 9200,  lotSize: 1.4, yearBuilt: 2022, imgs: [IMG.villa1, IMG.interior1, IMG.pool1, IMG.villa3],    desc: "An architectural masterpiece with floor-to-ceiling glass framing the Atlas foothills.",      featured: true },
  { title: "Résidence Le Palmier",          type: "house",       listingType: "sale", price: 2_200_000, address: "Bloc B, Résidence Al Firdaous",          city: "Benslimane", neighborhood: "Shems Al Madina",   lat: 33.6195, lng: -7.1210, beds: 4, baths: 5, sqft: 6100,  lotSize: 0,   yearBuilt: 2019, imgs: [IMG.villa2, IMG.interior2, IMG.villa4],              desc: "Triple-height living space with rooftop terrace and panoramic views of the medina.",          featured: true },
  { title: "Dar Al Yasmine",               type: "house",       listingType: "sale", price: 1_650_000, address: "Rue 14, Hay Al Massira",                 city: "Benslimane", neighborhood: "Hay Al Massira",    lat: 33.6165, lng: -7.1240, beds: 5, baths: 4, sqft: 4800,  lotSize: 0,   yearBuilt: 2018, imgs: [IMG.villa5, IMG.interior3, IMG.villa6],              desc: "A meticulously designed Moroccan-modern residence with private courtyard and fountain.",       featured: true },
  { title: "Villa Les Orangers",            type: "villa",       listingType: "sale", price: 6_200_000, address: "Avenue des FAR, Lot 5",                  city: "Benslimane", neighborhood: "Centre Ville",      lat: 33.6145, lng: -7.1160, beds: 8, baths: 9, sqft: 12400, lotSize: 3.2, yearBuilt: 2021, imgs: [IMG.villa7, IMG.pool1, IMG.villa8],                desc: "An infinity pool meets lush citrus gardens at this palatial estate.",                         featured: true },
  { title: "Appartement Shems View",        type: "house",       listingType: "rent", price: 8_500,     address: "Immeuble C, Shems Al Madina",            city: "Benslimane", neighborhood: "Shems Al Madina",   lat: 33.6220, lng: -7.1195, beds: 3, baths: 3, sqft: 3400,  lotSize: 0,   yearBuilt: 2020, imgs: [IMG.interior1, IMG.villa9, IMG.interior2],           desc: "Modern apartment with panoramic terrace overlooking the olive groves." },
  { title: "Maison Traditionnelle",         type: "house",       listingType: "sale", price: 980_000,   address: "Derb Lalla Khadija, Médina",             city: "Benslimane", neighborhood: "Médina",            lat: 33.6130, lng: -7.1300, beds: 4, baths: 4, sqft: 3800,  lotSize: 0.6, yearBuilt: 1975, imgs: [IMG.villa10, IMG.pool1, IMG.villa11],              desc: "A lovingly restored traditional Moroccan house with zellige tilework and carved cedarwood."   },
  { title: "Villa Jardin d'Éden",           type: "villa",       listingType: "sale", price: 3_500_000, address: "Zone Touristique, Lot 22",               city: "Benslimane", neighborhood: "Zone Touristique",  lat: 33.6250, lng: -7.1130, beds: 7, baths: 8, sqft: 7400,  lotSize: 1.8, yearBuilt: 2023, imgs: [IMG.villa12, IMG.villa3, IMG.interior3],             desc: "Cedar-and-stone compound with chef's kitchen, hammam and heated pool." },
  { title: "Riad Atlas",                    type: "villa",       listingType: "sale", price: 5_100_000, address: "Lot 8, Route de Mohammedia",             city: "Benslimane", neighborhood: "Route Mohammedia",  lat: 33.6180, lng: -7.1100, beds: 6, baths: 7, sqft: 8800,  lotSize: 2.1, yearBuilt: 2020, imgs: [IMG.villa13, IMG.interior1, IMG.villa14],            desc: "Contemporary riad with spa, private garden and panoramic Atlas views." },
  { title: "Maison du Parc",               type: "house",       listingType: "sale", price: 1_900_000, address: "Avenue Hassan II, N° 45",                city: "Benslimane", neighborhood: "Centre Ville",      lat: 33.6155, lng: -7.1190, beds: 5, baths: 4, sqft: 4200,  lotSize: 0.1, yearBuilt: 2017, imgs: [IMG.villa15, IMG.interior2, IMG.villa6],             desc: "White facade townhouse near the municipal park with private garage." },
  { title: "Penthouse Shems Elite",         type: "house",       listingType: "rent", price: 12_000,    address: "Tour A, Complexe Shems",                 city: "Benslimane", neighborhood: "Shems Al Madina",   lat: 33.6205, lng: -7.1220, beds: 4, baths: 5, sqft: 5200,  lotSize: 0,   yearBuilt: 2023, imgs: [IMG.villa16, IMG.interior3, IMG.villa1],             desc: "Top-floor penthouse with wrap-around terrace and smart home automation." },
  { title: "Domaine des Oliviers",          type: "villa",       listingType: "sale", price: 7_800_000, address: "Route Provinciale 3220, Km 4",           city: "Benslimane", neighborhood: "Périphérie",        lat: 33.6280, lng: -7.1050, beds: 7, baths: 6, sqft: 8200,  lotSize: 24,  yearBuilt: 2019, imgs: [IMG.villa17, IMG.villa18, IMG.interior1],            desc: "Working olive estate with restored farmhouse, pool and private well." },
  { title: "Villa Al Baraka",               type: "villa",       listingType: "sale", price: 5_500_000, address: "Quartier Al Baraka, Lot 1",              city: "Benslimane", neighborhood: "Al Baraka",         lat: 33.6170, lng: -7.1265, beds: 8, baths: 10, sqft: 11800, lotSize: 1.6, yearBuilt: 2022, imgs: [IMG.villa2, IMG.pool1, IMG.interior2],              desc: "Gated estate with motor court, cinema room and resort-style grounds.",                         featured: true },
  { title: "Duplex Dar Salam",              type: "house",       listingType: "rent", price: 6_500,     address: "Résidence Dar Salam, Bloc D",            city: "Benslimane", neighborhood: "Hay Salam",         lat: 33.6140, lng: -7.1225, beds: 3, baths: 3, sqft: 2800,  lotSize: 0,   yearBuilt: 2021, imgs: [IMG.interior1, IMG.villa9, IMG.villa3],              desc: "Light-filled duplex with rooftop terrace and mountain views." },
  { title: "Villa Piscine Royale",          type: "villa",       listingType: "rent", price: 18_000,    address: "Lotissement Royal, Allée 3",             city: "Benslimane", neighborhood: "Shems Al Madina",   lat: 33.6232, lng: -7.1175, beds: 5, baths: 5, sqft: 6800,  lotSize: 1.1, yearBuilt: 2023, imgs: [IMG.villa5, IMG.interior3, IMG.villa14],            desc: "Luxury villa with infinity pool, lush gardens and separate guest house." },
  { title: "Résidence Al Amal",             type: "house",       listingType: "sale", price: 1_100_000, address: "Hay Al Amal, Rue 7",                     city: "Benslimane", neighborhood: "Hay Al Amal",       lat: 33.6120, lng: -7.1280, beds: 3, baths: 3, sqft: 3200,  lotSize: 0,   yearBuilt: 2016, imgs: [IMG.interior1, IMG.villa9, IMG.villa3],              desc: "Full-floor residence with tiled courtyard and 3.5m beamed ceilings." },
  { title: "Maison Forêt",                  type: "house",       listingType: "rent", price: 5_000,     address: "Route de la Forêt, N° 12",              city: "Benslimane", neighborhood: "Forêt",             lat: 33.6300, lng: -7.1150, beds: 4, baths: 4, sqft: 4100,  lotSize: 0.9, yearBuilt: 2020, imgs: [IMG.villa11, IMG.interior2, IMG.villa1],            desc: "Eco-lodge style home nestled at the edge of Benslimane forest." },
  { title: "Riad des Artisans",             type: "house",       listingType: "sale", price: 1_400_000, address: "Médina, Kissariat Al Fann",              city: "Benslimane", neighborhood: "Médina",            lat: 33.6135, lng: -7.1315, beds: 6, baths: 6, sqft: 5400,  lotSize: 0.2, yearBuilt: 1960, imgs: [IMG.villa6, IMG.interior3, IMG.villa15],             desc: "Restored artisan riad with three courtyards and rooftop hammam." },
  { title: "Centre Commercial Shems",       type: "commercial",  listingType: "sale", price: 15_000_000, address: "Boulevard Principal, Shems Al Madina",   city: "Benslimane", neighborhood: "Shems Al Madina",   lat: 33.6200, lng: -7.1200, beds: 0, baths: 12, sqft: 84000, lotSize: 0,  yearBuilt: 2022, imgs: [IMG.commercial1, IMG.commercial2],                    desc: "Premium retail complex with anchor tenant space and underground parking." },
  { title: "Bureau Prestige",               type: "commercial",  listingType: "rent", price: 25_000,    address: "Immeuble Al Quods, Av. Hassan II",       city: "Benslimane", neighborhood: "Centre Ville",      lat: 33.6150, lng: -7.1175, beds: 0, baths: 6, sqft: 18500, lotSize: 0,   yearBuilt: 2021, imgs: [IMG.commercial2, IMG.commercial3],                    desc: "Grade A office tower, fully fitted with fiber optics and panoramic conference rooms." },
  { title: "Showroom Boulevard",            type: "commercial",  listingType: "sale", price: 8_500_000, address: "Boulevard Mohammed V, N° 120",           city: "Benslimane", neighborhood: "Centre Ville",      lat: 33.6160, lng: -7.1140, beds: 0, baths: 4, sqft: 12200, lotSize: 0,   yearBuilt: 2019, imgs: [IMG.commercial3, IMG.commercial1],                    desc: "Flagship retail showroom on the main boulevard with double-height glazing." },
  { title: "Terrain Shems Nord",            type: "land",        listingType: "sale", price: 2_800_000, address: "Shems Al Madina, Zone Nord",             city: "Benslimane", neighborhood: "Shems Al Madina",   lat: 33.6260, lng: -7.1165, beds: 0, baths: 0, sqft: 0,     lotSize: 87,  yearBuilt: 0,    imgs: [IMG.land1, IMG.land2],                                  desc: "87 hectares of prime development land with approved masterplan." },
  { title: "Parcelle Forêt",                type: "land",        listingType: "sale", price: 1_200_000, address: "Route Forestière, Km 2",                 city: "Benslimane", neighborhood: "Forêt",             lat: 33.6310, lng: -7.1090, beds: 0, baths: 0, sqft: 0,     lotSize: 142, yearBuilt: 0,    imgs: [IMG.land2, IMG.land3],                                  desc: "142 acres of cork oak forest with two natural springs and meadow." },
  { title: "Terrain Panoramique",           type: "land",        listingType: "sale", price: 1_800_000, address: "Colline Sud, Benslimane",                city: "Benslimane", neighborhood: "Colline Sud",       lat: 33.6080, lng: -7.1250, beds: 0, baths: 0, sqft: 0,     lotSize: 38,  yearBuilt: 0,    imgs: [IMG.land3, IMG.land1],                                  desc: "Buildable hilltop parcel with panoramic views of Benslimane and surrounding plains." },
  { title: "Villa Perle du Sud",            type: "villa",       listingType: "rent", price: 22_000,    address: "Lotissement Perle du Sud, Lot 3",        city: "Benslimane", neighborhood: "Shems Al Madina",   lat: 33.6190, lng: -7.1235, beds: 5, baths: 6, sqft: 5800,  lotSize: 0.8, yearBuilt: 2023, imgs: [IMG.villa8, IMG.pool1, IMG.villa4],                desc: "Whitewashed villa with infinity pool, rooftop lounge and private garden." },
  { title: "Villa Méditerranée",            type: "villa",       listingType: "sale", price: 4_200_000, address: "Quartier Californie, Allée 7",           city: "Benslimane", neighborhood: "Quartier Californie", lat: 33.6175, lng: -7.1120, beds: 5, baths: 5, sqft: 4900, lotSize: 0.7, yearBuilt: 2021, imgs: [IMG.villa12, IMG.pool1, IMG.interior1],              desc: "Mediterranean-inspired villa with arched loggia and heated saltwater pool." },
  { title: "Villa Impériale",               type: "villa",       listingType: "sale", price: 9_500_000, address: "Route Royale, Km 1",                     city: "Benslimane", neighborhood: "Route Royale",      lat: 33.6240, lng: -7.1080, beds: 9, baths: 10, sqft: 14200, lotSize: 4.4, yearBuilt: 2020, imgs: [IMG.villa13, IMG.interior2, IMG.pool1],             desc: "Grand imperial estate on 4.4 acres with private tennis court and staff quarters." },
  { title: "Maison Al Wouroud",             type: "house",       listingType: "sale", price: 1_350_000, address: "Hay Al Wouroud, Rue 22",                 city: "Benslimane", neighborhood: "Hay Al Wouroud",    lat: 33.6108, lng: -7.1200, beds: 5, baths: 4, sqft: 4600,  lotSize: 0.05, yearBuilt: 2018, imgs: [IMG.villa17, IMG.interior3, IMG.villa6],            desc: "Single-family home with limestone facade, garden courtyard and rooftop terrace." },
  { title: "Villa Horizon",                 type: "villa",       listingType: "sale", price: 3_800_000, address: "Colline Est, Lotissement Horizon",       city: "Benslimane", neighborhood: "Colline Est",       lat: 33.6195, lng: -7.1060, beds: 6, baths: 6, sqft: 7800,  lotSize: 0.4, yearBuilt: 2022, imgs: [IMG.villa15, IMG.pool1, IMG.interior1],              desc: "Hilltop villa with unobstructed views, private pool and smart home systems." },
  { title: "Maison Zen",                    type: "house",       listingType: "sale", price: 2_100_000, address: "Quartier Zen, Rue Principale",           city: "Benslimane", neighborhood: "Shems Al Madina",   lat: 33.6225, lng: -7.1250, beds: 4, baths: 3, sqft: 3600,  lotSize: 0.1, yearBuilt: 2023, imgs: [IMG.villa18, IMG.interior2, IMG.villa3],             desc: "Minimalist concrete-and-wood residence by award-winning Moroccan architect." },
];

export const PROPERTIES: Property[] = SPECS.map((s, i) => ({
  id: `p-${(i + 1).toString().padStart(3, "0")}`,
  title: s.title,
  type: s.type,
  listingType: s.listingType,
  price: s.price,
  address: s.address,
  city: s.city,
  neighborhood: s.neighborhood,
  lat: s.lat,
  lng: s.lng,
  beds: s.beds,
  baths: s.baths,
  sqft: s.sqft,
  lotSize: s.lotSize,
  yearBuilt: s.yearBuilt,
  images: s.imgs,
  description: s.desc,
  amenities: pickAmenities(i + 1),
  agent: AGENTS[i % AGENTS.length],
  isFeatured: s.featured,
  walkability: 55 + ((i * 7) % 45),
  schoolRating: 6 + ((i * 3) % 5),
  crimeScore: 1 + ((i * 5) % 4),
}));

export function getProperty(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}

export function similarProperties(p: Property, n = 6): Property[] {
  return PROPERTIES.filter((x) => x.id !== p.id && x.type === p.type)
    .sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price))
    .slice(0, n);
}

export function formatPrice(price: number, listingType: ListingType): string {
  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  return listingType === "rent" ? `${fmt.format(price)}/mo` : fmt.format(price);
}
