import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "L'Usine RH — Consultante en ressources humaines";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #5a7a64 0%, #3d5a45 50%, #2d4433 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 700, color: "#fff", letterSpacing: "-2px" }}>
            L&apos;Usine RH
          </div>
          <div style={{ fontSize: 28, color: "#d4c5a0", fontWeight: 400 }}>
            Consultante en ressources humaines
          </div>
          <div
            style={{
              marginTop: "24px",
              width: "80px",
              height: "4px",
              background: "linear-gradient(90deg, #c4724e, #d4a85c)",
              borderRadius: "2px",
            }}
          />
          <div style={{ fontSize: 20, color: "#c9d4cb", marginTop: "8px" }}>
            emiliepoirierrh.ca
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
