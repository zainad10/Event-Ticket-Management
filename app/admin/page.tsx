"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ticket, Plus, LogOut, Users, Calendar, DollarSign, XCircle } from "lucide-react"
import { mockEvents } from "@/lib/mock-data"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "bookings" | "add-event">("overview")
  const [allBookings, setAllBookings] = useState<any[]>([])
  const [newEvent, setNewEvent] = useState({
    name: "",
    category: "concert" as "concert" | "conference" | "comedy",
    date: "",
    time: "",
    venue: "",
    description: "",
    basePrice: 50,
    rows: 15,
    columns: 12,
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)

    // Load all bookings
    const bookings = JSON.parse(localStorage.getItem("purchasedTickets") || "[]")
    setAllBookings(bookings)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    alert(
      `Event "${newEvent.name}" would be added to the system. In a real application, this would save to a database.`,
    )
    // Reset form
    setNewEvent({
      name: "",
      category: "concert",
      date: "",
      time: "",
      venue: "",
      description: "",
      basePrice: 50,
      rows: 15,
      columns: 12,
    })
  }

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      const updatedBookings = allBookings.filter((b) => b.id !== bookingId)
      localStorage.setItem("purchasedTickets", JSON.stringify(updatedBookings))
      setAllBookings(updatedBookings)
      alert("Booking cancelled successfully")
    }
  }

  const getRowLabel = (row: number) => String.fromCharCode(65 + row)

  const totalRevenue = allBookings.reduce((sum, booking) => sum + booking.total, 0)
  const totalTicketsSold = allBookings.reduce((sum, booking) => sum + booking.seats.length, 0)

  if (!user) return null

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-border bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Ticket className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EventFlow Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin: {user.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage events, bookings, and view analytics</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            {[
              { id: "overview", label: "Overview" },
              { id: "events", label: "Events" },
              { id: "bookings", label: "Bookings" },
              { id: "add-event", label: "Add Event" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 font-medium transition-colors relative ${
                  activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-4xl font-bold">{mockEvents.length}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-xs text-muted-foreground">Active in system</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-accent" />
                    </div>
                    <span className="text-4xl font-bold">{totalTicketsSold}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tickets Sold</p>
                    <p className="text-xs text-muted-foreground">All time sales</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-500" />
                    </div>
                    <span className="text-4xl font-bold">${totalRevenue.toFixed(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-xs text-muted-foreground">All bookings</p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold">Recent Bookings</h3>
                {allBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {allBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{booking.event.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.seats.length} ticket{booking.seats.length > 1 ? "s" : ""} • $
                            {booking.total.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(booking.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">All Events</h2>
                <Button onClick={() => setActiveTab("add-event")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockEvents.map((event) => (
                  <div key={event.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize mb-2">
                          {event.category}
                        </div>
                        <h3 className="font-bold line-clamp-1">{event.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Venue:</span>
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Available:</span>
                          <span>{event.availableSeats} seats</span>
                        </div>
                      </div>

                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">All Bookings</h2>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{allBookings.length} total bookings</span>
                </div>
              </div>

              {allBookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Ticket className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground">Bookings will appear here once customers make purchases</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allBookings.map((booking) => (
                    <div key={booking.id} className="bg-card border border-border rounded-xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                              <img
                                src={booking.event.image || "/placeholder.svg"}
                                alt={booking.event.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 space-y-2">
                              <div>
                                <h3 className="font-bold">{booking.event.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(booking.event.date).toLocaleDateString()} • {booking.event.venue}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <div className="px-2 py-1 bg-muted rounded text-xs">
                                  Booking ID: {booking.id.slice(0, 8)}
                                </div>
                                <div className="px-2 py-1 bg-muted rounded text-xs">
                                  {booking.seats.length} ticket{booking.seats.length > 1 ? "s" : ""}
                                </div>
                                <div className="px-2 py-1 bg-muted rounded text-xs">${booking.total.toFixed(2)}</div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                <span className="text-xs text-muted-foreground">Seats:</span>
                                {booking.seats.map((seat: any, index: number) => (
                                  <span key={index} className="text-xs font-medium">
                                    {getRowLabel(seat.row)}
                                    {seat.column + 1}
                                    {index < booking.seats.length - 1 ? "," : ""}
                                  </span>
                                ))}
                              </div>

                              <p className="text-xs text-muted-foreground">
                                Purchased: {new Date(booking.purchaseDate).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex-shrink-0"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add Event Tab */}
          {activeTab === "add-event" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold">Add New Event</h2>

              <form onSubmit={handleAddEvent} className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Event Name *</Label>
                    <Input
                      id="name"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      placeholder="Summer Music Festival 2025"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                      className="w-full h-11 px-3 rounded-lg bg-input border border-input text-foreground"
                      required
                    >
                      <option value="concert">Concert</option>
                      <option value="conference">Conference</option>
                      <option value="comedy">Comedy</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue *</Label>
                    <Input
                      id="venue"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      placeholder="Central Stadium"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Describe the event..."
                      required
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-input border border-input text-foreground resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price ($) *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      min="1"
                      value={newEvent.basePrice}
                      onChange={(e) => setNewEvent({ ...newEvent, basePrice: Number(e.target.value) })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rows">Number of Rows *</Label>
                    <Input
                      id="rows"
                      type="number"
                      min="1"
                      max="26"
                      value={newEvent.rows}
                      onChange={(e) => setNewEvent({ ...newEvent, rows: Number(e.target.value) })}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="columns">Seats per Row *</Label>
                    <Input
                      id="columns"
                      type="number"
                      min="1"
                      value={newEvent.columns}
                      onChange={(e) => setNewEvent({ ...newEvent, columns: Number(e.target.value) })}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Total Capacity: {newEvent.rows * newEvent.columns} seats
                  </p>
                  <Button type="submit" className="w-full h-11">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
