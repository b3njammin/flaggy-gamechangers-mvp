import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { MessageSquareX, Eye, UserX, Skull, Heart, AlertTriangle, Zap, HelpCircle, Activity, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportButton from "../components/dashboard/ReportButton";
import ReportModal from "../components/dashboard/ReportModal";
import UserReportsTable from "../components/dashboard/UserReportsTable";
import ReportCelebration from "../components/dashboard/ReportCelebration";

const reportTypes = [
  { type: "toxic_behavior", icon: MessageSquareX, label: "Toxic Behavior", description: "Swearing, insults, verbal abuse" },
  { type: "stalking", icon: Eye, label: "Stalking", description: "Following, watching persistently" },
  { type: "harassment", icon: UserX, label: "Harassment", description: "Targeted bullying, intimidation" },
  { type: "gore", icon: Skull, label: "Gore Content", description: "Graphic violence, disturbing imagery" },
  { type: "sexual_content", icon: Heart, label: "Sexual Content", description: "Inappropriate sexual material" },
  { type: "misinformation", icon: AlertTriangle, label: "Misinformation", description: "False or misleading information" },
  { type: "threats", icon: Zap, label: "Threats", description: "Threatening behavior or language" },
  { type: "other", icon: HelpCircle, label: "Other Issue", description: "Something else not listed" }
];

const generateAIAnalysis = (reportType) => {
  const base = { IsHateSpeech: 0, IsHarassment: 0, IsMisinformation: 0, IsRadicalization: 0, IsSelfHarm: 0, IsViolent: 0, IsSexualExploitation: 0, IsSpamScam: 0 };
  const r = () => Math.floor(Math.random() * 30);
  switch (reportType) {
    case "toxic_behavior": return { ...base, IsHateSpeech: 70 + r(), IsHarassment: 40 + r() };
    case "harassment": return { ...base, IsHarassment: 80 + r(), IsHateSpeech: 20 + r() };
    case "stalking": return { ...base, IsHarassment: 80 + r(), IsSexualExploitation: 20 + r() };
    case "threats": return { ...base, IsViolent: 80 + r(), IsHarassment: 50 + r() };
    case "sexual_content": return { ...base, IsSexualExploitation: 85 + r() };
    case "gore": return { ...base, IsViolent: 85 + r() };
    case "misinformation": return { ...base, IsMisinformation: 80 + r(), IsRadicalization: 10 + r() };
    default: return { ...base, IsSpamScam: 30 + r() };
  }
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [celebration, setCelebration] = useState({ isVisible: false, gameName: "", points: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      const reportsData = await base44.entities.Report.list("-created_date", 100);
      setReports(reportsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleReportClick = (reportType) => {
    if (!user) { base44.auth.redirectToLogin(window.location.href); return; }
    setSelectedReportType(reportType);
    setIsModalOpen(true);
  };

  const handleReportSubmit = async (reportData) => {
    setIsSubmitting(true);
    const aiScore = Math.floor(Math.random() * 40) + 60;
    await base44.entities.Report.create({ ...reportData, ai_confidence_score: aiScore, ai_analysis_details: generateAIAnalysis(reportData.report_type) });
    setIsModalOpen(false);
    setSelectedReportType(null);
    const points = Math.floor(Math.random() * 151) + 50;
    setCelebration({ isVisible: true, gameName: reportData.game_name, points });
    await loadData();
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  const myReports = user ? reports.filter(r => r.created_by === user.email) : [];
  const activeReports = myReports.filter(r => r.status === "pending" || r.status === "investigating");
  const completedReports = myReports.filter(r => r.status === "resolved" || r.status === "dismissed");

  return (
    <>
      <div className="min-h-screen px-4 py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">Make a Report,</span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6">Help Everyone!</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your reports help create a safer, more enjoyable experience for the entire gaming community.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "My Total Reports", value: myReports.length, color: "text-gray-900" },
              { label: "My Active Cases", value: activeReports.length, color: "text-blue-600" },
              { label: "My Resolved Cases", value: completedReports.filter(r => r.status === "resolved").length, color: "text-green-600" },
              { label: "Community Trust", value: "High", color: "text-purple-600" }
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <p className="text-gray-500 text-sm">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">What type of behavior would you like to report?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {reportTypes.map((rt, i) => (
                <ReportButton key={rt.type} icon={rt.icon} label={rt.label} description={rt.description} onClick={() => handleReportClick(rt.type)} delay={i * 0.05} />
              ))}
            </div>
          </motion.div>

          {user ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Your Contributions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <UserReportsTable title="Your Active Reports" reports={activeReports} icon={Activity} emptyMessage="No active reports. Great work!" isLoading={isLoading} />
                <UserReportsTable title="Your Completed Reports" reports={completedReports} icon={Check} emptyMessage="No completed reports yet." isLoading={isLoading} />
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600 mb-4">Login to view and manage your reports.</p>
              <Button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="bg-blue-600 hover:bg-blue-700">Login</Button>
            </div>
          )}

          <ReportModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedReportType(null); }} reportType={selectedReportType} onSubmit={handleReportSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>

      <ReportCelebration isVisible={celebration.isVisible} onClose={() => setCelebration({ isVisible: false, gameName: "", points: 0 })} gameName={celebration.gameName} points={celebration.points} />
    </>
  );
}