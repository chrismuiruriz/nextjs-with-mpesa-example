/**
 * Generates a timestamp in the format required by M-Pesa API
 * Format: YYYYMMDDHHmmss
 */
export function getTimestamp(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

/**
 * Generates a password for STK Push
 * Format: Shortcode + Passkey + Timestamp
 */
export function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  const password = shortcode + passkey + timestamp
  return Buffer.from(password).toString("base64")
}

/**
 * Generates a security credential for B2C and other APIs
 * Uses an initiator password
 */
export async function generateSecurityCredential(initiatorPassword: string): Promise<string> {
  // In sandbox, we can use plain text password
  if (process.env.MPESA_ENVIRONMENT !== "production") {
    return Buffer.from(initiatorPassword).toString("base64")
  }

  // In production, we need to encrypt with the M-Pesa certificate
  try {
    // Note: In a real implementation, you would fetch the Safaricom certificate and encrypt the password
    // This is a placeholder for the actual implementation
    // For production, you would use the public certificate from Safaricom

    // For demo purposes, we'll just use base64 encoding
    // In a real application, you would use the public key to encrypt:
    // const encryptedPassword = crypto.publicEncrypt(
    //   {
    //     key: safaricomCertificate,
    //     padding: crypto.constants.RSA_PKCS1_PADDING,
    //   },
    //   Buffer.from(initiatorPassword)
    // )

    return Buffer.from(initiatorPassword).toString("base64")
  } catch (error) {
    console.error("Failed to generate security credential:", error)
    throw error
  }
}
