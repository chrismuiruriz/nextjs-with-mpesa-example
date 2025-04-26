import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Log the status callback for debugging
    console.log("Transaction Status Callback:", JSON.stringify(body, null, 2))

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

      if (ResultParameters && ResultParameters.ResultParameter) {
        // Extract the transaction details from ResultParameters
        const resultParams = ResultParameters.ResultParameter.reduce((acc: any, curr: any) => {
          acc[curr.Key] = curr.Value
          return acc
        }, {})

        // This is where you would update your database with the transaction status
        // For example:
        // await db.transactions.update(
        //   { transactionId: TransactionID },
        //   {
        //     status: ResultCode === 0 ? 'completed' : 'failed',
        //     resultDesc: ResultDesc,
        //     ...resultParams
        //   }
        // )
      }
    }

    // Always return a success response
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Status received" })
  } catch (error: any) {
    // Log the error
    console.error("Error processing transaction status callback:", error)

    // Always return a success response
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Status received" })
  }
}
