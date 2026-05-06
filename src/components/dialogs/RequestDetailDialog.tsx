import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{request.id}</span>
            <Badge variant="outline" className={cn("capitalize text-xs", statusColors[request.status])}>
              {request.status.replace("_", " ")}
            </Badge>
            <Badge variant="outline" className={cn("capitalize text-xs", priorityColors[request.priority])}>
              {request.priority} priority
            </Badge>
            <Badge variant="outline" className="text-xs">{request.category}</Badge>
          </div>
          <DialogTitle className="text-xl pr-8">{request.title}</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Opened by {request.createdBy} · {new Date(request.createdAt).toLocaleString()}
          </p>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
          <div className="px-6 py-5 space-y-6">
            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {request.description || "No description provided."}
              </p>
            </div>

            <Separator />

            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Documents ({request.documents.length})
                </h4>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
              </div>
              {request.documents.length === 0 ? (
                <div className="border border-dashed border-border rounded-lg p-6 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No documents attached. Click Upload to add files.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {request.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(doc.size)} · {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDoc(doc)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteDoc(doc.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Comments */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments ({request.comments.length})
              </h4>
              {request.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground mb-3">No comments yet. Be the first to comment.</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {request.comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                          {c.author.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">{c.author}</span>
                          <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2">{c.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  maxLength={1000}
                />
                <div className="flex justify-end">
                  <Button size="sm" className="gap-2" onClick={handleAddComment} disabled={!comment.trim()}>
                    <Send className="w-4 h-4" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
