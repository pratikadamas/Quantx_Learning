import { Course, Semester, Subject, Unit, Resource } from "@/types/resource";

export const MOCK_COURSES: Course[] = [
  {
    id: "btech-cse",
    name: "B.Tech Computer Science & Engineering",
    code: "CSE",
    description: "Core computing, algorithms, systems engineering and modern software paradigms.",
    durationYears: 4,
  },
  {
    id: "btech-it",
    name: "B.Tech Information Technology",
    code: "IT",
    description: "Information processing, enterprise networking, cloud services, and security.",
    durationYears: 4,
  },
  {
    id: "btech-ece",
    name: "B.Tech Electronics & Communication",
    code: "ECE",
    description: "Circuits, embedded systems, signals, microprocessors, and IoT.",
    durationYears: 4,
  },
  {
    id: "bca",
    name: "Bachelor of Computer Applications",
    code: "BCA",
    description: "Application development, web architectures, databases, and programming fundamentals.",
    durationYears: 3,
  },
];

export const MOCK_SEMESTERS: Semester[] = [
  // B.Tech CSE Semesters 1-8
  { id: "cse-sem-1", number: 1, courseId: "btech-cse" },
  { id: "cse-sem-2", number: 2, courseId: "btech-cse" },
  { id: "cse-sem-3", number: 3, courseId: "btech-cse" },
  { id: "cse-sem-4", number: 4, courseId: "btech-cse" },
  { id: "cse-sem-5", number: 5, courseId: "btech-cse" },
  { id: "cse-sem-6", number: 6, courseId: "btech-cse" },
  { id: "cse-sem-7", number: 7, courseId: "btech-cse" },
  { id: "cse-sem-8", number: 8, courseId: "btech-cse" },

  // B.Tech IT Semesters 1-8
  { id: "it-sem-1", number: 1, courseId: "btech-it" },
  { id: "it-sem-2", number: 2, courseId: "btech-it" },
  { id: "it-sem-3", number: 3, courseId: "btech-it" },
  { id: "it-sem-4", number: 4, courseId: "btech-it" },
  { id: "it-sem-5", number: 5, courseId: "btech-it" },
  { id: "it-sem-6", number: 6, courseId: "btech-it" },
  { id: "it-sem-7", number: 7, courseId: "btech-it" },
  { id: "it-sem-8", number: 8, courseId: "btech-it" },

  // BCA Semesters 1-6
  { id: "bca-sem-1", number: 1, courseId: "bca" },
  { id: "bca-sem-2", number: 2, courseId: "bca" },
  { id: "bca-sem-3", number: 3, courseId: "bca" },
  { id: "bca-sem-4", number: 4, courseId: "bca" },
  { id: "bca-sem-5", number: 5, courseId: "bca" },
  { id: "bca-sem-6", number: 6, courseId: "bca" },
];

export const MOCK_SUBJECTS: Subject[] = [
  // CSE Semester 3 Subjects
  {
    id: "cse-s3-ds",
    name: "Data Structures",
    code: "ETCS-201",
    semesterId: "cse-sem-3",
    credits: 4,
  },
  {
    id: "cse-s3-dbms",
    name: "Database Management Systems",
    code: "ETCS-203",
    semesterId: "cse-sem-3",
    credits: 4,
  },
  {
    id: "cse-s3-co",
    name: "Computer Architecture & Organization",
    code: "ETCS-205",
    semesterId: "cse-sem-3",
    credits: 4,
  },
  {
    id: "cse-s3-dm",
    name: "Discrete Mathematics",
    code: "ETMA-207",
    semesterId: "cse-sem-3",
    credits: 4,
  },
  // Empty subject in CSE Sem 3 with no resources to test empty state
  {
    id: "cse-s3-ooad",
    name: "Object Oriented Analysis & Design",
    code: "ETCS-209",
    semesterId: "cse-sem-3",
    credits: 3,
  },

  // CSE Semester 4 Subjects
  {
    id: "cse-s4-os",
    name: "Operating Systems",
    code: "ETCS-202",
    semesterId: "cse-sem-4",
    credits: 4,
  },
  {
    id: "cse-s4-algo",
    name: "Design & Analysis of Algorithms",
    code: "ETCS-204",
    semesterId: "cse-sem-4",
    credits: 4,
  },
  {
    id: "cse-s4-se",
    name: "Software Engineering",
    code: "ETCS-206",
    semesterId: "cse-sem-4",
    credits: 4,
  },

  // IT Semester 3 Subjects
  {
    id: "it-s3-ds",
    name: "Data Structures & Algorithms",
    code: "ETIT-201",
    semesterId: "it-sem-3",
    credits: 4,
  },
  {
    id: "it-s3-cn",
    name: "Computer Networks & Protocols",
    code: "ETIT-203",
    semesterId: "it-sem-3",
    credits: 4,
  },

  // BCA Semester 1 Subjects
  {
    id: "bca-s1-cprog",
    name: "Programming in C",
    code: "BCA-101",
    semesterId: "bca-sem-1",
    credits: 4,
  },
];

