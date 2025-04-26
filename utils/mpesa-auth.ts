let tokenCache: { token: string; expiry: number } | null = null

export async function getMpesaAuthToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiry > Date.now()) {
    return tokenCache.token
  }

  // Get consumer key and secret from environment variables
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET

  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa API credentials not configured")
  }

  // Generate authorization header
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")

  // Determine API URL based on environment
  const baseUrl =
    process.env.MPESA_ENVIRONMENT === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"

  try {
    // Make OAuth request
    const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    // Parse response
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.errorMessage || "Failed to get access token")
    }

    // Extract and cache token
    const token = data.access_token
    const expiresIn = data.expires_in || 3600 // Default to 1 hour if not specified

    // Cache the token for slightly less than its expiry time
    tokenCache = {
      token,
      expiry: Date.now() + expiresIn * 1000 - 60000, // Subtract 1 minute to be safe
    }

    return token
  } catch (error) {
    console.error("Failed to get M-Pesa auth token:", error)
    throw error
  }
}
