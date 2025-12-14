"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Ticket, Calendar, LogOut, User, Flame, MapPin, Clock } from "lucide-react"
import { getTrendingEvent } from "@/lib/mock-data"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [trendingEvent, setTrendingEvent] = useState(getTrendingEvent())

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div className="fixed inset-0 w-full h-full -z-10">
        {trendingEvent ? (
          <>
            <Image
              src={trendingEvent.image || "/placeholder.svg"}
              alt={trendingEvent.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/75 via-zinc-950/85 to-blue-950/95" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-zinc-950 to-blue-900">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-20 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        )}
      </div>

      <nav className="relative z-50 border-b border-blue-500/10 bg-blue-950/40 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">EventFlow</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/events">
              <Button variant="ghost">Browse Events</Button>
            </Link>
            <Link href="/my-tickets">
              <Button variant="ghost">My Tickets</Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {trendingEvent && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative bg-blue-950/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full">
                        <Flame className="h-4 w-4 text-orange-400" />
                        <span className="text-sm font-bold text-orange-300">
                          {trendingEvent.isTrending ? "Trending" : "Most Booked"}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-balance text-white">{trendingEvent.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(trendingEvent.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>{trendingEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{trendingEvent.venue}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/events/${trendingEvent.id}`}>
                    <Button className="shadow-lg shadow-blue-500/20">Book Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-950/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}!</h1>
                <p className="text-gray-300">Ready to discover your next event?</p>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center backdrop-blur-sm">
                <User className="h-7 w-7 text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-950/60 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 space-y-4 shadow-xl shadow-blue-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 hover:border-cyan-400/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center backdrop-blur-sm">
                  <Calendar className="h-6 w-6 text-cyan-400" />
                </div>
                <span className="text-4xl font-bold text-white">12</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-300">Available Events</p>
                <p className="text-xs text-gray-400">Explore upcoming events</p>
              </div>
            </div>

            <div className="bg-blue-950/60 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 space-y-4 shadow-xl shadow-blue-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 hover:border-cyan-400/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center backdrop-blur-sm">
                  <Ticket className="h-6 w-6 text-cyan-400" />
                </div>
                <span className="text-4xl font-bold text-white">3</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-300">Tickets Purchased</p>
                <p className="text-xs text-gray-400">View your bookings</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/events">
                <div className="bg-blue-950/60 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:border-cyan-400/50 hover:bg-blue-950/70 transition-all cursor-pointer group shadow-lg shadow-blue-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center group-hover:from-blue-600/50 group-hover:to-cyan-500/30 transition-all backdrop-blur-sm">
                      <Calendar className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Browse Events</h3>
                      <p className="text-sm text-gray-300">Find your next experience</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/my-tickets">
                <div className="bg-blue-950/60 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:border-cyan-400/50 hover:bg-blue-950/70 transition-all cursor-pointer group shadow-lg shadow-blue-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-600">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center group-hover:from-blue-600/50 group-hover:to-cyan-500/30 transition-all backdrop-blur-sm">
                      <Ticket className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">My Tickets</h3>
                      <p className="text-sm text-gray-300">View your bookings</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
