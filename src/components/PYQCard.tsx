"use client";

import { useState } from "react";
import { PYQ, ExamType } from "@/types/resource";

interface PYQCardProps {
  pyq: PYQ;
  onPreview?: (pyq: PYQ) => void;
}

export default function PYQCard({ pyq, onPreview }: PYQCardProps) {
  const [copied, setCopied] = useState(false);

  const getExamBadgeInfo = (examType: ExamType) => {
    switch (examType) {
      case "END_SEM":
        return {
          label: "End Term Exam",
          classes:
            "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/80",
          dotColor: "bg-indigo-500",
        };
      case "MID_SEM":
        return {
          label: "Mid Term Exam",
          classes:
            "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80",
          dotColor: "bg-blue-500",
        };
      case "PRACTICAL":
        return {
          label: "Practical / Lab",
          classes:
            "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80",
          dotColor: "bg-emerald-500",
        };
      case "OTHER":
      default:
        return {
          label: "Special / Re-appear",
          classes:
            "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80",
          dotColor: "bg-amber-500",
        };
    }
  };

  const badgeInfo = getExamBadgeInfo(pyq.examType);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/pyqs?course=${pyq.subject?.semesterId ? "btech-cse" : ""}&subject=${pyq.subjectId}&year=${pyq.year}&examType=${pyq.examType}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-zinc-700 dark:hover:shadow-zinc-950/50">
      {/* Top Banner Row: Badges */}
      <div>
        <div className="flex items-center justify-between gap-2">
          {/* Year Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-bold text-zinc-900 shadow-xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
            <svg
              className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{pyq.year}</span>
          </div>

          {/* Exam Type Badge */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${badgeInfo.classes}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${badgeInfo.dotColor}`} />
            <span>{badgeInfo.label}</span>
          </div>
        </div>

        {/* Course & Semester info */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {pyq.courseCode || "Course"}
          </span>
          {pyq.semesterNumber && (
            <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              Semester {pyq.semesterNumber}
            </span>
          )}
          {pyq.subject?.code && (
            <span className="inline-flex items-center rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-mono font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
              {pyq.subject.code}
            </span>
          )}
        </div>

        {/* Subject Title */}
        <h3 className="mt-2 text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-1 dark:text-zinc-100 dark:group-hover:text-blue-400">
          {pyq.subject?.name || "Subject Paper"}
        </h3>

        {/* Paper details row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {pyq.pageCount || 4} Pages
          </span>

          <span className="inline-flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z"
              />
            </svg>
            {pyq.fileSize || "2.0 MB"}
          </span>

          <span className="inline-flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {pyq.totalMarks || 75} Marks
          </span>
        </div>

        {/* Solutions Badge */}
        <div className="mt-3">
          {pyq.hasSolution ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <svg
                className="h-3 w-3 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Solutions Included
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Question Paper Only
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {onPreview && (
            <button
              onClick={() => onPreview(pyq)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
            >
              <svg
                className="h-3.5 w-3.5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Preview</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            title="Copy share link"
            className="relative rounded-lg border border-zinc-200 p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Share paper"
          >
            {copied ? (
              <svg
                className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            )}
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow dark:bg-zinc-100 dark:text-zinc-900">
                Copied!
              </span>
            )}
          </button>
        </div>

        <a
          href={pyq.fileUrl}
          download={`${pyq.subject?.code || "IPU"}-${pyq.year}-${pyq.examType}.pdf`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-zinc-900"
        >
          <svg
            className="h-3.5 w-3.5"
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
          <span>Download</span>
        </a>
      </div>
    </div>
  );
}
