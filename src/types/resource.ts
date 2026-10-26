export type ResourceType =
  | 'NOTES'
  | 'PDF'
  | 'PPT'
  | 'LAB_MANUAL'
  | 'ASSIGNMENT'
  | 'IMPORTANT_QUESTIONS'
  | 'REVISION_MATERIAL';

export type Role = 'STUDENT' | 'MODERATOR' | 'ADMIN';

export type ExamType = 'MID_SEM' | 'END_SEM' | 'PRACTICAL' | 'OTHER';

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  durationYears?: number;
  semesters?: Semester[];
  createdAt?: string;
}

export interface Semester {
  id: string;
  number: number;
  courseId: string;
  subjects?: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  semesterId: string;
  credits?: number;
  units?: Unit[];
  resources?: Resource[];
}

export interface Unit {
  id: string;
  name: string;
  number: number;
  subjectId: string;
  description?: string;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  description?: string | null;
  type: ResourceType;
  fileUrl: string;
  fileSize?: string;
  format?: string;
  subjectId: string;
  unitId?: string | null;
  uploadedById: string;
  uploaderName?: string;
  views: number;
  downloads: number;
  createdAt: string; // ISO date string
}

export interface HierarchyBreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface PYQ {
  id: string;
  subjectId: string;
  subject?: Subject;
  year: number;
  examType: ExamType;
  fileUrl: string;
  fileSize?: string;
  format?: string;
  pageCount?: number;
  hasSolution?: boolean;
  totalMarks?: number;
  semesterNumber?: number;
  courseCode?: string;
  courseName?: string;
  createdAt: string; // ISO date string
}

export interface PYQFilterState {
  courseId: string;
  semesterNumber: number | null;
  subjectId: string;
  year: number | null;
  examType: ExamType | "ALL";
  searchQuery: string;
  page: number;
  pageSize: number;
  sortBy: "year-desc" | "year-asc";
}

