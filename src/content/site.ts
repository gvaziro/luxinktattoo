function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  name: "LUX INK Tattoo Studio",
  shortName: "LUX INK",
  url: resolveSiteUrl().replace(/\/$/, ""),
  phone: "+995 558 669 399",
  phoneE164: "+995558669399",
  whatsapp: "995558669399",
  instagramHandle: "luxinktattoostudio",
  instagram: "https://www.instagram.com/luxinktattoostudio/",
  address: {
    street: "13 Petre Melikishvili St",
    city: "Batumi",
    region: "Adjara",
    country: "GE",
  },
  coordinatesLabel: "41°38′N · 41°38′E",
  mapsQuery: "LUX INK Tattoo Studio, Petre Melikishvili Street 13, Batumi, Georgia",
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const directionsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;

export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  "Petre Melikishvili Street 13, Batumi, Georgia",
)}&z=17&output=embed`;
