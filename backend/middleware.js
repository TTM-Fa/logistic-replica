export const config = {
  matcher: ['/((?!api/|_next/|login\\.html|favicon\\.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.svg|.*\\.woff2?|.*\\.ico|.*\\.json).*)'],
};

export default function middleware(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)_auth_token=([^;]*)/);
  const token = match ? match[1] : '';

  if (token && token === process.env.AUTH_SECRET) {
    return;
  }

  return Response.redirect(new URL('/login.html', request.url).toString(), 302);
}
