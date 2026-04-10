/**
 * GET / POST / DELETE /api/webhooks
 *
 * Manage webhook targets. Auth required.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  registerTarget,
  listTargets,
  unregisterTarget,
} from '@/lib/webhooks';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

const CreateTargetSchema = z.object({
  url: z.string().url(),
  events: z
    .array(
      z.enum([
        'pipeline.started',
        'pipeline.step.started',
        'pipeline.step.completed',
        'pipeline.completed',
        'pipeline.failed',
        'soic.evaluated',
      ])
    )
    .min(1),
  secret: z.string().min(16).optional(),
});

async function requireAuth() {
  const session = await auth().catch(() => null);
  if (process.env.NEXTAUTH_SECRET && !session?.user?.id) {
    return null;
  }
  return session?.user?.id ?? 'guest';
}

export async function GET() {
  const userId = await requireAuth();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const targets = listTargets().map((t) => ({
    id: t.id,
    url: t.url,
    events: t.events,
    hasSecret: !!t.secret,
    active: t.active,
    createdAt: t.createdAt.toISOString(),
  }));
  return NextResponse.json({ targets });
}

export async function POST(request: NextRequest) {
  const userId = await requireAuth();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const parsed = CreateTargetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_body', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const target = registerTarget({
    url: parsed.data.url,
    events: parsed.data.events,
    secret: parsed.data.secret,
    active: true,
  });
  return NextResponse.json({
    target: {
      id: target.id,
      url: target.url,
      events: target.events,
      hasSecret: !!target.secret,
      active: target.active,
      createdAt: target.createdAt.toISOString(),
    },
  });
}

export async function DELETE(request: NextRequest) {
  const userId = await requireAuth();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'missing_id' }, { status: 400 });
  }
  const removed = unregisterTarget(id);
  return NextResponse.json({ removed });
}
