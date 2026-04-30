import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, CheckCircle2, XCircle, Eye, MessageCircle, User, Calendar, AlertTriangle, Ban, Mail, Brain, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import AIConfidenceScore from "./AIConfidenceScore";

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

const statusConfig = {
  pending: { icon: AlertTriangle, color: "text-yellow-600", bgColor: "bg-yellow-50", label: "Pending" },
  investigating: { icon: Eye, color: "text-blue-600", bgColor: "bg-blue-50", label: "Investigating" },
  resolved: { icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50", label: "Resolved" },
  dismissed: { icon: XCircle, color: "text-gray-600", bgColor: "bg-gray-50", label: "Dismissed" }
};

export default function ModeratorReportCard({ report, onStatusUpdate, onDismiss, onInvestigate, onContact, isCompleted = false, showOutreach = false }) {
  const cfg = statusConfig[report.status] || statusConfig.pending;
  const StatusIcon = cfg.icon;

  const ScoreButton = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
          <Brain className="w-4 h-4 mr-1" />See Score
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>AI Confidence Analysis</DialogTitle></DialogHeader>
        <AIConfidenceScore report={report} />
      </DialogContent>
    </Dialog>
  );

  const getActionButtons = () => {
    if (isCompleted) return null;
    if (report.status === "pending") {
      return (
        <div className="flex gap-2 flex-wrap justify-end">
          <Button size="sm" onClick={() => onInvestigate && onInvestigate(report)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Eye className="w-4 h-4 mr-1" />Investigate
          </Button>
          <ScoreButton />
          {showOutreach && report.allow_moderator_contact && (
            <Button size="sm" variant="outline" onClick={() => onContact && onContact(report)} className="border-green-300 text-green-600 hover:bg-green-50">
              <Mail className="w-4 h-4 mr-1" />Contact
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onDismiss && onDismiss(report.id)} className="border-gray-300 text-gray-600 hover:bg-gray-50">
            <Ban className="w-4 h-4 mr-1" />Dismiss
          </Button>
        </div>
      );
    }
    if (report.status === "investigating") {
      return (
        <div className="flex gap-2 flex-wrap justify-end">
          <Button size="sm" onClick={() => onStatusUpdate(report.id, "resolved")} className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle2 className="w-4 h-4 mr-1" />Resolve
          </Button>
          <ScoreButton />
          {showOutreach && report.allow_moderator_contact && (
            <Button size="sm" variant="outline" onClick={() => onContact && onContact(report)} className="border-green-300 text-green-600 hover:bg-green-50">
              <Mail className="w-4 h-4 mr-1" />Contact
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onDismiss && onDismiss(report.id)} className="border-gray-300 text-gray-600 hover:bg-gray-50">
            <XCircle className="w-4 h-4 mr-1" />Dismiss
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
      <Card className={`bg-white border-gray-200 hover:shadow-md transition-shadow ${isCompleted ? "opacity-75" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
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
                  {report.server_region && <Badge variant="outline" className="text-gray-500 border-gray-200">{report.server_region}</Badge>}
                  {report.ai_confidence_score != null && (
                    <Badge className={`border font-medium ${report.ai_confidence_score >= 80 ? "bg-red-50 text-red-700 border-red-200" : report.ai_confidence_score >= 60 ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
                      <Brain className="w-3 h-3 mr-1" />AI: {report.ai_confidence_score}%
                    </Badge>
                  )}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">{report.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{report.created_by?.split("@")[0]}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDistanceToNow(new Date(report.created_date))} ago</span>
                  {report.screenshot_urls?.length > 0 && (
                    <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" />{report.screenshot_urls.length} screenshot{report.screenshot_urls.length > 1 ? "s" : ""}</span>
                  )}
                  {showOutreach && report.allow_moderator_contact && (
                    <span className="flex items-center gap-1 text-purple-600"><Mail className="w-3 h-3" />Contact allowed</span>
                  )}
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${cfg.bgColor} shrink-0`}>
              <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
              <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
            </div>
          </div>
        </CardHeader>
        {(getActionButtons() || (showOutreach && report.allow_moderator_contact)) && (
          <CardContent className="pt-0 space-y-3">
            {getActionButtons()}
            {showOutreach && report.allow_moderator_contact && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-purple-700">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Outreach Available</span>
                </div>
                <p className="text-xs text-purple-600 mt-1">Reporter has consented to be contacted for additional information.</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}