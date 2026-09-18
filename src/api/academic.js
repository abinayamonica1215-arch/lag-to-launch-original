import apiClient from './client';

export const DEPARTMENTS = [
  'CSE',
  'ECE',
  'EEE',
  'Mechanical',
  'Civil',
  'IT',
  'Other',
];

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

// Catalog of subjects organized by Department -> Semester
export const ACADEMIC_CATALOG = {
  CSE: {
    'Semester 1': ['Engineering Mathematics I', 'Problem Solving and Python Programming', 'Engineering Physics'],
    'Semester 2': ['Engineering Mathematics II', 'Programming in C', 'Digital Principles & Computer Organization'],
    'Semester 3': ['Data Structures and Algorithms', 'Object Oriented Programming with Java', 'Discrete Mathematics'],
    'Semester 4': ['Design and Analysis of Algorithms', 'Operating Systems', 'Database Management Systems'],
    'Semester 5': ['Computer Networks', 'Theory of Computation', 'Software Engineering'],
    'Semester 6': ['Compiler Design', 'Artificial Intelligence', 'Cryptography and Network Security'],
    'Semester 7': ['Cloud Computing', 'Machine Learning', 'Big Data Analytics'],
    'Semester 8': ['Deep Learning', 'Project Work / Internship'],
  },
  IT: {
    'Semester 1': ['Engineering Mathematics I', 'Programming for Problem Solving', 'Physics for Information Science'],
    'Semester 2': ['Engineering Mathematics II', 'C Programming and Data Structures', 'Digital Logic Design'],
    'Semester 3': ['Object Oriented Programming', 'Data Structures', 'Analog and Digital Communication'],
    'Semester 4': ['Database Systems', 'Operating Systems', 'Web Technology Fundamentals'],
    'Semester 5': ['Computer Networks', 'Automata and Formal Languages', 'Web Applications Development'],
    'Semester 6': ['Mobile Computing', 'Software Testing', 'Information Security'],
    'Semester 7': ['Distributed Systems', 'Data Science', 'Cloud Services'],
    'Semester 8': ['Cyber Forensics', 'Capstone Project'],
  },
  ECE: {
    'Semester 1': ['Engineering Mathematics I', 'Engineering Physics', 'Basic Electrical Engineering'],
    'Semester 2': ['Engineering Mathematics II', 'Circuit Analysis', 'Electronic Devices'],
    'Semester 3': ['Digital Electronics', 'Signals and Systems', 'Electronic Circuits I'],
    'Semester 4': ['Linear Integrated Circuits', 'Electromagnetic Fields', 'Electronic Circuits II'],
    'Semester 5': ['Microprocessors & Microcontrollers', 'Digital Signal Processing', 'Analog Communication'],
    'Semester 6': ['VLSI Design', 'Digital Communication', 'Antenna and Wave Propagation'],
    'Semester 7': ['Wireless Communication', 'Optical Communication', 'Embedded Systems'],
    'Semester 8': ['Satellite Communication', 'Major Project'],
  },
  EEE: {
    'Semester 1': ['Engineering Mathematics I', 'Physics for Electrical Sciences', 'Programming in C'],
    'Semester 2': ['Engineering Mathematics II', 'Electric Circuit Theory', 'Electron Devices and Circuits'],
    'Semester 3': ['DC Machines and Transformers', 'Electromagnetic Theory', 'Digital Logic Circuits'],
    'Semester 4': ['AC Machines', 'Linear Integrated Circuits', 'Transmission and Distribution'],
    'Semester 5': ['Power Electronics', 'Control Systems', 'Microprocessors and Microcontrollers'],
    'Semester 6': ['Power System Analysis', 'Electric Drives and Control', 'Embedded Systems'],
    'Semester 7': ['High Voltage Engineering', 'Power System Operation & Control', 'Renewable Energy Systems'],
    'Semester 8': ['Utilization of Electrical Energy', 'Major Project'],
  },
  Mechanical: {
    'Semester 1': ['Engineering Mathematics I', 'Engineering Physics', 'Engineering Graphics'],
    'Semester 2': ['Engineering Mathematics II', 'Engineering Mechanics', 'Materials Science'],
    'Semester 3': ['Fluid Mechanics and Machinery', 'Manufacturing Technology I', 'Engineering Thermodynamics'],
    'Semester 4': ['Kinematics of Machinery', 'Manufacturing Technology II', 'Thermal Engineering'],
    'Semester 5': ['Design of Machine Elements', 'Dynamics of Machines', 'Metrology and Measurements'],
    'Semester 6': ['Design of Transmission Systems', 'Heat and Mass Transfer', 'Finite Element Analysis'],
    'Semester 7': ['Mechatronics', 'Computer Aided Design and Manufacturing', 'Power Plant Engineering'],
    'Semester 8': ['Robotics and Automation', 'Project Work'],
  },
  Civil: {
    'Semester 1': ['Engineering Mathematics I', 'Engineering Chemistry', 'Engineering Graphics'],
    'Semester 2': ['Engineering Mathematics II', 'Engineering Mechanics', 'Building Materials and Construction'],
    'Semester 3': ['Mechanics of Solids', 'Fluid Mechanics', 'Surveying'],
    'Semester 4': ['Strength of Materials', 'Applied Hydraulic Engineering', 'Soil Mechanics'],
    'Semester 5': ['Structural Analysis I', 'Design of RC Elements', 'Foundation Engineering'],
    'Semester 6': ['Design of Steel Structures', 'Highway Engineering', 'Structural Analysis II'],
    'Semester 7': ['Estimation and Costing', 'Water Resources and Irrigation Engineering', 'Environmental Engineering'],
    'Semester 8': ['Prestressed Concrete', 'Project Work'],
  },
  Other: {
    'Semester 1': ['Engineering Mathematics I', 'General Engineering Principles', 'Computer Fundamentals'],
    'Semester 2': ['Engineering Mathematics II', 'Applied Physics', 'Basic Electrical and Electronics'],
    'Semester 3': ['Core Engineering Subject I', 'Core Engineering Subject II', 'Applied Mathematics'],
    'Semester 4': ['Core Subject III', 'Core Subject IV', 'Professional Elective I'],
    'Semester 5': ['Core Subject V', 'Core Subject VI', 'Open Elective I'],
    'Semester 6': ['Core Subject VII', 'Core Subject VIII', 'Open Elective II'],
    'Semester 7': ['Advanced Core Elective I', 'Advanced Core Elective II', 'Industrial Training'],
    'Semester 8': ['Comprehensive Viva & Project Work'],
  },
};

