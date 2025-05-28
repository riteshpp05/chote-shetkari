const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface WaterLog {
  id: string
  date: string
  mugs: number
  userId: string
}

export interface GroupStats {
  groupName: string
  totalMembers: number
  totalMugs: number
  averageMugsPerMember: number
  topContributors: Array<{
    name: string
    mugs: number
  }>
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async submitWaterLog(mugs: number): Promise<WaterLog> {
    const response = await fetch(`${API_BASE_URL}/api/water-logs/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ mugs }),
    })

    if (!response.ok) {
      throw new Error("Failed to submit water log")
    }

    return response.json()
  }

  async getUserLogs(): Promise<WaterLog[]> {
    const response = await fetch(`${API_BASE_URL}/api/water-logs/`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user logs")
    }

    return response.json()
  }

  async getGroupStats(): Promise<GroupStats> {
    const response = await fetch(`${API_BASE_URL}/api/group-stats/`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch group stats")
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
