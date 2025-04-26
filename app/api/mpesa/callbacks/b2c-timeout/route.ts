import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Log the timeout for debugging
    console.log("B2C Timeout:", JSON.stringify(body, null, 2))

    // This is where you would update your database to mark the B2C transaction as timed out
    // For example:
    // await db.b2cTransactions.update(
    //   { conversationId: body.ConversationID },
    //   { status: 'timeout', updatedAt: new Date() }
    // )

    // Always return a success response
    return NextResponse.json({ ResultCode: 0, ResultDesc: "B2C timeout received" })
  } catch (error: any) {
    // Log the error
    console.error("Error processing B2C timeout:", error)

    // Always return a success response
    return NextResponse.json({ ResultCode: 0, ResultDesc: "B2C timeout received" })
  }
}