// Common weak topics lookup
export const WEAK_TOPICS_BY_SUBJECT = {
  'Data Structures and Algorithms': [
    'Linked List',
    'Binary Trees & BST',
    'Stack & Queue',
    'Graphs (BFS/DFS)',
    'Dynamic Programming',
    'Sorting Algorithms',
    'Recursion & Backtracking',
    'Hash Tables',
  ],
  'Database Management Systems': [
    'SQL Complex Queries & Joins',
    'Normalization (1NF to BCNF)',
    'ER Modeling',
    'Transactions & Concurrency Control',
    'Indexing & B+ Trees',
    'Relational Algebra',
  ],
  'Operating Systems': [
    'Process Scheduling Algorithms',
    'Deadlock Prevention & Avoidance',
    'Virtual Memory & Paging',
    'Semaphores & Mutex',
    'File Systems & Disk Scheduling',
    'Threads and Concurrency',
  ],
  'Computer Networks': [
    'OSI & TCP/IP Model',
    'Subnetting and IP Addressing',
    'Routing Protocols (OSPF, BGP)',
    'TCP Flow & Congestion Control',
    'DNS, HTTP, HTTPS Protocols',
    'Network Security & Firewalls',
  ],
  'Object Oriented Programming with Java': [
    'Polymorphism & Inheritance',
    'Interfaces & Abstract Classes',
    'Exception Handling',
    'Multithreading & Synchronization',
    'Collections Framework',
    'File I/O Streams',
  ],
  'Design and Analysis of Algorithms': [
    'Asymptotic Notations (Big-O)',
    'Divide and Conquer',
    'Greedy Method',
    'Dynamic Programming',
    'NP-Completeness',
    'Graph Algorithms (Dijkstra, Prim)',
  ],
};

export const DEFAULT_WEAK_TOPICS = [
  'Fundamental Concepts',
  'Problem-Solving Techniques',
  'Mathematical Derivations',
  'Code Implementation / Syntax',
  'Theoretical Memorization',
  'Diagrams & Circuit Schematics',
  'Previous Exam Questions',
  'Numerical Problems',
];

