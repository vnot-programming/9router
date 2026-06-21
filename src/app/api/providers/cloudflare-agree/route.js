import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { accountId, apiKey } = await request.json();

    if (!accountId || !apiKey) {
      return NextResponse.json({ error: "Account ID and API Key are required" }, { status: 400 });
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`;
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: "agree" }),
    });

    const data = await res.json();
    
    // Cloudflare returns success:false but logs the agreement in errors message
    const isSuccess = data?.success || (data?.errors?.[0]?.message?.includes("Thank you for agreeing") ?? false);

    if (isSuccess) {
      return NextResponse.json({ success: true, message: "Agreement accepted successfully" });
    } else {
      return NextResponse.json({ success: false, error: data?.errors?.[0]?.message || "Failed to agree" }, { status: 400 });
    }
  } catch (error) {
    console.error("Cloudflare agreement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
