import { NextRequest, NextResponse } from "next/server";

/**
 * Preview password gate.
 *
 * Locks the whole site behind HTTP Basic Auth so only people with the
 * shared credentials can view the deployed preview. The credentials are
 * read from environment variables set on the host (Vercel), NOT committed
 * to the repo:
 *   - PREVIEW_PASSWORD  (required to enable the gate)
 *   - PREVIEW_USER      (optional; defaults to "shenatech")
 *
 * If PREVIEW_PASSWORD is not set (e.g. local development), the gate is
 * disabled and the site is served normally — so this never interferes
 * with `npm run dev` or local previews.
 */
export function middleware(req: NextRequest) {
  const expectedPassword = process.env.PREVIEW_PASSWORD;

  // No password configured → gate disabled (local dev).
  if (!expectedPassword) return NextResponse.next();

  const expectedUser = process.env.PREVIEW_USER || "shenatech";
  const header = req.headers.get("authorization");

  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const sep = decoded.indexOf(":");
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      if (user === expectedUser && pass === expectedPassword) {
        return NextResponse.next();
      }
    } catch {
      /* malformed header → fall through to the 401 challenge */
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Shenatech preview"' },
  });
}

export const config = {
  // Gate every route except Next.js internals + the icons.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png|icon.png).*)"],
};
