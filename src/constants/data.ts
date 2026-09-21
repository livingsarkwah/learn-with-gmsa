import type { Resource, Course, Program, MonthlyDownloadPoint } from "../types";

// ─── Taxonomy ─────────────────────────────────────────────────────────────────

export const COLLEGES = [
  "College of Agriculture and Natural Resources",
  "College of Humanities and Social Sciences",
  "College of Engineering",
  "College of Art and Built Environment",
  "College of Science",
  "College of Health Sciences",
] as const;

export const COLLEGE_PROGRAMS: Record<string, string[]> = {
  "College of Agriculture and Natural Resources": [
    "BSc. Agriculture",
    "BSc. Natural Resources Management",
    "BSc. Landscape Design and Management",
    "BSc. Agricultural Biotechnology",
    "BSc. Agribusiness Management",
    "BSc. Forest Resources Technology",
    "BSc. Packaging Technology",
    "BSc. Aquaculture & Water Resources Management",
  ],
  "College of Humanities and Social Sciences": [
    "BA. Akan Language and Culture",
    "BA. Economics",
    "BA. English",
    "BA. French and Francophone Studies",
    "BA. Geography and Rural Development",
    "BA. History",
    "BA. Linguistics",
    "BA. Media and Communication Studies",
    "BA. Political Studies",
    "Bachelor of Public Administration",
    "BA. Religion and Human Development",
    "BA. Sociology",
    "BA. Social Work",
    "BSc. Business Administration (Human Resource Management/Management)",
    "BSc. Business Administration (Marketing/International Business)",
    "BSc. Business Administration (Accounting/Banking and Finance)",
    "BSc. Business Administration (Logistics and Supply Chain Management/Business Information Technology)",
    "BSc. Hospitality and Tourism Management",
    "LLB (4 years)",
    "LLB (3 years for Degree Holders)",
  ],
  "College of Engineering": [
    "BSc. Agricultural Engineering",
    "BSc. Chemical Engineering",
    "BSc. Civil Engineering",
    "BSc. Geomatic Engineering",
    "BSc. Materials Engineering",
    "BSc. Mechanical Engineering",
    "BSc. Electrical & Electronic Engineering",
    "BSc. Computer Engineering",
    "BSc. Aerospace Engineering",
    "BSc. Petroleum Engineering",
    "BSc. Telecommunication Engineering",
    "BSc. Geological Engineering",
    "BSc. Biomedical Engineering",
    "BSc. Petrochemical Engineering",
    "BSc. Metallurgical Engineering",
    "BSc. Automobile Engineering",
    "BSc. Industrial Engineering",
    "BSc. Marine Engineering",
  ],
  "College of Art and Built Environment": [
    "BSc. Architecture",
    "BSc. Construction Technology & Management",
    "BSc. Quantity Surveying & Construction Economics",
    "BSc. Development Planning",
    "BSc. Human Settlement Planning",
    "BSc. Land Economy",
    "BSc. Real Estate",
    "BFA. Fine Art and Curatorial Practice",
    "BA. Communication Design (Graphic Design)",
    "BSc. Fashion Design",
    "BSc. Textile Design and Technology",
    "BFA. Ceramics",
    "BSc. Ceramic Technology",
    "BSc. Metal Product Design and Technology",
    "BA. Integrated Rural Art and Industry",
    "BA. Publishing Studies",
    "B.Ed. Junior High School Education",
    "B.Ed. Chemistry",
    "B.Ed. Biology",
    "B.Ed. Mathematics",
    "B.Ed. Physics",
    "B.Ed. STEM (Aviation and Aerospace)",
    "B.Ed. STEM (Manufacturing)",
    "B.Ed. STEM (Robotics)",
    "B.Ed. STEM (Biomedical Science)",
    "B.Ed. Art and Design Technology",
    "B.Ed. ICT",
  ],
  "College of Science": [
    "BSc. Biochemistry",
    "BSc. Food Science and Technology",
    "BSc. Human Nutrition",
    "BSc. Dietetics",
    "BSc. Biological Sciences",
    "BSc. Environmental Science",
    "BSc. Chemistry",
    "BSc. Science Laboratory Technology",
    "BSc. Computer Science",
    "BSc. Information Technology",
    "BSc. Mathematics",
    "BSc. Statistics",
    "BSc. Physics",
    "BSc. Actuarial Science",
    "Doctor of Optometry (OD)",
    "BSc. Meteorology and Climate Science",
  ],
  "College of Health Sciences": [
    "Doctor of Pharmacy (Pharm D)",
    "BSc. Herbal Medicine",
    "BSc. Human Biology (Medicine)",
    "BSc. Medical Laboratory Science",
    "BSc. Physiotherapy and Sports Science",
    "BSc. Medical Imaging",
    "BSc. Nursing",
    "BSc. Midwifery",
    "Bachelor of Dental Surgery (BDS)",
    "Doctor of Veterinary Medicine (DVM)",
    "BSc. Disability & Rehabilitation Studies",
  ],
};

