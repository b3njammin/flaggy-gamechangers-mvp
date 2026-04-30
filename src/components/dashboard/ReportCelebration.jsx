import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, X } from "lucide-react";

const Firework = ({ delay = 0, x = 50, y = 50 }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-yellow-400"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: [0, 1, 0], opacity: [1, 1, 0], x: [0, (Math.random() * 80) - 40], y: [0, (Math.random() * 80) - 40] }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
  />
);

const SparkleEl = ({ delay = 0, x = 20, y = 30 }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ scale: 0, rotate: 0, opacity: 1 }}
    animate={{ scale: [0, 1, 0], rotate: [0, 180, 360], opacity: [1, 1, 0] }}
    transition={{ duration: 2, delay, ease: "easeInOut" }}
  >
    <Sparkles className="w-3 h-3 text-blue-400" />
  </motion.div>
);

export default function ReportCelebration({ isVisible, onClose, gameName, points }) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        {/* Fireworks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <Firework key={`fw-${i}`} delay={i * 0.2} x={20 + (i * 5) % 60} y={20 + (i * 7) % 60} />
          ))}
          {[...Array(8)].map((_, i) => (
            <SparkleEl key={`sp-${i}`} delay={i * 0.3} x={10 + (i * 10) % 80} y={10 + (i * 9) % 80} />
          ))}
        </div>

        {/* Card */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative z-10"
        >
          <Card className="bg-white border-2 border-yellow-200 shadow-2xl max-w-md mx-4">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
                className="mb-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="mb-4"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                >
                  +{points}
                </motion.div>
                <p className="text-lg font-semibold text-gray-800 mt-2">Points Earned!</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-gray-900">Great Work! 🎉</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  You got <span className="font-bold text-purple-600">{points} points</span> for making a good impact for everyone on{" "}
                  <span className="font-bold text-blue-600">{gameName}</span>. Nice work!
                </p>
                <Button onClick={onClose} className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 w-full">
                  Awesome!
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}