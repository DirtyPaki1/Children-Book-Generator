import { ClerkMiddlewareAuth, clerkMiddleware } from '@clerk/nextjs/server';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(35, "86400 s"), // 25 requests per day
  ephemeralCache: new Map(),
  analytics: true,
});

const isAPI = (path: string) => {
  return path.startsWith('/api/') || path.startsWith('/app/api/');
}

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, request: NextRequest) => {
  //Rate limit APIs
  if (isAPI(request.nextUrl.pathname)) {
    const { userId } = auth();
    const { success, limit, reset, remaining } = await ratelimit.limit(`${userId}`);

    const res = success ?
     NextResponse.next()
     : NextResponse.json({ errorMessage: 'Rate limit exceeded. Please try again later.' }, { status: 429 });

    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
      
    if (!success) return res;
    return res;
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};