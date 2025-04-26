import { type NextRequest, NextResponse } from "next/server"
import { getTimestamp, generatePassword } from "@/utils/mpesa"
import { getMpesaAuthToken } from "@/utils/mpesa-auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phoneNumber, amount, accountReference = "Test", transactionDesc = "Payment" } = body

    // Validate input
    if (!phoneNumber || !amount) {
      return NextResponse.json({ success: false, message: "Phone number and amount are required" }, { status: 400 })
    }

    // Get environment variables
    const shortcode = process.env.MPESA_SHORTCODE
    const passkey = process.env.MPESA_PASSKEY
    const callbackUrl = process.env.MPESA_CALLBACK_URL || `${req.nextUrl.origin}/api/mpesa/callbacks/stkpush`

    if (!shortcode || !passkey) {
      return NextResponse.json({ success: false, message: "Missing required configuration" }, { status: 500 })
    }

    // Generate timestamp and password
    const timestamp = getTimestamp()
    const password = generatePassword(shortcode, passkey, timestamp)

    // Get access token
    const accessToken = await getMpesaAuthToken()

    // Prepare API endpoint (sandbox or production)
    const baseUrl =
      process.env.MPESA_ENVIRONMENT === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"

    // Make STK Push request to M-Pesa API
    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      }),
    })

    const responseData = await response.json()

    if (response.ok) {
      return NextResponse.json(responseData)
    } else {
      console.error("M-Pesa API Error:", responseData)
      return NextResponse.json(
        { success: false, message: responseData.errorMessage || "STK Push failed", details: responseData },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("STK Push Error:", error)
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}
