import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = "LUX INK Tattoo Studio — Batumi, Georgia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/@fontsource/cormorant-garamond/files");

export default async function OpengraphImage() {
  const [statue, light, regular, italic] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/brand/statue.jpg")),
    readFile(join(fontDir, "cormorant-garamond-latin-300-normal.woff")),
    readFile(join(fontDir, "cormorant-garamond-latin-500-normal.woff")),
    readFile(join(fontDir, "cormorant-garamond-latin-400-italic.woff")),
  ]);
  const statueSrc = `data:image/jpeg;base64,${statue.toString("base64")}`;
  const ink = "#0a0908";
  const bone = "#ece5d8";
  const ash = "#918a7e";
  const blood = "#c8161d";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(60% 80% at 50% 100%, rgba(200,22,29,0.22), ${ink} 70%)`,
          color: bone,
          fontFamily: "Cormorant",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 540,
            height: 540,
            borderRadius: 9999,
            overflow: "hidden",
            display: "flex",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={statueSrc} width={540} height={834} style={{ objectFit: "cover", marginTop: -90 }} alt="" />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 540,
              height: 540,
              background: "radial-gradient(circle at 50% 40%, rgba(10,9,8,0.3), rgba(10,9,8,0.8) 75%)",
              display: "flex",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          <div style={{ fontSize: 210, fontWeight: 300, lineHeight: 0.82, letterSpacing: 8, textShadow: "0 0 30px rgba(236,229,216,0.35)" }}>
            LUX
          </div>
          <div style={{ fontSize: 210, fontWeight: 300, lineHeight: 0.82, letterSpacing: 8, textShadow: "0 0 30px rgba(236,229,216,0.35)" }}>
            INK
          </div>
          <div style={{ marginTop: 28, fontSize: 30, fontWeight: 500, letterSpacing: 16 }}>TATTOO STUDIO</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 56,
            top: 52,
            display: "flex",
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 6,
            color: ash,
          }}
        >
          <span style={{ color: bone }}>BATUMI</span>
          <span style={{ color: blood, margin: "0 14px" }}>—</span>
          GEORGIA
        </div>
        <div style={{ position: "absolute", right: 56, top: 52, fontSize: 24, fontWeight: 500, letterSpacing: 4, color: ash }}>
          {site.coordinatesLabel}
        </div>
        <div
          style={{
            position: "absolute",
            left: 56,
            bottom: 50,
            fontSize: 30,
            fontWeight: 400,
            fontStyle: "italic",
            color: ash,
            display: "flex",
          }}
        >
          Custom designs · 5+ years of experience
        </div>
        <div style={{ position: "absolute", right: 56, bottom: 50, fontSize: 28, fontWeight: 500, letterSpacing: 2, color: bone }}>
          {site.phone}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: light, weight: 300, style: "normal" },
        { name: "Cormorant", data: regular, weight: 500, style: "normal" },
        { name: "Cormorant", data: italic, weight: 400, style: "italic" },
      ],
    },
  );
}
