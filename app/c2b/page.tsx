import C2BRegisterForm from "@/components/c2b-register-form"
import C2BSimulateForm from "@/components/c2b-simulate-form"

export default function C2BPage() {
  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Customer to Business (C2B)</h1>
      <p className="mb-6">
        The C2B API enables merchants to receive payments from customers directly. This API allows for integration with
        paybill and till numbers.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Register C2B URLs</h2>
          <p className="text-sm mb-4">
            Register your confirmation and validation URLs to receive payment notifications.
          </p>
          <C2BRegisterForm />
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Simulate C2B Payment</h2>
          <p className="text-sm mb-4">Test C2B payments using the sandbox environment.</p>
          <C2BSimulateForm />
        </div>
      </div>
    </div>
  )
}
