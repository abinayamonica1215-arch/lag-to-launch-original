import apiClient from './client';

/**
 * Category-Specific Question Banks for Assessments 1, 2, 3, and Final Assessment.
 * Ensures strict partition by subject category so DSA questions NEVER leak into Discrete Math,
 * and different assessments within the same category test different sub-topics.
 */
export const CATEGORY_QUESTION_BANKS = {
  'Data Structures & Algorithms': {
    assessment1: {
      id: 'dsa_a1',
      title: 'DSA Assessment 1: Arrays, Lists, Stacks & Queues',
      durationMinutes: 20,
      questions: [
        {
          id: 'dsa_1_1',
          category: 'Data Structures & Algorithms',
          topic: 'Arrays',
          question: 'What is the worst-case time complexity of inserting an element at the beginning of a dynamic array of size N?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
          correctOptionIndex: 2,
        },
        {
          id: 'dsa_1_2',
          category: 'Data Structures & Algorithms',
          topic: 'Stacks',
          question: 'Which of the following data structures operates strictly on a LIFO (Last In, First Out) principle?',
          options: ['Queue', 'Stack', 'Circular Linked List', 'Priority Queue'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_1_3',
          category: 'Data Structures & Algorithms',
          topic: 'Linked Lists',
          question: 'In a Singly Linked List, what is the time complexity to access the k-th element from the head node?',
          options: ['O(1)', 'O(k)', 'O(log k)', 'O(N log N)'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_1_4',
          category: 'Data Structures & Algorithms',
          topic: 'Linked Lists',
          question: 'Which technique is optimal for detecting a cycle in a Singly Linked List without using extra memory?',
          options: ['Floyd’s Tortoise and Hare (Two Pointers)', 'Hash Set lookup', 'Reversing the list', 'Sorting the nodes'],
          correctOptionIndex: 0,
        },
        {
          id: 'dsa_1_5',
          category: 'Data Structures & Algorithms',
          topic: 'Queues',
          question: 'What is the minimum number of Queues required to implement a functional Stack?',
          options: ['1', '2', '3', 'Cannot be implemented'],
          correctOptionIndex: 1,
        },
      ],
    },
    assessment2: {
      id: 'dsa_a2',
      title: 'DSA Assessment 2: Trees, Heaps, Hashing & Searching/Sorting',
      durationMinutes: 20,
      questions: [
        {
          id: 'dsa_2_1',
          category: 'Data Structures & Algorithms',
          topic: 'Sorting',
          question: 'What is the worst-case time complexity of QuickSort when the pivot is consistently chosen as the smallest or largest element?',
          options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(log N)'],
          correctOptionIndex: 2,
        },
        {
          id: 'dsa_2_2',
          category: 'Data Structures & Algorithms',
          topic: 'Trees',
          question: 'In a Binary Search Tree (BST), which tree traversal order visits nodes in strictly ascending sorted order?',
          options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_2_3',
          category: 'Data Structures & Algorithms',
          topic: 'Heaps',
          question: 'In a Min-Heap with N elements, what is the time complexity of deleting the minimum root element?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_2_4',
          category: 'Data Structures & Algorithms',
          topic: 'Hashing',
          question: 'What collision resolution technique in Hash Tables resolves collisions by chaining elements into a linked list at each bucket?',
          options: ['Linear Probing', 'Separate Chaining', 'Quadratic Probing', 'Double Hashing'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_2_5',
          category: 'Data Structures & Algorithms',
          topic: 'Searching',
          question: 'What is the average time complexity of Binary Search on a sorted array of N elements?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctOptionIndex: 1,
        },
      ],
    },
    assessment3: {
      id: 'dsa_a3',
      title: 'DSA Assessment 3: Graphs, Dynamic Programming & Greedy Algorithms',
      durationMinutes: 25,
      questions: [
        {
          id: 'dsa_3_1',
          category: 'Data Structures & Algorithms',
          topic: 'Graphs',
          question: 'Which graph traversal algorithm uses a Queue data structure to explore nodes level-by-level?',
          options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Topological Sort', 'Kruskal’s Algorithm'],
          correctOptionIndex: 0,
        },
        {
          id: 'dsa_3_2',
          category: 'Data Structures & Algorithms',
          topic: 'Graphs',
          question: 'Why does Dijkstra’s single-source shortest path algorithm fail on certain graphs?',
          options: ['Graphs with cycles', 'Graphs with negative weight edges', 'Dense graphs', 'Disconnected graphs'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_3_3',
          category: 'Data Structures & Algorithms',
          topic: 'Dynamic Programming',
          question: 'Which strategy does Dynamic Programming use to avoid re-computing solutions to overlapping subproblems?',
          options: ['Greedy Choice', 'Memoization / Tabulation', 'Divide and Conquer without storage', 'Backtracking'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_3_4',
          category: 'Data Structures & Algorithms',
          topic: 'Dynamic Programming',
          question: 'In 0/1 Knapsack problem, which algorithmic paradigm yields the optimal solution?',
          options: ['Greedy Approach', 'Dynamic Programming', 'Brute Force Linear Search', 'Binary Search'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_3_5',
          category: 'Data Structures & Algorithms',
          topic: 'Graphs',
          question: 'Topological Sorting can only be performed on which type of graph?',
          options: ['Undirected Graph', 'Directed Acyclic Graph (DAG)', 'Complete Graph', 'Bipartite Graph'],
          correctOptionIndex: 1,
        },
      ],
    },
    final: {
      id: 'dsa_final',
      title: 'DSA Final Clearance Benchmark Examination',
      durationMinutes: 30,
      questions: [
        {
          id: 'dsa_f_1',
          category: 'Data Structures & Algorithms',
          topic: 'Trees',
          question: 'What is the height of a balanced AVL Tree storing N key-value items?',
          options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(1)'],
          correctOptionIndex: 0,
        },
        {
          id: 'dsa_f_2',
          category: 'Data Structures & Algorithms',
          topic: 'Sorting',
          question: 'Which sorting algorithm guarantees O(N log N) worst-case time complexity and is stable?',
          options: ['QuickSort', 'MergeSort', 'HeapSort', 'SelectionSort'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_f_3',
          category: 'Data Structures & Algorithms',
          topic: 'Graphs',
          question: 'What is the time complexity of Bellman-Ford algorithm for a graph with V vertices and E edges?',
          options: ['O(V + E)', 'O(V * E)', 'O(V^3)', 'O(E log V)'],
          correctOptionIndex: 1,
        },
        {
          id: 'dsa_f_4',
          category: 'Data Structures & Algorithms',
          topic: 'Stacks',
          question: 'What is the prefix (Polish) notation for the infix expression (A + B) * (C - D)?',
          options: ['* + A B - C D', '+ A B * - C D', 'A B + C D - *', '* A + B C - D'],
          correctOptionIndex: 0,
        },
        {
          id: 'dsa_f_5',
          category: 'Data Structures & Algorithms',
          topic: 'Hashing',
          question: 'Which data structure is most efficient to implement LRU (Least Recently Used) Cache with O(1) get and put operations?',
          options: ['Doubly Linked List + Hash Map', 'Binary Search Tree + Queue', 'Array + Stack', 'Priority Queue + Hash Set'],
          correctOptionIndex: 0,
        },
      ],
    },
  },

  'Discrete Mathematics': {
    assessment1: {
      id: 'dm_a1',
      title: 'Discrete Math Assessment 1: Set Theory, Logic & Truth Tables',
      durationMinutes: 20,
      questions: [
        {
          id: 'dm_1_1',
          category: 'Discrete Mathematics',
          topic: 'Sets',
          question: 'If a set S has 4 elements, how many elements are in the power set P(S)?',
          options: ['4', '8', '16', '32'],
          correctOptionIndex: 2,
        },
        {
          id: 'dm_1_2',
          category: 'Discrete Mathematics',
          topic: 'Logic',
          question: 'What is the logical equivalent of the implication P -> Q (P implies Q)?',
          options: ['~P OR Q', 'P AND ~Q', '~P AND ~Q', 'Q -> P'],
          correctOptionIndex: 0,
        },
        {
          id: 'dm_1_3',
          category: 'Discrete Mathematics',
          topic: 'Logic',
          question: 'Which rule of inference states that if "P -> Q" is true and "P" is true, then "Q" must be true?',
          options: ['Modus Ponens', 'Modus Tollens', 'Hypothetical Syllogism', 'Disjunctive Syllogism'],
          correctOptionIndex: 0,
        },
        {
          id: 'dm_1_4',
          category: 'Discrete Mathematics',
          topic: 'Logic',
          question: 'What is a compound proposition that is always true regardless of the truth values of its variables called?',
          options: ['Contradiction', 'Tautology', 'Contingency', 'Predicate'],
          correctOptionIndex: 1,
        },
        {
          id: 'dm_1_5',
          category: 'Discrete Mathematics',
          topic: 'Sets',
          question: 'If set A = {1, 2, 3} and set B = {3, 4, 5}, what is the Cartesian product size |A x B|?',
          options: ['3', '6', '9', '15'],
          correctOptionIndex: 2,
        },
      ],
    },
    assessment2: {
      id: 'dm_a2',
      title: 'Discrete Math Assessment 2: Combinatorics & Recurrence Relations',
      durationMinutes: 20,
      questions: [
        {
          id: 'dm_2_1',
          category: 'Discrete Mathematics',
          topic: 'Combinatorics',
          question: 'How many distinct permutations can be formed from the letters of the word "MATH"?',
          options: ['12', '16', '24', '48'],
          correctOptionIndex: 2,
        },
        {
          id: 'dm_2_2',
          category: 'Discrete Mathematics',
          topic: 'Combinatorics',
          question: 'According to the Pigeonhole Principle, if 13 pigeons occupy 12 holes, at least one hole must contain at least how many pigeons?',
          options: ['1', '2', '3', '13'],
          correctOptionIndex: 1,
        },
        {
          id: 'dm_2_3',
          category: 'Discrete Mathematics',
          topic: 'Recurrence Relations',
          question: 'What is the solution to the homogeneous linear recurrence relation a_n = 2 * a_{n-1} with a_0 = 3?',
          options: ['a_n = 3 * 2^n', 'a_n = 2 * 3^n', 'a_n = 3 + 2n', 'a_n = 6^n'],
          correctOptionIndex: 0,
        },
        {
          id: 'dm_2_4',
          category: 'Discrete Mathematics',
          topic: 'Combinatorics',
          question: 'What is the value of C(6, 2), which is the number of combinations choosing 2 items out of 6?',
          options: ['12', '15', '30', '36'],
          correctOptionIndex: 1,
        },
        {
          id: 'dm_2_5',
          category: 'Discrete Mathematics',
          topic: 'Recurrence Relations',
          question: 'What is the characteristic equation for the Fibonacci recurrence F_n = F_{n-1} + F_{n-2}?',
          options: ['r^2 - r - 1 = 0', 'r^2 + r - 1 = 0', 'r^2 - 2r + 1 = 0', 'r^2 - 1 = 0'],
          correctOptionIndex: 0,
        },
      ],
    },
    assessment3: {
      id: 'dm_a3',
      title: 'Discrete Math Assessment 3: Graph Theory & Algebraic Structures',
      durationMinutes: 25,
      questions: [
        {
          id: 'dm_3_1',
          category: 'Discrete Mathematics',
          topic: 'Graph Theory',
          question: 'According to the Handshaking Lemma, the sum of the degrees of all vertices in an undirected graph equals:',
          options: ['The number of edges E', 'Twice the number of edges 2E', 'The number of vertices V', 'V * E'],
          correctOptionIndex: 1,
        },
        {
          id: 'dm_3_2',
          category: 'Discrete Mathematics',
          topic: 'Graph Theory',
          question: 'An Euler circuit in a connected graph exists if and only if every vertex has:',
          options: ['Odd degree', 'Even degree', 'Degree equal to 2', 'Degree equal to V-1'],
          correctOptionIndex: 1,
        },
        {
          id: 'dm_3_3',
          category: 'Discrete Mathematics',
          topic: 'Graph Theory',
          question: 'In Euler’s formula for connected planar graphs (V - E + F), what is the value of V - E + F?',
          options: ['0', '1', '2', '3'],
          correctOptionIndex: 2,
        },
        {
          id: 'dm_3_4',
          category: 'Discrete Mathematics',
          topic: 'Algebraic Structures',
          question: 'A group (G, *) that satisfies the commutative property (a * b = b * a) is called:',
          options: ['Abelian Group', 'Monoid', 'Semigroup', 'Cyclic Subgroup'],
          correctOptionIndex: 0,
        },
        {
          id: 'dm_3_5',
          category: 'Discrete Mathematics',
          topic: 'Graph Theory',
          question: 'What is the minimum number of colors required to color any planar graph such that no two adjacent vertices share the same color?',
          options: ['2', '3', '4', '5'],
          correctOptionIndex: 2,
        },
      ],
    },
    final: {
      id: 'dm_final',
      title: 'Discrete Mathematics Final Clearance Benchmark Examination',
      durationMinutes: 30,
      questions: [
        {
          id: 'dm_f_1',
          category: 'Discrete Mathematics',
          topic: 'Combinatorics',
          question: 'What is the coefficient of x^3 * y^2 in the binomial expansion of (x + y)^5?',
          options: ['5', '10', '15', '20'],
          correctOptionIndex: 1,
        },
        {
          id: 'dm_f_2',
          category: 'Discrete Mathematics',
          topic: 'Relations',
          question: 'Which property is NOT required for a relation R on a set A to be a Partial Order Relation?',
          options: ['Reflexive', 'Antisymmetric', 'Transitive', 'Symmetric'],
          correctOptionIndex: 3,
        },
        {
          id: 'dm_f_3',
          category: 'Discrete Mathematics',
          topic: 'Graph Theory',
          question: 'In a tree with N vertices, how many edges does it contain?',
          options: ['N', 'N - 1', 'N + 1', '2N'],
          correctOptionIndex: 1,
        },
        {
          id: 'dm_f_4',
          category: 'Discrete Mathematics',
          topic: 'Algebraic Structures',
          question: 'What is Lagrange’s Theorem in Group Theory regarding finite group G and subgroup H?',
          options: ['Order of H divides Order of G', 'Order of G divides Order of H', 'Order of H equals Order of G', 'Order of H is prime'],
          correctOptionIndex: 0,
        },
        {
          id: 'dm_f_5',
          category: 'Discrete Mathematics',
          topic: 'Graph Theory',
          question: 'A graph is bipartite if and only if it contains no cycles of:',
          options: ['Even length', 'Odd length', 'Length 3', 'Length 4'],
          correctOptionIndex: 1,
        },
      ],
    },
  },

  'Database Management Systems': {
    assessment1: {
      id: 'dbms_a1',
      title: 'DBMS Assessment 1: ER Model, Relational Model & Basic SQL',
      durationMinutes: 20,
      questions: [
        {
          id: 'dbms_1_1',
          category: 'Database Management Systems',
          topic: 'ER Model',
          question: 'In an Entity-Relationship (ER) diagram, how are Weak Entity Sets represented visually?',
          options: ['Double Rectangle', 'Ellipse', 'Diamond', 'Dashed Line'],
          correctOptionIndex: 0,
        },
        {
          id: 'dbms_1_2',
          category: 'Database Management Systems',
          topic: 'SQL',
          question: 'Which SQL keyword is used to eliminate duplicate rows from query results?',
          options: ['UNIQUE', 'DISTINCT', 'GROUP BY', 'FILTER'],
          correctOptionIndex: 1,
        },
        {
          id: 'dbms_1_3',
          category: 'Database Management Systems',
          topic: 'Relational Model',
          question: 'What type of key uniquely identifies a tuple within a relation and can contain NULL values if not restricted?',
          options: ['Primary Key', 'Candidate Key', 'Super Key', 'Foreign Key'],
          correctOptionIndex: 1,
        },
        {
          id: 'dbms_1_4',
          category: 'Database Management Systems',
          topic: 'SQL',
          question: 'Which DDL command is used to permanently delete a table structure and all its data from the database?',
          options: ['DELETE TABLE', 'REMOVE TABLE', 'DROP TABLE', 'TRUNCATE TABLE'],
          correctOptionIndex: 2,
        },
        {
          id: 'dbms_1_5',
          category: 'Database Management Systems',
          topic: 'Relational Model',
          question: 'What relational algebra operator performs a Cartesian Product between two relations R and S?',
          options: ['R UNION S', 'R x S', 'R JOIN S', 'R PROJECT S'],
          correctOptionIndex: 1,
        },
      ],
    },
    assessment2: {
      id: 'dbms_a2',
      title: 'DBMS Assessment 2: Normalization, Functional Dependencies & Joins',
      durationMinutes: 20,
      questions: [
        {
          id: 'dbms_2_1',
          category: 'Database Management Systems',
          topic: 'Normalization',
          question: 'Which Normal Form requires that no non-prime attribute is transitively dependent on the primary key?',
          options: ['1NF', '2NF', '3NF', 'BCNF'],
          correctOptionIndex: 2,
        },
        {
          id: 'dbms_2_2',
          category: 'Database Management Systems',
          topic: 'Normalization',
          question: 'In Boyce-Codd Normal Form (BCNF), for every non-trivial functional dependency X -> Y, X must be a:',
          options: ['Super Key', 'Foreign Key', 'Primary Attribute', 'Atomic Domain'],
          correctOptionIndex: 0,
        },
        {
          id: 'dbms_2_3',
          category: 'Database Management Systems',
          topic: 'SQL',
          question: 'Which type of SQL JOIN returns all records from the left table and matched records from the right table?',
          options: ['INNER JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN'],
          correctOptionIndex: 1,
        },
        {
          id: 'dbms_2_4',
          category: 'Database Management Systems',
          topic: 'Normalization',
          question: 'What is a 1NF database table constraint?',
          options: ['No partial dependencies', 'Atomic values in every column', 'No transitive dependencies', 'No multi-valued dependencies'],
          correctOptionIndex: 1,
        },
        {
          id: 'dbms_2_5',
          category: 'Database Management Systems',
          topic: 'Normalization',
          question: 'If functional dependency X -> Y holds, what does Armstrong’s Axiom of Augmentation state?',
          options: ['XZ -> YZ holds for any Z', 'X -> Z holds', 'Y -> X holds', 'Z -> XY holds'],
          correctOptionIndex: 0,
        },
      ],
    },
    assessment3: {
      id: 'dbms_a3',
      title: 'DBMS Assessment 3: Transactions, ACID Properties & Concurrency',
      durationMinutes: 25,
      questions: [
        {
          id: 'dbms_3_1',
          category: 'Database Management Systems',
          topic: 'Transactions',
          question: 'Which ACID property guarantees that all operations of a transaction are completed or none are executed?',
          options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
          correctOptionIndex: 0,
        },
        {
          id: 'dbms_3_2',
          category: 'Database Management Systems',
          topic: 'Concurrency Control',
          question: 'In Two-Phase Locking (2PL) protocol, what happens during the shrinking phase?',
          options: ['Locks are acquired only', 'Locks are released only', 'Locks can be acquired and released', 'No locks are used'],
          correctOptionIndex: 1,
        },
        {
          id: 'dbms_3_3',
          category: 'Database Management Systems',
          topic: 'Concurrency Control',
          question: 'What concurrency anomaly occurs when a transaction reads data that has been modified by an uncommitted transaction?',
          options: ['Lost Update', 'Dirty Read', 'Non-repeatable Read', 'Phantom Read'],
          correctOptionIndex: 1,
        },
        {
          id: 'dbms_3_4',
          category: 'Database Management Systems',
          topic: 'Transactions',
          question: 'Which ACID property ensures that committed changes persist even in the event of a system crash?',
          options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
          correctOptionIndex: 3,
        },
        {
          id: 'dbms_3_5',
          category: 'Database Management Systems',
          topic: 'Concurrency Control',
          question: 'In Strict 2PL (Strict Two-Phase Locking), when are exclusive locks released?',
          options: ['In growing phase', 'At the end of transaction commit/abort', 'Immediately after read', 'During phase 1'],
          correctOptionIndex: 1,
        },
      ],
    },
    final: {
      id: 'dbms_final',
      title: 'DBMS Final Clearance Benchmark Examination',
      durationMinutes: 30,
      questions: [
        {
          id: 'dbms_f_1',
          category: 'Database Management Systems',
          topic: 'Indexing',
          question: 'What is the main advantage of a B+ Tree index over a standard B Tree index in databases?',
          options: ['Data pointers stored only at leaf nodes allowing faster range queries', 'Smaller tree height', 'Uses less memory', 'Faster key insertions'],
          correctOptionIndex: 0,
        },
        {
          id: 'dbms_f_2',
          category: 'Database Management Systems',
          topic: 'Transactions',
          question: 'Which log-based recovery technique writes changes to disk only after transaction reaches commit point?',
          options: ['Deferred Update', 'Immediate Update', 'Shadow Paging', 'Checkpointing'],
          correctOptionIndex: 0,
        },
        {
          id: 'dbms_f_3',
          category: 'Database Management Systems',
          topic: 'Relational Model',
          question: 'In relational algebra, which operator is equivalent to the SQL HAVING clause?',
          options: ['Selection (sigma)', 'Projection (pi)', 'Join (bowtie)', 'Division (divide)'],
          correctOptionIndex: 0,
        },
        {
          id: 'dbms_f_4',
          category: 'Database Management Systems',
          topic: 'Transactions',
          question: 'Which isolated transaction level prevents Dirty Reads and Non-repeatable Reads but allows Phantom Reads?',
          options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
          correctOptionIndex: 2,
        },
        {
          id: 'dbms_f_5',
          category: 'Database Management Systems',
          topic: 'Relational Model',
          question: 'What constraint ensures Referential Integrity between two database tables?',
          options: ['PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK'],
          correctOptionIndex: 1,
        },
      ],
    },
  },

  'Computer Networks': {
    assessment1: {
      id: 'cn_a1',
      title: 'Computer Networks Assessment 1: OSI & TCP/IP Layer Architectures',
      durationMinutes: 20,
      questions: [
        {
          id: 'cn_1_1',
          category: 'Computer Networks',
          topic: 'Data Link Layer',
          question: 'In the 7-layer OSI model, which layer is responsible for framing, error detection, and MAC addressing?',
          options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
          correctOptionIndex: 1,
        },
        {
          id: 'cn_1_2',
          category: 'Computer Networks',
          topic: 'Network Layer',
          question: 'Which device operates primarily at Layer 3 (Network Layer) of the OSI model?',
          options: ['Hub', 'Switch', 'Router', 'Repeater'],
          correctOptionIndex: 2,
        },
        {
          id: 'cn_1_3',
          category: 'Computer Networks',
          topic: 'Data Link Layer',
          question: 'What is the Data Link Layer protocol used for detecting collisions in shared Ethernet networks?',
          options: ['CSMA/CD', 'CSMA/CA', 'ALOHA', 'Token Ring'],
          correctOptionIndex: 0,
        },
        {
          id: 'cn_1_4',
          category: 'Computer Networks',
          topic: 'Data Link Layer',
          question: 'What is the maximum payload size (MTU) of a standard Ethernet frame?',
          options: ['512 bytes', '1500 bytes', '4096 bytes', '65535 bytes'],
          correctOptionIndex: 1,
        },
        {
          id: 'cn_1_5',
          category: 'Computer Networks',
          topic: 'OSI / TCP-IP Model',
          question: 'Which OSI layer is responsible for data encryption, compression, and formatting?',
          options: ['Application Layer', 'Presentation Layer', 'Session Layer', 'Transport Layer'],
          correctOptionIndex: 1,
        },
      ],
    },
    assessment2: {
      id: 'cn_a2',
      title: 'Computer Networks Assessment 2: IP Addressing, Subnetting & Routing',
      durationMinutes: 20,
      questions: [
        {
          id: 'cn_2_1',
          category: 'Computer Networks',
          topic: 'Network Layer',
          question: 'What is the default subnet mask for a Class B IPv4 network address?',
          options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
          correctOptionIndex: 1,
        },
        {
          id: 'cn_2_2',
          category: 'Computer Networks',
          topic: 'Network Layer',
          question: 'How many usable host IP addresses are available in a CIDR subnet specified as /28?',
          options: ['14', '16', '30', '62'],
          correctOptionIndex: 0,
        },
        {
          id: 'cn_2_3',
          category: 'Computer Networks',
          topic: 'Routing',
          question: 'Which routing protocol uses the Dijkstra shortest path algorithm to compute routing tables?',
          options: ['RIP', 'OSPF', 'BGP', 'EIGRP'],
          correctOptionIndex: 1,
        },
        {
          id: 'cn_2_4',
          category: 'Computer Networks',
          topic: 'Network Layer',
          question: 'What protocol resolves an IP address to a physical MAC address on a local network?',
          options: ['ARP', 'RARP', 'DHCP', 'ICMP'],
          correctOptionIndex: 0,
        },
        {
          id: 'cn_2_5',
          category: 'Computer Networks',
          topic: 'Routing',
          question: 'What is the primary exterior gateway protocol used for routing data across the global Internet?',
          options: ['OSPF', 'IS-IS', 'BGP', 'RIPv2'],
          correctOptionIndex: 2,
        },
      ],
    },
    assessment3: {
      id: 'cn_a3',
      title: 'Computer Networks Assessment 3: Transport Layer TCP/UDP & Sockets',
      durationMinutes: 25,
      questions: [
        {
          id: 'cn_3_1',
          category: 'Computer Networks',
          topic: 'Transport Layer',
          question: 'What flags are exchanged in order during a standard TCP 3-way handshake connection establishment?',
          options: ['SYN -> SYN-ACK -> ACK', 'ACK -> SYN -> SYN-ACK', 'SYN -> ACK -> FIN', 'FIN -> FIN-ACK -> ACK'],
          correctOptionIndex: 0,
        },
        {
          id: 'cn_3_2',
          category: 'Computer Networks',
          topic: 'Transport Layer',
          question: 'Which of the following transport protocols is connectionless and provides no guaranteed packet delivery?',
          options: ['TCP', 'UDP', 'SCTP', 'HTTP'],
          correctOptionIndex: 1,
        },
        {
          id: 'cn_3_3',
          category: 'Computer Networks',
          topic: 'Transport Layer',
          question: 'What TCP congestion control mechanism reduces the congestion window to 1 MSS upon detecting a timeout?',
          options: ['Slow Start', 'Fast Retransmit', 'Fast Recovery', 'Nagle’s Algorithm'],
          correctOptionIndex: 0,
        },
        {
          id: 'cn_3_4',
          category: 'Computer Networks',
          topic: 'Application Layer',
          question: 'What is the standard port number used for HTTPS secure web traffic?',
          options: ['80', '443', '22', '8080'],
          correctOptionIndex: 1,
        },
        {
          id: 'cn_3_5',
          category: 'Computer Networks',
          topic: 'Transport Layer',
          question: 'In TCP flow control, what is used to prevent the sender from overflowing the receiver’s buffer?',
          options: ['Sliding Window Protocol', 'Leaky Bucket', 'Time-to-Live (TTL)', 'Checksum'],
          correctOptionIndex: 0,
        },
      ],
    },
    final: {
      id: 'cn_final',
      title: 'Computer Networks Final Clearance Benchmark Examination',
      durationMinutes: 30,
      questions: [
        {
          id: 'cn_f_1',
          category: 'Computer Networks',
          topic: 'Application Layer',
          question: 'In DNS (Domain Name System), which record type maps a domain name to an IPv6 address?',
          options: ['A Record', 'AAAA Record', 'CNAME Record', 'MX Record'],
          correctOptionIndex: 1,
        },
        {
          id: 'cn_f_2',
          category: 'Computer Networks',
          topic: 'Application Layer',
          question: 'What cryptographic protocol replaced SSL to secure HTTP web communication?',
          options: ['TLS', 'IPsec', 'SSH', 'PGP'],
          correctOptionIndex: 0,
        },
        {
          id: 'cn_f_3',
          category: 'Computer Networks',
          topic: 'Network Layer',
          question: 'What is the function of the Time-to-Live (TTL) field in an IPv4 packet header?',
          options: ['Prevents packets from looping endlessly', 'Specifies packet priority', 'Measures network latency', 'Encrypts payload'],
          correctOptionIndex: 0,
        },
        {
          id: 'cn_f_4',
          category: 'Computer Networks',
          topic: 'Application Layer',
          question: 'Which HTTP status code signifies "404 Not Found"?',
          options: ['200', '301', '404', '500'],
          correctOptionIndex: 2,
        },
        {
          id: 'cn_f_5',
          category: 'Computer Networks',
          topic: 'Network Security',
          question: 'What network security device inspects incoming and outgoing traffic based on security rules?',
          options: ['Firewall', 'Modem', 'Hub', 'Bridge'],
          correctOptionIndex: 0,
        },
      ],
    },
  },

  'Operating Systems': {
    assessment1: {
      id: 'os_a1',
      title: 'OS Assessment 1: Process Management & CPU Scheduling',
      durationMinutes: 20,
      questions: [
        {
          id: 'os_1_1',
          category: 'Operating Systems',
          topic: 'CPU Scheduling',
          question: 'Which CPU scheduling algorithm can cause starvation for long processes?',
          options: ['Shortest Job First (SJF)', 'Round Robin', 'First-Come First-Served (FCFS)', 'FIFO'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_1_2',
          category: 'Operating Systems',
          topic: 'Processes',
          question: 'What data structure does the Operating System maintain to store all information about a specific process?',
          options: ['Process Control Block (PCB)', 'Task Control Header', 'Thread Pointer', 'System Inode'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_1_3',
          category: 'Operating Systems',
          topic: 'CPU Scheduling',
          question: 'What is the state transition when a running process is interrupted by a time-quantum expiry in Round Robin scheduling?',
          options: ['Running -> Ready', 'Running -> Waiting', 'Waiting -> Ready', 'Running -> Terminated'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_1_4',
          category: 'Operating Systems',
          topic: 'Threads',
          question: 'What is the primary advantage of Threads over Processes?',
          options: ['Threads share memory space allowing faster context switching and communication', 'Threads have separate memory protection', 'Threads cannot crash', 'Threads run without CPU'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_1_5',
          category: 'Operating Systems',
          topic: 'CPU Scheduling',
          question: 'What scheduling criteria measures the total time elapsed from process submission to its completion?',
          options: ['Turnaround Time', 'Waiting Time', 'Response Time', 'Throughput'],
          correctOptionIndex: 0,
        },
      ],
    },
    assessment2: {
      id: 'os_a2',
      title: 'OS Assessment 2: Synchronization & Deadlocks',
      durationMinutes: 20,
      questions: [
        {
          id: 'os_2_1',
          category: 'Operating Systems',
          topic: 'Deadlocks',
          question: 'Which of the following is NOT one of Coffman’s four necessary conditions for a Deadlock?',
          options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
          correctOptionIndex: 2,
        },
        {
          id: 'os_2_2',
          category: 'Operating Systems',
          topic: 'Deadlocks',
          question: 'Banker’s algorithm is used in Operating Systems for which purpose?',
          options: ['Deadlock Avoidance', 'Deadlock Detection', 'CPU Scheduling', 'Page Replacement'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_2_3',
          category: 'Operating Systems',
          topic: 'Synchronization',
          question: 'An integer variable used for process synchronization accessed via wait() and signal() atomic operations is called:',
          options: ['Semaphore', 'Mutex Lock', 'Condition Variable', 'Spinlock'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_2_4',
          category: 'Operating Systems',
          topic: 'Synchronization',
          question: 'What is the classic synchronization problem involving bounded buffers, producers, and consumers?',
          options: ['Producer-Consumer Problem', 'Dining Philosophers', 'Readers-Writers', 'Sleeping Barber'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_2_5',
          category: 'Operating Systems',
          topic: 'Synchronization',
          question: 'What condition occurs when multiple processes race to read/write shared data and final outcome depends on execution order?',
          options: ['Race Condition', 'Deadlock', 'Starvation', 'Thrashing'],
          correctOptionIndex: 0,
        },
      ],
    },
    assessment3: {
      id: 'os_a3',
      title: 'OS Assessment 3: Memory Management & Paging',
      durationMinutes: 25,
      questions: [
        {
          id: 'os_3_1',
          category: 'Operating Systems',
          topic: 'Memory Management',
          question: 'What page replacement algorithm suffers from Belady’s Anomaly (where increasing frames increases page faults)?',
          options: ['First-In First-Out (FIFO)', 'Least Recently Used (LRU)', 'Optimal Algorithm', 'Clock Algorithm'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_3_2',
          category: 'Operating Systems',
          topic: 'Memory Management',
          question: 'What hardware memory component caches recent virtual-to-physical address translations for rapid lookup?',
          options: ['Translation Lookaside Buffer (TLB)', 'Page Table Entry', 'Cache Controller', 'L3 Cache'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_3_3',
          category: 'Operating Systems',
          topic: 'Memory Management',
          question: 'What phenomenon occurs when the system spends more time swapping pages in and out of memory than executing processes?',
          options: ['Thrashing', 'Segmentation', 'Paging', 'Fragmentation'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_3_4',
          category: 'Operating Systems',
          topic: 'Memory Management',
          question: 'What type of memory fragmentation occurs when total free memory is sufficient but not contiguous?',
          options: ['External Fragmentation', 'Internal Fragmentation', 'Page Fault', 'Virtual Fault'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_3_5',
          category: 'Operating Systems',
          topic: 'Memory Management',
          question: 'In demand paging, what exception is raised by the MMU when a requested page is not in physical RAM?',
          options: ['Page Fault', 'Segmentation Fault', 'TLB Miss', 'Bus Error'],
          correctOptionIndex: 0,
        },
      ],
    },
    final: {
      id: 'os_final',
      title: 'Operating Systems Final Clearance Benchmark Examination',
      durationMinutes: 30,
      questions: [
        {
          id: 'os_f_1',
          category: 'Operating Systems',
          topic: 'File Systems',
          question: 'Which disk scheduling algorithm services disk requests by moving the head back and forth across the disk like an elevator?',
          options: ['SCAN (Elevator Algorithm)', 'FCFS', 'SSTF', 'C-LOOK'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_f_2',
          category: 'Operating Systems',
          topic: 'File Systems',
          question: 'What file system data structure contains metadata about a file (permissions, size, blocks) in UNIX/Linux?',
          options: ['Inode', 'FAT', 'Directory Block', 'Superblock'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_f_3',
          category: 'Operating Systems',
          topic: 'Processes',
          question: 'What is the system call in UNIX used to create a new child process by cloning the calling process?',
          options: ['fork()', 'exec()', 'create()', 'spawn()'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_f_4',
          category: 'Operating Systems',
          topic: 'Processes',
          question: 'What is a process called that has terminated execution but its parent has not yet read its exit status via wait()?',
          options: ['Zombie Process', 'Orphan Process', 'Daemon Process', 'Background Process'],
          correctOptionIndex: 0,
        },
        {
          id: 'os_f_5',
          category: 'Operating Systems',
          topic: 'Memory Management',
          question: 'Which virtual memory management scheme divides memory into variable-sized logical segments (code, data, stack)?',
          options: ['Segmentation', 'Paging', 'Swapping', 'Banking'],
          correctOptionIndex: 0,
        },
      ],
    },
  },
};

export const assessmentApi = {
  /**
   * Get Department -> Semester -> Subject -> Assessment Type Specific Questions
   * @param {string|Object} arg1 Subject string or options object
   * @param {string} arg2 Assessment Type ('dynamic_self' | 'weak_link' | 'final' | 'assessment1')
   * @param {string} arg3 Department ('CSE', 'ECE', 'EEE', etc.)
   * @param {string} arg4 Semester ('Semester 1' .. 'Semester 8')
   */
  async getCategoryAssessment(arg1 = 'Data Structures and Algorithms', arg2 = 'final', arg3 = 'CSE', arg4 = 'Semester 3') {
    let subject = 'Data Structures and Algorithms';
    let assessmentType = 'final';
    let department = 'CSE';
    let semester = 'Semester 3';

    if (typeof arg1 === 'object' && arg1 !== null) {
      subject = arg1.subject || subject;
      assessmentType = arg1.assessmentType || arg1.type || assessmentType;
      department = arg1.department || department;
      semester = arg1.semester || semester;
    } else {
      subject = arg1 || subject;
      assessmentType = arg2 || assessmentType;
      department = arg3 || department;
      semester = arg4 || semester;
    }

    const fallback = () => {
      const subLower = subject.toLowerCase();
      const semLower = semester.toLowerCase();
      const isWeakLink = assessmentType.toLowerCase().includes('weak');
      const isDynamicSelf = assessmentType.toLowerCase().includes('self') || assessmentType.toLowerCase().includes('dynamic');

      // ─── CATEGORY_QUESTION_BANKS lookup for assessment1 / assessment2 / assessment3 ───
      // These tiers are served when a roadmap "Take Quiz" button navigates with ?type=assessmentN.
      const TIER_KEYS = ['assessment1', 'assessment2', 'assessment3'];
      const normType = assessmentType.toLowerCase().trim();
      if (TIER_KEYS.includes(normType)) {
        // Find the matching bank key using keyword matching (case-insensitive).
        const bankKey = Object.keys(CATEGORY_QUESTION_BANKS).find((k) => {
          const kl = k.toLowerCase();
          if (subLower.includes('discrete') || subLower.includes('math'))
            return kl.includes('discrete');
          if (subLower.includes('database') || subLower.includes('dbms') || subLower.includes('sql'))
            return kl.includes('database');
          if (subLower.includes('network'))
            return kl.includes('network');
          if (subLower.includes('operating') || subLower.includes(' os'))
            return kl.includes('operating');
          // Default: DSA / Data Structures
          return kl.includes('data struct') || kl.includes('algorithm');
        });

        const tierBank = bankKey ? CATEGORY_QUESTION_BANKS[bankKey]?.[normType] : null;

        if (tierBank) {
          return {
            id: tierBank.id,
            subject,
            department,
            semester,
            assessmentType: normType,
            title: tierBank.title,
            subtitle: `${department} • ${semester}`,
            durationMinutes: tierBank.durationMinutes,
            questions: tierBank.questions,
          };
        }
        // If no bank entry found, fall through to the generic inline questions below.
      }
      // ─────────────────────────────────────────────────────────────────────────────────

      let questions = [];

      // 1. DISCRETE MATHEMATICS (Never mix DSA with Discrete Math!)
      if (subLower.includes('discrete') || subLower.includes('math')) {
        if (isWeakLink) {
          questions = [
            { id: 'dm_w_1', category: 'Discrete Mathematics', question: 'Which logical equivalence correctly represents the contrapositive of P → Q?', options: ['¬Q → ¬P', '¬P → ¬Q', 'Q → P', 'P ∧ ¬Q'], correctOptionIndex: 0 },
            { id: 'dm_w_2', category: 'Discrete Mathematics', question: 'In a group of 13 people, what is the minimum number of people born in the same month by Pigeonhole Principle?', options: ['1', '2', '3', '4'], correctOptionIndex: 1 },
            { id: 'dm_w_3', category: 'Discrete Mathematics', question: 'What is the sum of degrees of all vertices in a simple graph with E edges?', options: ['E', '2E', 'E/2', 'E^2'], correctOptionIndex: 1 },
            { id: 'dm_w_4', category: 'Discrete Mathematics', question: 'Which property MUST hold for a relation to be an Equivalence Relation?', options: ['Reflexive, Symmetric, Transitive', 'Reflexive, Anti-symmetric, Transitive', 'Irreflexive, Symmetric, Transitive', 'Reflexive, Symmetric, Asymmetric'], correctOptionIndex: 0 },
            { id: 'dm_w_5', category: 'Discrete Mathematics', question: 'What is the solution to the recurrence relation T(n) = T(n-1) + 3 with T(0) = 2?', options: ['T(n) = 3n + 2', 'T(n) = 2n + 3', 'T(n) = 3^n + 2', 'T(n) = n^3 + 2'], correctOptionIndex: 0 },
          ];
        } else {
          questions = [
            { id: 'dm_d_1', category: 'Discrete Mathematics', question: 'Which of the following propositions is a Tautology?', options: ['P ∨ ¬P', 'P ∧ ¬P', 'P → ¬P', '¬P ∧ P'], correctOptionIndex: 0 },
            { id: 'dm_d_2', category: 'Discrete Mathematics', question: 'What is the Cartesian Product |A × B| if |A| = 4 and |B| = 5?', options: ['9', '20', '16', '25'], correctOptionIndex: 1 },
            { id: 'dm_d_3', category: 'Discrete Mathematics', question: 'How many edges are in a complete graph K5 with 5 vertices?', options: ['5', '10', '15', '20'], correctOptionIndex: 1 },
            { id: 'dm_d_4', category: 'Discrete Mathematics', question: 'A Partially Ordered Set (Poset) requires which three properties?', options: ['Reflexive, Anti-symmetric, Transitive', 'Reflexive, Symmetric, Transitive', 'Irreflexive, Symmetric, Transitive', 'Reflexive, Asymmetric, Transitive'], correctOptionIndex: 0 },
            { id: 'dm_d_5', category: 'Discrete Mathematics', question: 'What is the chromatic number of a bipartite graph with at least one edge?', options: ['1', '2', '3', '4'], correctOptionIndex: 1 },
          ];
        }
      }
      // 2. DATABASE MANAGEMENT SYSTEMS (DBMS)
      else if (subLower.includes('database') || subLower.includes('dbms') || subLower.includes('sql')) {
        if (isWeakLink) {
          questions = [
            { id: 'db_w_1', category: 'Database Systems', question: 'Which Normal Form strictly prohibits non-trivial Functional Dependencies X → Y where X is NOT a Super Key?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctOptionIndex: 3 },
            { id: 'db_w_2', category: 'Database Systems', question: 'In SQL, which clause MUST be used to filter aggregated group results produced by GROUP BY?', options: ['WHERE', 'HAVING', 'ORDER BY', 'EXISTS'], correctOptionIndex: 1 },
            { id: 'db_w_3', category: 'Database Systems', question: 'Which concurrency anomaly occurs when T1 reads data modified by T2 before T2 commits?', options: ['Dirty Read', 'Non-Repeatable Read', 'Phantom Read', 'Lost Update'], correctOptionIndex: 0 },
            { id: 'db_w_4', category: 'Database Systems', question: 'In a B+ Tree index, where are the actual data pointers / record pointers stored?', options: ['Root node only', 'Internal nodes only', 'Leaf nodes only', 'All tree nodes'], correctOptionIndex: 2 },
            { id: 'db_w_5', category: 'Database Systems', question: 'Which ACID property ensures all operations in a transaction complete successfully or none take effect?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], correctOptionIndex: 0 },
          ];
        } else {
          questions = [
            { id: 'db_d_1', category: 'Database Systems', question: 'Which SQL command is used to alter an existing table structure in a relational database?', options: ['UPDATE', 'ALTER TABLE', 'MODIFY TABLE', 'CHANGE TABLE'], correctOptionIndex: 1 },
            { id: 'db_d_2', category: 'Database Systems', question: 'What type of JOIN returns all records when there is a match in either left or right table?', options: ['INNER JOIN', 'FULL OUTER JOIN', 'LEFT JOIN', 'CROSS JOIN'], correctOptionIndex: 1 },
            { id: 'db_d_3', category: 'Database Systems', question: 'A Primary Key must satisfy which two constraints?', options: ['UNIQUE and NOT NULL', 'FOREIGN and NOT NULL', 'CHECK and UNIQUE', 'DEFAULT and UNIQUE'], correctOptionIndex: 0 },
            { id: 'db_d_4', category: 'Database Systems', question: 'Which command permanently saves all changes made during the current transaction?', options: ['ROLLBACK', 'COMMIT', 'SAVEPOINT', 'CHECKPOINT'], correctOptionIndex: 1 },
            { id: 'db_d_5', category: 'Database Systems', question: 'What is an ER Diagram entity set represented by in relational schema design?', options: ['Relation (Table)', 'Column / Attribute', 'Primary Key', 'Foreign Key'], correctOptionIndex: 0 },
          ];
        }
      }
      // 3. COMPUTER NETWORKS
      else if (subLower.includes('network')) {
        if (isWeakLink) {
          questions = [
            { id: 'cn_w_1', category: 'Computer Networks', question: 'How many usable host IP addresses are available in a subnetwork with CIDR prefix /26?', options: ['64', '62', '32', '30'], correctOptionIndex: 1 },
            { id: 'cn_w_2', category: 'Computer Networks', question: 'Which TCP flag sequence is used during the standard 3-Way Handshake connection establishment?', options: ['SYN -> SYN-ACK -> ACK', 'ACK -> SYN -> ACK', 'FIN -> ACK -> FIN', 'SYN -> ACK -> RST'], correctOptionIndex: 0 },
            { id: 'cn_w_3', category: 'Computer Networks', question: 'Which Distance Vector routing protocol uses Hop Count as its sole metric and suffers from Count-to-Infinity?', options: ['OSPF', 'RIP', 'BGP', 'EIGRP'], correctOptionIndex: 1 },
            { id: 'cn_w_4', category: 'Computer Networks', question: 'What is the primary function of the ARP protocol?', options: ['Map IP address to MAC address', 'Map Domain Name to IP', 'Assign Dynamic IP', 'Route Packets'], correctOptionIndex: 0 },
            { id: 'cn_w_5', category: 'Computer Networks', question: 'In TCP congestion control, what happens immediately after a packet loss detection via 3 Duplicate ACKs?', options: ['Slow Start', 'Fast Retransmit & Fast Recovery', 'Reset Connection', 'Increase Congestion Window'], correctOptionIndex: 1 },
          ];
        } else {
          questions = [
            { id: 'cn_d_1', category: 'Computer Networks', question: 'Which OSI layer is responsible for end-to-end process-to-process communication and error control?', options: ['Network Layer', 'Transport Layer', 'Data Link Layer', 'Physical Layer'], correctOptionIndex: 1 },
            { id: 'cn_d_2', category: 'Computer Networks', question: 'Which protocol operates on port number 443 by default?', options: ['HTTP', 'HTTPS', 'FTP', 'DNS'], correctOptionIndex: 1 },
            { id: 'cn_d_3', category: 'Computer Networks', question: 'What is the IPv4 address length in bits?', options: ['16 bits', '32 bits', '64 bits', '128 bits'], correctOptionIndex: 1 },
            { id: 'cn_d_4', category: 'Computer Networks', question: 'Which device operates primarily at the Data Link Layer (Layer 2) of the OSI model?', options: ['Router', 'Switch', 'Repeater', 'Hub'], correctOptionIndex: 1 },
            { id: 'cn_d_5', category: 'Computer Networks', question: 'Which transport protocol is connectionless and does NOT guarantee packet delivery order?', options: ['TCP', 'UDP', 'SCTP', 'HTTP'], correctOptionIndex: 1 },
          ];
        }
      }
      // 4. OPERATING SYSTEMS
      else if (subLower.includes('operating') || subLower.includes('os')) {
        if (isWeakLink) {
          questions = [
            { id: 'os_w_1', category: 'Operating Systems', question: 'Which algorithm is used for Deadlock Avoidance by dynamically checking resource allocation state?', options: ['Bankers Algorithm', 'Round Robin', 'SJF', 'LRU'], correctOptionIndex: 0 },
            { id: 'os_w_2', category: 'Operating Systems', question: 'What is Belady’s Anomaly in Page Replacement algorithms?', options: ['More page frames cause MORE page faults in FIFO', 'More frames cause fewer faults', 'LRU causes infinite loop', 'Optimal algorithm fails'], correctOptionIndex: 0 },
            { id: 'os_w_3', category: 'Operating Systems', question: 'What condition occurs when a process parent terminates before calling wait()?', options: ['Zombie Process', 'Orphan Process', 'Daemon Process', 'Thread Starvation'], correctOptionIndex: 1 },
            { id: 'os_w_4', category: 'Operating Systems', question: 'Which atomic operations modify a Counting Semaphore value S?', options: ['wait(S) and signal(S)', 'lock(S) and release(S)', 'push(S) and pop(S)', 'open(S) and close(S)'], correctOptionIndex: 0 },
            { id: 'os_w_5', category: 'Operating Systems', question: 'What is Thrashing in Virtual Memory systems?', options: ['High CPU utilization', 'System spends more time paging than executing', 'Disk failure', 'Deadlock in kernel'], correctOptionIndex: 1 },
          ];
        } else {
          questions = [
            { id: 'os_d_1', category: 'Operating Systems', question: 'Which CPU scheduling algorithm gives the minimum average waiting time for a given set of processes?', options: ['FCFS', 'Shortest Job First (SJF)', 'Round Robin', 'Priority Scheduling'], correctOptionIndex: 1 },
            { id: 'os_d_2', category: 'Operating Systems', question: 'Which data structure maintains information about a specific process in OS kernel?', options: ['PCB (Process Control Block)', 'TLB', 'Inode Table', 'Page Table'], correctOptionIndex: 0 },
            { id: 'os_d_3', category: 'Operating Systems', question: 'What is the main advantage of Paging over Contiguous Memory Allocation?', options: ['Eliminates Internal Fragmentation', 'Eliminates External Fragmentation', 'Fastest Access', 'Zero Overhead'], correctOptionIndex: 1 },
            { id: 'os_d_4', category: 'Operating Systems', question: 'Which mechanism provides fast virtual-to-physical address translation hardware caching?', options: ['TLB (Translation Lookaside Buffer)', 'Cache RAM', 'Register File', 'DMA Controller'], correctOptionIndex: 0 },
            { id: 'os_d_5', category: 'Operating Systems', question: 'Which system call creates a new child process in UNIX/Linux?', options: ['fork()', 'exec()', 'wait()', 'exit()'], correctOptionIndex: 0 },
          ];
        }
      }
      // 5. DIGITAL ELECTRONICS / DIGITAL PRINCIPLES
      else if (subLower.includes('digital') || subLower.includes('circuit') || subLower.includes('microprocessor')) {
        questions = [
          { id: 'de_1', category: 'Digital Principles', question: 'How many select lines are required for an 8-to-1 Multiplexer (8:1 MUX)?', options: ['2', '3', '4', '8'], correctOptionIndex: 1 },
          { id: 'de_2', category: 'Digital Principles', question: 'Which Flip-Flop condition occurs in SR Flip-Flop when both S=1 and R=1?', options: ['Reset', 'Set', 'Invalid / Forbidden State', 'Toggle'], correctOptionIndex: 2 },
          { id: 'de_3', category: 'Digital Principles', question: 'What is the Two’s Complement of binary number 1010?', options: ['0101', '0110', '1011', '1100'], correctOptionIndex: 1 },
          { id: 'de_4', category: 'Digital Principles', question: 'Which logic gate is known as a Universal Gate?', options: ['AND', 'OR', 'NAND', 'XOR'], correctOptionIndex: 2 },
          { id: 'de_5', category: 'Digital Principles', question: 'A 4-variable K-Map contains how many total minterm cells?', options: ['4', '8', '16', '32'], correctOptionIndex: 2 },
        ];
      }
      // 6. DATA STRUCTURES & ALGORITHMS (Semester-specific variants!)
      else {
        if (semLower.includes('4') || semLower.includes('5')) {
          // Advanced DSA (Semester 4/5)
          if (isWeakLink) {
            questions = [
              { id: 'dsa_s4_w1', category: 'Data Structures & Algorithms', question: 'Which Graph algorithm finds All-Pairs Shortest Paths in O(V^3) time using Dynamic Programming?', options: ['Dijkstra', 'Floyd-Warshall', 'Bellman-Ford', 'Kruskal'], correctOptionIndex: 1 },
              { id: 'dsa_s4_w2', category: 'Data Structures & Algorithms', question: 'What is the time complexity of building a Binary Heap from an unsorted array of N elements using Heapify?', options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(log N)'], correctOptionIndex: 1 },
              { id: 'dsa_s4_w3', category: 'Data Structures & Algorithms', question: 'Which technique is used in KMP Algorithm for string matching to avoid unnecessary character comparisons?', options: ['Prefix Function / Longest Proper Prefix-Suffix (LPS) Array', 'Hash Function', 'Suffix Tree', 'Trie'], correctOptionIndex: 0 },
              { id: 'dsa_s4_w4', category: 'Data Structures & Algorithms', question: 'What is the worst-case time complexity of Bellman-Ford algorithm on a graph with V vertices and E edges?', options: ['O(V + E)', 'O(V * E)', 'O(V^2)', 'O(E log V)'], correctOptionIndex: 1 },
              { id: 'dsa_s4_w5', category: 'Data Structures & Algorithms', question: 'In 0/1 Knapsack Problem, why does the Greedy fractional approach fail?', options: ['Items cannot be divided into fractional parts', 'Dynamic programming fails', 'Overlapping subproblems missing', 'Greedy choice property holds'], correctOptionIndex: 0 },
            ];
          } else {
            questions = [
              { id: 'dsa_s4_d1', category: 'Data Structures & Algorithms', question: 'Which data structure is optimal for implementing Topological Sort on a Directed Acyclic Graph (DAG)?', options: ['Queue / Indegree Array (Kahn’s Algorithm)', 'Min-Heap', 'Hash Table', 'Binary Tree'], correctOptionIndex: 0 },
              { id: 'dsa_s4_d2', category: 'Data Structures & Algorithms', question: 'What is the main property of a Red-Black Tree to ensure O(log N) operations?', options: ['No two consecutive red nodes on any path', 'All nodes are black', 'Strictly balanced height difference 0', 'Nodes sorted in postorder'], correctOptionIndex: 0 },
              { id: 'dsa_s4_d3', category: 'Data Structures & Algorithms', question: 'Which algorithmic paradigm does Prim’s Minimum Spanning Tree algorithm follow?', options: ['Greedy Approach', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'], correctOptionIndex: 0 },
              { id: 'dsa_s4_d4', category: 'Data Structures & Algorithms', question: 'What is the space complexity of Breadth-First Search (BFS) on a graph with maximum width W?', options: ['O(1)', 'O(W)', 'O(V + E)', 'O(V^2)'], correctOptionIndex: 1 },
              { id: 'dsa_s4_d5', category: 'Data Structures & Algorithms', question: 'Which sorting algorithm is guaranteed to be stable and runs in O(N log N) worst-case time?', options: ['QuickSort', 'MergeSort', 'HeapSort', 'SelectionSort'], correctOptionIndex: 1 },
            ];
          }
        } else {
          // Core DSA (Semester 3)
          if (isWeakLink) {
            questions = [
              { id: 'dsa_s3_w1', category: 'Data Structures & Algorithms', question: 'What is the worst-case time complexity of searching an element in a Singly Linked List of size N?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'], correctOptionIndex: 2 },
              { id: 'dsa_s3_w2', category: 'Data Structures & Algorithms', question: 'Which algorithm is optimal for detecting a cycle in a Singly Linked List without extra memory?', options: ['Floyd’s Tortoise and Hare (Two Pointers)', 'Hash Set lookup', 'Reversing list', 'Sorting nodes'], correctOptionIndex: 0 },
              { id: 'dsa_s3_w3', category: 'Data Structures & Algorithms', question: 'What is the worst-case time complexity of QuickSort when pivot is always smallest or largest element?', options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(log N)'], correctOptionIndex: 2 },
              { id: 'dsa_s3_w4', category: 'Data Structures & Algorithms', question: 'In a Min-Heap with N elements, what is the time complexity of deleting the minimum root element?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'], correctOptionIndex: 1 },
              { id: 'dsa_s3_w5', category: 'Data Structures & Algorithms', question: 'What collision resolution technique in Hash Tables uses Separate Chaining via linked lists?', options: ['Linear Probing', 'Separate Chaining', 'Quadratic Probing', 'Double Hashing'], correctOptionIndex: 1 },
            ];
          } else {
            questions = [
              { id: 'dsa_s3_d1', category: 'Data Structures & Algorithms', question: 'Which data structure operates strictly on a LIFO (Last In, First Out) principle?', options: ['Queue', 'Stack', 'Circular List', 'Priority Queue'], correctOptionIndex: 1 },
              { id: 'dsa_s3_d2', category: 'Data Structures & Algorithms', question: 'In a Binary Search Tree (BST), which tree traversal order visits nodes in strictly ascending sorted order?', options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'], correctOptionIndex: 1 },
              { id: 'dsa_s3_d3', category: 'Data Structures & Algorithms', question: 'What is the average time complexity of Binary Search on a sorted array of N elements?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'], correctOptionIndex: 1 },
              { id: 'dsa_s3_d4', category: 'Data Structures & Algorithms', question: 'Which graph traversal algorithm uses a Queue data structure to explore nodes level-by-level?', options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Topological Sort', 'Kruskal’s Algorithm'], correctOptionIndex: 0 },
              { id: 'dsa_s3_d5', category: 'Data Structures & Algorithms', question: 'What is the minimum number of Queues required to implement a functional Stack?', options: ['1', '2', '3', 'Cannot be implemented'], correctOptionIndex: 1 },
            ];
          }
        }
      }

      const displayTitle = isWeakLink
        ? `Weak-Link Diagnostic Assessment: ${subject}`
        : isDynamicSelf
        ? `Dynamic Self-Assessment: ${subject}`
        : `Clearance Benchmark Examination: ${subject}`;

      return {
        id: `assess_${department}_${semester}_${subject}_${assessmentType}`.replace(/\s+/g, '_'),
        subject,
        department,
        semester,
        assessmentType,
        title: displayTitle,
        subtitle: `${department} • ${semester} • ${isWeakLink ? 'Weak-Link Focus' : 'Self-Assessment'}`,
        durationMinutes: 20,
        questions,
      };
    };

    // Resolve subject title → subject code via the subjects endpoint, then call the real backend.
    try {
      // Extract dept code: use the uppercase abbreviation portion before any dash or space.
      const deptCode = department.split(/[\s&]/)[0].trim().toUpperCase();
      // Extract semester number from strings like "Semester 3" or "3".
      const semMatch = semester.match(/(\d+)/);
      const semNumber = semMatch ? semMatch[1] : semester;

      // Fetch subjects for this dept/sem to find the matching subject code.
      const subjectsData = await apiClient.get(`/subjects/${encodeURIComponent(deptCode)}/${semNumber}`);
      const subjectsList = Array.isArray(subjectsData)
        ? subjectsData
        : subjectsData?.subjects || [];

      // Match the selected subject title (case-insensitive) to a subject code.
      const matchedSubject = subjectsList.find(
        (s) =>
          (s.title || s.name || '').toLowerCase() === subject.toLowerCase() ||
          (s.code || '').toLowerCase() === subject.toLowerCase()
      );

      if (!matchedSubject?.code) {
        // Subject not found in this dept/sem — fall back to local questions.
        console.warn(`[Assessment] Subject '${subject}' not found in backend for ${deptCode} sem ${semNumber}. Using local fallback questions.`);
        return fallback();
      }

      const subjectCode = matchedSubject.code.trim().toUpperCase();

      // Fetch real assessment questions from backend.
      const backendData = await apiClient.get(`/final-assessments/${encodeURIComponent(subjectCode)}`);

      // Normalise to the shape the page expects.
      return {
        id: `assess_backend_${subjectCode}`,
        subject,
        subjectCode,
        department,
        semester,
        assessmentType,
        title: `${subject} Assessment`,
        subtitle: `${department} • ${semester}`,
        durationMinutes: 20,
        questions: (backendData.questions || []).map((q) => ({
          id: q.id,
          category: subject,
          question: q.question,
          options: q.options,
          // correctOptionIndex is intentionally omitted — the backend grades on submit.
        })),
      };
    } catch (err) {
      // Any network or 4xx error falls back to local question bank.
      if (err.status && err.status !== 404) throw err;
      console.warn('[Assessment] Backend final-assessment unavailable, using local question bank.', err.message);
      return fallback();
    }
  },

  /**
   * Get placement readiness diagnostic assessment questions
   */
  async getPlacementAssessment() {
    const fallback = () => ({
      id: 'assess_pr_2026',
      title: 'Placement Readiness Diagnostic Assessment',
      durationMinutes: 20,
      totalQuestions: 6,
      categories: ['Data Structures & Algorithms', 'System Fundamentals', 'Quantitative Aptitude', 'Verbal & Logic'],
      questions: [
        {
          id: 'q1',
          category: 'Data Structures & Algorithms',
          question: 'What is the worst-case time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black)?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctOptionIndex: 1,
        },
        {
          id: 'q2',
          category: 'Data Structures & Algorithms',
          question: 'Which data structure is fundamentally used in Depth-First Search (DFS) graph traversal?',
          options: ['Queue', 'Stack (or Call Stack)', 'Min-Heap', 'Hash Table'],
          correctOptionIndex: 1,
        },
        {
          id: 'q3',
          category: 'System Fundamentals',
          question: 'In Operating Systems, which condition is NOT one of Coffman’s four conditions necessary for deadlock?',
          options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
          correctOptionIndex: 2,
        },
        {
          id: 'q4',
          category: 'System Fundamentals',
          question: 'In relational databases, which normal form ensures that no non-prime attribute is transitively dependent on the primary key?',
          options: ['1NF', '2NF', '3NF', 'BCNF'],
          correctOptionIndex: 2,
        },
        {
          id: 'q5',
          category: 'Quantitative Aptitude',
          question: 'A train 180 meters long running at 54 km/h passes a platform in 24 seconds. What is the length of the platform?',
          options: ['160 meters', '180 meters', '200 meters', '220 meters'],
          correctOptionIndex: 1,
        },
        {
          id: 'q6',
          category: 'Verbal & Logic',
          question: 'If all Coders are Problem Solvers, and some Problem Solvers are Innovators, which statement is definitely true?',
          options: [
            'All Coders are Innovators',
            'Some Coders may be Innovators',
            'No Innovator is a Coder',
            'Every Innovator is a Coder',
          ],
          correctOptionIndex: 1,
        },
      ],
    });

    try {
      return await apiClient.get('/assessment/placement-readiness', {}, fallback);
    } catch (err) {
      return fallback();
    }
  },

  /**
   * Submit Placement Readiness answers to backend AI
   */
  async submitPlacementAssessment(submission) {
    const fallback = () => {
      const answers = submission.answers || {};
      let correct = 0;
      if (answers.q1 === 1) correct++;
      if (answers.q2 === 1) correct++;
      if (answers.q3 === 2) correct++;
      if (answers.q4 === 2) correct++;
      if (answers.q5 === 1) correct++;
      if (answers.q6 === 1) correct++;

      const percentage = Math.round((correct / 6) * 100);
      const isReady = percentage >= 65;

      const result = {
        success: true,
        assessmentId: 'assess_pr_' + Date.now(),
        score: correct,
        totalScore: 6,
        percentage,
        readinessStatus: isReady ? 'Ready' : 'Not Ready',
        aiFeedback: isReady
          ? 'Exceptional performance across technical problem solving and aptitude! Direct entry to AI Mock Interviews is unlocked.'
          : 'Good effort. Gaps detected in core algorithms. Accelerated training modules are recommended.',
        categoryBreakdown: [
          { category: 'Data Structures & Algorithms', score: answers.q1 === 1 && answers.q2 === 1 ? 100 : answers.q1 === 1 || answers.q2 === 1 ? 50 : 0 },
          { category: 'System Fundamentals', score: answers.q3 === 2 && answers.q4 === 2 ? 100 : answers.q3 === 2 || answers.q4 === 2 ? 50 : 0 },
          { category: 'Aptitude & Logical Reasoning', score: answers.q5 === 1 && answers.q6 === 1 ? 100 : answers.q5 === 1 || answers.q6 === 1 ? 50 : 0 },
        ],
        nextStep: isReady ? '/mock-interview' : '/training',
      };

      localStorage.setItem('lag_to_launch_readiness_result', JSON.stringify(result));
      return result;
    };

    try {
      return await apiClient.post('/assessment/placement-readiness/submit', submission, {}, fallback);
    } catch (err) {
      return fallback();
    }
  },

  /**
   * Get Final Arrear Clearance Assessment questions
   */
  async getFinalAssessment(subject, assessmentType = 'final') {
    return this.getCategoryAssessment(subject, assessmentType);
  },

  /**
   * Submit Final / Category assessment
   */
  async submitFinalAssessment(submission) {
    const fallback = () => {
      const questions = submission.questions || [];
      const answers = submission.answers || {};

      const correct = questions.filter(
        (q) => answers[q.id] === q.correctOptionIndex
      ).length;

      const total = questions.length;

      const percentage = total > 0
        ? Math.round((correct / total) * 100)
        : 0;

      // Build per-question result objects for downstream analysis
      const questionResults = questions.map((q) => {
        const selectedOptionIndex = answers[q.id] !== undefined ? answers[q.id] : null;
        const isCorrect = selectedOptionIndex !== null && selectedOptionIndex === q.correctOptionIndex;
        return {
          questionId: q.id,
          question: q.question,
          category: q.category || '',
          topic: q.topic || q.category || '',
          selectedOptionIndex,
          correctOptionIndex: q.correctOptionIndex,
          isCorrect,
        };
      });
      const passed = percentage >= 60;

      return {
        success: true,
        passed,
        score: correct,
        totalScore: total,
        percentage,
        questionResults,
        message: passed
          ? 'Congratulations! You have successfully passed the Assessment Benchmark. Your status is now updated to Placement Ready!'
          : 'You scored below the 60% clearance threshold. Please review the weak topic notes and re-attempt.',
        newStatus: passed ? 'No Arrears' : 'Active Arrears',
      };
    };

    // If the assessment was loaded from the real backend it will have a subjectCode
    // and answers will be keyed by MongoDB ObjectId strings with option-index values.
    // We must convert to the backend's expected format:
    //   { subject_code, answers: [{question_id, selected_answer}] }
    // where selected_answer is the option text (not the index).
    const subjectCode = submission.subjectCode;
    const rawAnswers = submission.answers || {};
    const questions = submission.questions || []; // populated by FinalAssessmentPage

    if (subjectCode && questions.length > 0) {
      // Build a qId → question map so we can look up the option text.
      const qMap = {};
      questions.forEach((q) => { qMap[q.id] = q; });

      const formattedAnswers = Object.entries(rawAnswers)
        .filter(([qId]) => qMap[qId]) // only include questions that exist
        .map(([qId, optionIdx]) => ({
          question_id: qId,
          selected_answer: qMap[qId]?.options?.[optionIdx] ?? String(optionIdx),
        }));

      try {
        const backendResult = await apiClient.post('/final-assessments/submit', {
          subject_code: subjectCode,
          answers: formattedAnswers,
        });
        // Normalise backend response to the shape FinalAssessmentPage expects.
        const r = backendResult.result || backendResult;
        return {
          success: true,
          passed: r.passed,
          score: r.score,
          totalScore: r.total_questions,
          percentage: r.percentage,
          message: r.passed
            ? 'Congratulations! You have successfully passed the Assessment Benchmark. Your status is now updated to Placement Ready!'
            : 'You scored below the 60% clearance threshold. Please review the weak topic notes and re-attempt.',
          newStatus: r.passed ? 'No Arrears' : 'Active Arrears',
        };
      } catch (err) {
        console.warn('[Assessment] Backend submit failed, falling back to local grading.', err.message);
        return fallback();
      }
    }

    // Legacy path: assessment loaded from local question bank — submit locally.
    return fallback();
  },

  /**
   * Deterministic performance analysis based solely on the current quiz's questionResults.
   * Uses ONLY the provided questionResults — no localStorage, no history, no previous attempts.
   *
   * @param {Array}  questionResults  - Array of { questionId, question, topic, isCorrect, ... }
   * @param {string} subject          - Subject name (e.g. 'Data Structures & Algorithms')
   * @param {string} assessmentType   - 'assessment1' | 'assessment2' | 'assessment3' | 'final'
   * @returns {{
   *   correctCount, wrongCount, total, percentage,
   *   weakTopics, strongTopics,
   *   wrongQuestions, correctQuestions,
   *   recommendation, performanceLevel
   * }}
   */
  analyzePerformance(questionResults = [], subject = '', assessmentType = '') {
    // Partition results — do not mutate the input array
    const wrongQuestions  = questionResults.filter((r) => !r.isCorrect);
    const correctQuestions = questionResults.filter((r) => r.isCorrect);

    const total        = questionResults.length;
    const correctCount = correctQuestions.length;
    const wrongCount   = wrongQuestions.length;
    const percentage   = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // Deduplicated topic lists derived from the current quiz only
    const weakTopics = [...new Set(
      wrongQuestions.map((r) => r.topic).filter(Boolean)
    )];
    const strongTopics = [...new Set(
      correctQuestions.map((r) => r.topic).filter(Boolean)
    )].filter((t) => !weakTopics.includes(t)); // exclude topics that also appear in wrong answers

    // Performance level — spec thresholds: <50 | 50-79 | >=80
    let performanceLevel;
    if (percentage >= 80) {
      performanceLevel = 'Strong';
    } else if (percentage >= 50) {
      performanceLevel = 'Developing';
    } else {
      performanceLevel = 'Needs Improvement';
    }

    // Recommendation — spec thresholds: <50 | 50-79 | >=80
    let recommendation;
    if (percentage >= 80) {
      if (weakTopics.length === 0) {
        recommendation = `Excellent work on ${subject}! You demonstrated strong mastery across all topics. Proceed to the next learning stage.`;
      } else {
        recommendation = `Strong performance on ${subject}! Consider revising ${weakTopics.join(', ')} briefly before moving ahead.`;
      }
    } else if (percentage >= 50) {
      if (weakTopics.length > 0) {
        recommendation = `Good progress on ${subject}. Review and practise ${weakTopics.join(', ')} to strengthen your understanding before the next assessment.`;
      } else {
        recommendation = `Good progress on ${subject}. Keep practising to consolidate your understanding and reach the next performance tier.`;
      }
    } else {
      if (weakTopics.length > 0) {
        recommendation = `Revise ${weakTopics.join(', ')} in ${subject} before re-attempting. These topics had the most incorrect answers — focused revision will improve your score significantly.`;
      } else {
        recommendation = `Review all topics in ${subject} and re-attempt this assessment. Consistent practice will help you reach the 50% threshold.`;
      }
    }

    return {
      correctCount,
      wrongCount,
      total,
      percentage,
      weakTopics,
      strongTopics,
      wrongQuestions,
      correctQuestions,
      recommendation,
      performanceLevel,
    };
  },

  /**
   * Request AI-powered quiz performance feedback from the backend FastAPI Gemini service.
   * Endpoint: POST /api/analysis/quiz-feedback
   */
  async getAIQuizFeedback(payload) {
    return await apiClient.post('/analysis/quiz-feedback', payload, { timeout: 30000 });
  },
};

export default assessmentApi;

/**
 * Standalone named export so callers can import analyzePerformance directly:
 *   import { analyzePerformance } from '../api/assessment';
 * The implementation delegates to the method on assessmentApi so there is
 * exactly one source of truth — no duplication.
 */
export function analyzePerformance(questionResults, subject, assessmentType) {
  return assessmentApi.analyzePerformance(questionResults, subject, assessmentType);
}

/**
 * Standalone named export for AI quiz feedback:
 *   import { getAIQuizFeedback } from '../api/assessment';
 */
export function getAIQuizFeedback(payload) {
  return assessmentApi.getAIQuizFeedback(payload);
}

