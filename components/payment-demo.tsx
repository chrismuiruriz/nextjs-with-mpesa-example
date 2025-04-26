"use client"

import type React from "react"

import { useState } from "react"
import { formatCurrency } from "@/utils/format"

export function PaymentDemo() {
  const [amount, setAmount] = useState<number>(1)
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          phoneNumber,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      setResponse(data)
    } catch (err: any) {
      setError(err.message || "Failed to process payment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto card">
      <h2 className="text-xl font-bold mb-4">Try M-Pesa Payment</h2>

      {response ? (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-green-800 mb-2">Payment Initiated Successfully!</h3>
            <button onClick={() => setResponse(null)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
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
            Check your phone for the STK push prompt. Once completed, the payment will be processed.
          </p>
          <div className="mt-4">
            <button onClick={() => setResponse(null)} className="btn btn-secondary text-sm">
              Make Another Payment
            </button>
          </div>
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
            <div className="relative">
              <input
                id="amount"
                type="number"
                min="1"
                max="70000"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(Number.parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

          <button type="submit" className="form-submit" disabled={isLoading}>
            {isLoading ? "Processing..." : `Pay ${formatCurrency(amount, "KES")}`}
          </button>

          <p className="text-xs text-center text-gray-500">
            This is a demo. In sandbox mode, no actual charges will be made.
          </p>
        </form>
      )}
    </div>
  )
}
