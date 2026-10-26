import Link from "next/link";
import { MOCK_COURSES } from "@/data/mock-academic-data";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-blue-50/50 via-white to-zinc-50/50 py-16 sm:py-24 dark:border-zinc-800 dark:from-zinc-900/50 dark:via-zinc-950 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-sm dark:border-blue-800/80 dark:bg-blue-950/60 dark:text-blue-300">
            <span>✨ Centralized IPU Academic Repository</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
            One portal for all your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              IPU Academic
            </span>{" "}
            needs.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            No more hunting through WhatsApp groups or broken drive links. Access study notes, unit-wise question banks, previous year papers (PYQs), and lab manuals in seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Browse Study Resources</span>
            </Link>

            <Link
              href="/resources?course=btech-cse&semester=3&subject=cse-s3-ds"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-3.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <span>Quick Demo: Data Structures</span>
              <svg
                className="h-4 w-4 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Structured Hierarchy Section matching README */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Structured Academic Hierarchy
            </h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              Organized the way university courses work
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Navigate seamlessly from university degree down to precise unit notes with instant breadcrumb tracking.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
            {[
              { step: "01", name: "Course", desc: "B.Tech CSE, IT, ECE, BCA" },
              { step: "02", name: "Semester", desc: "Semester 1 through 8" },
              { step: "03", name: "Subject", desc: "Data Structures, DBMS, etc." },
              { step: "04", name: "Unit", desc: "Units 1, 2, 3, 4" },
              { step: "05", name: "Resource", desc: "Notes, PPTs, PYQs, Manuals" },
            ].map((node, i) => (
              <div
                key={node.step}
                className="relative flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {node.step}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {node.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {node.desc}
                  </p>
                </div>
                {i < 4 && (
                  <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-zinc-400 dark:text-zinc-600">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Course Links */}
          <div className="mt-12">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Available Programs:
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MOCK_COURSES.map((course) => (
                <Link
                  key={course.id}
                  href={`/resources?course=${course.id}`}
                  className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                      {course.code}
                    </span>
                    <span className="text-xs text-blue-600 group-hover:translate-x-0.5 transition-transform dark:text-blue-400">
                      Browse &rarr;
                    </span>
                  </div>
                  <h4 className="mt-3 font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                    {course.name}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-2 dark:text-zinc-400">
                    {course.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
