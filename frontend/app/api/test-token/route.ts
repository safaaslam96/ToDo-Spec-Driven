import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json();

    if (!user_id || typeof user_id !== "string") {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const secret = process.env.BETTER_AUTH_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "BETTER_AUTH_SECRET not configured" },
        { status: 500 }
      );
    }

    // Generate JWT token matching backend expectations
    const token = await new jose.SignJWT({ sub: user_id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(secret));

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