export const MOCK_UNITS: Unit[] = [
  // Units for CSE S3 Data Structures
  {
    id: "unit-ds-1",
    name: "Unit 1: Linear Data Structures, Stacks & Queues",
    number: 1,
    subjectId: "cse-s3-ds",
    description: "Array representations, stack operations, prefix/postfix conversions, circular queues, priority queues.",
  },
  {
    id: "unit-ds-2",
    name: "Unit 2: Linked Lists & Dynamic Storage",
    number: 2,
    subjectId: "cse-s3-ds",
    description: "Singly linked lists, doubly linked lists, circular lists, polynomial manipulation, memory allocation.",
  },
  {
    id: "unit-ds-3",
    name: "Unit 3: Non-Linear Structures: Trees & Binary Search Trees",
    number: 3,
    subjectId: "cse-s3-ds",
    description: "Binary tree traversals, AVL trees, B-trees, Red-Black trees, heap structures, and priority heaps.",
  },
  {
    id: "unit-ds-4",
    name: "Unit 4: Graphs, Sorting & Hashing",
    number: 4,
    subjectId: "cse-s3-ds",
    description: "Graph traversals (BFS/DFS), shortest paths (Dijkstra), minimum spanning trees (Prim/Kruskal), hashing techniques.",
  },

  // Units for CSE S3 DBMS
  {
    id: "unit-dbms-1",
    name: "Unit 1: Database Architecture & ER Modeling",
    number: 1,
    subjectId: "cse-s3-dbms",
    description: "Three-schema architecture, data independence, ER diagrams, weak entities, mapping ER to relational.",
  },
  {
    id: "unit-dbms-2",
    name: "Unit 2: Relational Model & SQL / Relational Algebra",
    number: 2,
    subjectId: "cse-s3-dbms",
    description: "Tuple relational calculus, domain calculus, complex SQL queries, views, constraints, assertions.",
  },
  {
    id: "unit-dbms-3",
    name: "Unit 3: Normalization & Functional Dependencies",
    number: 3,
    subjectId: "cse-s3-dbms",
    description: "1NF, 2NF, 3NF, BCNF, 4NF, lossless join decomposition, dependency preservation.",
  },
  {
    id: "unit-dbms-4",
    name: "Unit 4: Transaction Processing & Concurrency Control",
    number: 4,
    subjectId: "cse-s3-dbms",
    description: "ACID properties, serializability, lock-based protocols, two-phase locking, deadlock recovery.",
  },

  // Units for CSE S3 Computer Architecture
  {
    id: "unit-co-1",
    name: "Unit 1: Register Transfer & Microoperations",
    number: 1,
    subjectId: "cse-s3-co",
    description: "Bus and memory transfers, arithmetic/logic microoperations, instruction codes, computer registers.",
  },
  {
    id: "unit-co-2",
    name: "Unit 2: Central Processing Unit & Pipelining",
    number: 2,
    subjectId: "cse-s3-co",
    description: "Instruction formats, addressing modes, RISC vs CISC, parallel processing, arithmetic pipeline.",
  },

  // Units for empty subject (CSE S3 OOAD) with NO resources
  {
    id: "unit-ooad-1",
    name: "Unit 1: Introduction to UML & Class Diagrams",
    number: 1,
    subjectId: "cse-s3-ooad",
    description: "Object-oriented concepts, UML diagrams, class diagrams, structural modeling.",
  },
  {
    id: "unit-ooad-2",
    name: "Unit 2: Behavioral Modeling & Sequence Diagrams",
    number: 2,
    subjectId: "cse-s3-ooad",
    description: "Interaction diagrams, state machine diagrams, activity diagrams.",
  },
];

