import { type NextRequest, NextResponse } from "next/server"
import { getMpesaAuthToken } from "@/utils/mpesa-auth"
import { generateSecurityCredential } from "@/utils/mpesa"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { PhoneNumber, Amount, Remarks, CommandID = "BusinessPayment", Occassion = "" } = body

    // Validation
    if (!PhoneNumber || !Amount || !Remarks) {
      return NextResponse.json(
        { success: false, message: "Phone number, amount, and remarks are required" },
        { status: 400 },
      )
    }

    // Get environment variables
    const shortcode = process.env.MPESA_B2C_SHORTCODE || process.env.MPESA_SHORTCODE
    const initiatorName = process.env.MPESA_INITIATOR_NAME
    const initiatorPassword = process.env.MPESA_INITIATOR_PASSWORD
    const callbackUrl = process.env.MPESA_B2C_CALLBACK_URL || `${req.nextUrl.origin}/api/mpesa/callbacks/b2c`
    const timeoutUrl = process.env.MPESA_B2C_TIMEOUT_URL || `${req.nextUrl.origin}/api/mpesa/callbacks/b2c-timeout`

    if (!shortcode || !initiatorName || !initiatorPassword) {
      return NextResponse.json({ success: false, message: "Missing required configuration for B2C" }, { status: 500 })
    }

    // Generate security credential
    const securityCredential = await generateSecurityCredential(initiatorPassword)

    // Get access token
    const accessToken = await getMpesaAuthToken()

    // Prepare API endpoint (sandbox or production)
    const baseUrl =
      process.env.MPESA_ENVIRONMENT === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"

    // Make B2C request
    const response = await fetch(`${baseUrl}/mpesa/b2c/v1/paymentrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        InitiatorName: initiatorName,
        SecurityCredential: securityCredential,
        CommandID: CommandID,
        Amount: Math.round(Amount),
        PartyA: shortcode,
        PartyB: PhoneNumber,
        Remarks: Remarks,
        QueueTimeOutURL: timeoutUrl,
        ResultURL: callbackUrl,
        Occassion: Occassion,
      }),
    })

    const responseData = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: responseData,
      })
    } else {
      console.error("M-Pesa B2C Error:", responseData)
      return NextResponse.json(
        { success: false, message: responseData.errorMessage || "B2C payment failed", details: responseData },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("B2C Error:", error)
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}
