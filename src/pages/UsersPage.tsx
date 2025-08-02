import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiService, User, UserStats } from "@/lib/api";
import { Users, RefreshCw, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data.users);
      setUserStats(data.statistics);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleResetUser = async (userId: string) => {
    setResettingUser(userId);
    try {
      await apiService.resetUser(userId);
      await fetchUsers(); // Refresh the data
      toast({
        title: "Success",
        description: `User ${userId} has been reset`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset user",
        variant: "destructive",
      });
    } finally {
      setResettingUser(null);
    }
  };

  const getUserStatusBadge = (user: User) => {
    if (user.remaining === 0) {
      return <Badge variant="destructive">At Limit</Badge>;
    } else if (user.linksGiven > 0) {
      return <Badge variant="default">Active</Badge>;
    } else {
      return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  const getUserStatusIcon = (user: User) => {
    if (user.remaining === 0) {
      return <XCircle className="w-4 h-4 text-destructive" />;
    } else if (user.linksGiven > 0) {
      return <CheckCircle className="w-4 h-4 text-success" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Monitor and manage bot users</p>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Monitor and manage bot users</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" className="border-border hover:bg-accent">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.totalUsers}</p>
                </div>
                <Users className="w-6 h-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.activeUsers}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">At Limit</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.usersAtLimit}</p>
                </div>
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Links Dispensed</p>
                  <p className="text-2xl font-bold text-foreground">{userStats.totalLinksDispensed}</p>
                </div>
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            User List
            <Badge variant="secondary" className="ml-auto">
              {users.length} users
            </Badge>
          </CardTitle>
          <CardDescription>All users who have interacted with the bot</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground">Users will appear here once they start using the bot</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border hover:bg-muted/30 transition-smooth">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getUserStatusIcon(user)}
                      <span className="font-mono text-sm text-foreground">{user.userId}</span>
                    </div>
                    {getUserStatusBadge(user)}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="text-center">
                      <p className="font-medium text-foreground">{user.remaining}</p>
                      <p>Remaining</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">{user.linksGiven}</p>
                      <p>Given</p>
                    </div>
                    {user.firstUsed && (
                      <div className="text-center">
                        <p className="font-medium text-foreground">
                          {new Date(user.firstUsed).toLocaleDateString()}
                        </p>
                        <p>First Used</p>
                      </div>
                    )}
                    {user.nextReset && (
                      <div className="text-center">
                        <p className="font-medium text-foreground">
                          {new Date(user.nextReset).toLocaleDateString()}
                        </p>
                        <p>Next Reset</p>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetUser(user.userId)}
                      disabled={resettingUser === user.userId}
                      className="ml-4 hover:bg-primary hover:text-primary-foreground"
                    >
                      {resettingUser === user.userId ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Reset
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};