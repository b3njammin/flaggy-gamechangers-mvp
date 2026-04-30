import React from "react";
import { motion } from "framer-motion";

export default function ReportButton({ icon: Icon, label, description, onClick, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-slate-600 hover:border-blue-500 transition-all duration-200 text-white cursor-pointer w-full"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-slate-600 rounded-full">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
    </motion.button>
  );
}