"use client";

import { useState } from "react";
import { Resource, ResourceType } from "@/types/resource";

interface ResourceCardProps {
  resource: Resource;
  unitName?: string;
}

const TYPE_CONFIG: Record<
  ResourceType,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  NOTES: {
    label: "Study Notes",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/60",
    icon: "📝",
  },
  PDF: {
    label: "PDF Document",
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800/60",
    icon: "📄",
  },
  PPT: {
    label: "Lecture Slides",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800/60",
    icon: "📊",
  },
  LAB_MANUAL: {
    label: "Lab Manual",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800/60",
    icon: "🧪",
  },
  ASSIGNMENT: {
    label: "Assignment",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800/60",
    icon: "📋",
  },
  IMPORTANT_QUESTIONS: {
    label: "Important Questions",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800/60",
    icon: "⭐",
  },
  REVISION_MATERIAL: {
    label: "Revision Material",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800/60",
    icon: "⚡",
  },
};

export default function ResourceCard({ resource, unitName }: ResourceCardProps) {
  const [copied, setCopied] = useState(false);

  const typeConfig = TYPE_CONFIG[resource.type] || {
    label: resource.type,
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-700 dark:text-zinc-300",
    border: "border-zinc-200 dark:border-zinc-700",
    icon: "📁",
  };

  const formattedDate = new Date(resource.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.origin + resource.fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-zinc-700">
      <div>
        {/* Top Badges: Type and Unit */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}
          >
            <span>{typeConfig.icon}</span>
            <span>{typeConfig.label}</span>
          </span>

          {unitName && (
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {unitName}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3.5 text-base font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
          {resource.title}
        </h3>

        {/* Description */}
        {resource.description && (
          <p className="mt-2 text-xs leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-400">
            {resource.description}
          </p>
        )}
      </div>

      {/* Meta Information: Uploader, Date, Views */}
      <div className="mt-5 border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <svg
              className="h-3.5 w-3.5 shrink-0 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Uploaded {formattedDate}</span>
          </div>

          {resource.uploaderName && (
            <span className="truncate max-w-[120px] text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              by {resource.uploaderName}
            </span>
          )}
        </div>

        {/* Stats & Actions */}
        <div className="mt-3 flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1" title="Views">
              <svg
                className="h-3.5 w-3.5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {resource.views}
            </span>

            <span className="flex items-center gap-1" title="Downloads">
              <svg
                className="h-3.5 w-3.5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {resource.downloads}
            </span>

            {resource.fileSize && (
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {resource.fileSize}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              type="button"
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              title="Copy shareable link"
              aria-label="Copy share link"
            >
              {copied ? (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Copied!
                </span>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              )}
            </button>

            <a
              href={resource.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
