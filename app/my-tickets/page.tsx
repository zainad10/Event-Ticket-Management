"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ticket, Calendar, MapPin, Download, LogOut, ShoppingBag } from "lucide-react"
import { ETicketPreview } from "@/components/e-ticket-preview"

interface PurchasedTicket {
  id: string
  event: any
  seats: any[]
  subtotal: number
  discount: number
  total: number
  purchaseDate: string
}

export default function MyTicketsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [tickets, setTickets] = useState<PurchasedTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<PurchasedTicket | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    const purchasedTickets = JSON.parse(localStorage.getItem("purchasedTickets") || "[]")
    setTickets(purchasedTickets)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getRowLabel = (row: number) => String.fromCharCode(65 + row)

  const openTicketPreview = (ticket: PurchasedTicket) => {
    setSelectedTicket(ticket)
    setShowPreview(true)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm opacity-30"
          style={{
            backgroundImage: `url(/placeholder.svg?height=1080&width=1920&query=abstract+concert+stage+lights+bokeh+dark+blue+ambient+lighting+soft+glow)`,
          }}
        />
        {/* Dark blackish + deep bluish gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-blue-950/90 to-slate-950/95" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">EventFlow</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/events">
              <Button variant="ghost">Browse Events</Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              My Tickets
            </h1>
            <p className="text-gray-400">View and download your purchased tickets</p>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-3xl">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-950/50 to-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/10">
                <ShoppingBag className="h-10 w-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No tickets yet</h3>
              <p className="text-gray-400 mb-6">{"You haven't purchased any tickets. Start exploring events!"}</p>
              <Link href="/events">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                  Browse Events
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/10 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <div className="p-6 space-y-6">
                    {/* Event Info */}
                    <div className="flex items-start gap-6">
                      <div className="h-24 w-24 rounded-xl bg-slate-950/50 border border-cyan-500/20 overflow-hidden flex-shrink-0 shadow-inner">
                        <img
                          src={ticket.event.image || "/placeholder.svg"}
                          alt={ticket.event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-medium capitalize mb-2 shadow-sm shadow-cyan-500/20">
                            {ticket.event.category}
                          </div>
                          <h3 className="text-xl font-bold text-white">{ticket.event.name}</h3>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Calendar className="h-4 w-4 text-cyan-400" />
                            <span>
                              {new Date(ticket.event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              • {ticket.event.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <MapPin className="h-4 w-4 text-cyan-400" />
                            <span>{ticket.event.venue}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="border-t border-cyan-500/20 pt-6 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-cyan-300">Your Seats</p>
                          <div className="flex flex-wrap gap-2">
                            {ticket.seats.map((seat: any, index: number) => (
                              <div
                                key={index}
                                className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-sm font-medium text-white shadow-sm shadow-cyan-500/10"
                              >
                                {getRowLabel(seat.row)}
                                {seat.column + 1}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-cyan-300">Booking Details</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-gray-300">
                              <span className="text-gray-400">Booking ID:</span>
                              <span className="font-mono">{ticket.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span className="text-gray-400">Tickets:</span>
                              <span>{ticket.seats.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Total Paid:</span>
                              <span className="font-bold text-cyan-400">${ticket.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          onClick={() => openTicketPreview(ticket)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download E-Ticket
                        </Button>
                        <Link href={`/events/${ticket.event.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full bg-slate-900/50 border-cyan-500/30 hover:bg-slate-800/50 hover:border-cyan-400/50"
                          >
                            View Event Details
                          </Button>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-cyan-500/20">
                        <p className="text-xs text-gray-400">
                          Purchased on {new Date(ticket.purchaseDate).toLocaleDateString()} at{" "}
                          {new Date(ticket.purchaseDate).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Ticket Perforation */}
                  <div className="h-px bg-cyan-500/20 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-slate-950 -translate-x-1/2 border border-cyan-500/30" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-slate-950 translate-x-1/2 border border-cyan-500/30" />
                  </div>

                  {/* Bottom Bar */}
                  <div className="px-6 py-3 bg-slate-900/70 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-cyan-300">Valid Ticket</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">#{ticket.id.slice(0, 12)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTicket && (
        <ETicketPreview
          open={showPreview}
          onOpenChange={setShowPreview}
          ticket={selectedTicket}
          userName={user?.name || "Guest"}
          getRowLabel={getRowLabel}
        />
      )}
    </div>
  )
}
