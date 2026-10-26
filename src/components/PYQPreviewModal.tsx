"use client";

import { useEffect } from "react";
import { PYQ } from "@/types/resource";

interface PYQPreviewModalProps {
  pyq: PYQ | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PYQPreviewModal({
  pyq,
  isOpen,
  onClose,
}: PYQPreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pyq) return null;

  const examTypeLabels: Record<string, string> = {
    END_SEM: "End Term Examination (Theory)",
    MID_SEM: "Mid Term Examination (Internal)",
    PRACTICAL: "Practical Examination / Lab Viva",
    OTHER: "Special / Re-appear Examination",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {pyq.subject?.code || "IPU"}
              </span>
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {pyq.courseCode || pyq.courseName} • Sem {pyq.semesterNumber}
              </span>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                {pyq.year} Paper
              </span>
            </div>
            <h2
              id="modal-title"
              className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              {pyq.subject?.name}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {examTypeLabels[pyq.examType] || pyq.examType}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Close paper preview"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[65vh] overflow-y-auto p-6 space-y-6 text-sm text-zinc-700 dark:text-zinc-300">
          {/* Paper Quick Summary */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Max Marks
              </span>
              <p className="mt-0.5 font-bold text-zinc-900 dark:text-zinc-100">
                {pyq.totalMarks || 75} Marks
              </p>
            </div>
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Duration
              </span>
              <p className="mt-0.5 font-bold text-zinc-900 dark:text-zinc-100">
                {pyq.examType === "MID_SEM" ? "1.5 Hours" : "3.0 Hours"}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                File Size
              </span>
              <p className="mt-0.5 font-bold text-zinc-900 dark:text-zinc-100">
                {pyq.fileSize || "2.1 MB"}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Solution Status
              </span>
              <p className="mt-0.5 font-bold">
                {pyq.hasSolution ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Solved Included
                  </span>
                ) : (
                  <span className="text-zinc-500">Unsolved</span>
                )}
              </p>
            </div>
          </div>

          {/* Exam Instructions Outline */}
          <div className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Exam Instructions & Layout
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>Question No. 1 is compulsory containing short answer questions covering all units.</li>
              <li>Attempt one question from each remaining unit (Units I to IV).</li>
              <li>Assume missing data suitably, if any, and state assumptions clearly.</li>
              <li>All parts of a question must be answered together.</li>
            </ul>
          </div>

          {/* Paper Structure preview */}
          <div className="rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs uppercase tracking-wider text-zinc-500">
                Sample Question Overview (Preview)
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {pyq.pageCount || 4} Pages • {pyq.format || "PDF"}
              </span>
            </div>
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Q1 (Compulsory): 5 parts × 5 marks = 25 marks
                </p>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                  Includes definitions, algorithmic complexities, architecture comparisons, and brief derivations.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Q2 - Q5 (Unit Choices): Attempt 4 out of 8 = 50 marks
                </p>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                  Comprehensive problem-solving questions, design problems, and code walkthroughs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-50/70 p-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/80">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Backed by official IPU syllabus examination papers
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Close
            </button>
            <a
              href={pyq.fileUrl}
              download={`${pyq.subject?.code || "IPU"}-${pyq.year}-${pyq.examType}.pdf`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF ({pyq.fileSize || "PDF"})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
