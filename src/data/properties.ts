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

const SPECS: Spec[] = [
  { title: "Cliffside Glass Pavilion", type: "villa", listingType: "sale", price: 18750000, address: "1428 Pacific Ridge", city: "Malibu", neighborhood: "Point Dume", lat: 34.0089, lng: -118.8067, beds: 6, baths: 7, sqft: 9200, lotSize: 1.4, yearBuilt: 2022, imgs: [IMG.villa1, IMG.interior1, IMG.pool1, IMG.villa3], desc: "An architectural masterpiece carved into the bluff with floor-to-ceiling glass framing the Pacific.", featured: true },
  { title: "The Onyx Penthouse", type: "house", listingType: "sale", price: 12400000, address: "57 West 57th Street, PH", city: "New York", neighborhood: "Billionaires' Row", lat: 40.7647, lng: -73.9777, beds: 4, baths: 5, sqft: 6100, lotSize: 0, yearBuilt: 2019, imgs: [IMG.villa2, IMG.interior2, IMG.villa4], desc: "Triple-height great room above Central Park, private rooftop terrace and 360° skyline views.", featured: true },
  { title: "Maison Saint-Germain", type: "house", listingType: "sale", price: 9800000, address: "12 Rue de Verneuil", city: "Paris", neighborhood: "Saint-Germain", lat: 48.8576, lng: 2.3296, beds: 5, baths: 4, sqft: 4800, lotSize: 0, yearBuilt: 1872, imgs: [IMG.villa5, IMG.interior3, IMG.villa6], desc: "A meticulously restored Haussmannian hôtel particulier with private courtyard.", featured: true },
  { title: "Villa Aurora", type: "villa", listingType: "sale", price: 24500000, address: "Strada Provinciale 9", city: "Portofino", neighborhood: "Cala dell'Oro", lat: 44.3036, lng: 9.2079, beds: 8, baths: 9, sqft: 12400, lotSize: 3.2, yearBuilt: 2018, imgs: [IMG.villa7, IMG.pool1, IMG.villa8], desc: "An infinity pool meets the Ligurian Sea at this Riviera estate.", featured: true },
  { title: "The Atelier Loft", type: "house", listingType: "rent", price: 18500, address: "84 Mercer Street", city: "New York", neighborhood: "SoHo", lat: 40.7237, lng: -74.0021, beds: 3, baths: 3, sqft: 3400, lotSize: 0, yearBuilt: 1898, imgs: [IMG.interior1, IMG.villa9, IMG.interior2], desc: "Cast-iron loft with original tin ceilings, restored by Studio Mellone." },
  { title: "Palm Springs Modernist", type: "house", listingType: "sale", price: 4200000, address: "915 Vista Chino", city: "Palm Springs", neighborhood: "Old Las Palmas", lat: 33.8303, lng: -116.5453, beds: 4, baths: 4, sqft: 3800, lotSize: 0.6, yearBuilt: 1962, imgs: [IMG.villa10, IMG.pool1, IMG.villa11], desc: "A pedigreed Donald Wexler restoration with original terrazzo and breeze blocks." },
  { title: "Hamptons Beach House", type: "house", listingType: "sale", price: 8900000, address: "27 Further Lane", city: "East Hampton", neighborhood: "Further Lane", lat: 40.9498, lng: -72.1612, beds: 7, baths: 8, sqft: 7400, lotSize: 1.8, yearBuilt: 2015, imgs: [IMG.villa12, IMG.villa3, IMG.interior3], desc: "Cedar-shake compound steps from the dunes with chef's kitchen and pool house." },
  { title: "Aspen Mountain Lodge", type: "villa", listingType: "sale", price: 16200000, address: "1110 Red Mountain Rd", city: "Aspen", neighborhood: "Red Mountain", lat: 39.2009, lng: -106.8175, beds: 6, baths: 7, sqft: 8800, lotSize: 2.1, yearBuilt: 2020, imgs: [IMG.villa13, IMG.interior1, IMG.villa14], desc: "Ski-in ski-out timber and stone retreat with spa and private gondola." },
  { title: "Notting Hill Townhouse", type: "house", listingType: "sale", price: 11200000, address: "23 Lansdowne Crescent", city: "London", neighborhood: "Notting Hill", lat: 51.5104, lng: -0.2049, beds: 5, baths: 4, sqft: 4200, lotSize: 0.1, yearBuilt: 1855, imgs: [IMG.villa15, IMG.interior2, IMG.villa6], desc: "White stucco facade, private mews garage and access to Lansdowne Gardens." },
  { title: "The Sky Residences", type: "house", listingType: "rent", price: 32000, address: "Marina Bay Tower 3", city: "Singapore", neighborhood: "Marina Bay", lat: 1.2834, lng: 103.8607, beds: 4, baths: 5, sqft: 5200, lotSize: 0, yearBuilt: 2021, imgs: [IMG.villa16, IMG.interior3, IMG.villa1], desc: "Curated by André Fu, on the 64th floor with infinity pool and private lift lobby." },
  { title: "Tuscan Vineyard Estate", type: "villa", listingType: "sale", price: 7400000, address: "Strada di Montalcino 14", city: "Montalcino", neighborhood: "Val d'Orcia", lat: 43.0573, lng: 11.4894, beds: 7, baths: 6, sqft: 8200, lotSize: 24, yearBuilt: 1780, imgs: [IMG.villa17, IMG.villa18, IMG.interior1], desc: "Working Brunello vineyard with restored stone farmhouse and infinity pool." },
  { title: "Beverly Hills Compound", type: "villa", listingType: "sale", price: 21500000, address: "1011 Summit Drive", city: "Beverly Hills", neighborhood: "BHPO", lat: 34.0982, lng: -118.4256, beds: 8, baths: 10, sqft: 11800, lotSize: 1.6, yearBuilt: 2017, imgs: [IMG.villa2, IMG.pool1, IMG.interior2], desc: "Gated estate with motor court, screening room and resort-style grounds.", featured: true },
  { title: "Ibiza Sunset Villa", type: "villa", listingType: "rent", price: 48000, address: "Cap Negret 22", city: "Ibiza", neighborhood: "San Antonio", lat: 38.9784, lng: 1.3071, beds: 6, baths: 6, sqft: 6500, lotSize: 1.2, yearBuilt: 2019, imgs: [IMG.villa4, IMG.pool1, IMG.villa10], desc: "West-facing whitewashed villa with chef's kitchen and DJ booth." },
  { title: "Lake Como Boathouse", type: "villa", listingType: "sale", price: 13800000, address: "Via Regina 88", city: "Como", neighborhood: "Bellagio", lat: 45.9866, lng: 9.2625, beds: 5, baths: 5, sqft: 6800, lotSize: 1.1, yearBuilt: 1924, imgs: [IMG.villa5, IMG.interior3, IMG.villa14], desc: "Liberty-era villa with private boathouse and lakefront infinity pool." },
  { title: "Tribeca Loft", type: "house", listingType: "sale", price: 6700000, address: "415 Greenwich Street", city: "New York", neighborhood: "Tribeca", lat: 40.7196, lng: -74.0094, beds: 3, baths: 3, sqft: 3200, lotSize: 0, yearBuilt: 1920, imgs: [IMG.interior1, IMG.villa9, IMG.villa3], desc: "Full-floor loft with private keyed elevator and 12' beamed ceilings." },
  { title: "Costa Rica Treehouse", type: "villa", listingType: "rent", price: 14000, address: "Playa Hermosa 9", city: "Santa Teresa", neighborhood: "Playa Hermosa", lat: 9.6435, lng: -85.1641, beds: 4, baths: 4, sqft: 4100, lotSize: 0.9, yearBuilt: 2022, imgs: [IMG.villa11, IMG.interior2, IMG.villa1], desc: "Teak and glass canopy villa with private surf path and outdoor showers." },
  { title: "Marrakech Riad", type: "house", listingType: "sale", price: 3400000, address: "Derb Lalla Azouna", city: "Marrakech", neighborhood: "Medina", lat: 31.6320, lng: -7.9890, beds: 6, baths: 6, sqft: 5400, lotSize: 0.2, yearBuilt: 1890, imgs: [IMG.villa6, IMG.interior3, IMG.villa15], desc: "Restored 19th-century riad with three courtyards and rooftop hammam." },
  { title: "Manhattan Office Tower", type: "commercial", listingType: "sale", price: 87000000, address: "640 Fifth Avenue", city: "New York", neighborhood: "Midtown", lat: 40.7589, lng: -73.9776, beds: 0, baths: 12, sqft: 84000, lotSize: 0, yearBuilt: 1998, imgs: [IMG.commercial1, IMG.commercial2], desc: "Class A trophy asset with marquee Fifth Avenue retail frontage." },
  { title: "Mayfair Boutique HQ", type: "commercial", listingType: "rent", price: 145000, address: "12 Berkeley Square", city: "London", neighborhood: "Mayfair", lat: 51.5099, lng: -0.1452, beds: 0, baths: 6, sqft: 18500, lotSize: 0, yearBuilt: 1936, imgs: [IMG.commercial2, IMG.commercial3], desc: "Grade II listed corner building, fully refurbished as boutique HQ." },
  { title: "Miami Design District Retail", type: "commercial", listingType: "sale", price: 24500000, address: "140 NE 39th Street", city: "Miami", neighborhood: "Design District", lat: 25.8136, lng: -80.1928, beds: 0, baths: 4, sqft: 12200, lotSize: 0, yearBuilt: 2014, imgs: [IMG.commercial3, IMG.commercial1], desc: "Flagship retail box neighboring Hermès, Cartier and Dior." },
  { title: "Big Sur Coastal Land", type: "land", listingType: "sale", price: 8900000, address: "Highway 1, MM 38", city: "Big Sur", neighborhood: "Coastal", lat: 36.2704, lng: -121.8081, beds: 0, baths: 0, sqft: 0, lotSize: 87, yearBuilt: 0, imgs: [IMG.land1, IMG.land2], desc: "87 oceanfront acres with approved building envelope." },
  { title: "Hudson Valley Estate Land", type: "land", listingType: "sale", price: 2400000, address: "County Route 9", city: "Rhinebeck", neighborhood: "Hudson Valley", lat: 41.9270, lng: -73.9123, beds: 0, baths: 0, sqft: 0, lotSize: 142, yearBuilt: 0, imgs: [IMG.land2, IMG.land3], desc: "142 acres of mature hardwood forest with two ponds and meadow." },
  { title: "Kauai Cliffside Parcel", type: "land", listingType: "sale", price: 5600000, address: "Kahili Mountain Rd", city: "Koloa", neighborhood: "South Shore", lat: 21.9078, lng: -159.4625, beds: 0, baths: 0, sqft: 0, lotSize: 38, yearBuilt: 0, imgs: [IMG.land3, IMG.land1], desc: "Buildable cliff parcel with panoramic Pacific views." },
  { title: "St. Barth Beachfront", type: "villa", listingType: "rent", price: 92000, address: "Anse de Grand Cul-de-Sac", city: "Gustavia", neighborhood: "Grand Cul-de-Sac", lat: 17.9039, lng: -62.8113, beds: 5, baths: 6, sqft: 5800, lotSize: 0.8, yearBuilt: 2021, imgs: [IMG.villa8, IMG.pool1, IMG.villa4], desc: "Toes-in-sand villa with infinity pool and private dock." },
  { title: "Mykonos Cycladic Villa", type: "villa", listingType: "sale", price: 6200000, address: "Agios Lazaros", city: "Mykonos", neighborhood: "Psarrou", lat: 37.4054, lng: 25.3290, beds: 5, baths: 5, sqft: 4900, lotSize: 0.7, yearBuilt: 2017, imgs: [IMG.villa12, IMG.pool1, IMG.interior1], desc: "Whitewashed cycladic architecture with infinity pool over the Aegean." },
  { title: "Cap-Ferrat Belle Époque", type: "villa", listingType: "sale", price: 38000000, address: "Avenue Denis Séméria", city: "Saint-Jean-Cap-Ferrat", neighborhood: "Cap-Ferrat", lat: 43.6892, lng: 7.3331, beds: 9, baths: 10, sqft: 14200, lotSize: 4.4, yearBuilt: 1908, imgs: [IMG.villa13, IMG.interior2, IMG.pool1], desc: "Restored Belle Époque grande dame on the tip of Cap-Ferrat." },
  { title: "Brooklyn Brownstone", type: "house", listingType: "sale", price: 5800000, address: "98 Hicks Street", city: "Brooklyn", neighborhood: "Brooklyn Heights", lat: 40.6962, lng: -73.9961, beds: 5, baths: 4, sqft: 4600, lotSize: 0.05, yearBuilt: 1872, imgs: [IMG.villa17, IMG.interior3, IMG.villa6], desc: "Single-family limestone with original parlor floor and garden." },
  { title: "Sydney Harbour House", type: "house", listingType: "sale", price: 19200000, address: "12 Wolseley Road", city: "Sydney", neighborhood: "Point Piper", lat: -33.8728, lng: 151.2625, beds: 6, baths: 6, sqft: 7800, lotSize: 0.4, yearBuilt: 2016, imgs: [IMG.villa15, IMG.pool1, IMG.interior1], desc: "Direct harbour frontage with private jetty and Opera House views." },
  { title: "Cape Town Mountain Villa", type: "villa", listingType: "sale", price: 4900000, address: "12 Nettleton Road", city: "Cape Town", neighborhood: "Clifton", lat: -33.9300, lng: 18.3776, beds: 5, baths: 5, sqft: 6200, lotSize: 0.6, yearBuilt: 2019, imgs: [IMG.villa16, IMG.pool1, IMG.villa9], desc: "Cantilevered villa above Clifton Beach with cliff-edge pool." },
  { title: "Tokyo Minimalist Residence", type: "house", listingType: "sale", price: 7800000, address: "4-12 Aobadai, Meguro", city: "Tokyo", neighborhood: "Daikanyama", lat: 35.6504, lng: 139.6917, beds: 4, baths: 3, sqft: 3600, lotSize: 0.1, yearBuilt: 2020, imgs: [IMG.villa18, IMG.interior2, IMG.villa3], desc: "Concrete-and-cedar residence by SANAA-trained architect." },
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
