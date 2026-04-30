import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Clock, CheckCircle2, MessageCircle, AlertTriangle, Eye, Users, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ModeratorReportCard from "../components/moderator/ModeratorReportCard";
import ModeratorStats from "../components/moderator/ModeratorStats";
import InvestigationModal from "../components/moderator/InvestigationModal";
import ContactUserModal from "../components/moderator/ContactUserModal";

export default function ModeratorDashboard() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [investigationModal, setInvestigationModal] = useState({ isOpen: false, report: null });
  const [contactModal, setContactModal] = useState({ isOpen: false, report: null });
  const [isSubmittingInvestigation, setIsSubmittingInvestigation] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      if (userData.role === "admin") {
        setHasAccess(true);
        const reportsData = await base44.entities.Report.list("-created_date", 100);
        setReports(reportsData);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setHasAccess(false);
    }
    setIsLoading(false);
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    const report = reports.find(r => r.id === reportId);
    await base44.entities.Report.update(reportId, { ...report, status: newStatus });
    await loadData();
  };

  const handleDismiss = async (reportId) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    const report = reports.find(r => r.id === reportId);
    await base44.entities.Report.update(reportId, { ...report, status: "dismissed" });
  };

  const handleInvestigationSubmit = async (data) => {
    setIsSubmittingInvestigation(true);
    const report = reports.find(r => r.id === data.reportId);
    await base44.entities.Report.update(data.reportId, { ...report, status: "investigating" });
    setInvestigationModal({ isOpen: false, report: null });
    await loadData();
    setIsSubmittingInvestigation(false);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">This dashboard is only available to administrators.</p>
            <Link to="/"><Button className="bg-blue-600 hover:bg-blue-700 w-full"><ArrowLeft className="w-4 h-4 mr-2" />Go to User Dashboard</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeReports = reports.filter(r => r.status !== "dismissed");
  const pendingReports = activeReports.filter(r => r.status === "pending");
  const investigatingReports = activeReports.filter(r => r.status === "investigating");
  const resolvedReports = activeReports.filter(r => r.status === "resolved");
  const outreachNeeded = activeReports.filter(r => r.allow_moderator_contact && (r.status === "pending" || r.status === "investigating"));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Moderator Dashboard</h1>
              <p className="text-gray-600">Review and manage community reports</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/"><Button variant="outline" className="flex items-center gap-2"><Users className="w-4 h-4" />User Dashboard</Button></Link>
            <Button disabled className="flex items-center gap-2"><Shield className="w-4 h-4" />Mod Dashboard</Button>
          </div>
        </motion.div>

        <ModeratorStats reports={activeReports} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
          <Tabs defaultValue="in-review" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white border-gray-200">
              <TabsTrigger value="in-review" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />In Review ({pendingReports.length + investigatingReports.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />Resolved ({resolvedReports.length})
              </TabsTrigger>
              <TabsTrigger value="outreach" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />Outreach ({outreachNeeded.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />All ({activeReports.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="in-review" className="mt-6 space-y-6">
              {pendingReports.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />Pending Review ({pendingReports.length})
                  </h3>
                  <div className="grid gap-4">
                    {pendingReports.map(r => <ModeratorReportCard key={r.id} report={r} onStatusUpdate={handleStatusUpdate} onDismiss={handleDismiss} onInvestigate={(rep) => setInvestigationModal({ isOpen: true, report: rep })} onContact={(rep) => setContactModal({ isOpen: true, report: rep })} />)}
                  </div>
                </div>
              )}
              {investigatingReports.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />Under Investigation ({investigatingReports.length})
                  </h3>
                  <div className="grid gap-4">
                    {investigatingReports.map(r => <ModeratorReportCard key={r.id} report={r} onStatusUpdate={handleStatusUpdate} onDismiss={handleDismiss} onInvestigate={(rep) => setInvestigationModal({ isOpen: true, report: rep })} onContact={(rep) => setContactModal({ isOpen: true, report: rep })} />)}
                  </div>
                </div>
              )}
              {pendingReports.length === 0 && investigatingReports.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">All caught up! No reports need review.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid gap-4">
                {resolvedReports.map(r => <ModeratorReportCard key={r.id} report={r} onStatusUpdate={handleStatusUpdate} onDismiss={handleDismiss} onInvestigate={(rep) => setInvestigationModal({ isOpen: true, report: rep })} onContact={(rep) => setContactModal({ isOpen: true, report: rep })} isCompleted={true} />)}
                {resolvedReports.length === 0 && <div className="text-center py-12 text-gray-500"><CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>No resolved reports yet.</p></div>}
              </div>
            </TabsContent>

            <TabsContent value="outreach" className="mt-6">
              <div className="grid gap-4">
                {outreachNeeded.map(r => <ModeratorReportCard key={r.id} report={r} onStatusUpdate={handleStatusUpdate} onDismiss={handleDismiss} onInvestigate={(rep) => setInvestigationModal({ isOpen: true, report: rep })} onContact={(rep) => setContactModal({ isOpen: true, report: rep })} showOutreach={true} />)}
                {outreachNeeded.length === 0 && <div className="text-center py-12 text-gray-500"><MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>No outreach needed.</p></div>}
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-4">
                {activeReports.map(r => <ModeratorReportCard key={r.id} report={r} onStatusUpdate={handleStatusUpdate} onDismiss={handleDismiss} onInvestigate={(rep) => setInvestigationModal({ isOpen: true, report: rep })} onContact={(rep) => setContactModal({ isOpen: true, report: rep })} isCompleted={r.status === "resolved"} />)}
                {activeReports.length === 0 && <div className="text-center py-12 text-gray-500"><Shield className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>No active reports.</p></div>}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <InvestigationModal isOpen={investigationModal.isOpen} onClose={() => setInvestigationModal({ isOpen: false, report: null })} report={investigationModal.report} onSubmit={handleInvestigationSubmit} isSubmitting={isSubmittingInvestigation} />
        <ContactUserModal isOpen={contactModal.isOpen} onClose={() => setContactModal({ isOpen: false, report: null })} report={contactModal.report} onSent={() => console.log("Message sent")} />
      </div>
    </div>
  );
}