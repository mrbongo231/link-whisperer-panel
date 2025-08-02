import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiService, Link } from "@/lib/api";
import { Plus, Trash2, Link2, Upload, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LinksPage: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [addingLink, setAddingLink] = useState(false);
  const [addingBulk, setAddingBulk] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchLinks = async () => {
    try {
      const data = await apiService.getLinks();
      setLinks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch links",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleAddLink = async () => {
    if (!newUrl.trim()) return;
    
    setAddingLink(true);
    try {
      const newLink = await apiService.addLink(newUrl.trim());
      setLinks(prev => [newLink, ...prev]);
      setNewUrl("");
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Link added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add link",
        variant: "destructive",
      });
    } finally {
      setAddingLink(false);
    }
  };

  const handleBulkAdd = async () => {
    if (!bulkUrls.trim()) return;
    
    const urls = bulkUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    if (urls.length === 0) return;
    
    setAddingBulk(true);
    try {
      const newLinks = await apiService.addBulkLinks(urls);
      setLinks(prev => [...newLinks, ...prev]);
      setBulkUrls("");
      setIsBulkDialogOpen(false);
      toast({
        title: "Success",
        description: `Added ${newLinks.length} links successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add bulk links",
        variant: "destructive",
      });
    } finally {
      setAddingBulk(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    try {
      await apiService.removeLink(id);
      setLinks(prev => prev.filter(link => link.id !== id));
      toast({
        title: "Success",
        description: "Link removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove link",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Link Management</h1>
            <p className="text-muted-foreground">Manage your bot's link database</p>
          </div>
        </div>
        <Card className="bg-gradient-card border-border shadow-card animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Link Management</h1>
          <p className="text-muted-foreground">Manage your bot's link database</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 shadow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Add New Link</DialogTitle>
                <DialogDescription>Add a single link to the database</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="bg-muted/50 border-border"
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddLink} disabled={addingLink} className="flex-1">
                    {addingLink ? "Adding..." : "Add Link"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-border hover:bg-accent">
                <Upload className="w-4 h-4 mr-2" />
                Bulk Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Add Links</DialogTitle>
                <DialogDescription>Add multiple links (one per line)</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  className="bg-muted/50 border-border min-h-32"
                />
                <div className="flex gap-2">
                  <Button onClick={handleBulkAdd} disabled={addingBulk} className="flex-1">
                    {addingBulk ? "Adding..." : "Add Links"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Links Database
            <Badge variant="secondary" className="ml-auto">
              {links.length} total
            </Badge>
          </CardTitle>
          <CardDescription>All links in your bot's database</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-12">
              <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No links found</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first link</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add First Link
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border hover:bg-muted/30 transition-smooth">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-smooth truncate"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>ID: {link.id}</span>
                      <span>Added: {new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteLink(link.id)}
                    className="ml-4 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};