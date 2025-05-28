"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api"
import { Droplets, Plus, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [mugs, setMugs] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [todayTotal, setTodayTotal] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    // Fetch today's total
    fetchTodayTotal()
  }, [])

  const fetchTodayTotal = async () => {
    try {
      const logs = await apiClient.getUserLogs()
      const today = new Date().toISOString().split("T")[0]
      const todayLogs = logs.filter((log) => log.date.startsWith(today))
      const total = todayLogs.reduce((sum, log) => sum + log.mugs, 0)
      setTodayTotal(total)
    } catch (error) {
      console.error("Error fetching today total:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mugs || Number.parseInt(mugs) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number of mugs",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await apiClient.submitWaterLog(Number.parseInt(mugs))
      toast({
        title: "Success!",
        description: `Added ${mugs} mugs to your log`,
      })
      setMugs("")
      fetchTodayTotal()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit water log",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-green-700">Chote Shetkari Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Water Logging Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Log Water Given
              </CardTitle>
              <CardDescription>Record how many mugs of water you gave to plants today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="mugs">Number of Mugs</Label>
                  <Input
                    id="mugs"
                    type="number"
                    min="1"
                    value={mugs}
                    onChange={(e) => setMugs(e.target.value)}
                    placeholder="Enter number of mugs"
                    className="text-lg"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
                  {isSubmitting ? "Adding..." : "Add to Log"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Today's Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Today's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{todayTotal}</div>
                <div className="text-gray-600">mugs given today</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/history">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold">View History</h3>
                  <p className="text-sm text-gray-600">See your past contributions</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/group-stats">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Group Stats</h3>
                  <p className="text-sm text-gray-600">Compare with your group</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
