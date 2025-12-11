"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ==== BACKDROP (karartılmış arkaplan) ==== */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-9998"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* ==== MODAL ==== */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-9999 px-4"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full aspect-video">

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-white/10 p-2 rounded-full hover:bg-white/20 transition z-50"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* VIDEO FRAME */}
              <video
                src="/video2.mp4"
                className="w-full h-full object-cover"
                controls
                autoPlay
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
