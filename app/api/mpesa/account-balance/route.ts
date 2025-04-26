import { type NextRequest, NextResponse } from "next/server"
import { getMpesaAuthToken } from "@/utils/mpesa-auth"
import { generateSecurityCredential } from "@/utils/mpesa"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { Remarks = "Account balance query", IdentifierType = "4" } = body

    // Get environment variables
    const shortcode = process.env.MPESA_SHORTCODE
    const initiatorName = process.env.MPESA_INITIATOR_NAME
    const initiatorPassword = process.env.MPESA_INITIATOR_PASSWORD
    const callbackUrl = process.env.MPESA_BALANCE_CALLBACK_URL || `${req.nextUrl.origin}/api/mpesa/callbacks/balance`
    const timeoutUrl =
      process.env.MPESA_BALANCE_TIMEOUT_URL || `${req.nextUrl.origin}/api/mpesa/callbacks/balance-timeout`

    if (!shortcode || !initiatorName || !initiatorPassword) {
      return NextResponse.json({ success: false, message: "Missing required configuration" }, { status: 500 })
    }

    // Generate security credential
    const securityCredential = await generateSecurityCredential(initiatorPassword)

    // Get access token
    const accessToken = await getMpesaAuthToken()

    // Prepare API endpoint (sandbox or production)
    const baseUrl =
      process.env.MPESA_ENVIRONMENT === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"

    // Make account balance request
    const response = await fetch(`${baseUrl}/mpesa/accountbalance/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Initiator: initiatorName,
        SecurityCredential: securityCredential,
        CommandID: "AccountBalance",
        PartyA: shortcode,
        IdentifierType: IdentifierType,
        Remarks: Remarks,
        QueueTimeOutURL: timeoutUrl,
        ResultURL: callbackUrl,
      }),
    })

    const responseData = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: responseData,
      })
    } else {
      console.error("M-Pesa Account Balance Error:", responseData)
      return NextResponse.json(
        { success: false, message: responseData.errorMessage || "Account balance query failed", details: responseData },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Account Balance Error:", error)
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}
