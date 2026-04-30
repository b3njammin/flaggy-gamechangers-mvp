import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const regions = ["NA East", "NA West", "EU West", "EU Central", "Asia", "OCE", "SA", "ME"];

export default function ReportModal({ isOpen, onClose, reportType, onSubmit, isSubmitting }) {
  const [gameName, setGameName] = useState("");
  const [serverRegion, setServerRegion] = useState("");
  const [description, setDescription] = useState("");
  const [allowContact, setAllowContact] = useState(true);
  const [screenshotUrls, setScreenshotUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setIsUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setScreenshotUrls(prev => [...prev, ...urls]);
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      report_type: reportType,
      game_name: gameName,
      server_region: serverRegion,
      description,
      allow_moderator_contact: allowContact,
      screenshot_urls: screenshotUrls,
      status: "pending"
    });
    setGameName("");
    setServerRegion("");
    setDescription("");
    setAllowContact(true);
    setScreenshotUrls([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Submit Report
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-700">Game Name *</Label>
            <Input
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="e.g. Valorant, Fortnite..."
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-700">Description *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened in detail..."
              required
              className="mt-1 h-28"
            />
          </div>
          <div>
            <Label className="text-gray-700">Server Region</Label>
            <Select value={serverRegion} onValueChange={setServerRegion}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select region (optional)" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-700">Screenshots (optional)</Label>
            <label className="mt-1 flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg p-3 hover:bg-gray-50">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-gray-500" />}
              <span className="text-sm text-gray-500">Click to upload screenshots</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            {screenshotUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {screenshotUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-16 h-16 object-cover rounded" />
                    <button type="button" onClick={() => setScreenshotUrls(p => p.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={allowContact} onCheckedChange={setAllowContact} />
            <Label className="text-gray-700 text-sm">Allow moderators to contact me for more info</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}