"use client"

import type React from "react"

import { useState } from "react"
import { formatCurrency } from "@/utils/format"

export default function B2CForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState(10)
  const [remarks, setRemarks] = useState("Payment from Next.js M-Pesa example")
  const [commandID, setCommandID] = useState("BusinessPayment")
  const [occassion, setOccassion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/mpesa/b2c", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PhoneNumber: phoneNumber,
          Amount: amount,
          Remarks: remarks,
          CommandID: commandID,
          Occassion: occassion,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to process B2C payment")
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
            <h3 className="font-medium text-green-800 mb-2">Payment Initiated!</h3>
            <p className="text-sm text-green-700">
              A B2C payment request has been initiated. The recipient will receive {formatCurrency(amount, "KES")}{" "}
              shortly.
            </p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium mb-2">Response Details</h3>
            <pre className="text-xs overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
          </div>

          <button onClick={handleReset} className="btn btn-secondary">
            Send Another Payment
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
              min="10"
              max="70000"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="commandID" className="form-label">
              Payment Type
            </label>
            <select
              id="commandID"
              className="form-input"
              value={commandID}
              onChange={(e) => setCommandID(e.target.value)}
            >
              <option value="BusinessPayment">Business Payment</option>
              <option value="SalaryPayment">Salary Payment</option>
              <option value="PromotionPayment">Promotion Payment</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="remarks" className="form-label">
              Remarks
            </label>
            <input
              id="remarks"
              type="text"
              className="form-input"
              placeholder="Payment description"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="occassion" className="form-label">
              Occassion (Optional)
            </label>
            <input
              id="occassion"
              type="text"
              className="form-input"
              placeholder="e.g., Christmas Bonus"
              value={occassion}
              onChange={(e) => setOccassion(e.target.value)}
            />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

          <button type="submit" className="form-submit" disabled={isLoading}>
            {isLoading ? "Processing..." : `Send ${formatCurrency(amount, "KES")}`}
          </button>
        </form>
      )}
    </div>
  )
}
