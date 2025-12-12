"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type Policy = {
  id: string;
  title: string;
  content: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  policy: Policy | undefined;
};

const PolicyModal = ({ open, onClose, policy }: Props) => {
  if (!policy) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="
              fixed inset-0 
              bg-black/40 backdrop-blur-sm 
              z-40
            "
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* MODAL */}
          <motion.div
            className="
              fixed left-1/2
              top-35                 /* ⬅️ HEADER ALTINDA */
              -translate-x-1/2
              w-[92%] md:w-[560px]
              max-h-[70vh]               /* ⬅️ DAHA KÜÇÜK */
              overflow-y-auto

              bg-white text-neutral-900  /* ⬅️ LIGHT DEFAULT */
              dark:bg-neutral-900 dark:text-neutral-50

              rounded-2xl
              border border-neutral-200 dark:border-neutral-700
              p-6
              z-50
              shadow-2xl
            "
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {policy.title}
              </h2>

              <button
                onClick={onClose}
                className="
                  p-2 rounded-full
                  hover:bg-neutral-100 
                  dark:hover:bg-neutral-800
                  transition
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* CONTENT */}
            <div
              className="
                text-sm leading-relaxed
                text-neutral-600 dark:text-neutral-300
                space-y-3 pr-1
              "
            >
              {policy.content.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PolicyModal;
