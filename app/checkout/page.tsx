"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, CheckCircle, ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("currentBooking")
    if (!data) {
      router.push("/events")
      return
    }
    setBookingData(JSON.parse(data))
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      const existingTickets = JSON.parse(localStorage.getItem("purchasedTickets") || "[]")
      const newTicket = {
        id: Date.now().toString(),
        ...bookingData,
        purchaseDate: new Date().toISOString(),
      }
      localStorage.setItem("purchasedTickets", JSON.stringify([...existingTickets, newTicket]))
      localStorage.removeItem("currentBooking")

      setIsProcessing(false)
      setIsComplete(true)

      setTimeout(() => {
        router.push("/my-tickets")
      }, 2000)
    }, 2000)
  }

  if (!bookingData) return null

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">Your tickets have been booked successfully.</p>
          </div>
          <p className="text-sm text-muted-foreground">Redirecting to your tickets...</p>
        </div>
      </div>
    )
  }

  const getRowLabel = (row: number) => String.fromCharCode(65 + row)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Link
            href={`/events/${bookingData.event.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your booking</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4 card-glow">
            <h2 className="text-lg font-bold">Order Summary</h2>

            <div className="space-y-3">
              <div>
                <p className="font-medium">{bookingData.event.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(bookingData.event.date).toLocaleDateString()} • {bookingData.event.time}
                </p>
                <p className="text-sm text-muted-foreground">{bookingData.event.venue}</p>
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <p className="text-sm font-medium">Seats ({bookingData.seats.length})</p>
                <div className="flex flex-wrap gap-2">
                  {bookingData.seats.map((seat: any, index: number) => (
                    <div key={index} className="px-3 py-1 bg-muted rounded text-sm">
                      {getRowLabel(seat.row)}
                      {seat.column + 1}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${bookingData.subtotal}</span>
                </div>
                {bookingData.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Group Discount</span>
                    <span>-${bookingData.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${bookingData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6 card-glow">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <h2 className="text-lg font-bold">Payment Details</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input id="cardName" placeholder="John Doe" required className="h-11 bg-input" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" required className="h-11 bg-input" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required className="h-11 bg-input" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" required className="h-11 bg-input" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 btn-gradient" disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Pay $${bookingData.total.toFixed(2)}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              This is a demo checkout. No real payment will be processed.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
