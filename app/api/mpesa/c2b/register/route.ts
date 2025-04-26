import { type NextRequest, NextResponse } from "next/server"
import { getMpesaAuthToken } from "@/utils/mpesa-auth"

export async function POST(req: NextRequest) {
  try {
    // Get validation and confirmation URLs from request body or use defaults
    const body = await req.json()
    const baseUrl = req.nextUrl.origin

    const validationUrl = body.ValidationURL || `${baseUrl}/api/mpesa/callbacks/validation`
    const confirmationUrl = body.ConfirmationURL || `${baseUrl}/api/mpesa/callbacks/confirmation`
    const responseType = body.ResponseType || "Completed"

    // Get shortcode from environment
    const shortcode = process.env.MPESA_SHORTCODE

    if (!shortcode) {
      return NextResponse.json({ success: false, message: "Missing M-Pesa shortcode configuration" }, { status: 500 })
    }

    // Get access token
    const accessToken = await getMpesaAuthToken()

    // Prepare API endpoint (sandbox or production)
    const apiUrl =
      process.env.MPESA_ENVIRONMENT === "production"
        ? "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl"
        : "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"

    // Make C2B URL registration request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ShortCode: shortcode,
        ResponseType: responseType,
        ConfirmationURL: confirmationUrl,
        ValidationURL: validationUrl,
      }),
    })

    const responseData = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: responseData,
        urls: {
          validation: validationUrl,
          confirmation: confirmationUrl,
        },
      })
    } else {
      console.error("M-Pesa C2B Register URL Error:", responseData)
      return NextResponse.json(
        { success: false, message: responseData.errorMessage || "URL registration failed", details: responseData },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("C2B Register URL Error:", error)
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 })
  }
}
