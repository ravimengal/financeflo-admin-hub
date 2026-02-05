import { useState, useRef } from "react";
import { Building2, Upload, Save, Camera } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Organization() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [orgData, setOrgData] = useState({
    name: "Acme Corporation",
    description: "Leading provider of innovative solutions for enterprise businesses.",
    website: "https://acme.com",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
  });
  
  const [logo, setLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Organization updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Organization</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization's profile and settings
          </p>
        </div>

        {/* Logo Section */}
        <div className="content-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Organization Logo
          </h2>
          <div className="flex items-center gap-6">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-xl bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                {logo ? (
                  <img
                    src={logo}
                    alt="Organization logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-primary/50" />
                )}
              </div>
              <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <Button
                variant="outline"
                className="gap-2 mb-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Upload Logo
              </Button>
              <p className="text-sm text-muted-foreground">
                Recommended: 200x200px, PNG or JPG
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Organization Details */}
        <div className="content-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Organization Details
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-muted-foreground">
                Organization Name
              </Label>
              <Input
                id="name"
                value={orgData.name}
                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                className="mt-1.5 bg-card border-border"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={orgData.description}
                onChange={(e) =>
                  setOrgData({ ...orgData, description: e.target.value })
                }
                className="mt-1.5 bg-card border-border min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="text-muted-foreground">
                  Website
                </Label>
                <Input
                  id="website"
                  value={orgData.website}
                  onChange={(e) =>
                    setOrgData({ ...orgData, website: e.target.value })
                  }
                  className="mt-1.5 bg-card border-border"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-muted-foreground">
                  Contact Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={orgData.email}
                  onChange={(e) =>
                    setOrgData({ ...orgData, email: e.target.value })
                  }
                  className="mt-1.5 bg-card border-border"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="text-muted-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={orgData.phone}
                onChange={(e) =>
                  setOrgData({ ...orgData, phone: e.target.value })
                }
                className="mt-1.5 bg-card border-border"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}