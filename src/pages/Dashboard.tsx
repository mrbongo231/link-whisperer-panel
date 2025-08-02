import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService, Stats } from "@/lib/api";
import { BarChart3, Link2, Users, Activity, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getStats();
        setStats(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const statCards = [
    {
      title: "Total Links",
      value: stats?.totalLinks || 0,
      icon: Link2,
      description: "Links in database",
      color: "text-primary"
    },
    {
      title: "Total Users", 
      value: stats?.totalUsers || 0,
      icon: Users,
      description: "Registered users",
      color: "text-success"
    },
    {
      title: "Links Dispensed",
      value: stats?.totalLinksDispensed || 0, 
      icon: TrendingUp,
      description: "Total links given out",
      color: "text-warning"
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: Activity,
      description: "Users with activity",
      color: "text-primary-glow"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Overview of your link bot performance</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gradient-card border-border shadow-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Overview of your link bot performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted/20 ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats && (
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              System Metrics
            </CardTitle>
            <CardDescription>Detailed performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Average Links per User</p>
                <p className="text-xl font-bold text-foreground">{stats.averageLinksPerUser}</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Database Health</p>
                <p className="text-xl font-bold text-success">Healthy</p>
              </div>
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground">API Status</p>
                <p className="text-xl font-bold text-success">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};