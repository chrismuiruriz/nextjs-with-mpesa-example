import { NextResponse } from "next/server"
import { getMpesaAuthToken } from "@/utils/mpesa-auth"

export async function GET() {
  try {
    const token = await getMpesaAuthToken()

    return NextResponse.json({
      success: true,
      token,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to get auth token" }, { status: 500 })
  }
}
