import { Timer, RefreshCw, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SessionExpiredDialogProps {
  open: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export function SessionExpiredDialog({ open, onRefresh, onLogout }: SessionExpiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="items-center text-center">
          <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-2">
            <Timer className="w-7 h-7 text-warning" />
          </div>
          <DialogTitle className="text-xl">Session Expired</DialogTitle>
          <DialogDescription className="text-center">
            Your session has expired due to inactivity. Please refresh your token to continue or logout.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
          <Button variant="outline" onClick={onLogout} className="gap-2 flex-1">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
          <Button onClick={onRefresh} className="gap-2 flex-1">
            <RefreshCw className="w-4 h-4" />
            Refresh Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
