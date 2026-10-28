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
  /** The studio's Google Business Profile listing ("Lux Ink Tattoo Studio" on Google Maps). */
  googleMaps: {
    cid: "14017873251736338653",
    featureId: "0x4067870029c18805:0xc2897d73dc31c0dd",
    name: "Lux Ink Tattoo Studio",
    lat: 41.6493493,
    lng: 41.6292517,
  },
  coordinatesLabel: "41°38′58″N · 41°37′45″E",
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/** Opens the studio's own place card (reviews, photos, hours), not just a pin on the address. */
export const mapsPlaceLink = `https://www.google.com/maps?cid=${site.googleMaps.cid}`;

export const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${site.googleMaps.name}, Batumi`,
)}`;

/**
 * Embed of the studio's place card, as produced by Google Maps "Share → Embed a map",
 * with the interface language switched to the page language.
 */
export function mapEmbedSrc(lang: string) {
  const { featureId, name, lat, lng } = site.googleMaps;
  const pb = [
    "!1m18!1m12!1m3!1d2981.295858107166",
    `!2d${lng}!3d${lat}`,
    "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2",
    `!1s${encodeURIComponent(featureId)}!2s${encodeURIComponent(name)}`,
    `!5e0!3m2!1s${lang}!2sge!4v1793214931490!5m2!1s${lang}!2sge`,
  ].join("");
  return `https://www.google.com/maps/embed?pb=${pb}`;
}