export const PROGRAMS: string[] = Object.values(COLLEGE_PROGRAMS).flat();

export const COLLECTIONS = [
  "Assignments",
  "Lab Reports",
  "Lecture Notes",
  "Past Questions",
  "Slides",
  "Textbooks",
  "Tutorials",
  "Videos",
  "Project Reports",
] as const;

export const LEVELS    = ["100", "200", "300", "400", "500", "600"] as const;
export const SEMESTERS = ["First", "Second"] as const;
export const RESOURCE_TYPES = ["PDF", "Video", "Document"] as const;

// ─── Collection styling ───────────────────────────────────────────────────────

export const COLLECTION_ACCENT: Record<string, { dot: string; badge: string; dark: string }> = {
  "Lecture Notes":  { dot: "#16a34a", badge: "bg-emerald-100 text-emerald-800", dark: "dark:bg-emerald-900/40 dark:text-emerald-300" },
  "Past Questions": { dot: "#dc2626", badge: "bg-red-100 text-red-800",         dark: "dark:bg-red-900/40 dark:text-red-300" },
  "Tutorials":      { dot: "#2563eb", badge: "bg-blue-100 text-blue-800",        dark: "dark:bg-blue-900/40 dark:text-blue-300" },
  "Slides":         { dot: "#7c3aed", badge: "bg-violet-100 text-violet-800",    dark: "dark:bg-violet-900/40 dark:text-violet-300" },
  "Textbooks":      { dot: "#d97706", badge: "bg-amber-100 text-amber-800",      dark: "dark:bg-amber-900/40 dark:text-amber-300" },
  "Videos":         { dot: "#e11d48", badge: "bg-rose-100 text-rose-800",        dark: "dark:bg-rose-900/40 dark:text-rose-300" },
  "Assignments":    { dot: "#ea580c", badge: "bg-orange-100 text-orange-800",    dark: "dark:bg-orange-900/40 dark:text-orange-300" },
  "Lab Materials":  { dot: "#0891b2", badge: "bg-cyan-100 text-cyan-800",        dark: "dark:bg-cyan-900/40 dark:text-cyan-300" },
};

// ─── Resources ────────────────────────────────────────────────────────────────


