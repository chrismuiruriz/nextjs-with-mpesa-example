import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Log the B2C callback for debugging
    console.log("B2C Callback:", JSON.stringify(body, null, 2))

    // Extract the Result parameter containing the transaction details
    const { Result } = body

    if (Result) {
      // Extract relevant transaction details
      const {
        ResultType,
        ResultCode,
        ResultDesc,
        OriginatorConversationID,
        ConversationID,
        TransactionID,
        ResultParameters,
      } = Result

      if (ResultCode === 0) {
        // Transaction was successful

        // Extract the transaction details from ResultParameters
        const resultParams = ResultParameters.ResultParameter.reduce((acc: any, curr: any) => {
          acc[curr.Key] = curr.Value
          return acc
        }, {})

        // This is where you would update your database record
        // For example:
        // await db.b2cTransactions.update(
        //   { originatorConversationID: OriginatorConversationID },
        //   {
        //     status: 'completed',
        //     transactionId: TransactionID,
        //     resultDesc: ResultDesc,
        //     ...resultParams
        //   }
        // )
      } else {
        // Transaction failed
        console.error("B2C transaction failed:", ResultDesc)

        // Update your database with the failure reason
      }
    }

    // Always return a success response
    return NextResponse.json({ success: true })
  } catch (error: any) {
    // Log the error
    console.error("Error processing B2C callback:", error)

    // Always return a success response
    return NextResponse.json({ success: true })
  }
}
