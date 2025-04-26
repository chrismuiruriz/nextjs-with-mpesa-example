import Link from "next/link"
import { PaymentDemo } from "@/components/payment-demo"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-12 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm">
        <nav className="flex justify-between">
          <Link href="/" className="font-bold">
            Next.js M-Pesa Integration
          </Link>
          <div className="flex gap-4">
            <Link href="/docs" className="hover:underline">
              Documentation
            </Link>
            <Link href="https://github.com/chrismuiruriz/nextjs-with-mpesa-example" className="hover:underline">
              Source Code
            </Link>
          </div>
        </nav>
      </div>

      <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-8 py-8">
        <h1 className="text-4xl font-bold text-center">Next.js M-Pesa Integration</h1>
        <p className="text-center text-xl">
          A production-ready example of integrating M-Pesa payment processing with Next.js
        </p>
        <div className="w-full">
          <PaymentDemo />
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <Link
          href="/stk-push"
          className="group rounded-lg border border-gray-300 px-5 py-4 m-2 hover:border-gray-700 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            STK Push{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">Initiate STK push payments directly to customer phones.</p>
        </Link>

        <Link
          href="/c2b"
          className="group rounded-lg border border-gray-300 px-5 py-4 m-2 hover:border-gray-700 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            C2B{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">
            Handle Customer to Business payments and payment confirmations.
          </p>
        </Link>

        <Link
          href="/b2c"
          className="group rounded-lg border border-gray-300 px-5 py-4 m-2 hover:border-gray-700 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            B2C{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-70">
            Send money from your business to customers or suppliers.
          </p>
        </Link>
      </div>
    </main>
  )
}
