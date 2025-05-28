"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { apiClient, type WaterLog } from "@/lib/api"
import { ArrowLeft, Calendar, Droplets } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [logs, setLogs] = useState<WaterLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchLogs()
  }, [user, router])

  const fetchLogs = async () => {
    try {
      const userLogs = await apiClient.getUserLogs()
      setLogs(userLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTotalMugs = () => {
    return logs.reduce((total, log) => total + log.mugs, 0)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-green-700">Your Water Log History</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Total Contribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{getTotalMugs()}</div>
                <div className="text-sm text-gray-600">Total Mugs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{logs.length}</div>
                <div className="text-sm text-gray-600">Days Logged</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {logs.length > 0 ? Math.round(getTotalMugs() / logs.length) : 0}
                </div>
                <div className="text-sm text-gray-600">Avg per Day</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Logs
            </CardTitle>
            <CardDescription>Your daily water contributions to plants</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading your logs...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No logs found. Start by adding your first water log!</div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{formatDate(log.date)}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(log.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-lg">{log.mugs}</span>
                      <span className="text-sm text-gray-600">mugs</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
