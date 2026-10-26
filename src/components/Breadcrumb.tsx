"use client";

import Link from "next/link";
import { HierarchyBreadcrumbItem } from "@/types/resource";

interface BreadcrumbProps {
  items: HierarchyBreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full overflow-x-auto py-2">
      <ol className="flex items-center gap-1.5 text-sm whitespace-nowrap text-zinc-500 dark:text-zinc-400">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100"
            title="Go to Home"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.active;

          return (
            <li key={index} className="flex items-center gap-1.5">
              <svg
                className="h-3.5 w-3.5 text-zinc-400 shrink-0 dark:text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="font-medium text-zinc-600 hover:text-blue-600 hover:underline transition-colors dark:text-zinc-400 dark:hover:text-blue-400 max-w-[200px] truncate sm:max-w-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="font-semibold text-zinc-900 dark:text-zinc-100 max-w-[240px] truncate sm:max-w-none"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
