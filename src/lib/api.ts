const API_BASE_URL = "https://link-api.c.ch3n.cc";
const API_KEY = "01f08c76-e08d-4969-860d-f143aad5fe08";

export interface Link {
  id: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  userId: string;
  remaining: number;
  linksGiven: number;
  firstUsed: string | null;
  nextReset: string | null;
}

export interface Stats {
  totalLinks: number;
  totalUsers: number;
  totalLinksDispensed: number;
  activeUsers: number;
  averageLinksPerUser: string;
}

export interface UserStats {
  totalUsers: number;
  totalLinksDispensed: number;
  activeUsers: number;
  usersAtLimit: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getLinks(): Promise<Link[]> {
    const response = await this.request<{ links: Link[] }>("/api/links");
    return response.links;
  }

  async addLink(url: string): Promise<Link> {
    const response = await this.request<{ link: Link }>("/api/links", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    return response.link;
  }

  async addBulkLinks(urls: string[]): Promise<Link[]> {
    const results = await Promise.allSettled(
      urls.map(url => this.addLink(url))
    );
    
    const successfulLinks: Link[] = [];
    const errors: string[] = [];
    
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successfulLinks.push(result.value);
      } else {
        errors.push(`${urls[index]}: ${result.reason.message}`);
      }
    });
    
    if (errors.length > 0) {
      console.warn("Some links failed to add:", errors);
    }
    
    return successfulLinks;
  }

  async removeLink(id: number): Promise<void> {
    await this.request(`/api/links/${id}`, {
      method: "DELETE",
    });
  }

  async getUsers(): Promise<{ statistics: UserStats; users: User[] }> {
    return this.request("/api/users");
  }

  async resetUser(userId: string): Promise<User> {
    const response = await this.request<{ user: User }>(`/api/users/${userId}/reset`, {
      method: "POST",
    });
    return response.user;
  }

  async getStats(): Promise<Stats> {
    const response = await this.request<{ statistics: Stats }>("/api/stats");
    return response.statistics;
  }

  async getHealth(): Promise<{ success: boolean; message: string; timestamp: string; uptime: number }> {
    return this.request("/api/health");
  }
}

export const apiService = new ApiService();