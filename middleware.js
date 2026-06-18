export default function middleware(request) {
  const url = new URL(request.url);

  if (url.hostname.endsWith('.vercel.app')) {
    const target = new URL(url.pathname + url.search, 'https://www.neumaticosnorte.com.ar');
    return Response.redirect(target.href, 308);
  }
}

export const config = {
  matcher: '/(.*)',
};
