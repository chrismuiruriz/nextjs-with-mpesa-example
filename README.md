# Next.js M-Pesa (Daraja API) Integration Example

This is a production-ready example of integrating the Safaricom M-Pesa payment system (Daraja API) with a Next.js application. It demonstrates how to implement the most common M-Pesa API endpoints and provides a clean, user-friendly interface for testing and development.

## Features

- **STK Push (Lipa Na M-Pesa Online)** - Initiate payment requests directly to customer phones
- **C2B (Customer to Business)** - Process payments made by customers to your business
- **B2C (Business to Customer)** - Send money from your business to customers
- **Transaction Status** - Check the status of M-Pesa transactions
- **Account Balance** - Query your M-Pesa account balance

## Demo

You can see a live demo of this project at [https://mpesa-nextjs.vercel.app](https://mpesa-nextjs.vercel.app)

## Prerequisites

- Node.js 18.x or later
- M-Pesa Daraja API credentials (get these from the [Safaricom Developer Portal](https://developer.safaricom.co.ke/))

## Getting Started

### Installation

1. Clone this repository:

\`\`\`bash
git clone https://github.com/vercel/next.js.git
cd next.js/examples/with-mpesa
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn
# or
pnpm install
\`\`\`

3. Set up your environment variables:

   - Copy the `.env.example` file to `.env.local`:
   
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   - Edit `.env.local` and add your M-Pesa API credentials:

   \`\`\`
   MPESA_CONSUMER_KEY=your_consumer_key\n
   MPESA_CONSUMER_SECRET=your_consumer_secret

   
   MPESA_PASSKEY=your_passkey
   MPESA_SHORTCODE=your_shortcode
   MPESA_INITIATOR_NAME=your_initiator_name
   MPESA_INITIATOR_PASSWORD=your_initiator_password
   MPESA_B2C_SHORTCODE=your_b2c_shortcode
   MPESA_ENVIRONMENT=sandbox # Change to 'production' when ready
   \`\`\`

4. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

This example requires several environment variables to connect to the M-Pesa API:

| Variable | Description | Required |
|----------|-------------|----------|
| `MPESA_CONSUMER_KEY` | Your M-Pesa API consumer key | Yes |
| `MPESA_CONSUMER_SECRET` | Your M-Pesa API consumer secret | Yes |
| `MPESA_SHORTCODE` | Your M-Pesa shortcode (paybill/till number) | Yes |
| `MPESA_PASSKEY` | Your M-Pesa passkey (for STK Push) | Yes |
| `MPESA_INITIATOR_NAME` | Your M-Pesa initiator name (for B2C) | Yes for B2C |
| `MPESA_INITIATOR_PASSWORD` | Your M-Pesa initiator password (for B2C) | Yes for B2C |
| `MPESA_B2C_SHORTCODE` | Your M-Pesa B2C shortcode (if different) | No |
| `MPESA_ENVIRONMENT` | `sandbox` or `production` | Yes |
| `MPESA_CALLBACK_URL` | URL for STK Push callbacks | No |
| `MPESA_B2C_CALLBACK_URL` | URL for B2C callbacks | No |
| `MPESA_B2C_TIMEOUT_URL` | URL for B2C timeout callbacks | No |
| `MPESA_STATUS_CALLBACK_URL` | URL for transaction status callbacks | No |
| `MPESA_STATUS_TIMEOUT_URL` | URL for transaction status timeout callbacks | No |
| `MPESA_BALANCE_CALLBACK_URL` | URL for balance query callbacks | No |
| `MPESA_BALANCE_TIMEOUT_URL` | URL for balance query timeout callbacks | No |

If callback URLs are not provided, the application will automatically generate them based on your application's domain.

## API Endpoints

The example exposes the following API endpoints:

### Authentication
- `GET /api/mpesa/auth` - Generate OAuth token for API access

### STK Push
- `POST /api/mpesa/stkpush` - Initiate an STK push request to a customer's phone

### C2B
- `POST /api/mpesa/c2b/register` - Register validation and confirmation URLs
- `POST /api/mpesa/c2b/simulate` - Simulate a C2B transaction (sandbox only)

### B2C
- `POST /api/mpesa/b2c` - Send money from business to customer

### Other APIs
- `POST /api/mpesa/transaction-status` - Check status of a transaction
- `POST /api/mpesa/account-balance` - Query account balance

### Callback URLs
- `/api/mpesa/callbacks/stkpush` - Callback for STK push
- `/api/mpesa/callbacks/c2b` - Callback for C2B transactions
- `/api/mpesa/callbacks/b2c` - Callback for B2C transactions

## Usage Examples

### Initiating an STK Push

\`\`\`javascript
const response = await fetch('/api/mpesa/stkpush', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phoneNumber: '254712345678', // Format: 254XXXXXXXXX
    amount: 1,                   // Amount in KES
    accountReference: 'Order123', // Reference for the transaction
    transactionDesc: 'Payment for Order 123', // Description
  }),
});

const result = await response.json();
console.log(result);
\`\`\`

### Simulating a C2B Transaction (Sandbox only)

\`\`\`javascript
const response = await fetch('/api/mpesa/c2b/simulate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    PhoneNumber: '254712345678',
    Amount: 100,
    BillRefNumber: 'Invoice123',
    CommandID: 'CustomerPayBillOnline',
  }),
});

const result = await response.json();
console.log(result);
\`\`\`

### Sending a B2C Payment

\`\`\`javascript
const response = await fetch('/api/mpesa/b2c', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    PhoneNumber: '254712345678',
    Amount: 100,
    Remarks: 'Salary payment',
    CommandID: 'SalaryPayment',
    Occassion: 'May Salary',
  }),
});

const result = await response.json();
console.log(result);
\`\`\`

## Deployment

### Deploying to Vercel

The easiest way to deploy this example is to use [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-mpesa&env=MPESA_CONSUMER_KEY,MPESA_CONSUMER_SECRET,MPESA_SHORTCODE,MPESA_PASSKEY,MPESA_ENVIRONMENT&project-name=mpesa-nextjs&repository-name=mpesa-nextjs)

Make sure to add all the required environment variables during the deployment process.

### Other Deployment Options

For other deployment options, follow the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Production Considerations

### 1. Callback URLs

For production, you'll need publicly accessible URLs for your callbacks. If you're developing locally, consider using a service like [ngrok](https://ngrok.com/) to expose your local server.

### 2. Security

- Store your API credentials securely using environment variables
- For production, use proper encryption for the security credential (B2C APIs)
- Consider implementing rate limiting on your API endpoints
- Validate all input data

### 3. Error Handling

The example includes basic error handling. In production, you might want to:
- Log errors to a monitoring service
- Implement retry mechanisms for failed transactions
- Set up alerts for critical failures

### 4. Database Integration

This example doesn't include database integration. In a production application, you should:
- Store transaction details in a database
- Implement idempotency to prevent duplicate transactions
- Create a proper transaction tracking system

## M-Pesa Testing in Sandbox

### Test Credentials for Sandbox

- **Phone Numbers**: Use standard test numbers like 254708374149
- **STK Push**: Any valid phone number format (254XXXXXXXXX) should work
- **C2B Simulation**: Use specific test phone numbers provided by Safaricom

### Test Shortcuts

- For B2C, use the Sandbox test credentials provided by Safaricom
- For transaction status queries, you can use any valid transaction ID format

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your consumer key and secret are correct
   - Check that you're using the right environment (sandbox vs production)

2. **STK Push Not Working**
   - Ensure the phone number is in the correct format (254XXXXXXXXX)
   - Verify your shortcode and passkey are correct
   - Check that the amount is a positive integer

3. **Callback Not Received**
   - Ensure your callback URLs are publicly accessible
   - Check that your server is properly handling POST requests
   - Verify that your firewall or security settings allow incoming requests

4. **B2C Failures**
   - Verify your initiator name and password
   - Ensure you have sufficient balance in your M-Pesa account
   - Check that the recipient phone number is valid

### Debugging

The example includes console logging for debugging purposes. Check your server logs for detailed error messages and API responses.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Safaricom Daraja API Documentation](https://developer.safaricom.co.ke/Documentation)
- [Next.js Documentation](https://nextjs.org/docs)
