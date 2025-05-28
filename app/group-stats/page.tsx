"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { apiClient, type GroupStats } from "@/lib/api"
import { ArrowLeft, Trophy, Users, Droplets } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function GroupStatsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<GroupStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchGroupStats()
  }, [user, router])

  const fetchGroupStats = async () => {
    try {
      const groupStats = await apiClient.getGroupStats()
      setStats(groupStats)
    } catch (error) {
      console.error("Error fetching group stats:", error)
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-xl font-bold text-green-700">Group Statistics</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {isLoading ? (
          <div className="text-center py-8">Loading group statistics...</div>
        ) : !stats ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500">No group data available. You might not be assigned to a group yet.</div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Group Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {stats.groupName} Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats.totalMugs}</div>
                    <div className="text-sm text-gray-600">Total Group Mugs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.totalMembers}</div>
                    <div className="text-sm text-gray-600">Group Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{stats.averageMugsPerMember}</div>
                    <div className="text-sm text-gray-600">Avg per Member</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top Contributors
                </CardTitle>
                <CardDescription>Leading members in your group</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.topContributors.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No contributions recorded yet</div>
                ) : (
                  <div className="space-y-3">
                    {stats.topContributors.map((contributor, index) => (
                      <div
                        key={contributor.name}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                  ? "bg-gray-400"
                                  : index === 2
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="font-medium">{contributor.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold">{contributor.mugs}</span>
                          <span className="text-sm text-gray-600">mugs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