export const ALL_RESOURCES: Resource[] = [
  // ── College of Engineering ────────────────────────────────────────────────
  {
    id: 1, title: "Fluid Mechanics — Complete Lecture Notes", courseCode: "ME 305",
    courseTitle: "Fluid Mechanics I", program: "BSc. Mechanical Engineering",
    collection: "Lecture Notes", type: "PDF", downloads: 1243, views: 4821,
    tags: ["fluid dynamics", "viscosity", "bernoulli", "pipe flow"],
    description: "Comprehensive notes covering all 14 weeks of ME 305: fluid statics, kinematics, the Bernoulli equation, viscous pipe flow, and boundary layer theory.",
    level: "300", semester: "First", featured: true, uploadDate: "2024-09-15", status: "published",
  },
  {
    id: 2, title: "Structural Analysis II — Tutorial Sheets 1–6", courseCode: "CE 402",
    courseTitle: "Structural Analysis II", program: "BSc. Civil Engineering",
    collection: "Tutorials", type: "PDF", downloads: 892, views: 3104,
    tags: ["stiffness method", "indeterminate structures", "moment distribution"],
    description: "Six tutorial sheets covering indeterminate structures, the stiffness method, moment distribution, and influence lines.",
    level: "400", semester: "First", featured: true, uploadDate: "2024-09-20", status: "published",
  },
  {
    id: 3, title: "Digital Logic Design — Full Lecture Slides", courseCode: "CE 301",
    courseTitle: "Digital Logic Design", program: "BSc. Computer Engineering",
    collection: "Slides", type: "PDF", downloads: 2104, views: 6732,
    tags: ["logic gates", "boolean algebra", "flip-flops", "FSM", "VHDL"],
    description: "All 14 weeks of lecture slides for CE 301. Covers combinational and sequential circuits, Karnaugh maps, finite state machines, and VHDL basics.",
    level: "300", semester: "First", featured: true, uploadDate: "2024-08-28", status: "published", 
  },
  {
    id: 4, title: "Engineering Thermodynamics I — 10 Years Past Questions", courseCode: "ME 201",
    courseTitle: "Engineering Thermodynamics I", program: "BSc. Mechanical Engineering",
    collection: "Past Questions", type: "PDF", downloads: 3511, views: 9204,
    tags: ["thermodynamics", "entropy", "Rankine cycle", "heat work"],
    description: "Past exam questions for ME 201, 2014–2024. Organised by topic with model answers for 2020–2024.",
    level: "200", semester: "First", uploadDate: "2024-07-10", status: "published",
  },
  {
    id: 5, title: "Engineering Circuit Analysis — Hayt & Kemmerly 9th Ed.", courseCode: "EE 201",
    courseTitle: "Circuit Theory I", program: "BSc. Electrical & Electronic Engineering",
    collection: "Textbooks", type: "PDF", downloads: 4201, views: 11500,
    tags: ["KVL", "KCL", "AC circuits", "nodal analysis", "Laplace"],
    description: "The complete recommended textbook for EE 201 and EE 202. Covers DC analysis, AC steady-state, transient response, and Laplace-domain methods.",
    level: "200", semester: "First", uploadDate: "2024-06-05", status: "published",
  },
  {
    id: 6, title: "Concrete Technology — Lab Manual & Report Templates", courseCode: "CE 403",
    courseTitle: "Concrete Technology", program: "BSc. Civil Engineering",
    collection: "Lab Materials", type: "PDF", downloads: 677, views: 2211,
    tags: ["mix design", "compressive strength", "slump test", "ASTM"],
    description: "Official lab manual for CE 403 including procedure guides, data sheets, and report templates for all six lab sessions.",
    level: "400", semester: "Second", uploadDate: "2024-09-01", status: "published",
  },
  {
    id: 7, title: "Data Structures and Algorithms — Lecture Notes", courseCode: "CE 302",
    courseTitle: "Data Structures and Algorithms", program: "BSc. Computer Engineering",
    collection: "Lecture Notes", type: "PDF", downloads: 1876, views: 5430,
    tags: ["arrays", "linked lists", "trees", "sorting", "graph algorithms"],
    description: "Complete lecture notes for CE 302 with Python implementations covering arrays, trees, sorting, and graph algorithms.",
    level: "300", semester: "Second", uploadDate: "2024-09-18", status: "published",
  },
  {
    id: 8, title: "Heat & Mass Transfer — Video Lecture Series", courseCode: "ME 405",
    courseTitle: "Heat and Mass Transfer", program: "BSc. Mechanical Engineering",
    collection: "Videos", type: "Video", downloads: 534, views: 7892,
    tags: ["conduction", "convection", "radiation", "heat exchangers"],
    description: "12-episode video lecture series for ME 405 by Prof. E. Mensah. Each ~45-minute episode covers one topic with solved exam problems.",
    level: "400", semester: "First", featured: true, uploadDate: "2024-09-10", status: "published",
  },
  {
    id: 9, title: "Engineering Mathematics I — Tutorial Booklet", courseCode: "GE 101",
    courseTitle: "Engineering Mathematics I", program: "BSc. Mechanical Engineering",
    collection: "Tutorials", type: "PDF", downloads: 5102, views: 14300,
    tags: ["calculus", "differential equations", "linear algebra", "vectors"],
    description: "Comprehensive tutorial booklet for GE 101 with 200+ solved problems. Suitable for all engineering programs.",
    level: "100", semester: "First", uploadDate: "2024-08-01", status: "published",
  },
  {
    id: 10, title: "Steel Structures Design — Past Questions 2019–2024", courseCode: "CE 501",
    courseTitle: "Steel Structures Design", program: "BSc. Civil Engineering",
    collection: "Past Questions", type: "PDF", downloads: 1032, views: 3211,
    tags: ["AISC", "tension members", "beams", "columns", "connections"],
    description: "CE 501 past examination questions from 2019 to 2024, organised by topic with AISC code references.",
    level: "500", semester: "First", uploadDate: "2024-08-25", status: "published",
  },
  {
    id: 11, title: "Embedded Systems — RTOS Implementation Assignment", courseCode: "CE 404",
    courseTitle: "Embedded Systems Design", program: "BSc. Computer Engineering",
    collection: "Assignments", type: "PDF", downloads: 443, views: 1820,
    tags: ["FreeRTOS", "ARM Cortex-M4", "task scheduling", "RTOS"],
    description: "Assignment 2 brief for CE 404. Students implement a RTOS on ARM Cortex-M4 using FreeRTOS.",
    level: "400", semester: "Second", uploadDate: "2024-10-01", status: "published",
  },
  {
    id: 12, title: "Engineering Materials I — Crystallography Slides", courseCode: "MT 201",
    courseTitle: "Engineering Materials I", program: "BSc. Materials Engineering",
    collection: "Slides", type: "PDF", downloads: 789, views: 2540,
    tags: ["crystal structure", "FCC", "BCC", "Miller indices", "XRD"],
    description: "Lecture slides for the crystallography module of MT 201: crystal systems, Bravais lattices, Miller indices, and XRD techniques.",
    level: "200", semester: "First", uploadDate: "2024-09-05", status: "draft",
  },
  // ── College of Science ────────────────────────────────────────────────────
  {
    id: 13, title: "General Chemistry I — Lecture Notes & Worked Examples", courseCode: "CH 101",
    courseTitle: "General Chemistry I", program: "BSc. Chemistry",
    collection: "Lecture Notes", type: "PDF", downloads: 2341, views: 7120,
    tags: ["atomic structure", "periodic table", "bonding", "stoichiometry"],
    description: "Complete lecture notes for CH 101 covering atomic theory, periodic trends, chemical bonding, and stoichiometry. Includes 60+ worked examples.",
    level: "100", semester: "First", featured: true, uploadDate: "2024-09-12", status: "published",
  },
  {
    id: 14, title: "Calculus I — Tutorial Booklet with Solutions", courseCode: "MA 101",
    courseTitle: "Calculus I", program: "BSc. Mathematics",
    collection: "Tutorials", type: "PDF", downloads: 3890, views: 10240,
    tags: ["limits", "derivatives", "integration", "fundamental theorem"],
    description: "200+ solved calculus problems covering limits, differentiation, and integration. Mapped to MA 101 weekly topics.",
    level: "100", semester: "First", uploadDate: "2024-08-20", status: "published",
  },
  {
    id: 15, title: "Probability and Statistics — Past Questions 2018–2024", courseCode: "ST 201",
    courseTitle: "Probability and Statistics", program: "BSc. Statistics",
    collection: "Past Questions", type: "PDF", downloads: 1672, views: 4830,
    tags: ["probability", "distributions", "hypothesis testing", "regression"],
    description: "ST 201 past exam questions with marking schemes for 2020–2024. Topics include probability theory, discrete and continuous distributions.",
    level: "200", semester: "First", uploadDate: "2024-07-30", status: "published",
  },
  {
    id: 16, title: "Introduction to Programming — Python Video Series", courseCode: "CS 101",
    courseTitle: "Introduction to Programming", program: "BSc. Computer Science",
    collection: "Videos", type: "Video", downloads: 4102, views: 13450,
    tags: ["python", "programming basics", "functions", "OOP"],
    description: "10-part video series introducing Python programming for CS 101. Covers data types, control flow, functions, and object-oriented basics.",
    level: "100", semester: "First", featured: true, uploadDate: "2024-09-08", status: "published",
  },
  {
    id: 17, title: "Biochemistry I — Amino Acids & Proteins Slides", courseCode: "BC 201",
    courseTitle: "Biochemistry I", program: "BSc. Biochemistry",
    collection: "Slides", type: "PDF", downloads: 987, views: 3210,
    tags: ["amino acids", "proteins", "enzymes", "metabolism"],
    description: "Lecture slides for the amino acids, protein structure, and enzyme kinetics modules of BC 201.",
    level: "200", semester: "First", uploadDate: "2024-09-22", status: "published",
  },
  // ── College of Agriculture and Natural Resources ───────────────────────────
  {
    id: 18, title: "Principles of Agronomy — Lecture Notes", courseCode: "AG 201",
    courseTitle: "Principles of Agronomy", program: "BSc. Agriculture",
    collection: "Lecture Notes", type: "PDF", downloads: 1102, views: 3680,
    tags: ["soil science", "crop production", "irrigation", "pest management"],
    description: "Full lecture notes for AG 201 covering soil properties, crop physiology, irrigation techniques, and integrated pest management.",
    level: "200", semester: "First", uploadDate: "2024-09-03", status: "published",
  },
  {
    id: 19, title: "Food Processing Technology — Lab Manual", courseCode: "FS 301",
    courseTitle: "Food Processing Technology", program: "BSc. Food Science and Technology",
    collection: "Lab Materials", type: "PDF", downloads: 743, views: 2190,
    tags: ["food preservation", "HACCP", "thermal processing", "packaging"],
    description: "Lab manual for FS 301 with 8 practical sessions on food preservation, quality control, and packaging standards.",
    level: "300", semester: "Second", uploadDate: "2024-09-28", status: "published", 
  },
  {
    id: 20, title: "Forest Management — Tutorials & Case Studies", courseCode: "FR 302",
    courseTitle: "Forest Resource Management", program: "BSc. Forest Resources Technology",
    collection: "Tutorials", type: "PDF", downloads: 521, views: 1740,
    tags: ["silviculture", "forest inventory", "sustainable forestry", "GIS"],
    description: "Tutorial sheets and Ghana-specific case studies for FR 302. Covers timber valuation, inventory methods, and sustainable forest management plans.",
    level: "300", semester: "First", uploadDate: "2024-10-05", status: "published",
  },
  // ── College of Humanities and Social Sciences ─────────────────────────────
  {
    id: 21, title: "Principles of Economics — Lecture Slides", courseCode: "EC 101",
    courseTitle: "Principles of Economics", program: "BA. Economics",
    collection: "Slides", type: "PDF", downloads: 2890, views: 8430,
    tags: ["supply and demand", "elasticity", "market structures", "GDP"],
    description: "Complete slide deck for EC 101 covering microeconomic and macroeconomic fundamentals. Includes Ghana-specific case studies.",
    level: "100", semester: "First", featured: true, uploadDate: "2024-09-11", status: "published",
  },
  {
    id: 22, title: "Business Law — Past Questions 2019–2024", courseCode: "LW 201",
    courseTitle: "Business Law", program: "LLB (4 years)",
    collection: "Past Questions", type: "PDF", downloads: 1340, views: 4120,
    tags: ["contract law", "tort", "commercial law", "Ghana legal system"],
    description: "Past exam questions for LW 201 Business Law from 2019–2024 with model answers. Covers contract formation, breach, and remedies.",
    level: "200", semester: "Second", uploadDate: "2024-08-15", status: "published",
  },
  {
    id: 23, title: "Introduction to Media Studies — Textbook", courseCode: "MC 101",
    courseTitle: "Introduction to Media Studies", program: "BA. Media and Communication Studies",
    collection: "Textbooks", type: "PDF", downloads: 876, views: 2970,
    tags: ["media theory", "journalism", "broadcasting", "digital media"],
    description: "Core textbook for MC 101. Covers media history, theories of communication, journalism ethics, and digital media landscape.",
    level: "100", semester: "First", uploadDate: "2024-07-20", status: "published",
  },
  // ── College of Art and Built Environment ─────────────────────────────────
  {
    id: 24, title: "Architectural Design Studio II — Project Briefs", courseCode: "AR 202",
    courseTitle: "Architectural Design Studio II", program: "BSc. Architecture",
    collection: "Assignments", type: "PDF", downloads: 612, views: 2340,
    tags: ["design brief", "site analysis", "spatial planning", "sustainability"],
    description: "Project briefs and assessment criteria for AR 202 Studio II. Three projects: community centre, mixed-use urban infill, and adaptive reuse.",
    level: "200", semester: "Second", uploadDate: "2024-09-25", status: "published",
  },
  {
    id: 25, title: "Quantity Surveying Practice — Lecture Notes", courseCode: "QS 201",
    courseTitle: "Quantity Surveying Practice", program: "BSc. Quantity Surveying & Construction Economics",
    collection: "Lecture Notes", type: "PDF", downloads: 834, views: 2780,
    tags: ["bills of quantities", "cost estimation", "procurement", "NEC contract"],
    description: "Lecture notes for QS 201 covering measurement rules, bill of quantities preparation, cost planning, and procurement strategies.",
    level: "200", semester: "First", uploadDate: "2024-09-17", status: "published",
  },
  {
    id: 26, title: "Graphic Design Principles — Video Workshop Series", courseCode: "GD 102",
    courseTitle: "Graphic Design Principles", program: "BA. Communication Design (Graphic Design)",
    collection: "Videos", type: "Video", downloads: 1190, views: 5640,
    tags: ["typography", "colour theory", "layout", "Adobe Illustrator"],
    description: "8-part video workshop series for GD 102 covering typography, grid systems, colour theory, and Adobe Illustrator fundamentals.",
    level: "100", semester: "Second", uploadDate: "2024-10-02", status: "published",
  },
  // ── College of Health Sciences ────────────────────────────────────────────
  {
    id: 27, title: "Human Anatomy I — Complete Lecture Notes", courseCode: "AN 111",
    courseTitle: "Human Anatomy I", program: "BSc. Human Biology (Medicine)",
    collection: "Lecture Notes", type: "PDF", downloads: 3401, views: 11200,
    tags: ["gross anatomy", "histology", "musculoskeletal", "neuroanatomy"],
    description: "Comprehensive anatomy notes for AN 111 covering the musculoskeletal, cardiovascular, and nervous systems with detailed diagrams.",
    level: "100", semester: "First", featured: true, uploadDate: "2024-09-02", status: "published",
  },
  {
    id: 28, title: "Pharmacology II — Past Questions & Model Answers", courseCode: "PH 402",
    courseTitle: "Pharmacology II", program: "Doctor of Pharmacy (Pharm D)",
    collection: "Past Questions", type: "PDF", downloads: 1820, views: 5930,
    tags: ["pharmacokinetics", "drug interactions", "cardiovascular drugs", "antibiotics"],
    description: "PH 402 past exam questions 2018–2024 with model answers. Covers autonomic, cardiovascular, and anti-infective pharmacology.",
    level: "400", semester: "Second", uploadDate: "2024-08-10", status: "published",
  },
  {
    id: 29, title: "Medical Laboratory — Haematology Practical Manual", courseCode: "ML 301",
    courseTitle: "Haematology", program: "BSc. Medical Laboratory Science",
    collection: "Lab Materials", type: "PDF", downloads: 930, views: 3200,
    tags: ["blood films", "CBC", "haematological disorders", "microscopy"],
    description: "Practical manual for ML 301 Haematology. Covers full blood count interpretation, blood film preparation, and abnormal cell morphology.",
    level: "300", semester: "First", uploadDate: "2024-09-30", status: "published",
  },
  {
    id: 30, title: "Nursing Ethics & Professional Practice — Textbook", courseCode: "NS 201",
    courseTitle: "Nursing Ethics and Professional Practice", program: "BSc. Nursing",
    collection: "Textbooks", type: "PDF", downloads: 1105, views: 3780,
    tags: ["nursing ethics", "patient rights", "professional conduct", "Ghana health law"],
    description: "Core textbook for NS 201. Covers ethical frameworks, patient advocacy, professional conduct, and Ghana's health regulatory environment.",
    level: "200", semester: "First", uploadDate: "2024-07-25", status: "published",
  },
];

