"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login - in real app, this would call an API
    setTimeout(() => {
      // Mock authentication
      if (email === "admin@eventflow.com") {
        localStorage.setItem("user", JSON.stringify({ email, role: "admin", name: "Admin User" }))
        router.push("/admin")
      } else {
        localStorage.setItem("user", JSON.stringify({ email, role: "user", name: email.split("@")[0] }))
        router.push("/dashboard")
      }
    }, 1000)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 py-12">
          {/* Login Form */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6 card-glow">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-input border-border focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-input border-border focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-base btn-gradient" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </a>
            </div>

            {/* Demo Accounts Hint */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-2">Demo Accounts:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  • <span className="text-primary">admin@eventflow.com</span> (Admin access)
                </p>
                <p>• Any other email (User access)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
