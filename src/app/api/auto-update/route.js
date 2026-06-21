import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const res = await fetch('http://100.70.118.53:9099/webhook-update_9router', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer router9-secure-update-key-2026`
      }
    });

    if (res.ok) {
      return NextResponse.json({ success: true, message: 'Update triggered in background' });
    } else {
      return NextResponse.json({ success: false, message: 'Webhook failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
