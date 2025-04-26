import { type NextRequest, NextResponse } from "next/server"
import { getMpesaAuthToken } from "@/utils/mpesa-auth"
import { generateSecurityCredential } from "@/utils/mpesa"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { TransactionID, Identifier = "MSISDN", IdentifierType = "1", Remarks = "Transaction status query" } = body

    if (!TransactionID) {
      return NextResponse.json({ success: false, message: "Transaction ID is required" }, { status: 400 })
    }

    // Get environment variables
    const shortcode = process.env.MPESA_SHORTCODE
    const initiatorName = process.env.MPESA_INITIATOR_NAME
    const initiatorPassword = process.env.MPESA_INITIATOR_PASSWORD
    const callbackUrl = process.env.MPESA_STATUS_CALLBACK_URL || `${req.nextUrl.origin}/api/mpesa/callbacks/status`
    const timeoutUrl =
      process.env.MPESA_STATUS_TIMEOUT_URL || `${req.nextUrl.origin}/api/mpesa/callbacks/status-timeout`

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

    // Make transaction status request
    const response = await fetch(`${baseUrl}/mpesa/transactionstatus/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Initiator: initiatorName,
        SecurityCredential: securityCredential,
        CommandID: "TransactionStatusQuery",
        TransactionID: TransactionID,
        PartyA: shortcode,
        IdentifierType: IdentifierType,
        ResultURL: callbackUrl,
        QueueTimeOutURL: timeoutUrl,
        Remarks: Remarks,
        Occasion: "",
      }),
    })

    const responseData = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: responseData,
      })
    } else {
      console.error("M-Pesa Transaction Status Error:", responseData)
      return NextResponse.json(
        {
          success: false,
          message: responseData.errorMessage || "Transaction status query failed",
          details: responseData,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Transaction Status Error:", error)
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}
