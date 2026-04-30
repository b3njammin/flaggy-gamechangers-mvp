import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const analysisCategories = [
  { key: "IsHateSpeech", label: "Hate Speech" },
  { key: "IsHarassment", label: "Harassment" },
  { key: "IsViolent", label: "Violence" },
  { key: "IsSexualExploitation", label: "Sexual Exploit." },
  { key: "IsSelfHarm", label: "Self Harm" },
  { key: "IsSpamScam", label: "Spam / Scam" },
  { key: "IsMisinformation", label: "Misinformation" },
  { key: "IsRadicalization", label: "Radicalization" }
];

export default function AIConfidenceScore({ report }) {
  const score = report.ai_confidence_score || 0;
  const details = report.ai_analysis_details || {};

  const getScoreConfig = (s) => {
    if (s >= 80) return { label: "Very Likely Malicious", textColor: "text-red-700", bg: "bg-red-50 border-red-200" };
    if (s >= 60) return { label: "Likely Malicious", textColor: "text-orange-700", bg: "bg-orange-50 border-orange-200" };
    if (s >= 30) return { label: "Unclear", textColor: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
    return { label: "Unlikely Malicious", textColor: "text-green-700", bg: "bg-green-50 border-green-200" };
  };

  const getBarColor = (v) => {
    if (v > 75) return "bg-red-500";
    if (v > 50) return "bg-orange-500";
    if (v > 25) return "bg-yellow-500";
    return "bg-gray-300";
  };

  const config = getScoreConfig(score);

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Analysis</h3>
            <p className="text-sm text-gray-500">Automated threat assessment</p>
          </div>
        </div>

        <div className={`flex items-center justify-between p-3 rounded-lg border mb-4 ${config.bg}`}>
          <span className={`text-sm font-medium ${config.textColor}`}>{config.label}</span>
          <Badge className={`font-bold text-base border ${config.bg} ${config.textColor}`}>{score}/100</Badge>
        </div>

        <h4 className="text-sm font-medium text-gray-800 mb-2">Category Analysis</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {analysisCategories.map(cat => {
            const value = details[cat.key] || 0;
            return (
              <div key={cat.key} className="text-xs">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-gray-600">{cat.label}</span>
                  <span className="font-semibold text-gray-800">{value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${getBarColor(value)}`} style={{ width: `${value}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}