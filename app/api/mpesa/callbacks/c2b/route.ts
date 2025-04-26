import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Log the C2B notification for debugging
    console.log("C2B Notification:", JSON.stringify(body, null, 2))

    // Extract the transaction details
    const {
      TransactionType,
      TransID,
      TransTime,
      TransAmount,
      BusinessShortCode,
      BillRefNumber,
      InvoiceNumber,
      OrgAccountBalance,
      ThirdPartyTransID,
      MSISDN,
      FirstName,
      MiddleName,
      LastName,
    } = body

    // This is where you would store the payment in your database
    // For example:
    // await db.payments.create({
    //   transactionId: TransID,
    //   amount: TransAmount,
    //   phoneNumber: MSISDN,
    //   customerName: `${FirstName} ${MiddleName} ${LastName}`.trim(),
    //   reference: BillRefNumber || InvoiceNumber,
    //   timestamp: TransTime,
    // })

    // Return a success response
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" })
  } catch (error: any) {
    // Log the error
    console.error("Error processing C2B notification:", error)

    // Even in case of error, return a success response to avoid M-Pesa retries
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" })
  }
}
