import { Cormorant_Garamond, Manrope, Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

// Georgian glyphs only; browsers download these files only when Georgian text is on the page.
export const georgianSerif = Noto_Serif_Georgian({
  subsets: ["georgian"],
  weight: ["300", "400", "500"],
  variable: "--font-georgian-serif",
  display: "swap",
  preload: false,
});

export const georgianSans = Noto_Sans_Georgian({
  subsets: ["georgian"],
  variable: "--font-georgian-sans",
  display: "swap",
  preload: false,
});

export const fontVariables = [cormorant, manrope, georgianSerif, georgianSans].map((f) => f.variable).join(" ");
