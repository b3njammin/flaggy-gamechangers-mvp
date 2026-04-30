import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  investigating: "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  dismissed: "bg-gray-100 text-gray-600 border-gray-200"
};

export default function UserReportsTable({ title, reports, icon: Icon, emptyMessage, isLoading }) {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <Icon className="w-4 h-4 text-blue-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
        ) : reports.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-medium text-sm text-gray-900">{report.report_type.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-500">{report.game_name} • {formatDistanceToNow(new Date(report.created_date))} ago</p>
                </div>
                <Badge className={`${statusColors[report.status]} border text-xs`}>
                  {report.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}