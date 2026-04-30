import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Eye, CheckCircle2, MessageCircle } from "lucide-react";

export default function ModeratorStats({ reports }) {
  const pending = reports.filter(r => r.status === "pending").length;
  const investigating = reports.filter(r => r.status === "investigating").length;
  const resolved = reports.filter(r => r.status === "resolved").length;
  const outreach = reports.filter(r => r.allow_moderator_contact && (r.status === "pending" || r.status === "investigating")).length;

  const stats = [
    { label: "Pending", value: pending, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Investigating", value: investigating, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Resolved", value: resolved, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Outreach Needed", value: outreach, icon: MessageCircle, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(s => (
        <Card key={s.label} className="bg-white border-gray-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-full flex items-center justify-center`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}