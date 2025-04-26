import B2CForm from "@/components/b2c-form"

export default function B2CPage() {
  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Business to Customer (B2C)</h1>
      <p className="mb-6">
        The B2C API enables merchants to send money to their customers. This API supports salary payments, business
        payments, and promotion payments.
      </p>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Send Money</h2>
        <B2CForm />
      </div>
    </div>
  )
}
