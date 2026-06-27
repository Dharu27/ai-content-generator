import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing email or password" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Login failed",
      },
      { status: 500 }
    );
  }
}