// ─── Popular courses (public) ─────────────────────────────────────────────────

export const POPULAR_COURSES = [
  { code: "GE 101", title: "Engineering Mathematics I",    program: "All Engineering Programs",  n: 22, level: "100" },
  { code: "ME 305", title: "Fluid Mechanics I",            program: "Mechanical Eng.",            n: 14, level: "300" },
  { code: "EC 101", title: "Principles of Economics",      program: "Economics",                  n: 18, level: "100" },
  { code: "CS 101", title: "Introduction to Programming",  program: "Computer Science",           n: 16, level: "100" },
  { code: "AN 111", title: "Human Anatomy I",              program: "Human Biology (Medicine)",   n: 12, level: "100" },
  { code: "CH 101", title: "General Chemistry I",          program: "Chemistry",                  n: 11, level: "100" },
];

// ─── Quick access categories ──────────────────────────────────────────────────

import { GraduationCap, Code, Briefcase, Rocket, Microscope } from "lucide-react";

export const QUICK_ACCESS = [
  { label: "Academics",        Icon: GraduationCap, palette: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40", desc: "Notes, slides & textbooks" },
  { label: "Technical Skills", Icon: Code,          palette: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40",                         desc: "Programming, CAD & labs" },
  { label: "Career Dev.",      Icon: Briefcase,     palette: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40",             desc: "CV guides & internships" },
  { label: "Projects",         Icon: Rocket,        palette: "bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40",       desc: "FYP & group project kits" },
  { label: "Research",         Icon: Microscope,    palette: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40",                   desc: "Journals & methodology" },
];

// ─── Admin data ───────────────────────────────────────────────────────────────

export const ADMIN_COURSES: Course[] = [
  { id: 1,  code: "GE 101", title: "Engineering Mathematics I",      program: "BSc. Mechanical Engineering",           level: "100", semester: "First",  resourceCount: 22 },
  { id: 2,  code: "ME 305", title: "Fluid Mechanics I",              program: "BSc. Mechanical Engineering",           level: "300", semester: "First",  resourceCount: 14 },
  { id: 3,  code: "EE 201", title: "Circuit Theory I",               program: "BSc. Electrical & Electronic Engineering", level: "200", semester: "First", resourceCount: 18 },
  { id: 4,  code: "CE 301", title: "Digital Logic Design",           program: "BSc. Computer Engineering",             level: "300", semester: "First",  resourceCount: 11 },
  { id: 5,  code: "ME 201", title: "Engineering Thermodynamics I",   program: "BSc. Mechanical Engineering",           level: "200", semester: "First",  resourceCount: 16 },
  { id: 6,  code: "CE 402", title: "Structural Analysis II",         program: "BSc. Civil Engineering",                level: "400", semester: "First",  resourceCount:  9 },
  { id: 7,  code: "CH 101", title: "General Chemistry I",            program: "BSc. Chemistry",                        level: "100", semester: "First",  resourceCount: 11 },
  { id: 8,  code: "CS 101", title: "Introduction to Programming",    program: "BSc. Computer Science",                 level: "100", semester: "First",  resourceCount: 16 },
  { id: 9,  code: "AN 111", title: "Human Anatomy I",               program: "BSc. Human Biology (Medicine)",         level: "100", semester: "First",  resourceCount: 12 },
  { id: 10, code: "EC 101", title: "Principles of Economics",        program: "BA. Economics",                         level: "100", semester: "First",  resourceCount: 18 },
];

export const ADMIN_PROGRAMS: Program[] = [
  { id: 1,  name: "BSc. Mechanical Engineering",              college: "College of Engineering",                   courseCount: 42, resourceCount: 312 },
  { id: 2,  name: "BSc. Civil Engineering",                   college: "College of Engineering",                   courseCount: 38, resourceCount: 287 },
  { id: 3,  name: "BSc. Computer Engineering",                college: "College of Engineering",                   courseCount: 35, resourceCount: 241 },
  { id: 4,  name: "BSc. Electrical & Electronic Engineering", college: "College of Engineering",                   courseCount: 40, resourceCount: 298 },
  { id: 5,  name: "BSc. Chemistry",                           college: "College of Science",                       courseCount: 28, resourceCount: 176 },
  { id: 6,  name: "BSc. Computer Science",                    college: "College of Science",                       courseCount: 32, resourceCount: 214 },
  { id: 7,  name: "BSc. Mathematics",                         college: "College of Science",                       courseCount: 26, resourceCount: 158 },
  { id: 8,  name: "BA. Economics",                            college: "College of Humanities and Social Sciences",courseCount: 30, resourceCount: 189 },
  { id: 9,  name: "BSc. Human Biology (Medicine)",            college: "College of Health Sciences",               courseCount: 45, resourceCount: 362 },
  { id: 10, name: "Doctor of Pharmacy (Pharm D)",             college: "College of Health Sciences",               courseCount: 38, resourceCount: 291 },
  { id: 11, name: "BSc. Agriculture",                         college: "College of Agriculture and Natural Resources", courseCount: 29, resourceCount: 143 },
  { id: 12, name: "BSc. Architecture",                        college: "College of Art and Built Environment",     courseCount: 34, resourceCount: 198 },
];

 
// ─── Analytics chart data ─────────────────────────────────────────────────────

export const MONTHLY_DOWNLOADS: MonthlyDownloadPoint[] = [
  { month: "Dec",  downloads: 3200,  uploads: 18 },
  { month: "Jan",  downloads: 4100,  uploads: 24 },
  { month: "Feb",  downloads: 5800,  uploads: 31 },
  { month: "Mar",  downloads: 7200,  uploads: 28 },
  { month: "Apr",  downloads: 6100,  uploads: 22 },
  { month: "May",  downloads: 5400,  uploads: 19 },
  { month: "Jun",  downloads: 3800,  uploads: 14 },
  { month: "Jul",  downloads: 2900,  uploads: 10 },
  { month: "Aug",  downloads: 4200,  uploads: 21 },
  { month: "Sep",  downloads: 8900,  uploads: 47 },
  { month: "Oct",  downloads: 11200, uploads: 52 },
  { month: "Nov",  downloads: 9800,  uploads: 38 },
];

// ─── Admin stats ──────────────────────────────────────────────────────────────

export const ADMIN_STATS = {
  totalResources:    12480,
  totalDownloads:    214390,
  registeredMembers: 8214,
  storageUsedGB:     38.7,
  storageMaxGB:      100,
  resourcesDelta:    "+18%",
  downloadsDelta:    "+31%",
  membersDelta:      "+22%",
  storageDelta:      "+14%",
};
