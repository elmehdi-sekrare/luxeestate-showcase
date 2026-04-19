import { create } from "zustand";

export type Lang = "fr" | "ar" | "en";

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const useLang = create<LangState>((set) => ({
  lang: "fr",
  setLang: (lang) => set({ lang }),
}));

// Translation dictionary
const dict: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { fr: "Accueil", ar: "الرئيسية", en: "Home" },
  "nav.buy": { fr: "Acheter", ar: "شراء", en: "Buy" },
  "nav.rent": { fr: "Louer", ar: "إيجار", en: "Rent" },
  "nav.land": { fr: "Terrain", ar: "أراضي", en: "Land" },
  "nav.mapSearch": { fr: "Carte", ar: "خريطة", en: "Map Search" },
  "nav.contact": { fr: "Contact", ar: "اتصل بنا", en: "Contact" },
  "nav.listProperty": { fr: "Lister votre bien", ar: "أضف عقارك", en: "List your property" },

  // Hero
  "hero.title1": { fr: "Découvrez votre", ar: "اكتشف", en: "Discover your" },
  "hero.title2": { fr: "résidence d'exception", ar: "مسكن أحلامك", en: "dream residence" },

  // Search
  "search.location": { fr: "Localisation", ar: "الموقع", en: "Location" },
  "search.placeholder": { fr: "Ville, quartier…", ar: "مدينة، حي...", en: "City, neighborhood…" },
  "search.type": { fr: "Type de bien", ar: "نوع العقار", en: "Property type" },
  "search.price": { fr: "Budget", ar: "الميزانية", en: "Price range" },
  "search.beds": { fr: "Chambres", ar: "غرف", en: "Beds" },
  "search.allTypes": { fr: "Tous types", ar: "الكل", en: "All Types" },
  "search.anyPrice": { fr: "Tous prix", ar: "أي سعر", en: "Any price" },

  // Sections
  "section.projects": { fr: "Nos Projets", ar: "مشاريعنا", en: "Our Projects" },
  "section.typeBiens": { fr: "Type de Biens", ar: "أنواع العقارات", en: "Property Types" },
  "section.collection": { fr: "La Collection", ar: "المجموعة", en: "The Collection" },
  "section.featured": { fr: "Résidences en vedette", ar: "مساكن مميزة", en: "Featured residences" },
  "section.featuredDesc": {
    fr: "Des propriétés soigneusement sélectionnées représentant le summum du luxe à Benslimane.",
    ar: "عقارات مختارة بعناية تمثل قمة الفخامة في بنسليمان.",
    en: "Handpicked properties that represent the pinnacle of luxury living in Benslimane and beyond.",
  },

  // Contact
  "contact.speak": { fr: "Parler à un conseiller privé", ar: "تحدث مع مستشار خاص", en: "Speak with a private advisor" },
  "contact.service": { fr: "À votre service", ar: "في خدمتكم", en: "At your service" },

  // Property
  "property.about": { fr: "À propos de cette résidence", ar: "حول هذا المسكن", en: "About this residence" },
  "property.gallery": { fr: "Galerie", ar: "معرض الصور", en: "Gallery" },
  "property.closerLook": { fr: "Regard de plus près", ar: "نظرة أقرب", en: "A closer look" },
  "property.amenities": { fr: "Équipements", ar: "المرافق", en: "Amenities" },
  "property.included": { fr: "Ce qui est inclus", ar: "ما يشمل", en: "What's included" },
  "property.neighborhood": { fr: "Le quartier", ar: "الحي", en: "The neighborhood" },
  "property.location": { fr: "Localisation", ar: "الموقع", en: "Location" },
  "property.onMap": { fr: "Sur la carte", ar: "على الخريطة", en: "On the map" },
  "property.similar": { fr: "Vous aimerez aussi", ar: "قد يعجبك أيضاً", en: "You may also love" },
  "property.similarTitle": { fr: "Résidences similaires", ar: "مساكن مشابهة", en: "Similar residences" },
  "property.price": { fr: "Prix", ar: "السعر", en: "Price" },
  "property.bedrooms": { fr: "Chambres", ar: "غرف", en: "Bedrooms" },
  "property.bathrooms": { fr: "Salles de bain", ar: "حمامات", en: "Bathrooms" },
  "property.interior": { fr: "Intérieur", ar: "المساحة", en: "Interior" },
  "property.lot": { fr: "Terrain", ar: "الأرض", en: "Lot" },
  "property.built": { fr: "Construit", ar: "سنة البناء", en: "Built" },
  "property.floorPlan": { fr: "Plan d'étage", ar: "مخطط الطابق", en: "Floor plan" },
  "property.interiorLayout": { fr: "Aménagement intérieur", ar: "التصميم الداخلي", en: "Interior layout" },

  // Neighborhood amenities
  "nearby.school": { fr: "École", ar: "مدرسة", en: "School" },
  "nearby.mosque": { fr: "Mosquée", ar: "مسجد", en: "Mosque" },
  "nearby.park": { fr: "Parc & Jardin", ar: "حديقة", en: "Park & Garden" },
  "nearby.pharmacy": { fr: "Pharmacie", ar: "صيدلية", en: "Pharmacy" },
  "nearby.market": { fr: "Marché", ar: "سوق", en: "Market" },
  "nearby.hospital": { fr: "Hôpital", ar: "مستشفى", en: "Hospital" },

  // Footer
  "footer.rights": { fr: "Tous droits réservés", ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
};

export function t(key: string, lang: Lang): string {
  return dict[key]?.[lang] ?? key;
}
