export default function DocsPage() {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            This example demonstrates integration with Safaricom's M-Pesa payment API (Daraja) using Next.js. The
            example covers the most common API integrations:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>STK Push (Lipa Na M-Pesa Online)</li>
            <li>C2B (Customer to Business)</li>
            <li>B2C (Business to Customer)</li>
            <li>Transaction Status Query</li>
            <li>Account Balance Query</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Environment Setup</h2>
          <p className="mb-4">
            To use this example, you need to set up your environment variables in a <code>.env.local</code> file:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mb-4">
            {`MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=your_shortcode
MPESA_INITIATOR_NAME=your_initiator_name
MPESA_INITIATOR_PASSWORD=your_initiator_password
MPESA_B2C_SHORTCODE=your_b2c_shortcode
MPESA_ENVIRONMENT=sandbox # or production
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000`}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>

          <h3 className="text-xl font-medium mb-2">Authentication</h3>
          <p className="mb-4">
            <code>POST /api/mpesa/auth</code> - Generates OAuth token for M-Pesa API access
          </p>

          <h3 className="text-xl font-medium mb-2">STK Push</h3>
          <p className="mb-4">
            <code>POST /api/mpesa/stkpush</code> - Initiates an STK push request
          </p>

          <h3 className="text-xl font-medium mb-2">C2B</h3>
          <p className="mb-4">
            <code>POST /api/mpesa/c2b/register</code> - Registers C2B callback URLs
            <br />
            <code>POST /api/mpesa/c2b/simulate</code> - Simulates a C2B transaction (sandbox only)
          </p>

          <h3 className="text-xl font-medium mb-2">B2C</h3>
          <p className="mb-4">
            <code>POST /api/mpesa/b2c</code> - Sends money from business to customer
          </p>

          <h3 className="text-xl font-medium mb-2">Other APIs</h3>
          <p className="mb-4">
            <code>POST /api/mpesa/transaction-status</code> - Checks status of a transaction
            <br />
            <code>POST /api/mpesa/account-balance</code> - Queries account balance
          </p>
        </section>
      </div>
    </div>
  )
}
