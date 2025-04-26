"use client"

import type React from "react"

import { useState } from "react"
import { formatCurrency } from "@/utils/format"

export default function StkPushForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState(1)
  const [accountReference, setAccountReference] = useState("NextJS Test")
  const [transactionDesc, setTransactionDesc] = useState("Payment for goods/services")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          amount,
          accountReference,
          transactionDesc,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate STK Push")
      }

      setResponse(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResponse(null)
    setError(null)
  }

  return (
    <div>
      {response ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-green-800 mb-2">STK Push Initiated!</h3>
              <button onClick={handleReset} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-green-700">
              A payment request has been sent to {phoneNumber}. Check your phone for the STK prompt.
            </p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium mb-2">Response Details</h3>
            <pre className="text-xs overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
          </div>

          <button onClick={handleReset} className="btn btn-secondary">
            Send Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              className="form-input"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Format: 254XXXXXXXXX (without + or leading 0)</p>
          </div>

          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount (KSH)
            </label>
            <input
              id="amount"
              type="number"
              min="1"
              max="70000"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountReference" className="form-label">
              Account Reference
            </label>
            <input
              id="accountReference"
              type="text"
              className="form-input"
              placeholder="Order ID or Account Number"
              value={accountReference}
              onChange={(e) => setAccountReference(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="transactionDesc" className="form-label">
              Transaction Description
            </label>
            <input
              id="transactionDesc"
              type="text"
              className="form-input"
              placeholder="Description of the transaction"
              value={transactionDesc}
              onChange={(e) => setTransactionDesc(e.target.value)}
              required
            />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

          <button type="submit" className="form-submit" disabled={isLoading}>
            {isLoading ? "Processing..." : `Initiate Payment of ${formatCurrency(amount, "KES")}`}
          </button>
        </form>
      )}
    </div>
  )
}
