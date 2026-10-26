import { Suspense } from "react";
import type { Metadata } from "next";
import ResourceBrowser from "./ResourceBrowser";

export const metadata: Metadata = {
  title: "Browse Resources | IPU Student Portal",
  description:
    "Browse IPU study notes, lecture slides, question banks, and lab manuals organized by Course, Semester, Subject, and Unit.",
};

export default function ResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-500">
              Loading academic hierarchy...
            </p>
          </div>
        </div>
      }
    >
      <ResourceBrowser />
    </Suspense>
  );
}