export const academicApi = {
  getDepartments() {
    return Promise.resolve(DEPARTMENTS);
  },

  getSemesters() {
    return Promise.resolve(SEMESTERS);
  },

  async getSubjects(department, semester) {
    const fallback = () => {
      const deptData = ACADEMIC_CATALOG[department] || ACADEMIC_CATALOG['CSE'];
      return deptData[semester] || deptData['Semester 3'] || [];
    };

    const semesterNum = String(semester).replace(/\D/g, '') || semester;

    const response = await apiClient.get(
      `/subjects/${encodeURIComponent(department)}/${encodeURIComponent(semesterNum)}`,
      {},
      fallback
    );

    let subjectsList = response;
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      if (Array.isArray(response.subjects)) {
        subjectsList = response.subjects;
      }
    }

    if (Array.isArray(subjectsList)) {
      return subjectsList.map(s => {
        if (typeof s === 'string') return s;
        return s.title || s.name || s.code || 'Unknown Subject';
      });
    }

    return subjectsList;
  },

  getWeakTopics(subject) {
    const fallback = () => {
      return WEAK_TOPICS_BY_SUBJECT[subject] || DEFAULT_WEAK_TOPICS;
    };

    return apiClient.get(
      `/academic/weak-topics?subject=${encodeURIComponent(subject)}`,
      {},
      fallback
    );
  },

  getReadyMadePlan(subject = 'Data Structures and Algorithms') {
    const subLower = subject.toLowerCase();

    if (subLower.includes('math') || subLower.includes('discrete') || subLower.includes('algebra')) {
      return {
        title: `Ready-Made Plan – ${subject}`,
        duration: '3-Week Structured Recovery',
        units: [
          { name: 'Unit 1: Logic & Set Theory', focus: 'Propositional Logic, Quantifiers, Normal Forms', weight: '20%' },
          { name: 'Unit 2: Combinatorics & Recurrence', focus: 'Permutations, Combinations, Generating Functions', weight: '20%' },
          { name: 'Unit 3: Algebraic Structures', focus: 'Groups, Rings, Fields, Semi-groups', weight: '20%' },
          { name: 'Unit 4: Graph Theory & Trees', focus: 'Euler/Hamiltonian Paths, Tree Traversal, Planar Graphs', weight: '20%' },
          { name: 'Unit 5: Lattices & Boolean Algebra', focus: 'Posets, Hasse Diagrams, Boolean Functions', weight: '20%' },
        ],
      };
    }

    if (subLower.includes('database') || subLower.includes('dbms') || subLower.includes('sql')) {
      return {
        title: `Ready-Made Plan – ${subject}`,
        duration: '3-Week Structured Recovery',
        units: [
          { name: 'Unit 1: ER Modeling & Relational Algebra', focus: 'Entities, Relationships, Tuple Relational Calculus', weight: '20%' },
          { name: 'Unit 2: SQL Queries & Joins', focus: 'Nested Queries, Aggregations, Views, Triggers', weight: '20%' },
          { name: 'Unit 3: Normalization', focus: '1NF, 2NF, 3NF, BCNF, Lossless Join Decomposition', weight: '20%' },
          { name: 'Unit 4: Transactions & Concurrency', focus: 'ACID Properties, Two-Phase Locking, Deadlocks', weight: '20%' },
          { name: 'Unit 5: Indexing & Storage', focus: 'B+ Trees, Hashing, File Organization', weight: '20%' },
        ],
      };
    }

    if (subLower.includes('operating') || subLower.includes('os')) {
      return {
        title: `Ready-Made Plan – ${subject}`,
        duration: '3-Week Structured Recovery',
        units: [
          { name: 'Unit 1: Process & CPU Scheduling', focus: 'PCB, Context Switching, FCFS, SJF, Round Robin', weight: '20%' },
          { name: 'Unit 2: Synchronization & Mutex', focus: 'Critical Section Problem, Semaphores, Monitors', weight: '20%' },
          { name: 'Unit 3: Deadlock Handling', focus: 'Bankers Algorithm, Detection, Prevention, Recovery', weight: '20%' },
          { name: 'Unit 4: Memory Management', focus: 'Paging, Segmentation, Page Replacement (FIFO, LRU)', weight: '20%' },
          { name: 'Unit 5: File Systems & Disk Scheduling', focus: 'Inodes, Allocation Methods, SSTF, SCAN, C-SCAN', weight: '20%' },
        ],
      };
    }

    if (subLower.includes('network')) {
      return {
        title: `Ready-Made Plan – ${subject}`,
        duration: '3-Week Structured Recovery',
        units: [
          { name: 'Unit 1: OSI & TCP/IP Architecture', focus: 'Layer Functions, Encapsulation, Packet Framing', weight: '20%' },
          { name: 'Unit 2: Data Link & Error Control', focus: 'Stop-and-Wait, Go-Back-N, Selective Repeat, CRC', weight: '20%' },
          { name: 'Unit 3: IP Addressing & Routing', focus: 'IPv4, IPv6, Subnetting, CIDR, OSPF, BGP', weight: '20%' },
          { name: 'Unit 4: Transport Layer Protocols', focus: 'TCP 3-Way Handshake, Flow Control, Congestion Control', weight: '20%' },
          { name: 'Unit 5: Application Protocols & Security', focus: 'DNS, HTTP/S, SSL/TLS, Firewalls, Cryptography', weight: '20%' },
        ],
      };
    }

    if (subLower.includes('java') || subLower.includes('python') || subLower.includes('c++') || subLower.includes('object')) {
      return {
        title: `Ready-Made Plan – ${subject}`,
        duration: '3-Week Structured Recovery',
        units: [
          { name: 'Unit 1: OOP Principles', focus: 'Classes, Objects, Encapsulation, Abstraction', weight: '20%' },
          { name: 'Unit 2: Inheritance & Polymorphism', focus: 'Method Overriding, Overloading, Dynamic Binding', weight: '20%' },
          { name: 'Unit 3: Exception Handling & Packages', focus: 'Try-Catch-Finally, Custom Exceptions, Imports', weight: '20%' },
          { name: 'Unit 4: Multithreading & I/O', focus: 'Thread Lifecycle, Synchronization, File Streams', weight: '20%' },
          { name: 'Unit 5: Collections & Frameworks', focus: 'List, Set, Map, Generics, Lambda Expressions', weight: '20%' },
        ],
      };
    }

    if (subLower.includes('digital') || subLower.includes('circuit') || subLower.includes('microprocessor') || subLower.includes('electronic')) {
      return {
        title: `Ready-Made Plan – ${subject}`,
        duration: '3-Week Structured Recovery',
        units: [
          { name: 'Unit 1: Number Systems & Logic Gates', focus: 'Binary Arithmetic, K-Map Minimization, POS/SOP', weight: '20%' },
          { name: 'Unit 2: Combinational Logic', focus: 'Multiplexers, Decoders, Adders, Subtractors', weight: '20%' },
          { name: 'Unit 3: Sequential Logic', focus: 'Flip-Flops (SR, JK, D, T), Counters, Shift Registers', weight: '20%' },
          { name: 'Unit 4: Memory & Programmable Logic', focus: 'RAM, ROM, PLA, PAL, Semiconductor Memory', weight: '20%' },
          { name: 'Unit 5: Micro-architecture & I/O', focus: 'Bus Structure, Instruction Cycle, Interrupts', weight: '20%' },
        ],
      };
    }

    // Default structure for Data Structures and Algorithms or general subjects
    return {
      title: `Ready-Made Plan – ${subject}`,
      duration: '3-Week Structured Recovery',
      units: [
        { name: 'Unit 1: Foundations & High-Yield Core Concepts', focus: `Primary definitions, formulas, and fundamental topics in ${subject}`, weight: '20%' },
        { name: 'Unit 2: Intermediate Analytical Problem Solving', focus: 'Derivations, multi-step problems, and analytical methods', weight: '20%' },
        { name: 'Unit 3: Core University Exam Question Patterns', focus: '16-mark high-weightage questions and past paper trends', weight: '20%' },
        { name: 'Unit 4: Comprehensive Model Paper Practice', focus: 'Timed problem sets and error rectification drills', weight: '20%' },
        { name: 'Unit 5: Final Revision & Clearance Assessment', focus: 'Formula cheat sheets, diagram memorization, and mock tests', weight: '20%' },
      ],
    };
  },
};

export default academicApi;
