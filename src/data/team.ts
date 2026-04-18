import type { Agent } from "@/data/properties";

export interface TeamAgent extends Agent {
  bio: string;
  yearsExperience: number;
  languages: string[];
  city: string;
  closedVolume: string;
}

export const TEAM: TeamAgent[] = [
  {
    id: "a1",
    name: "Eleanor Whitfield",
    title: "Senior Estate Director",
    phone: "+1 (310) 555-0182",
    whatsapp: "13105550182",
    email: "eleanor@luxestate.com",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop",
    bio: "Eleanor leads our West Coast portfolio with eighteen years representing trophy oceanfront properties from Malibu to Carmel.",
    yearsExperience: 18,
    languages: ["English", "French"],
    city: "Los Angeles",
    closedVolume: "$1.4B",
  },
  {
    id: "a2",
    name: "Marcus Aldridge",
    title: "Private Client Advisor",
    phone: "+1 (212) 555-0144",
    whatsapp: "12125550144",
    email: "marcus@luxestate.com",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&auto=format&fit=crop",
    bio: "Marcus represents discreet acquisitions for institutional and ultra-high-net-worth clients across Manhattan and the Hamptons.",
    yearsExperience: 14,
    languages: ["English", "Mandarin"],
    city: "New York",
    closedVolume: "$2.1B",
  },
  {
    id: "a3",
    name: "Saoirse Lévesque",
    title: "International Properties Lead",
    phone: "+33 1 55 55 0166",
    whatsapp: "33155550166",
    email: "saoirse@luxestate.com",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80&auto=format&fit=crop",
    bio: "Saoirse curates our European collection — historic hôtels particuliers in Paris, Riviera estates and Tuscan vineyards.",
    yearsExperience: 12,
    languages: ["French", "English", "Italian"],
    city: "Paris",
    closedVolume: "$890M",
  },
  {
    id: "a4",
    name: "Hiroshi Tanaka",
    title: "Asia-Pacific Director",
    phone: "+65 6555 0199",
    whatsapp: "6565550199",
    email: "hiroshi@luxestate.com",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop",
    bio: "Hiroshi oversees Singapore, Tokyo, Hong Kong and Sydney — specializing in sky residences and waterfront estates.",
    yearsExperience: 16,
    languages: ["English", "Japanese", "Mandarin"],
    city: "Singapore",
    closedVolume: "$1.2B",
  },
  {
    id: "a5",
    name: "Amara Okonkwo",
    title: "Investment Properties Specialist",
    phone: "+44 20 7555 0177",
    whatsapp: "442075550177",
    email: "amara@luxestate.com",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80&auto=format&fit=crop",
    bio: "Amara structures landmark commercial transactions across London, Dubai and emerging African luxury markets.",
    yearsExperience: 11,
    languages: ["English", "Arabic", "Yoruba"],
    city: "London",
    closedVolume: "$760M",
  },
  {
    id: "a6",
    name: "Sebastián Ferrer",
    title: "Resort & Branded Residences",
    phone: "+34 91 555 0122",
    whatsapp: "34915550122",
    email: "sebastian@luxestate.com",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80&auto=format&fit=crop",
    bio: "Sebastián represents branded residence developments and resort estates across Ibiza, Marbella and the Caribbean.",
    yearsExperience: 9,
    languages: ["Spanish", "English", "Portuguese"],
    city: "Madrid",
    closedVolume: "$540M",
  },
];

export interface Office {
  city: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  hero: string;
  isHeadquarters?: boolean;
}

export const OFFICES: Office[] = [
  {
    city: "New York",
    address: "57 West 57th Street, 38th Floor",
    phone: "+1 (212) 555-0100",
    lat: 40.7647,
    lng: -73.9777,
    hero: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80&auto=format&fit=crop",
    isHeadquarters: true,
  },
  {
    city: "London",
    address: "12 Berkeley Square, Mayfair",
    phone: "+44 20 7555 0100",
    lat: 51.5099,
    lng: -0.1452,
    hero: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80&auto=format&fit=crop",
  },
  {
    city: "Paris",
    address: "12 Place Vendôme, 1er",
    phone: "+33 1 55 55 0100",
    lat: 48.8676,
    lng: 2.3294,
    hero: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80&auto=format&fit=crop",
  },
];
