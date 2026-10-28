import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPost, hasBlog } from "@/content/blog";

export const alt = "LUX INK Tattoo Studio — Journal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/@fontsource/cormorant-garamond/files");

/** Article share image: headline over the brand background. */
export default async function PostOpengraphImage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const post = hasBlog(lang) ? getPost(lang, slug) : undefined;
  const title = post?.title ?? "LUX INK Journal";
  const category = post?.category ?? "Journal";

  const [latin, cyrillic, latinMedium, cyrillicMedium] = await Promise.all([
    readFile(join(fontDir, "cormorant-garamond-latin-400-normal.woff")),
    readFile(join(fontDir, "cormorant-garamond-cyrillic-400-normal.woff")),
    readFile(join(fontDir, "cormorant-garamond-latin-600-normal.woff")),
    readFile(join(fontDir, "cormorant-garamond-cyrillic-600-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "radial-gradient(70% 90% at 100% 100%, rgba(200,22,29,0.28), #0a0908 65%)",
          color: "#ece5d8",
          fontFamily: "CormorantLatin, CormorantCyrillic",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: 6 }}>LUX INK</span>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: 10, color: "#918a7e", marginTop: 8 }}>
              TATTOO STUDIO · BATUMI
            </span>
          </div>
          <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: 4, color: "#c8161d", textTransform: "uppercase" }}>
            {category}
          </span>
        </div>

        <div style={{ display: "flex", fontSize: title.length > 60 ? 64 : 76, fontWeight: 400, lineHeight: 1.05, maxWidth: 1000 }}>
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 24, fontWeight: 600, color: "#918a7e" }}>
          <div style={{ width: 64, height: 2, background: "#c8161d", display: "flex" }} />
          luxinktattoostudio · +995 558 669 399
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "CormorantLatin", data: latin, weight: 400, style: "normal" },
        { name: "CormorantCyrillic", data: cyrillic, weight: 400, style: "normal" },
        { name: "CormorantLatin", data: latinMedium, weight: 600, style: "normal" },
        { name: "CormorantCyrillic", data: cyrillicMedium, weight: 600, style: "normal" },
      ],
    },
  );
}
