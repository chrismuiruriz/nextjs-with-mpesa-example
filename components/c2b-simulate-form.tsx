"use client"

import type React from "react"

import { useState } from "react"

export default function C2BSimulateForm() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [amount, setAmount] = useState(10)
  const [billRefNumber, setBillRefNumber] = useState("")
  const [commandID, setCommandID] = useState("CustomerPayBillOnline")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/mpesa/c2b/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PhoneNumber: phoneNumber,
          Amount: amount,
          BillRefNumber: billRefNumber,
          CommandID: commandID,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to simulate payment")
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
            <h3 className="font-medium text-green-800 mb-2">Payment Simulated!</h3>
            <p className="text-sm text-green-700">A C2B payment has been simulated successfully.</p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium mb-2">Response Details</h3>
            <pre className="text-xs overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
          </div>

          <button onClick={handleReset} className="btn btn-secondary">
            Simulate Another Payment
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
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="billRefNumber" className="form-label">
              Bill Reference Number
            </label>
            <input
              id="billRefNumber"
              type="text"
              className="form-input"
              placeholder="Invoice123"
              value={billRefNumber}
              onChange={(e) => setBillRefNumber(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Optional for PayBill, required for BuyGoods</p>
          </div>

          <div className="form-group">
            <label htmlFor="commandID" className="form-label">
              Command ID
            </label>
            <select
              id="commandID"
              className="form-input"
              value={commandID}
              onChange={(e) => setCommandID(e.target.value)}
            >
              <option value="CustomerPayBillOnline">CustomerPayBillOnline</option>
              <option value="CustomerBuyGoodsOnline">CustomerBuyGoodsOnline</option>
            </select>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

          <button type="submit" className="form-submit" disabled={isLoading}>
            {isLoading ? "Simulating..." : "Simulate Payment"}
          </button>

          <p className="text-xs text-center text-gray-500">Note: C2B simulation only works in sandbox environment.</p>
        </form>
      )}
    </div>
  )
}
