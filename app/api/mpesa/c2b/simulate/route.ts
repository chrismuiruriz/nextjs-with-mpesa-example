import { type NextRequest, NextResponse } from "next/server"
import { getMpesaAuthToken } from "@/utils/mpesa-auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { PhoneNumber, Amount, BillRefNumber, CommandID = "CustomerPayBillOnline" } = body

    // Validation
    if (!PhoneNumber || !Amount) {
      return NextResponse.json({ success: false, message: "Phone number and amount are required" }, { status: 400 })
    }

    // Get shortcode from environment
    const shortcode = process.env.MPESA_SHORTCODE

    if (!shortcode) {
      return NextResponse.json({ success: false, message: "Missing M-Pesa shortcode configuration" }, { status: 500 })
    }

    // Only available in sandbox environment
    if (process.env.MPESA_ENVIRONMENT === "production") {
      return NextResponse.json(
        { success: false, message: "C2B simulation is only available in sandbox environment" },
        { status: 400 },
      )
    }

    // Get access token
    const accessToken = await getMpesaAuthToken()

    // Make C2B simulation request
    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ShortCode: shortcode,
        CommandID: CommandID,
        Amount: Math.round(Amount),
        Msisdn: PhoneNumber,
        BillRefNumber: BillRefNumber || "Test",
      }),
    })

    const responseData = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: responseData,
      })
    } else {
      console.error("M-Pesa C2B Simulate Error:", responseData)
      return NextResponse.json(
        { success: false, message: responseData.errorMessage || "C2B simulation failed", details: responseData },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("C2B Simulate Error:", error)
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}
