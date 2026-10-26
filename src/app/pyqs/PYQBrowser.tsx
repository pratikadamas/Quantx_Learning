"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PYQCard from "@/components/PYQCard";
import PYQPreviewModal from "@/components/PYQPreviewModal";
import EmptyState from "@/components/EmptyState";
import {
  MOCK_COURSES,
  MOCK_SEMESTERS,
  MOCK_SUBJECTS,
  EXAM_TYPE_OPTIONS,
  getCourseById,
  getSubjectById,
  getFilteredPYQs,
  getAvailablePYQYears,
  getSubjectsForCourse,
} from "@/data/mock-academic-data";
import { PYQ, ExamType } from "@/types/resource";

export default function PYQBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL search parameter extraction
  const selectedCourseId = searchParams.get("course") || "";
  const selectedSemParam = searchParams.get("semester");
  const selectedSemNumber = selectedSemParam ? parseInt(selectedSemParam, 10) : null;
  const selectedSubjectId = searchParams.get("subject") || "";
  const selectedYearParam = searchParams.get("year");
  const selectedYear = selectedYearParam ? parseInt(selectedYearParam, 10) : null;
  const selectedExamType = (searchParams.get("examType") || "ALL") as ExamType | "ALL";
  const searchQueryParam = searchParams.get("q") || "";
  const sortByParam = (searchParams.get("sort") || "year-desc") as "year-desc" | "year-asc";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const pageSizeParam = parseInt(searchParams.get("limit") || "9", 10);

  // Local search query input for real-time responsiveness
  const [searchInput, setSearchInput] = useState(searchQueryParam);
  const [previewPaper, setPreviewPaper] = useState<PYQ | null>(null);

  // Dynamic filter lists based on dependencies
  const selectedCourse = useMemo(
    () => (selectedCourseId ? getCourseById(selectedCourseId) : undefined),
    [selectedCourseId]
  );

  const availableSemesters = useMemo(() => {
    if (!selectedCourse) {
      return Array.from({ length: 8 }, (_, i) => i + 1);
    }
    const sems = MOCK_SEMESTERS.filter((s) => s.courseId === selectedCourse.id);
    return Array.from(new Set(sems.map((s) => s.number))).sort((a, b) => a - b);
  }, [selectedCourse]);

  const availableSubjects = useMemo(() => {
    if (selectedCourse && selectedSemNumber) {
      const sem = MOCK_SEMESTERS.find(
        (s) => s.courseId === selectedCourse.id && s.number === selectedSemNumber
      );
      if (sem) {
        return MOCK_SUBJECTS.filter((subj) => subj.semesterId === sem.id);
      }
    }
    if (selectedCourse) {
      return getSubjectsForCourse(selectedCourse.id);
    }
    if (selectedSemNumber) {
      const semIds = MOCK_SEMESTERS.filter((s) => s.number === selectedSemNumber).map(
        (s) => s.id
      );
      return MOCK_SUBJECTS.filter((subj) => semIds.includes(subj.semesterId));
    }
    return MOCK_SUBJECTS;
  }, [selectedCourse, selectedSemNumber]);

  const availableYears = useMemo(() => getAvailablePYQYears(), []);

  // Update URL helper preserving existing parameters
  const updateFilters = (newParams: Record<string, string | number | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || value === "ALL") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset page to 1 whenever filters change (unless the page itself was changed)
    if (!("page" in newParams)) {
      params.set("page", "1");
    }

    const qs = params.toString();
    router.push(qs ? `/pyqs?${qs}` : "/pyqs", { scroll: false });
  };

  // Handler for course change: reset dependent semester and subject if not applicable
  const handleCourseChange = (courseId: string) => {
    updateFilters({
      course: courseId,
      semester: null,
      subject: null,
    });
  };

  // Handler for semester change
  const handleSemesterChange = (semNum: number | null) => {
    updateFilters({
      semester: semNum,
      subject: null,
    });
  };

  // Handler for search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateFilters({ q: null });
  };

  const handleResetAllFilters = () => {
    setSearchInput("");
    router.push("/pyqs", { scroll: false });
  };

  // Get all filtered PYQs combining filters with strict AND logic
  const filteredPYQs = useMemo(() => {
    return getFilteredPYQs({
      courseId: selectedCourseId,
      semesterNumber: selectedSemNumber,
      subjectId: selectedSubjectId,
      year: selectedYear,
      examType: selectedExamType,
      searchQuery: searchQueryParam,
      sortBy: sortByParam,
    });
  }, [
    selectedCourseId,
    selectedSemNumber,
    selectedSubjectId,
    selectedYear,
    selectedExamType,
    searchQueryParam,
    sortByParam,
  ]);

  // Pagination calculation
  const totalCount = filteredPYQs.length;
  const pageSize = pageSizeParam > 0 ? pageSizeParam : 9;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);

  const paginatedPYQs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPYQs.slice(start, start + pageSize);
  }, [filteredPYQs, currentPage, pageSize]);

  // Check if any filters are actively set
  const hasActiveFilters = Boolean(
    selectedCourseId ||
      selectedSemNumber ||
      selectedSubjectId ||
      selectedYear ||
      (selectedExamType && selectedExamType !== "ALL") ||
      searchQueryParam
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Heading & Introduction */}
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-800/80 dark:bg-blue-950/60 dark:text-blue-300">
              <span>📝 IPU Examination Repository</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl dark:text-zinc-50">
              Previous Year Question Papers (PYQs)
            </h1>
            <p className="mt-2 text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
              Browse, filter, preview, and download official IPU End-Term, Mid-Term, and Practical exam question papers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 shadow-xs transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-4 w-4 text-zinc-400"
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
              <span>Browse Notes & Manuals</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Filter Control Panel */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-col gap-4">
          {/* Top row: 5 Primary Filters (Course, Semester, Subject, Year, Exam Type) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* 1. Course Filter */}
            <div>
              <label
                htmlFor="course-select"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                1. Course
              </label>
              <select
                id="course-select"
                value={selectedCourseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">All Courses</option>
                {MOCK_COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Semester Filter */}
            <div>
              <label
                htmlFor="semester-select"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                2. Semester
              </label>
              <select
                id="semester-select"
                value={selectedSemNumber ?? ""}
                onChange={(e) =>
                  handleSemesterChange(e.target.value ? parseInt(e.target.value, 10) : null)
                }
                className="mt-1.5 block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">All Semesters</option>
                {availableSemesters.map((num) => (
                  <option key={num} value={num}>
                    Semester {num}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Subject Filter */}
            <div>
              <label
                htmlFor="subject-select"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                3. Subject
              </label>
              <select
                id="subject-select"
                value={selectedSubjectId}
                onChange={(e) => updateFilters({ subject: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">All Subjects</option>
                {availableSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Year Filter */}
            <div>
              <label
                htmlFor="year-select"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                4. Year
              </label>
              <select
                id="year-select"
                value={selectedYear ?? ""}
                onChange={(e) =>
                  updateFilters({
                    year: e.target.value ? parseInt(e.target.value, 10) : null,
                  })
                }
                className="mt-1.5 block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">All Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Year {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Exam Type Filter */}
            <div>
              <label
                htmlFor="exam-select"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              >
                5. Exam Type
              </label>
              <select
                id="exam-select"
                value={selectedExamType}
                onChange={(e) => updateFilters({ examType: e.target.value })}
                className="mt-1.5 block w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {EXAM_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Bar & Quick Exam Type Pills */}
          <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 lg:flex-row lg:items-center lg:justify-between">
            {/* Quick Exam Type Pills for fast switching */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-zinc-500 mr-1 hidden sm:inline">
                Exam:
              </span>
              {EXAM_TYPE_OPTIONS.map((opt) => {
                const isActive = selectedExamType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateFilters({ examType: opt.id })}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900 font-bold"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {opt.shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Real-time search query input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search papers (e.g. Data Structures, 2024, ETCS-201)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-16 text-xs text-zinc-900 shadow-xs placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <svg
                  className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-12 top-2 rounded p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Filter
                </button>
              </div>
            </form>
          </div>

          {/* Active Filter Chips & Reset All */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="text-xs font-semibold text-zinc-500">Active Filters (AND):</span>

              {selectedCourse && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Course: {selectedCourse.code || selectedCourse.name}
                  <button
                    onClick={() => handleCourseChange("")}
                    className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                    aria-label="Remove Course filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {selectedSemNumber && (
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  Semester {selectedSemNumber}
                  <button
                    onClick={() => handleSemesterChange(null)}
                    className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100"
                    aria-label="Remove Semester filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {selectedSubjectId && (
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                  Subject: {getSubjectById(selectedSubjectId)?.name || selectedSubjectId}
                  <button
                    onClick={() => updateFilters({ subject: null })}
                    className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                    aria-label="Remove Subject filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {selectedYear && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  Year: {selectedYear}
                  <button
                    onClick={() => updateFilters({ year: null })}
                    className="ml-1 hover:text-amber-900 dark:hover:text-amber-100"
                    aria-label="Remove Year filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {selectedExamType && selectedExamType !== "ALL" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Exam: {selectedExamType}
                  <button
                    onClick={() => updateFilters({ examType: null })}
                    className="ml-1 hover:text-emerald-900 dark:hover:text-emerald-100"
                    aria-label="Remove Exam Type filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {searchQueryParam && (
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  Query: &ldquo;{searchQueryParam}&rdquo;
                  <button
                    onClick={handleClearSearch}
                    className="ml-1 hover:text-zinc-900 dark:hover:text-zinc-100"
                    aria-label="Remove Query filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              <button
                onClick={handleResetAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 ml-auto"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results Header Toolbar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {totalCount === 0 ? (
              <span>0 papers found</span>
            ) : (
              <span>
                Showing{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {Math.min(currentPage * pageSize, totalCount)}
                </span>{" "}
                of <span className="font-bold">{totalCount}</span> question papers
              </span>
            )}
          </p>
        </div>

        {/* Sort & Page Size Controls */}
        {totalCount > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <span>Sort:</span>
              <select
                value={sortByParam}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 shadow-xs focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="year-desc">Newest Year First (↓)</option>
                <option value="year-asc">Oldest Year First (↑)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => updateFilters({ limit: e.target.value, page: 1 })}
                className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 shadow-xs focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Results Grid / Empty State */}
      <div className="mt-6">
        {totalCount === 0 ? (
          <EmptyState
            title="No Previous Year Papers Found"
            description={
              hasActiveFilters
                ? "No exam papers matched all of your active filters combined. Try broadening your criteria or clearing specific filters."
                : "There are currently no previous year papers uploaded in this section."
            }
            icon="document"
            actionLabel="Reset All Filters"
            onAction={handleResetAllFilters}
            secondaryActionLabel="Browse General Resources"
            onSecondaryAction={() => router.push("/resources")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPYQs.map((pyq) => (
              <PYQCard
                key={pyq.id}
                pyq={pyq}
                onPreview={(paper) => setPreviewPaper(paper)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-6 sm:flex-row dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Page {currentPage} of {totalPages} ({totalCount} total papers)
          </p>

          <nav
            aria-label="Pagination Navigation"
            className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Previous Page Button */}
            <button
              onClick={() => updateFilters({ page: currentPage - 1 })}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isCurrent = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateFilters({ page: pageNum })}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition ${
                      isCurrent
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => updateFilters({ page: currentPage + 1 })}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <span>Next</span>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* Paper Preview Modal */}
      <PYQPreviewModal
        pyq={previewPaper}
        isOpen={Boolean(previewPaper)}
        onClose={() => setPreviewPaper(null)}
      />
    </div>
  );
}
