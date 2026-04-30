import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Shield } from "lucide-react";

const disciplinaryActions = [
  "Warning Issued",
  "Temporary Chat Ban (24h)",
  "Temporary Chat Ban (7d)",
  "Permanent Chat Ban",
  "Temporary Game Ban (24h)",
  "Temporary Game Ban (7d)",
  "Permanent Game Ban",
  "Account Suspension",
  "No Action Required"
];

export default function InvestigationModal({ isOpen, onClose, report, onSubmit, isSubmitting }) {
  const [description, setDescription] = useState("");
  const [disciplinaryAction, setDisciplinaryAction] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ reportId: report.id, description, disciplinaryAction, attachments: [] });
    setDescription("");
    setDisciplinaryAction("");
  };

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-5 h-5 text-blue-500" />
            Investigate Report
          </DialogTitle>
        </DialogHeader>
        <div className="bg-gray-50 rounded-lg p-3 mb-2 text-sm text-gray-700">
          <span className="font-medium">{report.report_type?.replace(/_/g, " ")} in {report.game_name}</span>
          <p className="text-gray-500 mt-1 text-xs">{report.description}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-900 font-medium">Investigation Notes</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Document your findings and investigation details..."
              className="mt-1 h-28 bg-white border-gray-300"
              required
            />
          </div>
          <div>
            <Label className="text-gray-900 font-medium">Disciplinary Action</Label>
            <Select value={disciplinaryAction} onValueChange={setDisciplinaryAction}>
              <SelectTrigger className="mt-1 bg-white border-gray-300">
                <SelectValue placeholder="Select action to take..." />
              </SelectTrigger>
              <SelectContent>
                {disciplinaryActions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !description.trim()} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Submit Investigation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}