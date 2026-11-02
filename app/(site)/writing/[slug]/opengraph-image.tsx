import { ImageResponse } from "next/og";
import { getPost, getPosts } from "@/lib/content";
import { CurveSlice, og, ogFonts } from "@/lib/og";
import { siteUrl } from "@/lib/site";

// The LinkedIn preview for an essay: night ground, a slice of the curve field on the right, the
// essay's number and title, and its first key figure on a glass chip.
export const size = og.size;
export const contentType = "image/png";
export const alt = "Essay by Padraig Middleton";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  const figure = post.keyFigures?.[0];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: og.night,
        backgroundImage: `radial-gradient(60% 60% at 75% 0%, rgba(45, 91, 227, 0.22), transparent 70%)`,
        color: og.nightText,
        fontFamily: "Schibsted Grotesk",
      }}
    >
      <div style={{ position: "absolute", right: 0, top: 30, display: "flex" }}>
        <CurveSlice width={580} height={580} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px 56px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
          <div style={{ fontSize: 26, fontWeight: 500, color: og.nightMuted }}>
            {`No. ${post.number}`}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {post.title}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {figure && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: 540,
                padding: "20px 28px",
                borderRadius: 8,
                backgroundColor: og.glassBg,
                border: `1px solid ${og.glassBorder}`,
              }}
            >
              <div
                style={{ flexShrink: 0, fontSize: 44, fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                {figure.figure}
              </div>
              <div
                style={{
                  marginLeft: 24,
                  fontSize: 22,
                  fontWeight: 500,
                  lineHeight: 1.35,
                  color: og.nightMuted,
                }}
              >
                {figure.label}
              </div>
            </div>
          )}
          <div style={{ fontSize: 22, fontWeight: 500, color: og.nightMuted }}>
            {new URL(siteUrl).host}
          </div>
        </div>
      </div>
    </div>,
    { ...size, fonts: ogFonts() },
  );
}
