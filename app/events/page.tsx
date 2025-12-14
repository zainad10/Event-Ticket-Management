"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, MapPin, Users, Filter } from "lucide-react"
import { mockEvents, type Event } from "@/lib/mock-data"
import { Navbar } from "@/components/navbar"

export default function EventsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    let filtered = mockEvents

    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredEvents(filtered)
  }, [searchQuery, selectedCategory])

  const categories = [
    { id: "all", label: "All Events" },
    { id: "concert", label: "Concerts" },
    { id: "conference", label: "Conferences" },
    { id: "comedy", label: "Comedy" },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="relative border-b border-blue-500/20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/summer-music-festival-concert-stage.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/95 via-zinc-950/90 to-zinc-950" />
        </div>

        {/* Header Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">Discover Events</h1>
            <p className="text-xl text-gray-300">Browse through our collection of amazing events</p>

            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-blue-950/40 backdrop-blur-md border-blue-500/30 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-blue-500/10 bg-zinc-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-full bg-blue-950/30 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No events found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="group bg-blue-950/30 border border-blue-500/20 rounded-xl overflow-hidden backdrop-blur-sm hover:border-cyan-400/50 hover:bg-blue-950/50 transition-all duration-300 h-full">
                  <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="px-3 py-1 rounded-full bg-blue-950/80 backdrop-blur-sm border border-blue-400/30 text-xs font-medium capitalize text-cyan-300">
                        {event.category}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {event.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{event.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          • {event.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span>{event.venue}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-4 w-4 text-cyan-400" />
                        <span>{event.availableSeats} seats available</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-blue-500/20">
                      <span className="text-lg font-bold text-cyan-400">{event.priceRange}</span>
                      <Button size="sm" className="group-hover:bg-cyan-500 transition-colors">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
