import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const webhookUrl = process.env.WEBHOOK_UPDATE_URL || 'http://100.70.118.53:9099/webhook-update_9router';
    const webhookToken = process.env.WEBHOOK_UPDATE_TOKEN || 'router9-secure-update-key-2026';

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${webhookToken}`
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
