import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  ResourceType,
  ExamType,
  Difficulty,
  NoticeCategory,
} from "@prisma/client";

// Setup adapter and PrismaClient
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/quantx_learning?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding for IPU Student Portal...\n");

  // 1. Clean up existing data in reverse relation order for clean idempotency
  console.log("🧹 Cleaning up existing records...");
  await prisma.notice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.pYQ.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();
  console.log("✅ Existing data cleaned successfully.\n");

  // 2. Seed Courses (At least 1 course)
  console.log("📚 Seeding Courses...");
  const btechCse = await prisma.course.create({
    data: {
      name: "B.Tech Computer Science & Engineering",
      code: "CSE",
    },
  });

  const btechIt = await prisma.course.create({
    data: {
      name: "B.Tech Information Technology",
      code: "IT",
    },
  });

  const bca = await prisma.course.create({
    data: {
      name: "Bachelor of Computer Applications",
      code: "BCA",
    },
  });
  console.log(`✅ Created 3 courses: ${btechCse.code}, ${btechIt.code}, ${bca.code}`);

  // 3. Seed Semesters (At least 2 semesters)
  console.log("📅 Seeding Semesters...");
  const cseSemesters: Record<number, { id: string; number: number }> = {};
  for (let sem = 1; sem <= 8; sem++) {
    const created = await prisma.semester.create({
      data: {
        number: sem,
        courseId: btechCse.id,
      },
    });
    cseSemesters[sem] = created;
  }

  const itSemesters: Record<number, { id: string; number: number }> = {};
  for (let sem = 1; sem <= 4; sem++) {
    const created = await prisma.semester.create({
      data: {
        number: sem,
        courseId: btechIt.id,
      },
    });
    itSemesters[sem] = created;
  }

  const bcaSem1 = await prisma.semester.create({
    data: {
      number: 1,
      courseId: bca.id,
    },
  });
  await prisma.semester.create({
    data: {
      number: 2,
      courseId: bca.id,
    },
  });
  console.log(`✅ Created semesters across CSE (1-8), IT (1-4), and BCA (1-2)`);

  // 4. Seed Users (Admin, Moderator/Faculty, Student Council, Student)
  console.log("👤 Seeding Users...");
  const adminUser = await prisma.user.create({
    data: {
      name: "IPU Examination & Academic Admin",
      email: "admin@ipu.ac.in",
      role: Role.ADMIN,
    },
  });

  const facultyUser = await prisma.user.create({
    data: {
      name: "Dr. R. K. Sharma",
      email: "rksharma.cse@ipu.ac.in",
      role: Role.MODERATOR,
    },
  });

  const facultyAnanya = await prisma.user.create({
    data: {
      name: "Prof. Ananya Gupta",
      email: "ananya.cse@ipu.ac.in",
      role: Role.MODERATOR,
    },
  });

  const studentCouncilUser = await prisma.user.create({
    data: {
      name: "IPU Student Council",
      email: "council@ipu.ac.in",
      role: Role.MODERATOR,
    },
  });

  await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "aarav.cse26@ipu.ac.in",
      role: Role.STUDENT,
      courseId: btechCse.id,
      semester: 3,
    },
  });
  console.log(`✅ Created users (Admin, Faculty, Student Council, Student)`);

  // 5. Seed Subjects (At least 3 subjects)
  console.log("📖 Seeding Subjects...");
  // CSE Semester 3 Subjects
  const subjDs = await prisma.subject.create({
    data: {
      name: "Data Structures",
      code: "ETCS-201",
      semesterId: cseSemesters[3].id,
    },
  });

  const subjDbms = await prisma.subject.create({
    data: {
      name: "Database Management Systems",
      code: "ETCS-203",
      semesterId: cseSemesters[3].id,
    },
  });

  const subjCoa = await prisma.subject.create({
    data: {
      name: "Computer Architecture & Organization",
      code: "ETCS-205",
      semesterId: cseSemesters[3].id,
    },
  });

  const subjDm = await prisma.subject.create({
    data: {
      name: "Discrete Mathematics",
      code: "ETMA-207",
      semesterId: cseSemesters[3].id,
    },
  });

  // CSE Semester 4 Subjects
  const subjOs = await prisma.subject.create({
    data: {
      name: "Operating Systems",
      code: "ETCS-202",
      semesterId: cseSemesters[4].id,
    },
  });

  const subjAlgo = await prisma.subject.create({
    data: {
      name: "Design & Analysis of Algorithms",
      code: "ETCS-204",
      semesterId: cseSemesters[4].id,
    },
  });

  // IT Semester 3 Subjects
  const subjCn = await prisma.subject.create({
    data: {
      name: "Computer Networks & Protocols",
      code: "ETIT-203",
      semesterId: itSemesters[3].id,
    },
  });

  // BCA Semester 1 Subjects
  const subjCprog = await prisma.subject.create({
    data: {
      name: "Programming in C",
      code: "BCA-101",
      semesterId: bcaSem1.id,
    },
  });
  console.log(`✅ Created 8 subjects across multiple semesters`);

  // 6. Seed Units
  console.log("📑 Seeding Units...");
  // Units for Data Structures
  const unitDs1 = await prisma.unit.create({
    data: {
      name: "Unit 1: Linear Data Structures, Stacks & Queues",
      number: 1,
      subjectId: subjDs.id,
    },
  });
  const unitDs2 = await prisma.unit.create({
    data: {
      name: "Unit 2: Linked Lists & Dynamic Memory Allocation",
      number: 2,
      subjectId: subjDs.id,
    },
  });
  const unitDs3 = await prisma.unit.create({
    data: {
      name: "Unit 3: Non-Linear Structures: Trees & BSTs",
      number: 3,
      subjectId: subjDs.id,
    },
  });
  const unitDs4 = await prisma.unit.create({
    data: {
      name: "Unit 4: Graphs, Sorting & Hashing",
      number: 4,
      subjectId: subjDs.id,
    },
  });

  // Units for DBMS
  const unitDbms1 = await prisma.unit.create({
    data: {
      name: "Unit 1: Database Architecture & ER Modeling",
      number: 1,
      subjectId: subjDbms.id,
    },
  });
  const unitDbms2 = await prisma.unit.create({
    data: {
      name: "Unit 2: Relational Model & Complex SQL Queries",
      number: 2,
      subjectId: subjDbms.id,
    },
  });
  const unitDbms3 = await prisma.unit.create({
    data: {
      name: "Unit 3: Functional Dependencies & Normalization (1NF-BCNF)",
      number: 3,
      subjectId: subjDbms.id,
    },
  });
  const unitDbms4 = await prisma.unit.create({
    data: {
      name: "Unit 4: Transaction Processing & Concurrency Control",
      number: 4,
      subjectId: subjDbms.id,
    },
  });

  // Units for Operating Systems
  const unitOs1 = await prisma.unit.create({
    data: {
      name: "Unit 1: OS Overview & Process Management",
      number: 1,
      subjectId: subjOs.id,
    },
  });
  const unitOs2 = await prisma.unit.create({
    data: {
      name: "Unit 2: CPU Scheduling & Inter-Process Synchronization",
      number: 2,
      subjectId: subjOs.id,
    },
  });
  const unitOs3 = await prisma.unit.create({
    data: {
      name: "Unit 3: Memory Management & Paging / Virtual Memory",
      number: 3,
      subjectId: subjOs.id,
    },
  });
  const unitOs4 = await prisma.unit.create({
    data: {
      name: "Unit 4: File Systems Architecture & Disk Scheduling",
      number: 4,
      subjectId: subjOs.id,
    },
  });
  console.log(`✅ Created units for Data Structures, DBMS, and Operating Systems`);

  // 7. Seed Resources
  console.log("📂 Seeding Academic Resources...");
  await prisma.resource.createMany({
    data: [
      // Data Structures Resources
      {
        title: "Handwritten Master Notes: Stacks, Infix to Postfix & Queue Types",
        description:
          "Comprehensive lecture notes covering array implementation of stacks, recursion simulation, and circular queue mechanics with diagrams.",
        type: ResourceType.NOTES,
        fileUrl: "/sample-docs/ds-unit1-stacks.pdf",
        subjectId: subjDs.id,
        unitId: unitDs1.id,
        uploadedById: facultyUser.id,
        views: 1240,
        downloads: 512,
      },
      {
        title: "Unit 1 Lecture Slides: Array Representation & Applications",
        description:
          "Official faculty presentation explaining row/column-major ordering, sparse matrices representation, and stack frame execution.",
        type: ResourceType.PPT,
        fileUrl: "/sample-docs/ds-unit1-slides.pptx",
        subjectId: subjDs.id,
        unitId: unitDs1.id,
        uploadedById: facultyAnanya.id,
        views: 890,
        downloads: 340,
      },
      {
        title: "Lab Manual: Experiments 1-4 (Stack & Queue Implementation in C)",
        description:
          "Step-by-step lab exercise codes, test cases, and viva question bank for linear data structure lab assignments.",
        type: ResourceType.LAB_MANUAL,
        fileUrl: "/sample-docs/ds-lab-manual-part1.pdf",
        subjectId: subjDs.id,
        unitId: unitDs1.id,
        uploadedById: facultyUser.id,
        views: 1650,
        downloads: 980,
      },
      {
        title: "Most Repeated Unit 1 Mid-Sem & End-Sem Questions",
        description:
          "Curated compilation of 10-marker questions asked in IPU examinations between 2018-2025 with model answers.",
        type: ResourceType.IMPORTANT_QUESTIONS,
        fileUrl: "/sample-docs/ds-unit1-important-qs.pdf",
        subjectId: subjDs.id,
        unitId: unitDs1.id,
        uploadedById: studentCouncilUser.id,
        views: 2450,
        downloads: 1320,
      },
      {
        title: "Linked Lists Complete Architecture & Pointer Manipulation Guide",
        description:
          "Detailed breakdown of memory allocation, pointer rewiring in singly, doubly, and circular linked lists with C code snippets.",
        type: ResourceType.NOTES,
        fileUrl: "/sample-docs/ds-unit2-linked-lists.pdf",
        subjectId: subjDs.id,
        unitId: unitDs2.id,
        uploadedById: facultyAnanya.id,
        views: 920,
        downloads: 410,
      },
      {
        title: "Polynomial Addition & Multiplication using Linked List (Assignment)",
        description:
          "Problem statements and template code for assignment 2 due prior to mid-semester evaluations.",
        type: ResourceType.ASSIGNMENT,
        fileUrl: "/sample-docs/ds-assignment-2.pdf",
        subjectId: subjDs.id,
        unitId: unitDs2.id,
        uploadedById: facultyUser.id,
        views: 630,
        downloads: 295,
      },
      {
        title: "AVL Trees Rotation Cheat Sheet & Binary Tree Traversals",
        description:
          "Quick revision formula sheet for LL, RR, LR, RL tree rotations, height balancing, and recursive/iterative traversals.",
        type: ResourceType.REVISION_MATERIAL,
        fileUrl: "/sample-docs/ds-unit3-avl-rotations.pdf",
        subjectId: subjDs.id,
        unitId: unitDs3.id,
        uploadedById: studentCouncilUser.id,
        views: 1890,
        downloads: 870,
      },
      {
        title: "Graph Algorithms: BFS, DFS, Dijkstra & Minimum Spanning Trees",
        description:
          "Implementation codes, step-by-step trace examples, and complexity analyses for Prim's and Kruskal's algorithms.",
        type: ResourceType.NOTES,
        fileUrl: "/sample-docs/ds-unit4-graphs.pdf",
        subjectId: subjDs.id,
        unitId: unitDs4.id,
        uploadedById: facultyUser.id,
        views: 1420,
        downloads: 670,
      },
      // DBMS Resources
      {
        title: "Relational Database Concepts & Enhanced ER Diagram Modeling",
        description:
          "Complete guide on entities, relationships, cardinalities, generalization, specialization, and aggregation.",
        type: ResourceType.PDF,
        fileUrl: "/sample-docs/dbms-er-diagrams.pdf",
        subjectId: subjDbms.id,
        unitId: unitDbms1.id,
        uploadedById: facultyUser.id,
        views: 1100,
        downloads: 480,
      },
      {
        title: "Advanced SQL & Relational Algebra Practical Lab Manual",
        description:
          "Hands-on queries covering nested subqueries, joins, aggregate functions, views, and integrity triggers.",
        type: ResourceType.LAB_MANUAL,
        fileUrl: "/sample-docs/dbms-sql-lab-manual.pdf",
        subjectId: subjDbms.id,
        unitId: unitDbms2.id,
        uploadedById: facultyAnanya.id,
        views: 1780,
        downloads: 890,
      },
      {
        title: "Normalization Masterclass: 1NF through BCNF with Step-by-Step Solved Proofs",
        description:
          "Clear decomposition steps, finding candidate keys, closure of attribute sets, and proving lossless join / dependency preservation.",
        type: ResourceType.NOTES,
        fileUrl: "/sample-docs/dbms-normalization-guide.pdf",
        subjectId: subjDbms.id,
        unitId: unitDbms3.id,
        uploadedById: facultyUser.id,
        views: 3100,
        downloads: 1750,
      },
      {
        title: "10 Years Solved Normalization Questions (IPU End-Term)",
        description:
          "Every functional dependency problem asked in IPU end-semester exams from 2015 to 2025 solved with explanations.",
        type: ResourceType.IMPORTANT_QUESTIONS,
        fileUrl: "/sample-docs/dbms-pyq-normalization.pdf",
        subjectId: subjDbms.id,
        unitId: unitDbms3.id,
        uploadedById: studentCouncilUser.id,
        views: 2980,
        downloads: 1620,
      },
      {
        title: "Official IPU DBMS Syllabus & Prescribed Textbook References",
        description:
          "Complete curriculum structure, marking scheme, internal assessment breakdown, and recommended readings (Korth & Navathe).",
        type: ResourceType.PDF,
        fileUrl: "/sample-docs/dbms-syllabus-ipu.pdf",
        subjectId: subjDbms.id,
        unitId: null,
        uploadedById: adminUser.id,
        views: 1420,
        downloads: 650,
      },
      // Operating Systems Resources
      {
        title: "Introduction to Operating Systems: Kernel Architectures & System Calls",
        description:
          "Overview of monolithic vs microkernels, dual-mode operation, process states, and PCB data structure.",
        type: ResourceType.PDF,
        fileUrl: "/sample-docs/os-unit1-intro.pdf",
        subjectId: subjOs.id,
        unitId: unitOs1.id,
        uploadedById: facultyAnanya.id,
        views: 990,
        downloads: 430,
      },
      {
        title: "Process Scheduling Algorithms & Gantt Chart Solved Examples",
        description:
          "FCFS, SJF, Round Robin, and Priority Scheduling calculations including average waiting time and turnaround time calculations.",
        type: ResourceType.NOTES,
        fileUrl: "/sample-docs/os-unit2-scheduling.pdf",
        subjectId: subjOs.id,
        unitId: unitOs2.id,
        uploadedById: facultyUser.id,
        views: 1540,
        downloads: 710,
      },
      {
        title: "Virtual Memory & Page Replacement Algorithms (FIFO, LRU, Optimal)",
        description:
          "Detailed explanation of paging, segmentation, TLB hit/miss ratio, and page fault calculations.",
        type: ResourceType.NOTES,
        fileUrl: "/sample-docs/os-unit3-memory.pdf",
        subjectId: subjOs.id,
        unitId: unitOs3.id,
        uploadedById: facultyAnanya.id,
        views: 1390,
        downloads: 620,
      },
      {
        title: "Disk Scheduling Algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK)",
        description:
          "Seek time calculations and head movement analysis with graphical charts and solved past exam questions.",
        type: ResourceType.REVISION_MATERIAL,
        fileUrl: "/sample-docs/os-unit4-disk-scheduling.pdf",
        subjectId: subjOs.id,
        unitId: unitOs4.id,
        uploadedById: facultyUser.id,
        views: 1120,
        downloads: 530,
      },
      // Algorithms & Networks & C Programming Resources
      {
        title: "Dynamic Programming & Greedy Approaches Quick Study Guide",
        description:
          "Optimal substructure, memoization vs tabulation, knapsack, and matrix chain multiplication formulas.",
        type: ResourceType.NOTES,
        fileUrl: "/sample-docs/algo-dp-notes.pdf",
        subjectId: subjAlgo.id,
        unitId: null,
        uploadedById: facultyAnanya.id,
        views: 1250,
        downloads: 610,
      },
      {
        title: "OSI vs TCP/IP Protocol Stack Reference Architecture",
        description:
          "Layer-by-layer protocols, header structures, packet flow, and IP addressing subnetting cheat sheet.",
        type: ResourceType.PDF,
        fileUrl: "/sample-docs/cn-protocols-overview.pdf",
        subjectId: subjCn.id,
        unitId: null,
        uploadedById: facultyUser.id,
        views: 1670,
        downloads: 840,
      },
      {
        title: "C Programming Language Fundamentals & Syntax Handbook",
        description:
          "Variables, loops, pointers, functions, dynamic memory management, and file operations in C with examples.",
        type: ResourceType.NOTES,
        fileUrl: "/sample-docs/cprog-handbook.pdf",
        subjectId: subjCprog.id,
        unitId: null,
        uploadedById: facultyUser.id,
        views: 2100,
        downloads: 1150,
      },
    ],
  });
  console.log(`✅ Created academic resources across multiple subjects and units`);

  // 8. Seed Previous Year Questions (PYQs)
  console.log("📝 Seeding Previous Year Questions (PYQs)...");
  await prisma.pYQ.createMany({
    data: [
      // Data Structures PYQs
      {
        subjectId: subjDs.id,
        year: 2025,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/ds-2025-end-term.pdf",
      },
      {
        subjectId: subjDs.id,
        year: 2024,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/ds-2024-end-term.pdf",
      },
      {
        subjectId: subjDs.id,
        year: 2024,
        examType: ExamType.MID_SEM,
        fileUrl: "/sample-papers/ds-2024-mid-term.pdf",
      },
      {
        subjectId: subjDs.id,
        year: 2024,
        examType: ExamType.PRACTICAL,
        fileUrl: "/sample-papers/ds-2024-lab-viva.pdf",
      },
      {
        subjectId: subjDs.id,
        year: 2023,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/ds-2023-end-term.pdf",
      },
      // DBMS PYQs
      {
        subjectId: subjDbms.id,
        year: 2025,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/dbms-2025-end-term.pdf",
      },
      {
        subjectId: subjDbms.id,
        year: 2024,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/dbms-2024-end-term.pdf",
      },
      {
        subjectId: subjDbms.id,
        year: 2024,
        examType: ExamType.MID_SEM,
        fileUrl: "/sample-papers/dbms-2024-mid-term.pdf",
      },
      {
        subjectId: subjDbms.id,
        year: 2023,
        examType: ExamType.PRACTICAL,
        fileUrl: "/sample-papers/dbms-2023-practical-sql.pdf",
      },
      // COA PYQs
      {
        subjectId: subjCoa.id,
        year: 2024,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/coa-2024-end-term.pdf",
      },
      {
        subjectId: subjCoa.id,
        year: 2023,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/coa-2023-end-term.pdf",
      },
      // Discrete Math Special / Other PYQ
      {
        subjectId: subjDm.id,
        year: 2022,
        examType: ExamType.OTHER,
        fileUrl: "/sample-papers/dm-2022-special-reappear.pdf",
      },
      // OS PYQ
      {
        subjectId: subjOs.id,
        year: 2024,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/os-2024-end-term.pdf",
      },
      // Algorithms PYQ
      {
        subjectId: subjAlgo.id,
        year: 2024,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/algo-2024-end-term.pdf",
      },
      // Computer Networks PYQ
      {
        subjectId: subjCn.id,
        year: 2024,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/cn-2024-end-term.pdf",
      },
      // Programming in C PYQ
      {
        subjectId: subjCprog.id,
        year: 2024,
        examType: ExamType.END_SEM,
        fileUrl: "/sample-papers/cprog-2024-end-term.pdf",
      },
    ],
  });
  console.log(`✅ Created PYQ papers across multiple subjects, years, and exam types`);

  // 9. Seed Question Bank Questions
  console.log("❓ Seeding Question Bank...");
  await prisma.question.createMany({
    data: [
      {
        subjectId: subjDs.id,
        unitId: unitDs1.id,
        topic: "Stacks & Queues",
        difficulty: Difficulty.EASY,
        text: "Explain the difference between a Linear Queue and a Circular Queue. Why is a Circular Queue preferred?",
        answer:
          "In a linear queue, when elements are dequeued, empty memory spaces at the front cannot be reused even if rear reaches maximum capacity. A circular queue connects the last position back to the first position modulo N, eliminating memory wastage.",
      },
      {
        subjectId: subjDs.id,
        unitId: unitDs1.id,
        topic: "Expression Evaluation",
        difficulty: Difficulty.MEDIUM,
        text: "Write an algorithm to convert an Infix arithmetic expression to Postfix notation using a stack.",
        answer:
          "Iterate tokens: operands go directly to output; open parentheses push to stack; operators pop higher or equal precedence operators to output before pushing; close parenthesis pops until matching open parenthesis.",
      },
      {
        subjectId: subjDs.id,
        unitId: unitDs3.id,
        topic: "AVL Trees",
        difficulty: Difficulty.HARD,
        text: "Define AVL tree balance factor. Explain with diagrams LL, RR, LR, and RL rotations used to restore balance upon node insertion.",
        answer:
          "Balance factor = Height(Left Subtree) - Height(Right Subtree). An AVL tree maintains balance factor in {-1, 0, 1}. Single rotations (LL, RR) fix monotonic imbalance; double rotations (LR, RL) first rotate child then grandchild.",
      },
      {
        subjectId: subjDbms.id,
        unitId: unitDbms3.id,
        topic: "Functional Dependencies & Normalization",
        difficulty: Difficulty.MEDIUM,
        text: "Explain Boyce-Codd Normal Form (BCNF). How does it differ from Third Normal Form (3NF)?",
        answer:
          "A relation R is in BCNF if for every non-trivial functional dependency X -> Y, X is a superkey. 3NF allows Y to be a prime attribute even if X is not a superkey. Every BCNF schema is in 3NF, but not vice versa.",
      },
      {
        subjectId: subjDbms.id,
        unitId: unitDbms4.id,
        topic: "Concurrency Control",
        difficulty: Difficulty.HARD,
        text: "Explain Two-Phase Locking (2PL) protocol. Contrast Strict 2PL and Rigorous 2PL with respect to cascading rollbacks.",
        answer:
          "2PL enforces a growing phase (only acquiring locks) and shrinking phase (only releasing locks). Strict 2PL holds all exclusive locks until transaction commit/abort, guaranteeing conflict serializability without cascading aborts.",
      },
    ],
  });
  console.log(`✅ Created Question Bank entries across Easy, Medium, and Hard difficulties`);

  // 10. Seed Notices
  console.log("📢 Seeding University and Academic Notices...");
  await prisma.notice.createMany({
    data: [
      {
        title: "End Term Theory & Practical Examination Date Sheet - Dec 2026",
        description:
          "Official schedule for B.Tech (All Branches), BCA, and MCA Odd Semester Regular and Re-appear theory and practical examinations. Students must report 30 minutes prior to exam start.",
        category: NoticeCategory.EXAMINATION,
        attachmentUrl: "/sample-notices/end-term-datesheet-dec2026.pdf",
        source: "Controller of Examinations, GGSIPU",
        published: true,
        publishedById: adminUser.id,
      },
      {
        title: "Guidelines & Admit Card Distribution for Odd Semester Examinations 2026",
        description:
          "Admit cards for the upcoming semester examinations are available for download via student portal. Verified college stamp and signature of director/principal is mandatory.",
        category: NoticeCategory.EXAMINATION,
        attachmentUrl: "/sample-notices/admit-card-instructions.pdf",
        source: "Academic Branch, GGSIPU",
        published: true,
        publishedById: adminUser.id,
      },
      {
        title: "Revised Academic Calendar for B.Tech & BCA Programs (Academic Session 2026-27)",
        description:
          "Detailed schedule including semester commencement dates, mid-semester evaluations, minor tests, preparatory holidays, and semester break intervals.",
        category: NoticeCategory.ACADEMIC,
        attachmentUrl: "/sample-notices/academic-calendar-2026-27.pdf",
        source: "Dean, Academic Affairs, GGSIPU",
        published: true,
        publishedById: adminUser.id,
      },
      {
        title: "Registration & Semester Fee Submission Notice for Academic Session 2026",
        description:
          "All enrolled students from Semesters 3, 5, and 7 must complete subject registration and deposit semester fees through the centralized university payment gateway by September 15, 2026.",
        category: NoticeCategory.REGISTRATION,
        attachmentUrl: "/sample-notices/fee-circular-2026.pdf",
        source: "Finance & Accounts Branch, GGSIPU",
        published: true,
        publishedById: adminUser.id,
      },
      {
        title: "Annual Inter-College Technical Hackathon 'HackIPU 2026' Announced",
        description:
          "Registrations are open for the 36-hour flagship hackathon organized across Web3, AI/ML, and Open Innovation tracks. Prizes worth INR 5 Lakhs.",
        category: NoticeCategory.COLLEGE,
        attachmentUrl: "/sample-notices/hackipu-2026-brochure.pdf",
        source: "University Technical Club & ACM Student Chapter",
        published: true,
        publishedById: adminUser.id,
      },
      {
        title: "Central University Library Extended Working Hours During Exam Period",
        description:
          "The central library reading rooms and digital repository section will remain open 24/7 starting from November 15, 2026 until the conclusion of semester end-term examinations.",
        category: NoticeCategory.GENERAL,
        attachmentUrl: null,
        source: "Chief Librarian, University Information Resource Centre",
        published: true,
        publishedById: adminUser.id,
      },
    ],
  });
  console.log(`✅ Created university and academic notices across multiple categories`);

  console.log("\n✨ Database seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Error during database seeding:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
