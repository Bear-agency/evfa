import { NextResponse } from "next/server";

const ONE_BY_ONE_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Zz7kAAAAASUVORK5CYII=",
  "base64"
);

export async function GET() {
  return new NextResponse(ONE_BY_ONE_PNG, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