export const MOCK_RESOURCES: Resource[] = [
  // Resources for Data Structures - Unit 1
  {
    id: "res-ds-u1-1",
    title: "Handwritten Master Notes: Stacks, Infix to Postfix & Queue Types",
    description: "Comprehensive class notes covering array implementation of stacks, recursion simulation, and circular queue mechanics with diagrams.",
    type: "NOTES",
    fileUrl: "/sample-docs/ds-unit1-stacks.pdf",
    fileSize: "4.2 MB",
    format: "PDF",
    subjectId: "cse-s3-ds",
    unitId: "unit-ds-1",
    uploadedById: "usr-teacher-1",
    uploaderName: "Dr. R. K. Sharma",
    views: 1240,
    downloads: 512,
    createdAt: "2026-08-15T10:30:00Z",
  },
  {
    id: "res-ds-u1-2",
    title: "Unit 1 Lecture Slides: Array Representation & Applications",
    description: "Official faculty slides explaining row/column-major ordering, sparse matrices representation, and stack frame execution.",
    type: "PPT",
    fileUrl: "/sample-docs/ds-unit1-slides.pptx",
    fileSize: "6.8 MB",
    format: "PPTX",
    subjectId: "cse-s3-ds",
    unitId: "unit-ds-1",
    uploadedById: "usr-faculty-2",
    uploaderName: "Prof. Ananya Gupta",
    views: 890,
    downloads: 340,
    createdAt: "2026-08-18T14:15:00Z",
  },
  {
    id: "res-ds-u1-3",
    title: "Lab Manual: Experiment 1-4 (Stack & Queue Implementation in C)",
    description: "Step-by-step lab exercise codes, test cases, and viva question bank for linear data structure lab assignments.",
    type: "LAB_MANUAL",
    fileUrl: "/sample-docs/ds-lab-manual-part1.pdf",
    fileSize: "2.1 MB",
    format: "PDF",
    subjectId: "cse-s3-ds",
    unitId: "unit-ds-1",
    uploadedById: "usr-ta-1",
    uploaderName: "Academic Tech Team",
    views: 1650,
    downloads: 980,
    createdAt: "2026-08-20T09:00:00Z",
  },
  {
    id: "res-ds-u1-4",
    title: "Most Repeated Unit 1 Mid-Sem & End-Sem Questions",
    description: "Curated compilation of 10-marker questions asked in IPU examinations between 2018-2025 with model answers.",
    type: "IMPORTANT_QUESTIONS",
    fileUrl: "/sample-docs/ds-unit1-important-qs.pdf",
    fileSize: "1.5 MB",
    format: "PDF",
    subjectId: "cse-s3-ds",
    unitId: "unit-ds-1",
    uploadedById: "usr-student-council",
    uploaderName: "IPU Student Council",
    views: 2450,
    downloads: 1320,
    createdAt: "2026-08-25T16:45:00Z",
  },

  // Resources for Data Structures - Unit 2
  {
    id: "res-ds-u2-1",
    title: "Linked Lists Complete Architecture & Pointer Manipulation Guide",
    description: "Detailed breakdown of memory allocation, pointer rewiring in singly, doubly, and circular linked lists with C code snippets.",
    type: "NOTES",
    fileUrl: "/sample-docs/ds-unit2-linked-lists.pdf",
    fileSize: "3.7 MB",
    format: "PDF",
    subjectId: "cse-s3-ds",
    unitId: "unit-ds-2",
    uploadedById: "usr-faculty-2",
    uploaderName: "Prof. Ananya Gupta",
    views: 920,
    downloads: 410,
    createdAt: "2026-08-22T11:20:00Z",
  },
  {
    id: "res-ds-u2-2",
    title: "Polynomial Addition & Multiplication using Linked List (Assignment)",
    description: "Problem statements and template code for assignment 2 due prior to mid-semester evaluations.",
    type: "ASSIGNMENT",
    fileUrl: "/sample-docs/ds-assignment-2.pdf",
    fileSize: "850 KB",
    format: "PDF",
    subjectId: "cse-s3-ds",
    unitId: "unit-ds-2",
    uploadedById: "usr-teacher-1",
    uploaderName: "Dr. R. K. Sharma",
    views: 630,
    downloads: 295,
    createdAt: "2026-08-24T18:00:00Z",
  },

  // Resources for Data Structures - Unit 3
  {
    id: "res-ds-u3-1",
    title: "AVL Trees Rotation Cheat Sheet & Binary Tree Traversals",
    description: "Quick revision formula sheet for LL, RR, LR, RL tree rotations, height balancing, and recursive/iterative traversals.",
    type: "REVISION_MATERIAL",
    fileUrl: "/sample-docs/ds-unit3-avl-rotations.pdf",
    fileSize: "1.8 MB",
    format: "PDF",
    subjectId: "cse-s3-ds",
    unitId: "unit-ds-3",
    uploadedById: "usr-student-council",
    uploaderName: "Peer Tutoring Group",
    views: 1890,
    downloads: 870,
    createdAt: "2026-08-26T12:00:00Z",
  },

  // Note: Unit 4 of Data Structures intentionally left with NO resources
  // to showcase the empty state when a student clicks on Unit 4!

  // Resources for DBMS - Unit 1
  {
    id: "res-dbms-u1-1",
    title: "Relational Database Concepts & Enhanced ER Diagram Modeling",
    description: "Complete guide on entities, relationships, cardinalities, generalization, specialization, and aggregation.",
    type: "PDF",
    fileUrl: "/sample-docs/dbms-er-diagrams.pdf",
    fileSize: "5.1 MB",
    format: "PDF",
    subjectId: "cse-s3-dbms",
    unitId: "unit-dbms-1",
    uploadedById: "usr-faculty-dbms",
    uploaderName: "Prof. Vikram Malhotra",
    views: 1100,
    downloads: 480,
    createdAt: "2026-08-16T15:10:00Z",
  },

  // Resources for DBMS - Unit 3
  {
    id: "res-dbms-u3-1",
    title: "Normalization Masterclass: 1NF through BCNF with Step-by-Step Solved Proofs",
    description: "Clear decomposition steps, finding candidate keys, closure of attribute sets, and proving lossless join / dependency preservation.",
    type: "NOTES",
    fileUrl: "/sample-docs/dbms-normalization-guide.pdf",
    fileSize: "3.4 MB",
    format: "PDF",
    subjectId: "cse-s3-dbms",
    unitId: "unit-dbms-3",
    uploadedById: "usr-faculty-dbms",
    uploaderName: "Prof. Vikram Malhotra",
    views: 3100,
    downloads: 1750,
    createdAt: "2026-08-21T10:00:00Z",
  },
  {
    id: "res-dbms-u3-2",
    title: "10 Years Solved Normalization Questions (IPU End-Term)",
    description: "Every functional dependency problem asked in IPU end-semester exams from 2015 to 2025 solved with explanations.",
    type: "IMPORTANT_QUESTIONS",
    fileUrl: "/sample-docs/dbms-pyq-normalization.pdf",
    fileSize: "2.8 MB",
    format: "PDF",
    subjectId: "cse-s3-dbms",
    unitId: "unit-dbms-3",
    uploadedById: "usr-student-council",
    uploaderName: "IPU Student Council",
    views: 2980,
    downloads: 1620,
    createdAt: "2026-08-23T14:30:00Z",
  },

  // Subject-level resource (without specific unit)
  {
    id: "res-dbms-syllabus",
    title: "Official IPU DBMS Syllabus & Prescribed Textbook References",
    description: "Complete curriculum structure, marking scheme, internal assessment breakdown, and recommended readings (Korth & Navathe).",
    type: "PDF",
    fileUrl: "/sample-docs/dbms-syllabus-ipu.pdf",
    fileSize: "950 KB",
    format: "PDF",
    subjectId: "cse-s3-dbms",
    unitId: null,
    uploadedById: "usr-ta-1",
    uploaderName: "Academic Section",
    views: 1420,
    downloads: 650,
    createdAt: "2026-08-10T08:00:00Z",
  },
];

