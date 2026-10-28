import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFoundView";
import { en } from "@/content/dictionaries/en";
import { site } from "@/content/site";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: `${en.notFound.title} · ${site.name}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <NotFoundView dict={en.notFound} home="/" />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
