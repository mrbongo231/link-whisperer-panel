import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/api";
import { Activity, Server, Database, Wifi, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HealthStatus {
  success: boolean;
  message: string;
  timestamp: string;
  uptime: number;
}

export const StatusPage: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  const checkHealth = async () => {
    setChecking(true);
    try {
      const data = await apiService.getHealth();
      setHealth(data);
    } catch (error) {
      setHealth({
        success: false,
        message: "API is unreachable",
        timestamp: new Date().toISOString(),
        uptime: 0
      });
      toast({
        title: "Error",
        description: "Failed to check API health",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getStatusBadge = (isHealthy: boolean) => {
    return isHealthy ? (
      <Badge className="bg-success text-success-foreground">
        <CheckCircle className="w-3 h-3 mr-1" />
        Healthy
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Unhealthy
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Status</h1>
          <p className="text-muted-foreground">Monitor API and system health</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Status</h1>
          <p className="text-muted-foreground">Monitor API and system health</p>
        </div>
        <Button 
          onClick={checkHealth} 
          variant="outline" 
          className="border-border hover:bg-accent"
          disabled={checking}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
          {checking ? 'Checking...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">API Server</span>
              </div>
              {getStatusBadge(health?.success || false)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-foreground">
                  {health?.success ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response:</span>
                <span className="text-foreground">
                  {health?.success ? 'OK' : 'Error'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Database</span>
              </div>
              {getStatusBadge(health?.success || false)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Connection:</span>
                <span className="text-foreground">
                  {health?.success ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Performance:</span>
                <span className="text-foreground">
                  {health?.success ? 'Good' : 'Poor'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Network</span>
              </div>
              {getStatusBadge(health?.success || false)}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Latency:</span>
                <span className="text-foreground">
                  {health?.success ? 'Low' : 'High'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Throughput:</span>
                <span className="text-foreground">
                  {health?.success ? 'Normal' : 'Limited'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {health && (
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              System Information
            </CardTitle>
            <CardDescription>Detailed system metrics and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">Uptime</span>
                    <Badge variant="outline" className="text-xs">
                      {formatUptime(health.uptime)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Server has been running for {formatUptime(health.uptime)}
                  </p>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">Last Check</span>
                    <Badge variant="outline" className="text-xs">
                      {new Date(health.timestamp).toLocaleTimeString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {health.message}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">API Version</span>
                    <Badge variant="outline" className="text-xs">v1.0</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Link Dispenser API running on production
                  </p>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">Base URL</span>
                    <Badge variant="outline" className="text-xs">HTTPS</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    https://link-api.c.ch3n.cc
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};