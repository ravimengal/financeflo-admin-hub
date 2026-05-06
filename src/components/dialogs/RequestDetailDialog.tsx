import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload, FileText, Eye, Trash2, Send, Paperclip, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface RequestDocument {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  url?: string;
}

export interface RequestComment {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdBy: string;
  createdAt: string;
  documents: RequestDocument[];
  comments: RequestComment[];
}

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground border-muted",
  medium: "bg-warning/20 text-warning border-warning/30",
  high: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusColors: Record<string, string> = {
  open: "bg-primary/20 text-primary border-primary/30",
  in_progress: "bg-warning/20 text-warning border-warning/30",
  resolved: "bg-success/20 text-success border-success/30",
  closed: "bg-muted text-muted-foreground border-muted",
};

interface Props {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (req: ServiceRequest) => void;
}

const formatBytes = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

export function RequestDetailDialog({ request, open, onOpenChange, onUpdate }: Props) {
  const [comment, setComment] = useState("");
  const [tab, setTab] = useState("documents");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!request) return null;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newDocs: RequestDocument[] = files.map((f) => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      size: f.size,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(f),
    }));
    onUpdate({ ...request, documents: [...request.documents, ...newDocs] });
    toast({ title: "Documents uploaded", description: `${newDocs.length} file(s) added.` });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleViewDoc = (doc: RequestDocument) => {
    if (doc.url) {
      window.open(doc.url, "_blank");
    } else {
      toast({ title: "Preview unavailable", description: `Cannot preview ${doc.name} in demo.` });
    }
  };

  const handleDeleteDoc = (id: string) => {
    onUpdate({ ...request, documents: request.documents.filter((d) => d.id !== id) });
    toast({ title: "Document deleted" });
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newComment: RequestComment = {
      id: `c-${Date.now()}`,
      author: "Finance Admin",
      message: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    onUpdate({ ...request, comments: [...request.comments, newComment] });
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-4 pt-4 pb-3 border-b">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-muted-foreground">{request.id}</span>
            <Badge variant="outline" className={cn("capitalize text-[10px] px-1.5 py-0", statusColors[request.status])}>
              {request.status.replace("_", " ")}
            </Badge>
            <Badge variant="outline" className={cn("capitalize text-[10px] px-1.5 py-0", priorityColors[request.priority])}>
              {request.priority}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{request.category}</Badge>
          </div>
          <DialogTitle className="text-base pr-8 leading-snug">{request.title}</DialogTitle>
          <p className="text-[11px] text-muted-foreground">
            By {request.createdBy} · {new Date(request.createdAt).toLocaleString()}
          </p>
        </DialogHeader>

        <div className="px-4 py-3 border-b">
          <h4 className="text-xs font-semibold text-foreground mb-1">Description</h4>
          <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed line-clamp-3">
            {request.description || "No description provided."}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-4 pt-3">
            <TabsList className="h-8 w-full grid grid-cols-2">
              <TabsTrigger value="documents" className="text-xs gap-1.5 h-6">
                <Paperclip className="w-3 h-3" />
                Documents ({request.documents.length})
              </TabsTrigger>
              <TabsTrigger value="comments" className="text-xs gap-1.5 h-6">
                <MessageSquare className="w-3 h-3" />
                Comments ({request.comments.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="documents" className="flex-1 min-h-0 mt-0 px-4 pb-4 pt-3 flex flex-col">
            <div className="flex justify-end mb-2">
              <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-3 h-3" />
                Upload
              </Button>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
            </div>
            <ScrollArea className="flex-1 max-h-[40vh]">
              {request.documents.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg p-5 text-center">
                  <FileText className="w-6 h-6 text-muted-foreground mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">No documents attached.</p>
                </div>
              ) : (
                <div className="space-y-1.5 pr-2">
                  {request.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 p-2 rounded-md border border-border bg-card">
                      <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatBytes(doc.size)} · {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleViewDoc(doc)}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteDoc(doc.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="flex-1 min-h-0 mt-0 px-4 pb-4 pt-3 flex flex-col">
            <ScrollArea className="flex-1 max-h-[35vh] mb-2">
              {request.comments.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No comments yet.</p>
              ) : (
                <div className="space-y-2 pr-2">
                  {request.comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-semibold">
                          {c.author.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-medium text-foreground">{c.author}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-foreground bg-muted/50 rounded-md px-2 py-1.5 leading-relaxed">{c.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="space-y-1.5 border-t pt-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                maxLength={1000}
                className="text-xs min-h-[60px] resize-none"
              />
              <div className="flex justify-end">
                <Button size="sm" className="gap-1.5 h-7 text-xs" onClick={handleAddComment} disabled={!comment.trim()}>
                  <Send className="w-3 h-3" />
                  Post
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
