import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Log the callback for debugging
    console.log("STK Push Callback:", JSON.stringify(body, null, 2))

    // Extract relevant data
    const { Body } = body

    // Check if it's a successful transaction
    if (Body.stkCallback.ResultCode === 0) {
      // Process successful payment
      const callbackData = Body.stkCallback.CallbackMetadata.Item

      // Extract payment details
      const amount = callbackData.find((item: any) => item.Name === "Amount")?.Value
      const mpesaReceiptNumber = callbackData.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value
      const transactionDate = callbackData.find((item: any) => item.Name === "TransactionDate")?.Value
      const phoneNumber = callbackData.find((item: any) => item.Name === "PhoneNumber")?.Value

      // This is where you would store the payment in your database
      // For example: await db.payments.create({ amount, receiptNumber: mpesaReceiptNumber, ... })

      // Return a success response
      return NextResponse.json({ success: true })
    } else {
      // Payment failed
      console.error("STK Push payment failed:", Body.stkCallback.ResultDesc)

      // This is where you would update your payment record with the failure reason

      // Return a success response (to acknowledge receipt of the callback)
      return NextResponse.json({ success: true })
    }
  } catch (error: any) {
    // Log the error
    console.error("Error processing STK Push callback:", error)

    // Always return a success response to M-Pesa
    return NextResponse.json({ success: true })
  }
}
