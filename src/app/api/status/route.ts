import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}
