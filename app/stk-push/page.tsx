import StkPushForm from "@/components/stk-push-form"

export default function StkPushPage() {
  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">STK Push</h1>
      <p className="mb-6">
        Lipa Na M-Pesa Online (STK Push) allows customers to make payments through a prompt on their phone, which
        requires them to enter their M-Pesa PIN to authorize the payment.
      </p>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Test STK Push</h2>
        <StkPushForm />
      </div>
    </div>
  )
}
