import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2, Mail, MessageCircle, User, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDistanceToNow } from "date-fns";

const reportTypeColors = {
  toxic_behavior: "bg-red-100 text-red-800 border-red-200",
  stalking: "bg-purple-100 text-purple-800 border-purple-200",
  harassment: "bg-orange-100 text-orange-800 border-orange-200",
  gore: "bg-red-200 text-red-900 border-red-300",
  sexual_content: "bg-pink-100 text-pink-800 border-pink-200",
  misinformation: "bg-yellow-100 text-yellow-800 border-yellow-200",
  threats: "bg-red-100 text-red-800 border-red-200",
  other: "bg-slate-100 text-slate-800 border-slate-200"
};

export default function ContactUserModal({ isOpen, onClose, report, onSent }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  React.useEffect(() => {
    if (report) {
      setSubject(`Follow-up on your report #${report.id?.slice(-6) || "Unknown"}`);
    }
  }, [report]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !subject.trim()) return;
    setIsSending(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: report.created_by,
        subject: subject.trim(),
        body: `Hello,\n\n${message.trim()}\n\nThis message is regarding your report about ${report.report_type.replace(/_/g, " ")} in ${report.game_name}.\n\nBest regards,\nFlaggy Moderation Team`,
        from_name: "Flaggy Moderation Team"
      });
      onSent && onSent();
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
    }
    setIsSending(false);
  };

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="w-5 h-5 text-blue-500" />
            Contact User
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Send a message to the user who submitted this report for additional information.
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10 border-2 border-gray-200">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                  {report.created_by?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className={`${reportTypeColors[report.report_type]} border font-medium`}>
                    {report.report_type.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-gray-600 border-gray-300">{report.game_name}</Badge>
                </div>
                <p className="text-gray-700 text-sm mb-2">{report.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{report.created_by?.split("@")[0]}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDistanceToNow(new Date(report.created_date))} ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <Label className="text-gray-900 font-medium">Email Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 bg-white border-gray-300" required />
          </div>
          <div>
            <Label className="text-gray-900 font-medium">Message *</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask for additional details or clarification..."
              className="mt-1 h-32 bg-white border-gray-300"
              required
            />
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSending} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={isSending || !message.trim()} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {isSending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : <><Send className="w-4 h-4 mr-2" />Send Message</>}
            </Button>
          </div>
        </form>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Contact Permission Granted</p>
              <p className="text-blue-700 text-xs mt-1">This user has explicitly allowed moderators to contact them.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}