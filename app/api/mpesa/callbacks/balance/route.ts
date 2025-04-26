import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Log the balance callback for debugging
    console.log("Account Balance Callback:", JSON.stringify(body, null, 2))

    // Extract the Result parameter containing the balance details
    const { Result } = body

    if (Result) {
      // Extract relevant balance details
      const {
        ResultType,
        ResultCode,
        ResultDesc,
        OriginatorConversationID,
        ConversationID,
        TransactionID,
        ResultParameters,
      } = Result

      if (ResultParameters && ResultParameters.ResultParameter) {
        // Extract the balance details from ResultParameters
        const resultParams = ResultParameters.ResultParameter.reduce((acc: any, curr: any) => {
          acc[curr.Key] = curr.Value
          return acc
        }, {})

        // This is where you would update your database with the account balance
        // For example:
        // await db.accountBalances.create({
        //   conversationId: ConversationID,
        //   transactionId: TransactionID,
        //   resultCode: ResultCode,
        //   resultDesc: ResultDesc,
        //   ...resultParams,
        //   timestamp: new Date()
        // })
      }
    }

    // Always return a success response
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Balance received" })
  } catch (error: any) {
    // Log the error
    console.error("Error processing account balance callback:", error)

    // Always return a success response
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Balance received" })
  }
}
