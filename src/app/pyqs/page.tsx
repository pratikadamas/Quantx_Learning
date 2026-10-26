import { Suspense } from "react";
import type { Metadata } from "next";
import PYQBrowser from "./PYQBrowser";

export const metadata: Metadata = {
  title: "Previous Year Questions (PYQs) | IPU Student Portal",
  description:
    "Browse, search, and download IPU previous year question papers filtered by Course, Semester, Subject, Year, and Exam Type.",
};

export default function PYQPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-500">
              Loading previous year questions repository...
            </p>
          </div>
        </div>
      }
    >
      <PYQBrowser />
    </Suspense>
  );
}