// Helper functions for easy hierarchy querying
export function getAllCourses(): Course[] {
  return MOCK_COURSES;
}

export function getCourseById(courseId: string): Course | undefined {
  return MOCK_COURSES.find((c) => c.id === courseId);
}

export function getSemestersForCourse(courseId: string): Semester[] {
  return MOCK_SEMESTERS.filter((s) => s.courseId === courseId);
}

export function getSemesterByCourseAndNumber(courseId: string, semNumber: number): Semester | undefined {
  return MOCK_SEMESTERS.find((s) => s.courseId === courseId && s.number === semNumber);
}

export function getSubjectsForSemester(semesterId: string): Subject[] {
  return MOCK_SUBJECTS.filter((s) => s.semesterId === semesterId);
}

export function getSubjectById(subjectId: string): Subject | undefined {
  return MOCK_SUBJECTS.find((s) => s.id === subjectId);
}

export function getUnitsForSubject(subjectId: string): Unit[] {
  return MOCK_UNITS.filter((u) => u.subjectId === subjectId);
}

export function getUnitById(unitId: string): Unit | undefined {
  return MOCK_UNITS.find((u) => u.id === unitId);
}

export function getResourcesForSubject(
  subjectId: string,
  unitId?: string | null,
  resourceType?: string | null,
  searchQuery?: string | null
): Resource[] {
  let list = MOCK_RESOURCES.filter((r) => r.subjectId === subjectId);

  if (unitId && unitId !== "all") {
    list = list.filter((r) => r.unitId === unitId);
  }

  if (resourceType && resourceType !== "ALL") {
    list = list.filter((r) => r.type === resourceType);
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.uploaderName && r.uploaderName.toLowerCase().includes(q)) ||
        r.type.toLowerCase().includes(q)
    );
  }

  return list;
}
