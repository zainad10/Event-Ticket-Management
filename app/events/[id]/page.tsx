"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ArrowLeft, ShoppingCart } from "lucide-react"
import { mockEvents } from "@/lib/mock-data"
import { Navbar } from "@/components/navbar"

interface Seat {
  row: number
  column: number
  status: "available" | "reserved" | "selected"
  price: number
}

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])

  const event = mockEvents.find((e) => e.id === eventId)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    if (!event) return

    const generatedSeats: Seat[] = []
    for (let row = 0; row < event.rows; row++) {
      for (let col = 0; col < event.columns; col++) {
        const isReserved = Math.random() < 0.2
        const rowMultiplier = 1 + (event.rows - row) * 0.1
        const price = Math.round(event.basePrice * rowMultiplier)

        generatedSeats.push({
          row,
          column: col,
          status: isReserved ? "reserved" : "available",
          price,
        })
      }
    }
    setSeats(generatedSeats)
  }, [event])

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "reserved") return

    const seatIndex = seats.findIndex((s) => s.row === seat.row && s.column === seat.column)

    if (seat.status === "selected") {
      const newSeats = [...seats]
      newSeats[seatIndex] = { ...seat, status: "available" }
      setSeats(newSeats)
      setSelectedSeats(selectedSeats.filter((s) => !(s.row === seat.row && s.column === seat.column)))
    } else {
      const newSeats = [...seats]
      newSeats[seatIndex] = { ...seat, status: "selected" }
      setSeats(newSeats)
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const calculateTotal = () => {
    const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)
    const discount = selectedSeats.length >= 5 ? subtotal * 0.1 : 0
    return { subtotal, discount, total: subtotal - discount }
  }

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return
    if (!user) {
      router.push("/login")
      return
    }

    const bookingData = {
      event,
      seats: selectedSeats,
      ...calculateTotal(),
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("currentBooking", JSON.stringify(bookingData))
    router.push("/checkout")
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { subtotal, discount, total } = calculateTotal()
  const getRowLabel = (row: number) => String.fromCharCode(65 + row)

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${event.image})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/95 via-zinc-950/90 to-zinc-950/95" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Event Details Header */}
        <div className="border-b border-blue-500/20">
          <div className="container mx-auto px-4 py-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>

            <div className="grid md:grid-cols-2 gap-8 mt-4">
              <div>
                <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-blue-500/20 mb-4 backdrop-blur-sm">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-sm font-medium capitalize mb-3">
                    {event.category}
                  </div>
                  <h1 className="text-4xl font-bold mb-3">{event.name}</h1>
                  <p className="text-gray-300">{event.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      • {event.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                    <span>{event.venue}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="h-5 w-5 text-cyan-400" />
                    <span>{event.availableSeats} seats available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Selection */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Seat Map */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Select Your Seats</h2>
                <p className="text-gray-400">Click on available seats to select them</p>
              </div>

              <div className="flex flex-wrap gap-6 p-4 bg-blue-950/40 border border-blue-500/30 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-green-500/20 border border-green-500" />
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-cyan-500 border border-cyan-400" />
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-red-500/20 border border-red-500" />
                  <span className="text-sm">Reserved</span>
                </div>
              </div>

              {/* Stage */}
              <div className="text-center">
                <div className="inline-block px-8 py-3 bg-blue-950/50 border border-cyan-400/30 rounded-lg text-sm font-medium backdrop-blur-sm">
                  STAGE
                </div>
              </div>

              {/* Seat Grid */}
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {Array.from({ length: event.rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-2 mb-2">
                      <div className="w-8 text-center text-sm font-medium text-gray-400">{getRowLabel(rowIndex)}</div>
                      <div className="flex gap-1">
                        {seats
                          .filter((s) => s.row === rowIndex)
                          .map((seat, colIndex) => (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleSeatClick(seat)}
                              disabled={seat.status === "reserved"}
                              className={`
                                h-8 w-8 rounded text-xs font-medium transition-all duration-200
                                ${
                                  seat.status === "available"
                                    ? "bg-green-500/20 border border-green-500 hover:bg-green-500/30 cursor-pointer"
                                    : ""
                                }
                                ${seat.status === "selected" ? "bg-cyan-500 border border-cyan-400 scale-110" : ""}
                                ${
                                  seat.status === "reserved"
                                    ? "bg-red-500/20 border border-red-500 cursor-not-allowed opacity-50"
                                    : ""
                                }
                              `}
                              title={`Row ${getRowLabel(rowIndex)}, Seat ${colIndex + 1} - $${seat.price}`}
                            >
                              {colIndex + 1}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-6 space-y-6 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-bold">Booking Summary</h3>
                  </div>

                  {selectedSeats.length === 0 ? (
                    <p className="text-sm text-gray-400">No seats selected</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Selected Seats ({selectedSeats.length})</p>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {selectedSeats.map((seat, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-400">
                                Row {getRowLabel(seat.row)}, Seat {seat.column + 1}
                              </span>
                              <span className="font-medium">${seat.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-blue-500/20 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="font-medium">${subtotal}</span>
                        </div>

                        {discount > 0 && (
                          <>
                            <div className="flex justify-between text-sm text-green-400">
                              <span>Group Discount (10%)</span>
                              <span>-${discount.toFixed(2)}</span>
                            </div>
                            <div className="p-2 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">
                              You're saving 10% on 5+ tickets!
                            </div>
                          </>
                        )}

                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-blue-500/20">
                          <span>Total</span>
                          <span className="text-cyan-400">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleProceedToCheckout}
                    disabled={selectedSeats.length === 0}
                    className="w-full h-11"
                  >
                    {user ? "Proceed to Checkout" : "Login to Book"}
                  </Button>

                  {selectedSeats.length >= 5 && discount === 0 && (
                    <p className="text-xs text-gray-400 text-center">Select 5+ tickets for a 10% group discount!</p>
                  )}
                </div>

                {/* Pricing Info */}
                <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-6 space-y-3 backdrop-blur-md">
                  <h4 className="font-bold">Pricing Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price Range</span>
                      <span className="font-medium text-cyan-400">{event.priceRange}</span>
                    </div>
                    <p className="text-xs text-gray-400">Prices vary by row. Front rows are more expensive.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
