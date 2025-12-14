"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ticket, Calendar, MapPin, Sparkles, Zap, Users, Download } from "lucide-react"
import { getTrendingEvent } from "@/lib/mock-data"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const trendingEvent = getTrendingEvent()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-zinc-950">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
          style={{
            backgroundImage: trendingEvent ? `url(${trendingEvent.image})` : "none",
            transform: `scale(${1 + scrollY * 0.0002})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-zinc-950/85 to-blue-950/95" />
      </div>

      <div className="relative z-10">
        <nav className="border-b border-blue-500/10 bg-blue-950/30 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">EventFlow</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </nav>

        <section className="min-h-[90vh] flex items-center justify-center px-4 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-400/30 backdrop-blur-sm text-cyan-300 text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Premium Event Booking Experience</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-balance leading-tight">
              Discover & Book
              <span className="text-cyan-400 block mt-2">Unforgettable Events</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto text-pretty">
              From electrifying concerts to insightful conferences, book your tickets for the best events in town with
              our seamless platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/events">
                <Button size="lg" className="text-lg px-10 h-14">
                  Browse Events
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="text-lg px-10 h-14 bg-transparent">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Explore Event Categories</h2>
              <p className="text-xl text-gray-400">Find the perfect event for every occasion</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="group relative overflow-hidden rounded-2xl bg-blue-950/30 border border-blue-500/20 backdrop-blur-md p-8 hover:border-blue-400/50 hover:bg-blue-950/50 transition-all duration-300">
                <div className="relative z-10 space-y-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center group-hover:from-blue-600/50 group-hover:to-cyan-500/30 transition-colors">
                    <Calendar className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Concerts</h3>
                  <p className="text-gray-400">
                    Live music experiences from top artists and emerging talents across all genres.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-blue-950/30 border border-blue-500/20 backdrop-blur-md p-8 hover:border-cyan-400/50 hover:bg-blue-950/50 transition-all duration-300">
                <div className="relative z-10 space-y-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:from-blue-600/50 group-hover:to-cyan-500/30 transition-colors">
                    <MapPin className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Conferences</h3>
                  <p className="text-gray-400">
                    Professional networking and learning opportunities with industry leaders.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-blue-950/30 border border-blue-500/20 backdrop-blur-md p-8 hover:border-blue-400/50 hover:bg-blue-950/50 transition-all duration-300">
                <div className="relative z-10 space-y-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center group-hover:from-blue-600/50 group-hover:to-cyan-500/30 transition-colors">
                    <Sparkles className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Comedy Shows</h3>
                  <p className="text-gray-400">
                    Stand-up comedy nights featuring hilarious performers and rising comedians.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Why Choose EventFlow?</h2>
              <p className="text-xl text-gray-400">Experience the future of event ticketing</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-500/20 backdrop-blur-md space-y-4 hover:bg-blue-950/50 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold">Interactive Seating</h3>
                <p className="text-sm text-gray-400">Choose your perfect seat with a visual seat map.</p>
              </div>

              <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-500/20 backdrop-blur-md space-y-4 hover:bg-blue-950/50 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold">Instant Booking</h3>
                <p className="text-sm text-gray-400">Secure tickets in seconds.</p>
              </div>

              <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-500/20 backdrop-blur-md space-y-4 hover:bg-blue-950/50 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold">Group Discounts</h3>
                <p className="text-sm text-gray-400">Save up to 10% when booking 5 or more tickets together.</p>
              </div>

              <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-500/20 backdrop-blur-md space-y-4 hover:bg-blue-950/50 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center">
                  <Download className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold">Digital Tickets</h3>
                <p className="text-sm text-gray-400">Instant e-ticket access.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-blue-600/30 via-cyan-500/20 to-blue-600/30 border border-blue-400/30 backdrop-blur-md p-12 md:p-16 text-center space-y-6 shadow-2xl shadow-blue-500/20">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Ready to experience amazing events?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of event-goers who trust EventFlow for their ticketing needs.
            </p>
            <div className="pt-4">
              <Link href="/events">
                <Button size="lg" className="text-lg px-10 h-14">
                  Explore Events Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-blue-500/10 mt-20 bg-blue-950/30 backdrop-blur-md">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Ticket className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">EventFlow</span>
              </div>
              <p className="text-sm text-gray-400">© 2025 EventFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
