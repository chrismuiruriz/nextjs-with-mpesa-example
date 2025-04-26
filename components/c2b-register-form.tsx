"use client"

import type React from "react"

import { useState } from "react"

export default function C2BRegisterForm() {
  const [validationUrl, setValidationUrl] = useState("")
  const [confirmationUrl, setConfirmationUrl] = useState("")
  const [responseType, setResponseType] = useState("Completed")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/mpesa/c2b/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ValidationURL: validationUrl,
          ConfirmationURL: confirmationUrl,
          ResponseType: responseType,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to register URLs")
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
              <h3 className="font-medium text-green-800 mb-2">URLs Registered Successfully!</h3>
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
            <p className="text-sm text-green-700">Your validation and confirmation URLs have been registered.</p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium mb-2">Response Details</h3>
            <pre className="text-xs overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
          </div>

          <button onClick={handleReset} className="btn btn-secondary">
            Register Different URLs
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="validationUrl" className="form-label">
              Validation URL
            </label>
            <input
              id="validationUrl"
              type="url"
              className="form-input"
              placeholder="https://example.com/api/validation"
              value={validationUrl}
              onChange={(e) => setValidationUrl(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be a publicly accessible HTTPS URL</p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmationUrl" className="form-label">
              Confirmation URL
            </label>
            <input
              id="confirmationUrl"
              type="url"
              className="form-input"
              placeholder="https://example.com/api/confirmation"
              value={confirmationUrl}
              onChange={(e) => setConfirmationUrl(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be a publicly accessible HTTPS URL</p>
          </div>

          <div className="form-group">
            <label htmlFor="responseType" className="form-label">
              Response Type
            </label>
            <select
              id="responseType"
              className="form-input"
              value={responseType}
              onChange={(e) => setResponseType(e.target.value)}
            >
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

          <button type="submit" className="form-submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register URLs"}
          </button>
        </form>
      )}
    </div>
  )
}
