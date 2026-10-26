"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ResourceCard from "@/components/ResourceCard";
import EmptyState from "@/components/EmptyState";
import {
  MOCK_COURSES,
  MOCK_SEMESTERS,
  MOCK_SUBJECTS,
  MOCK_RESOURCES,
  getCourseById,
  getSemesterByCourseAndNumber,
  getSubjectById,
  getUnitsForSubject,
  getResourcesForSubject,
} from "@/data/mock-academic-data";
import { HierarchyBreadcrumbItem } from "@/types/resource";

const RESOURCE_TYPES: { id: string; label: string }[] = [
  { id: "ALL", label: "All Types" },
  { id: "NOTES", label: "Notes" },
  { id: "PDF", label: "PDFs" },
  { id: "PPT", label: "Slides" },
  { id: "LAB_MANUAL", label: "Lab Manuals" },
  { id: "IMPORTANT_QUESTIONS", label: "Important Qs" },
  { id: "ASSIGNMENT", label: "Assignments" },
  { id: "REVISION_MATERIAL", label: "Revision" },
];

export default function ResourceBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCourseId = searchParams.get("course") || "";
  const selectedSemParam = searchParams.get("semester");
  const selectedSemNumber = selectedSemParam ? parseInt(selectedSemParam, 10) : null;
  const selectedSubjectId = searchParams.get("subject") || "";
  const selectedUnitId = searchParams.get("unit") || "all";
  const selectedType = searchParams.get("type") || "ALL";

  const [searchQuery, setSearchQuery] = useState("");

  // Hierarchy Resolution
  const currentCourse = useMemo(
    () => (selectedCourseId ? getCourseById(selectedCourseId) : undefined),
    [selectedCourseId]
  );

  const currentSemester = useMemo(
    () =>
      currentCourse && selectedSemNumber
        ? getSemesterByCourseAndNumber(currentCourse.id, selectedSemNumber)
        : undefined,
    [currentCourse, selectedSemNumber]
  );

  const currentSubject = useMemo(
    () => (selectedSubjectId ? getSubjectById(selectedSubjectId) : undefined),
    [selectedSubjectId]
  );

  // Available Semesters for chosen course
  const availableSemesters = useMemo(() => {
    if (!currentCourse) return [];
    return MOCK_SEMESTERS.filter((s) => s.courseId === currentCourse.id).sort(
      (a, b) => a.number - b.number
    );
  }, [currentCourse]);

  // Available Subjects for chosen semester
  const availableSubjects = useMemo(() => {
    if (!currentSemester) return [];
    return MOCK_SUBJECTS.filter((s) => s.semesterId === currentSemester.id);
  }, [currentSemester]);

  // Units for current subject
  const currentUnits = useMemo(() => {
    if (!currentSubject) return [];
    return getUnitsForSubject(currentSubject.id).sort(
      (a, b) => a.number - b.number
    );
  }, [currentSubject]);

  const activeUnit = useMemo(() => {
    if (selectedUnitId === "all" || !selectedUnitId) return undefined;
    return currentUnits.find((u) => u.id === selectedUnitId);
  }, [selectedUnitId, currentUnits]);

  // Resources for the current subject, filtered by unit, type, and keyword
  const filteredResources = useMemo(() => {
    if (!currentSubject) return [];
    return getResourcesForSubject(
      currentSubject.id,
      selectedUnitId,
      selectedType,
      searchQuery
    );
  }, [currentSubject, selectedUnitId, selectedType, searchQuery]);

  // Build breadcrumbs matching hierarchy: Course -> Semester -> Subject -> Unit
  const breadcrumbItems = useMemo<HierarchyBreadcrumbItem[]>(() => {
    const items: HierarchyBreadcrumbItem[] = [
      {
        label: "Resources",
        href: "/resources",
        active: !currentCourse,
      },
    ];

    if (currentCourse) {
      items.push({
        label: currentCourse.code || currentCourse.name,
        href: `/resources?course=${currentCourse.id}`,
        active: !currentSemester,
      });
    }

    if (currentCourse && currentSemester) {
      items.push({
        label: `Semester ${currentSemester.number}`,
        href: `/resources?course=${currentCourse.id}&semester=${currentSemester.number}`,
        active: !currentSubject,
      });
    }

    if (currentCourse && currentSemester && currentSubject) {
      items.push({
        label: currentSubject.name,
        href: `/resources?course=${currentCourse.id}&semester=${currentSemester.number}&subject=${currentSubject.id}`,
        active: !activeUnit,
      });
    }

    if (currentCourse && currentSemester && currentSubject && activeUnit) {
      items.push({
        label: `Unit ${activeUnit.number}`,
        active: true,
      });
    }

    return items;
  }, [currentCourse, currentSemester, currentSubject, activeUnit]);

  // Navigation handlers
  const handleSelectCourse = (courseId: string) => {
    router.push(`/resources?course=${courseId}`);
  };

  const handleSelectSemester = (semNum: number) => {
    router.push(`/resources?course=${selectedCourseId}&semester=${semNum}`);
  };

  const handleSelectSubject = (subjectId: string) => {
    router.push(
      `/resources?course=${selectedCourseId}&semester=${selectedSemNumber}&subject=${subjectId}`
    );
  };

  const handleSelectUnit = (unitId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (unitId === "all") {
      params.delete("unit");
    } else {
      params.set("unit", unitId);
    }
    router.push(`/resources?${params.toString()}`);
  };

  const handleSelectType = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "ALL") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    router.push(`/resources?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20 dark:bg-zinc-950">
      {/* Top Banner / Breadcrumb Area */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* LEVEL 1: NO COURSE SELECTED -> SHOW ALL COURSES          */}
        {/* ========================================================= */}
        {!currentCourse && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-blue-50/30 p-6 sm:p-8 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-blue-950/20">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                <span>🎓 Step 1 of 4</span>
                <span>•</span>
                <span>Select Course</span>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                Browse Academic Resources
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
                Select your academic degree program to browse study notes, unit-wise question banks, previous year question papers, and official lab manuals.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MOCK_COURSES.map((course) => {
                const sems = MOCK_SEMESTERS.filter((s) => s.courseId === course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => handleSelectCourse(course.id)}
                    className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-600"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          {course.code}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {course.durationYears} Years
                        </span>
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                        {course.name}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-2 dark:text-zinc-400">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      <span>{sems.length} Semesters</span>
                      <span className="inline-flex items-center gap-1 text-blue-600 group-hover:translate-x-0.5 transition-transform dark:text-blue-400">
                        Explore
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* LEVEL 2: COURSE SELECTED -> SELECT SEMESTER              */}
        {/* ========================================================= */}
        {currentCourse && !currentSemester && (
          <section className="space-y-6">
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Step 2 of 4: Select Semester
                </span>
                <span className="text-xs text-zinc-500">• {currentCourse.name}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Choose Semester
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Select your current semester to view subject-wise study material and syllabus hierarchy.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {availableSemesters.map((sem) => {
                const subjectsCount = MOCK_SUBJECTS.filter((s) => s.semesterId === sem.id).length;
                return (
                  <button
                    key={sem.id}
                    onClick={() => handleSelectSemester(sem.number)}
                    type="button"
                    className="group flex flex-col items-start rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 font-bold text-zinc-800 group-hover:bg-blue-600 group-hover:text-white transition-colors dark:bg-zinc-800 dark:text-zinc-200">
                      {sem.number}
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                      Semester {sem.number}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {subjectsCount > 0
                        ? `${subjectsCount} subjects available`
                        : "Syllabus mapping in progress"}
                    </p>
                    <div className="mt-4 flex w-full items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-400">
                      <span>View Subjects</span>
                      <svg className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* LEVEL 3: SEMESTER SELECTED -> SELECT SUBJECT             */}
        {/* ========================================================= */}
        {currentCourse && currentSemester && !currentSubject && (
          <section className="space-y-6">
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Step 3 of 4: Select Subject
                </span>
                <span className="text-xs text-zinc-500">
                  • {currentCourse.code} — Semester {currentSemester.number}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Subjects for Semester {currentSemester.number}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Choose a subject to access unit-wise notes, presentations, lab manuals, and important questions.
              </p>
            </div>

            {availableSubjects.length === 0 ? (
              <EmptyState
                title={`No subjects added yet for Semester ${currentSemester.number}`}
                description="The curriculum and subjects for this semester are currently being curated by student contributors."
                actionLabel="Switch to Semester 3"
                onAction={() => handleSelectSemester(3)}
                secondaryActionLabel="Back to All Semesters"
                onSecondaryAction={() => router.push(`/resources?course=${currentCourse.id}`)}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {availableSubjects.map((subject) => {
                  const units = getUnitsForSubject(subject.id);
                  const resources = MOCK_RESOURCES.filter((r) => r.subjectId === subject.id);

                  return (
                    <div
                      key={subject.id}
                      onClick={() => handleSelectSubject(subject.id)}
                      className="group flex cursor-pointer flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-500"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            {subject.code}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {subject.credits} Credits
                          </span>
                        </div>
                        <h2 className="mt-3 text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                          {subject.name}
                        </h2>
                        <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{units.length} Units</span>
                          <span>•</span>
                          <span className={resources.length === 0 ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
                            {resources.length} {resources.length === 1 ? "resource" : "resources"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs font-medium text-blue-600 dark:border-zinc-800 dark:text-blue-400">
                        <span>Browse Unit Resources</span>
                        <svg className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ========================================================= */}
        {/* LEVEL 4: SUBJECT SELECTED -> UNIT & RESOURCE BROWSING    */}
        {/* ========================================================= */}
        {currentCourse && currentSemester && currentSubject && (
          <section className="space-y-6">
            {/* Subject Header */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {currentCourse.code}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      Semester {currentSemester.number}
                    </span>
                    <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {currentSubject.code}
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                    {currentSubject.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/pyqs?course=${currentCourse.id}&semester=${currentSemester.number}&subject=${currentSubject.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>View PYQ Papers</span>
                  </Link>

                  <Link
                    href={`/resources?course=${currentCourse.id}&semester=${currentSemester.number}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Other Subjects
                  </Link>
                </div>
              </div>

              {/* Unit Tabs / Pills */}
              <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Filter By Unit
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {currentUnits.length} Units in syllabus
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSelectUnit("all")}
                    type="button"
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedUnitId === "all" || !selectedUnitId
                        ? "bg-zinc-900 text-white shadow dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    All Units ({MOCK_RESOURCES.filter((r) => r.subjectId === currentSubject.id).length})
                  </button>

                  {currentUnits.map((u) => {
                    const unitCount = MOCK_RESOURCES.filter(
                      (r) => r.subjectId === currentSubject.id && r.unitId === u.id
                    ).length;
                    const isSelected = selectedUnitId === u.id;

                    return (
                      <button
                        key={u.id}
                        onClick={() => handleSelectUnit(u.id)}
                        type="button"
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow dark:bg-blue-600 font-semibold"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        }`}
                      >
                        <span>Unit {u.number}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                            isSelected
                              ? "bg-blue-700 text-white"
                              : "bg-zinc-200/80 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {unitCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeUnit && activeUnit.description && (
                  <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {activeUnit.name}:
                    </span>{" "}
                    {activeUnit.description}
                  </div>
                )}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
              {/* Resource Type Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                {RESOURCE_TYPES.map((type) => {
                  const isActive = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleSelectType(type.id)}
                      type="button"
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>

              {/* Search within resources */}
              <div className="relative min-w-[240px]">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources, topics, authors..."
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50/50 py-1.5 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder-zinc-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    aria-label="Clear search"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Resources List / Empty State */}
            {filteredResources.length === 0 ? (
              searchQuery.trim().length > 0 ? (
                <EmptyState
                  icon="search"
                  title="No matching resources"
                  description={`No materials found matching "${searchQuery}". Try searching with different keywords or clearing your filters.`}
                  actionLabel="Clear Search"
                  onAction={() => setSearchQuery("")}
                />
              ) : selectedUnitId !== "all" && activeUnit ? (
                <EmptyState
                  title={`No resources in ${activeUnit.name} yet`}
                  description="Study materials for this unit haven't been uploaded yet. Check back soon or view materials from other units."
                  actionLabel="View All Units"
                  onAction={() => handleSelectUnit("all")}
                />
              ) : selectedType !== "ALL" ? (
                <EmptyState
                  title="No resources for selected type"
                  description="There are no materials under this specific category for this subject yet."
                  actionLabel="Show All Types"
                  onAction={() => handleSelectType("ALL")}
                />
              ) : (
                <EmptyState
                  title="No resources yet for this subject"
                  description={`There are currently no notes or materials uploaded for ${currentSubject.name}. Be the first student or educator to contribute!`}
                  actionLabel="Browse Other Subjects"
                  onAction={() =>
                    router.push(
                      `/resources?course=${currentCourse.id}&semester=${currentSemester.number}`
                    )
                  }
                />
              )
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>
                    Showing {filteredResources.length}{" "}
                    {filteredResources.length === 1 ? "resource" : "resources"}
                  </span>
                  <span>IPU V1 Academic Repository</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.map((resource) => {
                    const unit = currentUnits.find((u) => u.id === resource.unitId);
                    return (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        unitName={unit ? `Unit ${unit.number}` : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
