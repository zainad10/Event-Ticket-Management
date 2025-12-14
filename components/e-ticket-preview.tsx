"use client"

import { useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Calendar, MapPin, User, Hash } from "lucide-react"

interface ETicketPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: {
    id: string
    event: any
    seats: any[]
    total: number
    purchaseDate: string
  }
  userName: string
  getRowLabel: (row: number) => string
}

export function ETicketPreview({ open, onOpenChange, ticket, userName, getRowLabel }: ETicketPreviewProps) {
  const ticketRef = useRef<HTMLDivElement>(null)

  const generateQRCode = (text: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
  }

  const downloadTicketAsPDF = async () => {
    const { jsPDF } = await import("jspdf")
    const html2canvas = (await import("html2canvas")).default

    if (!ticketRef.current) return

    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
      backgroundColor: "#0f0f0f",
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = (pdfHeight - imgHeight * ratio) / 2

    pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(`EventFlow-Ticket-${ticket.id.slice(0, 8)}.pdf`)
  }

  const downloadTicketAsImage = async () => {
    const html2canvas = (await import("html2canvas")).default

    if (!ticketRef.current) return

    const canvas = await html2canvas(ticketRef.current, {
      scale: 3,
      backgroundColor: "#0f0f0f",
      logging: false,
    })

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `EventFlow-Ticket-${ticket.id.slice(0, 8)}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-foreground">E-Ticket Preview</DialogTitle>
        </DialogHeader>

        {/* Ticket Design */}
        <div className="space-y-6">
          <div ref={ticketRef} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">E</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">EventFlow</h3>
                    <p className="text-xs text-white/80">Official E-Ticket</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60 uppercase tracking-wider">Ticket ID</p>
                  <p className="text-sm font-mono font-bold text-white">{ticket.id.slice(0, 12)}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-[1fr,auto] gap-0">
              {/* Main Ticket Info */}
              <div className="p-8 space-y-6">
                {/* Event Name */}
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-600/20 border border-purple-600/30 text-purple-400 text-xs font-medium capitalize">
                    {ticket.event.category}
                  </div>
                  <h2 className="text-3xl font-bold text-white leading-tight">{ticket.event.name}</h2>
                </div>

                {/* Event Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <div className="h-10 w-10 rounded-lg bg-purple-600/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Date & Time</p>
                      <p className="text-sm font-semibold text-white">
                        {new Date(ticket.event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-zinc-300">{ticket.event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <div className="h-10 w-10 rounded-lg bg-pink-600/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-pink-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Venue</p>
                      <p className="text-sm font-semibold text-white break-words">{ticket.event.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <div className="h-10 w-10 rounded-lg bg-purple-600/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Attendee</p>
                      <p className="text-sm font-semibold text-white break-words">{userName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <div className="h-10 w-10 rounded-lg bg-pink-600/10 flex items-center justify-center flex-shrink-0">
                      <Hash className="h-5 w-5 text-pink-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Seat Numbers</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ticket.seats.map((seat: any, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-purple-600/20 border border-purple-600/30 rounded text-xs font-mono font-bold text-purple-300"
                          >
                            {getRowLabel(seat.row)}
                            {seat.column + 1}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Info */}
                <div className="pt-4 border-t border-zinc-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Number of Tickets</span>
                    <span className="text-sm font-semibold text-white">{ticket.seats.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Total Amount Paid</span>
                    <span className="text-lg font-bold text-white">${ticket.total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Purchase Date</span>
                    <span className="text-xs font-mono text-zinc-400">
                      {new Date(ticket.purchaseDate).toLocaleDateString()} •{" "}
                      {new Date(ticket.purchaseDate).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Perforated Divider */}
              <div className="hidden md:block w-px bg-zinc-800 relative">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-zinc-950"
                    style={{ top: `${(i + 1) * 6.25}%` }}
                  />
                ))}
              </div>

              {/* QR Code Section */}
              <div className="p-8 bg-zinc-800/30 flex flex-col items-center justify-center space-y-4 border-l border-zinc-800">
                <div className="bg-white p-4 rounded-xl shadow-lg">
                  <img
                    src={generateQRCode(`TICKET:${ticket.id || "/placeholder.svg"}:EVENT:${ticket.event.id}`)}
                    alt="QR Code"
                    className="h-40 w-40"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Scan at Venue</p>
                  <p className="text-xs font-mono text-zinc-500">{ticket.id}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-zinc-800/50 border-t border-zinc-700/50">
              <div className="flex items-center justify-between text-xs">
                <p className="text-zinc-400">
                  This is an official EventFlow e-ticket. Please present this ticket at the venue entrance.
                </p>
                <p className="text-zinc-500 font-mono">#{ticket.id.slice(0, 16)}</p>
              </div>
            </div>
          </div>

          {/* Download Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={downloadTicketAsPDF} className="flex-1" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download as PDF
            </Button>
            <Button onClick={downloadTicketAsImage} variant="outline" className="flex-1 bg-transparent" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download as Image
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your ticket will be downloaded in high resolution, ready for printing or digital presentation.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
