import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  consent: z.literal(true),
  // Honeypot — bots fill hidden fields
  website: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  // Rate limit per IP (3 req / 15 min)
  const ip = getClientIp(request.headers);
  const limit = rateLimit(ip);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: 'rate_limited' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(limit.resetAt),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Honeypot triggered — pretend success to not signal detection
    if (data.website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // TODO: Send email via Resend/SMTP
    void data;

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': String(limit.remaining),
          'X-RateLimit-Reset': String(limit.resetAt),
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
