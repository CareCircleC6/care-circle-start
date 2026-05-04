import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoleSelector } from "./RoleSelector";
import { PatientForm } from "./forms/PatientForm";
import { FamilyForm } from "./forms/FamilyForm";
import { ProfessionalForm } from "./forms/ProfessionalForm";

export type UserRole = "patient" | "family" | "professional" | null;

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [role, setRole] = useState<UserRole>(null);
  const [submitted, setSubmitted] = useState(false);

  const step = role ? 2 : 1;

  const handleSuccess = useCallback(() => {
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRole(null);
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Sign up for CareCircle"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative z-10 w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl mx-4 md:mx-0"
          >
            {/* Step indicator */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center gap-3 z-10">
              {role && (
                <button
                  onClick={() => setRole(null)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
                  aria-label="Go back"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Step {step} of 2 — {step === 1 ? "Choose your role" : "Create account"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {!role ? (
                  <motion.div key="role" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <RoleSelector onSelect={setRole} />
                  </motion.div>
                ) : role === "patient" ? (
                  <motion.div key="patient" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <PatientForm onSuccess={handleSuccess} />
                  </motion.div>
                ) : role === "family" ? (
                  <motion.div key="family" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <FamilyForm onSuccess={handleSuccess} />
                  </motion.div>
                ) : (
                  <motion.div key="professional" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <ProfessionalForm onSuccess={handleSuccess} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}