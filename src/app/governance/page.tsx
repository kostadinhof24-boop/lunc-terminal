"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Vote, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface Proposal {
  proposal_id: string;
  content: {
    title: string;
    description: string;
  };
  status: string;
}

export default function GovernancePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/governance`);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const data = await res.json();
        if (data.proposals && data.proposals.length > 0) {
          setProposals(data.proposals);
        } else {
          setError("No proposals found.");
        }
      } catch (err) {
        setError("Failed to load proposals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PROPOSAL_STATUS_VOTING_PERIOD":
        return { label: "Active", color: "text-green-400 bg-green-400/10", icon: <Clock className="w-4 h-4" /> };
      case "PROPOSAL_STATUS_PASSED":
        return { label: "Passed", color: "text-blue-400 bg-blue-400/10", icon: <CheckCircle className="w-4 h-4" /> };
      case "PROPOSAL_STATUS_REJECTED":
        return { label: "Rejected", color: "text-red-400 bg-red-400/10", icon: <XCircle className="w-4 h-4" /> };
      default:
        return { label: status.replace("PROPOSAL_STATUS_", ""), color: "text-gray-400 bg-gray-400/10", icon: <Vote className="w-4 h-4" /> };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-24">
        <div className="w-10 h-10 border-4 border-t-[#F0B90B] border-gray-700 rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-24 px-6 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-400/50" />
        <p className="text-gray-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white">Governance</h1>
          <p className="text-gray-400 mt-2">Active and past proposals on Terra Classic</p>
        </motion.div>

        <div className="space-y-4">
          {proposals.map((prop, index) => {
            const statusInfo = getStatusInfo(prop.status);
            return (
              <motion.div 
                key={prop.proposal_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#F0B90B] font-mono text-sm">#{prop.proposal_id}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{prop.content.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{prop.content.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}