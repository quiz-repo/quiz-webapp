export const testdata = () => {
  return [
    {
      id: "5vugQmyHao8esOlmmo6n",
      questions: [
        {
          id: 1,
          question:
            "Which HTTP status code should be returned when a resource is successfully created via POST request?",
          options: ["200 OK", "201 Created", "202 Accepted", "204 No Content"],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 2,
          question:
            "In React, what is the primary purpose of the useCallback hook?",
          options: [
            "To memoize expensive calculations",
            "To memoize function references to prevent unnecessary re-renders",
            "To handle side effects",
            "To manage component state",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 3,
          question:
            "What is the difference between clustered and non-clustered indexes in SQL databases?",
          options: [
            "Clustered indexes sort data physically, non-clustered create separate lookup structures",
            "Clustered indexes are faster, non-clustered are slower",
            "Clustered indexes use more memory, non-clustered use less",
            "There is no significant difference",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 4,
          question:
            "In microservices architecture, what is the Circuit Breaker pattern used for?",
          options: [
            "Load balancing between services",
            "Preventing cascading failures by failing fast when a service is unavailable",
            "Data encryption between services",
            "Service discovery and routing",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 5,
          question:
            "Which Docker command creates a new image from a container's changes?",
          options: [
            "docker build",
            "docker commit",
            "docker create",
            "docker save",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 6,
          question:
            "In Node.js, what is the event loop and how does it handle I/O operations?",
          options: [
            "Synchronously processes all operations in sequence",
            "Uses multiple threads for all operations",
            "Single-threaded event loop with non-blocking I/O using callbacks/promises",
            "Creates new processes for each I/O operation",
          ],
          correctAnswer: 2,
          type: "multiple-choice",
        },
        {
          id: 7,
          question:
            "What is the primary difference between Server-Side Rendering (SSR) and Static Site Generation (SSG)?",
          options: [
            "SSR generates pages at build time, SSG generates at request time",
            "SSR generates pages at request time, SSG generates at build time",
            "SSR is faster than SSG",
            "There is no difference",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 8,
          question:
            "In Redis, what is the time complexity of the SADD operation?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 9,
          question:
            "Which design pattern is commonly used to handle cross-cutting concerns in enterprise applications?",
          options: [
            "Singleton",
            "Factory",
            "Aspect-Oriented Programming (AOP)",
            "Observer",
          ],
          correctAnswer: 2,
          type: "multiple-choice",
        },
        {
          id: 10,
          question:
            "In GraphQL, what is the N+1 query problem and how can it be solved?",
          options: [
            "Too many queries executed, solved by batching with DataLoader",
            "Not enough queries, solved by pagination",
            "Query depth issues, solved by depth limiting",
            "Authentication problems, solved by JWT",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 11,
          question: "What is the CAP theorem in distributed systems?",
          options: [
            "Consistency, Availability, Performance - you can have all three",
            "Consistency, Availability, Partition tolerance - you can only guarantee two",
            "Caching, Authentication, Performance - fundamental principles",
            "Create, Access, Process - basic operations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 12,
          question: "In TypeScript, what does the 'never' type represent?",
          options: [
            "A value that is null or undefined",
            "A value that never occurs or represents unreachable code",
            "A value that can be any type",
            "A value that is always false",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 13,
          question: "Which SQL isolation level prevents phantom reads?",
          options: [
            "Read Uncommitted",
            "Read Committed",
            "Repeatable Read",
            "Serializable",
          ],
          correctAnswer: 3,
          type: "multiple-choice",
        },
        {
          id: 14,
          question:
            "In Kubernetes, what is the difference between a Deployment and a StatefulSet?",
          options: [
            "Deployment for stateless apps, StatefulSet for stateful apps with stable identities",
            "Deployment is newer, StatefulSet is deprecated",
            "Deployment handles scaling, StatefulSet handles networking",
            "No significant difference",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 15,
          question: "What is the purpose of CSRF tokens in web security?",
          options: [
            "Encrypt user passwords",
            "Prevent cross-site request forgery attacks",
            "Handle user authentication",
            "Manage session timeouts",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 16,
          question:
            "In React, what is the difference between useMemo and useCallback?",
          options: [
            "useMemo memoizes values, useCallback memoizes functions",
            "useMemo is for state, useCallback is for effects",
            "useMemo is synchronous, useCallback is asynchronous",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 17,
          question: "What is database sharding and when should it be used?",
          options: [
            "Copying data to multiple servers, used for backup",
            "Partitioning data across multiple databases to improve performance",
            "Encrypting database connections",
            "Creating database indexes",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 18,
          question:
            "In Express.js, what is the purpose of middleware functions?",
          options: [
            "To handle database connections only",
            "Functions that execute during request-response cycle with access to req, res, and next",
            "To manage client-side routing",
            "To compile TypeScript code",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 19,
          question:
            "What is the difference between WebSockets and Server-Sent Events (SSE)?",
          options: [
            "WebSockets are bidirectional, SSE are unidirectional from server to client",
            "SSE are bidirectional, WebSockets are unidirectional",
            "WebSockets are slower than SSE",
            "They are identical technologies",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 20,
          question:
            "In MongoDB, what is the purpose of indexing and which type provides the fastest lookups?",
          options: [
            "Indexing slows down queries, compound indexes are fastest",
            "Indexing speeds up queries, single field indexes are fastest",
            "Indexing speeds up queries, hash indexes provide fastest lookups",
            "Indexing only helps with sorting",
          ],
          correctAnswer: 2,
          type: "multiple-choice",
        },
        {
          id: 21,
          question:
            "What is the purpose of a reverse proxy in web architecture?",
          options: [
            "To hide client IP addresses",
            "To distribute requests to backend servers and provide caching/SSL termination",
            "To store user sessions",
            "To handle database connections",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 22,
          question: "In React, what is the purpose of React.StrictMode?",
          options: [
            "To enforce TypeScript strict mode",
            "To highlight potential problems and deprecated APIs in development",
            "To improve production performance",
            "To enable strict CSP policies",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 23,
          question:
            "What is the difference between optimistic and pessimistic locking in databases?",
          options: [
            "Optimistic locks immediately, pessimistic waits",
            "Optimistic assumes no conflicts and checks at commit, pessimistic locks during transaction",
            "Optimistic is faster, pessimistic is more secure",
            "There is no difference",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 24,
          question:
            "In CI/CD pipelines, what is the difference between continuous integration and continuous deployment?",
          options: [
            "CI merges code frequently, CD automatically deploys to production",
            "CI deploys code, CD integrates code",
            "CI is manual, CD is automated",
            "They are the same thing",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 25,
          question:
            "What is OAuth 2.0 and how does it differ from basic authentication?",
          options: [
            "OAuth 2.0 uses passwords, basic auth uses tokens",
            "OAuth 2.0 is an authorization framework using tokens, basic auth sends credentials with each request",
            "OAuth 2.0 is less secure than basic auth",
            "They serve different purposes entirely",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 26,
          question:
            "In Node.js, what is the difference between process.nextTick() and setImmediate()?",
          options: [
            "nextTick() executes after I/O events, setImmediate() executes before",
            "nextTick() executes before I/O events in current phase, setImmediate() executes in next iteration",
            "They are identical in functionality",
            "nextTick() is synchronous, setImmediate() is asynchronous",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 27,
          question:
            "What is the purpose of Content Security Policy (CSP) headers?",
          options: [
            "To encrypt HTTP traffic",
            "To prevent XSS attacks by controlling resource loading",
            "To manage user authentication",
            "To compress response data",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 28,
          question:
            "In React, what is the difference between controlled and uncontrolled components?",
          options: [
            "Controlled components manage their own state, uncontrolled rely on refs",
            "Controlled components have state managed by React, uncontrolled manage their own state",
            "Controlled components are faster than uncontrolled",
            "There is no significant difference",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 29,
          question:
            "What is database normalization and what is the goal of 3NF (Third Normal Form)?",
          options: [
            "Denormalization for performance, 3NF removes all redundancy",
            "Organizing data to reduce redundancy, 3NF eliminates transitive dependencies",
            "Creating indexes, 3NF creates composite keys",
            "Backing up data, 3NF creates three copies",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 30,
          question:
            "In Docker, what is the difference between COPY and ADD instructions?",
          options: [
            "COPY is for files, ADD is for directories",
            "COPY only copies files/directories, ADD can also extract archives and download URLs",
            "COPY is faster than ADD",
            "They are identical in functionality",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 31,
          question: "What is the purpose of database connection pooling?",
          options: [
            "To backup database connections",
            "To reuse database connections and improve performance",
            "To encrypt database traffic",
            "To replicate data across servers",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 32,
          question:
            "In TypeScript, what is the difference between 'interface' and 'type' declarations?",
          options: [
            "Interface is for objects only, type can represent any type including unions",
            "Interface is newer, type is deprecated",
            "Interface is faster at runtime",
            "They are completely identical",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 33,
          question:
            "What is the purpose of load balancing and what are the main algorithms?",
          options: [
            "To increase security, using encryption algorithms",
            "To distribute traffic across servers, using round-robin, least connections, weighted",
            "To cache data, using LRU and LFU",
            "To compress data, using gzip and brotli",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 34,
          question:
            "In REST APIs, what is the difference between PUT and PATCH methods?",
          options: [
            "PUT creates resources, PATCH updates them",
            "PUT replaces entire resource, PATCH updates specific fields",
            "PUT is idempotent, PATCH is not",
            "PUT is faster than PATCH",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 35,
          question: "What is Redis and what are its primary use cases?",
          options: [
            "A SQL database for complex queries",
            "An in-memory data structure store used for caching, sessions, pub/sub",
            "A message queue only",
            "A file storage system",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 36,
          question:
            "In React, what is the Virtual DOM and how does it improve performance?",
          options: [
            "A copy of the real DOM stored in memory",
            "A lightweight representation that enables efficient diffing and selective updates",
            "A debugging tool for React applications",
            "A server-side rendering technique",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 37,
          question:
            "What is the difference between horizontal and vertical scaling?",
          options: [
            "Horizontal adds more servers, vertical adds more power to existing servers",
            "Horizontal is cheaper, vertical is more expensive",
            "Horizontal is for databases, vertical is for web servers",
            "There is no difference",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 38,
          question:
            "In SQL, what is the difference between INNER JOIN and LEFT JOIN?",
          options: [
            "INNER JOIN returns all rows, LEFT JOIN returns matching rows",
            "INNER JOIN returns matching rows from both tables, LEFT JOIN returns all from left table",
            "INNER JOIN is faster than LEFT JOIN",
            "They produce identical results",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 39,
          question: "What is the purpose of API rate limiting?",
          options: [
            "To slow down all API requests",
            "To prevent abuse and ensure fair usage by limiting requests per time period",
            "To cache API responses",
            "To authenticate users",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 40,
          question:
            "In JavaScript, what is the difference between null and undefined?",
          options: [
            "null is assigned, undefined means no value has been assigned",
            "null is a string, undefined is a number",
            "null is faster than undefined",
            "They are identical in all contexts",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 41,
          question:
            "What is the purpose of database transactions and ACID properties?",
          options: [
            "To backup data automatically",
            "To ensure data integrity through Atomicity, Consistency, Isolation, Durability",
            "To improve query performance",
            "To handle user authentication",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 42,
          question:
            "In Node.js, what is the difference between require() and import statements?",
          options: [
            "require() is CommonJS, import is ES6 modules",
            "require() is newer than import",
            "require() is asynchronous, import is synchronous",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 43,
          question: "What is the purpose of CDN (Content Delivery Network)?",
          options: [
            "To store user data permanently",
            "To deliver content from geographically distributed servers for better performance",
            "To handle user authentication",
            "To process payments",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 44,
          question: "In React, what is the useEffect hook primarily used for?",
          options: [
            "Managing component state",
            "Handling side effects like API calls, subscriptions, DOM manipulation",
            "Creating new components",
            "Styling components",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 45,
          question: "What is the difference between SQL and NoSQL databases?",
          options: [
            "SQL is newer, NoSQL is older",
            "SQL uses structured data with ACID compliance, NoSQL offers flexible schemas",
            "SQL is faster than NoSQL",
            "SQL is for web apps, NoSQL is for mobile apps",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 46,
          question:
            "What is JWT (JSON Web Token) and what are its main components?",
          options: [
            "A database query language with SELECT, INSERT, UPDATE",
            "A token format with header, payload, and signature for secure information transmission",
            "A JavaScript framework with components and routing",
            "A CSS preprocessing tool",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 47,
          question:
            "In microservices, what is service discovery and why is it important?",
          options: [
            "Finding bugs in services",
            "Mechanism for services to find and communicate with each other dynamically",
            "Creating new services automatically",
            "Monitoring service performance",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 48,
          question:
            "What is the difference between synchronous and asynchronous programming?",
          options: [
            "Synchronous blocks until completion, asynchronous allows other operations to continue",
            "Synchronous is faster than asynchronous",
            "Synchronous uses more memory",
            "They are the same in JavaScript",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 49,
          question:
            "In CSS, what is the difference between Flexbox and CSS Grid?",
          options: [
            "Flexbox is 1D layout, Grid is 2D layout system",
            "Flexbox is newer than Grid",
            "Flexbox is for mobile, Grid is for desktop",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 50,
          question:
            "What is the purpose of environment variables in application deployment?",
          options: [
            "To store source code",
            "To store configuration values outside of code for different environments",
            "To improve application performance",
            "To handle user authentication",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 51,
          question:
            "In React, what is prop drilling and how can it be avoided?",
          options: [
            "Passing props through multiple component layers, avoided with Context API or state management",
            "Creating too many props, avoided by using fewer components",
            "Prop validation errors, avoided with TypeScript",
            "Performance issues, avoided with memoization",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 52,
          question:
            "What is the difference between authentication and authorization?",
          options: [
            "Authentication verifies identity, authorization determines permissions",
            "Authentication is for admins, authorization is for users",
            "Authentication uses passwords, authorization uses tokens",
            "They are the same concept",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 53,
          question:
            "In databases, what is an index and how does it improve query performance?",
          options: [
            "A backup of table data",
            "A data structure that improves query speed by creating shortcuts to data",
            "A way to encrypt sensitive data",
            "A method to compress table data",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 54,
          question:
            "What is the purpose of Docker containers and how do they differ from virtual machines?",
          options: [
            "Containers virtualize hardware, VMs virtualize OS",
            "Containers share OS kernel and are lightweight, VMs include full OS",
            "Containers are slower than VMs",
            "Containers are only for development, VMs for production",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 55,
          question:
            "In JavaScript, what is closure and provide a practical use case?",
          options: [
            "A way to close browser windows, used for popup management",
            "Function retaining access to outer scope variables, used for data privacy and callbacks",
            "A method to terminate functions early",
            "A debugging technique for finding errors",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 56,
          question:
            "What is the difference between unit testing and integration testing?",
          options: [
            "Unit tests individual components, integration tests component interactions",
            "Unit testing is manual, integration testing is automated",
            "Unit testing is for frontend, integration testing is for backend",
            "Unit testing is faster, integration testing is more thorough",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 57,
          question: "In SQL, what is the purpose of foreign keys?",
          options: [
            "To encrypt data in tables",
            "To establish and enforce referential integrity between tables",
            "To improve query performance",
            "To create table backups automatically",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 58,
          question: "What is the difference between HTTP and HTTPS?",
          options: [
            "HTTP is faster than HTTPS",
            "HTTP is unencrypted, HTTPS uses SSL/TLS encryption",
            "HTTP is for websites, HTTPS is for APIs",
            "HTTP supports more features than HTTPS",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 59,
          question:
            "In React, what is the difference between class components and functional components?",
          options: [
            "Class components use ES6 classes and lifecycle methods, functional components use hooks",
            "Class components are newer than functional components",
            "Class components are faster than functional components",
            "Class components are for complex UIs, functional for simple ones",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 60,
          question:
            "What is the purpose of message queues in distributed systems?",
          options: [
            "To store user messages permanently",
            "To enable asynchronous communication and decouple system components",
            "To encrypt messages between services",
            "To compress data for faster transmission",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 61,
          question:
            "In Node.js, what is the difference between dependencies and devDependencies?",
          options: [
            "Dependencies for production, devDependencies for development only",
            "Dependencies are newer packages, devDependencies are older",
            "Dependencies are faster, devDependencies are slower",
            "There is no functional difference",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 62,
          question: "What is the purpose of database migrations?",
          options: [
            "To backup database data",
            "To version control and apply schema changes systematically",
            "To improve database performance",
            "To encrypt database connections",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 63,
          question: "In CSS, what is the box model?",
          options: [
            "A way to create 3D boxes",
            "Content, padding, border, and margin that define element spacing",
            "A layout technique for responsive design",
            "A method for creating animations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 64,
          question: "What is the difference between REST and GraphQL APIs?",
          options: [
            "REST uses multiple endpoints, GraphQL uses single endpoint with flexible queries",
            "REST is newer than GraphQL",
            "REST is for mobile apps, GraphQL for web apps",
            "REST is faster than GraphQL",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 65,
          question:
            "In JavaScript, what is event bubbling and how can it be controlled?",
          options: [
            "Events moving from child to parent elements, controlled with stopPropagation()",
            "Creating multiple event listeners, controlled with removeEventListener()",
            "Event timing issues, controlled with setTimeout()",
            "Memory leaks from events, controlled with cleanup functions",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 66,
          question:
            "What is the purpose of caching and what are the different levels?",
          options: [
            "To slow down applications for testing",
            "To store frequently accessed data for faster retrieval at browser, CDN, application, and database levels",
            "To backup data automatically",
            "To encrypt sensitive information",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 67,
          question: "In React, what is the Context API used for?",
          options: [
            "Creating reusable components",
            "Sharing state across component tree without prop drilling",
            "Handling HTTP requests",
            "Managing component lifecycles",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 68,
          question:
            "What is the difference between SOAP and REST web services?",
          options: [
            "SOAP is protocol-based with XML, REST is architectural style with multiple formats",
            "SOAP is newer than REST",
            "SOAP is for internal APIs, REST for public APIs",
            "SOAP is faster than REST",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 69,
          question: "In databases, what is the purpose of stored procedures?",
          options: [
            "To store user data permanently",
            "Precompiled SQL code that improves performance and encapsulates business logic",
            "To create database backups",
            "To handle user authentication",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 70,
          question: "What is the difference between cookies and local storage?",
          options: [
            "Cookies sent with requests and have expiration, localStorage persists until cleared",
            "Cookies are newer than localStorage",
            "Cookies store more data than localStorage",
            "Cookies are for authentication, localStorage for styling",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 71,
          question: "In TypeScript, what are generics and why are they useful?",
          options: [
            "Basic data types like string and number",
            "Type variables that enable code reuse while maintaining type safety",
            "Functions that generate other functions",
            "Classes that extend other classes",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 72,
          question:
            "What is the purpose of API versioning and what are common strategies?",
          options: [
            "To track API usage statistics",
            "To maintain backward compatibility while evolving APIs using URL, header, or parameter versioning",
            "To improve API security",
            "To reduce server load",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 73,
          question:
            "In React, what is server-side rendering (SSR) and what are its benefits?",
          options: [
            "Rendering components on the client side",
            "Rendering React components on server for better SEO and initial load performance",
            "A debugging technique for React applications",
            "A way to optimize bundle size",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 74,
          question: "What is the difference between TCP and UDP protocols?",
          options: [
            "TCP is reliable and connection-oriented, UDP is fast and connectionless",
            "TCP is newer than UDP",
            "TCP is for web traffic, UDP for email",
            "TCP is encrypted, UDP is not",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 75,
          question:
            "In SQL, what is the difference between DELETE and TRUNCATE?",
          options: [
            "DELETE removes specific rows and can be rolled back, TRUNCATE removes all rows and cannot be rolled back",
            "DELETE is faster than TRUNCATE",
            "DELETE is for tables, TRUNCATE is for databases",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 76,
          question:
            "What is the purpose of dependency injection in software architecture?",
          options: [
            "To inject malicious code into dependencies",
            "To provide dependencies to objects rather than having them create dependencies internally",
            "To compress dependencies for faster loading",
            "To encrypt sensitive dependencies",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 77,
          question:
            "In JavaScript, what is the difference between == and === operators?",
          options: [
            "== checks type and value, === checks only value",
            "== performs type coercion, === checks strict equality",
            "== is faster than ===",
            "They are identical in all cases",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 78,
          question:
            "What is the purpose of database replication and what are the main types?",
          options: [
            "To backup data, using full and incremental backups",
            "To distribute data across servers for availability and performance, using master-slave and master-master",
            "To compress data, using lossless and lossy compression",
            "To encrypt data, using symmetric and asymmetric encryption",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 79,
          question:
            "In React, what is the difference between useState and useReducer hooks?",
          options: [
            "useState for simple state, useReducer for complex state logic",
            "useState is newer than useReducer",
            "useState is synchronous, useReducer is asynchronous",
            "useState is for class components, useReducer for functional components",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 80,
          question:
            "What is the difference between monolithic and microservices architecture?",
          options: [
            "Monolithic is single deployable unit, microservices are independently deployable services",
            "Monolithic is newer than microservices",
            "Monolithic is for small apps, microservices for large apps",
            "Monolithic is faster than microservices",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 81,
          question:
            "In CSS, what is the difference between position: absolute and position: relative?",
          options: [
            "Absolute positions relative to viewport, relative positions relative to normal position",
            "Absolute is newer than relative",
            "Absolute is for mobile, relative for desktop",
            "Absolute is faster than relative",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 82,
          question:
            "What is the purpose of API gateways in microservices architecture?",
          options: [
            "To store API documentation",
            "Single entry point that handles routing, authentication, rate limiting, and monitoring",
            "To create new APIs automatically",
            "To backup API configurations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 83,
          question:
            "In Node.js, what is the difference between synchronous and asynchronous file operations?",
          options: [
            "Synchronous blocks the event loop, asynchronous doesn't block",
            "Synchronous is faster than asynchronous",
            "Synchronous uses more memory than asynchronous",
            "They produce different results",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 84,
          question:
            "What is the purpose of database indexing strategies and when should composite indexes be used?",
          options: [
            "To slow down queries for security",
            "To speed up queries; composite indexes when querying multiple columns together frequently",
            "To backup table data automatically",
            "To encrypt sensitive columns",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 85,
          question: "In React, what is the difference between props and state?",
          options: [
            "Props are mutable, state is immutable",
            "Props are passed from parent components, state is internal to component",
            "Props are for styling, state is for data",
            "Props are newer than state",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 86,
          question:
            "What is the difference between horizontal and vertical partitioning in databases?",
          options: [
            "Horizontal splits rows across tables, vertical splits columns across tables",
            "Horizontal is for performance, vertical is for security",
            "Horizontal uses more storage, vertical uses less",
            "They are the same concept",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 87,
          question:
            "In JavaScript, what is the event loop and how does it handle callbacks?",
          options: [
            "A loop that creates events, handling callbacks synchronously",
            "Mechanism that handles asynchronous operations by managing call stack, callback queue, and heap",
            "A debugging tool for tracking events",
            "A performance optimization technique",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 88,
          question:
            "What is the purpose of database connection pooling and what are its benefits?",
          options: [
            "To backup database connections",
            "To reuse connections, reducing overhead and improving performance",
            "To encrypt database traffic",
            "To create multiple database instances",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 89,
          question:
            "In web security, what is SQL injection and how can it be prevented?",
          options: [
            "A database optimization technique, prevented by indexing",
            "Malicious SQL code injection, prevented by parameterized queries and input validation",
            "A backup procedure, prevented by regular backups",
            "A performance issue, prevented by caching",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 90,
          question: "What is the purpose of webpack in modern web development?",
          options: [
            "To create web pages automatically",
            "Module bundler that processes and bundles JavaScript modules and assets",
            "To host websites on servers",
            "To debug JavaScript code",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 91,
          question: "In AWS, what is the difference between EC2 and Lambda?",
          options: [
            "EC2 provides virtual servers, Lambda provides serverless computing",
            "EC2 is newer than Lambda",
            "EC2 is for storage, Lambda is for computing",
            "EC2 is cheaper than Lambda",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 92,
          question:
            "What is the purpose of SOLID principles in software design?",
          options: [
            "To make code run faster",
            "Guidelines for writing maintainable and extensible object-oriented code",
            "To reduce memory usage",
            "To improve user interface design",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 93,
          question: "In Git, what is the difference between merge and rebase?",
          options: [
            "Merge combines branches preserving history, rebase rewrites history linearly",
            "Merge is newer than rebase",
            "Merge is for small changes, rebase for large changes",
            "Merge is automatic, rebase is manual",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 94,
          question: "What is the purpose of ESLint in JavaScript development?",
          options: [
            "To compile JavaScript code",
            "Static analysis tool to identify and fix code quality issues",
            "To run JavaScript tests",
            "To minify JavaScript files",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 95,
          question:
            "In MongoDB, what is the difference between find() and findOne()?",
          options: [
            "find() returns multiple documents, findOne() returns single document",
            "find() is faster than findOne()",
            "find() is for updates, findOne() is for queries",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 96,
          question: "What is the purpose of Docker Compose?",
          options: [
            "To create Docker images",
            "Tool for defining and running multi-container Docker applications",
            "To monitor Docker containers",
            "To secure Docker networks",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 97,
          question:
            "In React, what is the difference between componentDidMount and useEffect?",
          options: [
            "componentDidMount is for class components, useEffect is for functional components",
            "componentDidMount is newer than useEffect",
            "componentDidMount is synchronous, useEffect is asynchronous",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 98,
          question: "What is the purpose of nginx in web architecture?",
          options: [
            "Database management system",
            "Web server, reverse proxy, and load balancer",
            "JavaScript runtime environment",
            "CSS preprocessing tool",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 99,
          question:
            "In TypeScript, what is the difference between any and unknown types?",
          options: [
            "any disables type checking, unknown requires type checking before use",
            "any is newer than unknown",
            "any is for objects, unknown is for primitives",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 100,
          question: "What is the purpose of CI/CD in software development?",
          options: [
            "To write code automatically",
            "Automated processes for continuous integration and continuous deployment",
            "To design user interfaces",
            "To manage databases",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
      ],
    },

    {
      id: "8vl6j9oGMLasZrWmwe82",
      questions: [
        {
          id: 1,
          question:
            "Which core Node.js module is used to create an HTTP server?",
          options: ["fs", "http", "url", "net"],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 2,
          question: "What does the 'cluster' module in Node.js help achieve?",
          options: [
            "Database pooling",
            "Multi-threading",
            "Load balancing across processes",
            "Memory optimization",
          ],
          correctAnswer: 2,
          type: "multiple-choice",
        },
        {
          id: 3,
          question:
            "What is the default behavior of `require.cache` in Node.js?",
          options: [
            "Caches all external API responses",
            "Disables repeated execution of modules",
            "Caches previously required modules",
            "Caches HTTP request headers",
          ],
          correctAnswer: 2,
          type: "multiple-choice",
        },
        {
          id: 4,
          question:
            "Which of the following is true about the Event Loop in Node.js?",
          options: [
            "It handles blocking operations in a separate thread",
            "It is single-threaded and handles I/O asynchronously",
            "It runs on multiple threads for high performance",
            "It blocks the execution until all events are processed",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 5,
          question: "What is the purpose of `process.nextTick()` in Node.js?",
          options: [
            "To stop the process",
            "To run a callback after I/O events",
            "To defer the execution of a function until the next event loop iteration",
            "To run a callback before any I/O events",
          ],
          correctAnswer: 3,
          type: "multiple-choice",
        },
        {
          id: 6,
          question: "Which statement best describes Streams in Node.js?",
          options: [
            "They buffer entire data before sending",
            "They work only with files",
            "They handle large amounts of data efficiently by processing it in chunks",
            "They are blocking by default",
          ],
          correctAnswer: 2,
          type: "multiple-choice",
        },
        {
          id: 7,
          question:
            "Which method is used to schedule a callback to be invoked in the next iteration of the event loop?",
          options: [
            "setImmediate()",
            "setTimeout()",
            "setInterval()",
            "clearImmediate()",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 8,
          question: "What is the purpose of the `zlib` module in Node.js?",
          options: [
            "To compress or decompress files",
            "To serve static files",
            "To log server responses",
            "To interact with ZIP archives directly",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 9,
          question:
            "Which method is used to gracefully shut down a Node.js server?",
          options: [
            "server.shutdown()",
            "server.end()",
            "server.destroy()",
            "server.close()",
          ],
          correctAnswer: 3,
          type: "multiple-choice",
        },
        {
          id: 10,
          question:
            "Which module in Node.js provides utilities for working with file and directory paths?",
          options: ["fs", "path", "os", "http"],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 11,
          question: "What is the purpose of the `crypto` module in Node.js?",
          options: [
            "To handle cryptocurrency transactions",
            "To provide cryptographic functionality including hashing and encryption",
            "To compress files",
            "To manage user sessions",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 12,
          question:
            "In Node.js, what is the difference between `fs.readFile()` and `fs.createReadStream()`?",
          options: [
            "readFile() loads entire file into memory, createReadStream() processes file in chunks",
            "readFile() is asynchronous, createReadStream() is synchronous",
            "readFile() is for text files, createReadStream() for binary files",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 13,
          question: "What is the purpose of the `os` module in Node.js?",
          options: [
            "To manage database connections",
            "To provide operating system related utilities and information",
            "To handle HTTP requests",
            "To create child processes",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 14,
          question:
            "In Node.js, what is the difference between `setTimeout()` and `setImmediate()`?",
          options: [
            "setTimeout() executes immediately, setImmediate() has delay",
            "setTimeout() executes after specified delay, setImmediate() executes in next iteration of event loop",
            "They are identical in all scenarios",
            "setTimeout() is for I/O operations, setImmediate() for CPU operations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 15,
          question: "What is the purpose of the `util` module in Node.js?",
          options: [
            "To handle user authentication",
            "To provide utility functions for debugging and formatting",
            "To manage file systems",
            "To create HTTP servers",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 16,
          question:
            "In Node.js, what is the difference between `Buffer.from()` and `Buffer.alloc()`?",
          options: [
            "Buffer.from() creates from existing data, Buffer.alloc() creates empty buffer with specified size",
            "Buffer.from() is synchronous, Buffer.alloc() is asynchronous",
            "Buffer.from() is for strings, Buffer.alloc() for numbers",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 17,
          question: "What is the purpose of the `events` module in Node.js?",
          options: [
            "To handle DOM events",
            "To provide EventEmitter class for implementing event-driven architecture",
            "To schedule timed events",
            "To capture user input events",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 18,
          question:
            "In Node.js, what is the difference between `require()` and `require.resolve()`?",
          options: [
            "require() loads module, require.resolve() returns module path without loading",
            "require() is synchronous, require.resolve() is asynchronous",
            "require() is for local modules, require.resolve() for npm modules",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 19,
          question:
            "What is the purpose of the `child_process` module in Node.js?",
          options: [
            "To manage parent-child relationships in objects",
            "To spawn child processes and execute system commands",
            "To handle multi-threading",
            "To create nested functions",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 20,
          question:
            "In Node.js, what is the difference between `process.env` and `process.argv`?",
          options: [
            "process.env contains environment variables, process.argv contains command line arguments",
            "process.env is for production, process.argv for development",
            "process.env is synchronous, process.argv is asynchronous",
            "They contain the same information",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 21,
          question: "What is the purpose of middleware in Express.js?",
          options: [
            "To store data in databases",
            "Functions that execute during request-response cycle with access to req, res, next",
            "To handle client-side routing",
            "To compile templates",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 22,
          question:
            "In Express.js, what is the difference between `app.use()` and `app.get()`?",
          options: [
            "app.use() for all HTTP methods, app.get() specifically for GET requests",
            "app.use() is synchronous, app.get() is asynchronous",
            "app.use() is for middleware, app.get() for routes only",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 23,
          question: "What is the purpose of `app.param()` in Express.js?",
          options: [
            "To set application parameters",
            "To define parameter preprocessing middleware for route parameters",
            "To validate request parameters",
            "To parse URL parameters",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 24,
          question:
            "In Express.js, what is the difference between `res.send()` and `res.json()`?",
          options: [
            "res.send() sends any data type, res.json() specifically sends JSON with correct headers",
            "res.send() is faster than res.json()",
            "res.send() is for GET requests, res.json() for POST requests",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 25,
          question: "What is the purpose of `express.Router()` in Express.js?",
          options: [
            "To handle database routing",
            "To create modular, mountable route handlers",
            "To manage client-side routing",
            "To optimize server performance",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 26,
          question:
            "In Express.js, what is the difference between `req.params` and `req.query`?",
          options: [
            "req.params contains route parameters, req.query contains query string parameters",
            "req.params is for GET requests, req.query for POST requests",
            "req.params is synchronous, req.query is asynchronous",
            "They contain the same information",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 27,
          question:
            "What is the purpose of error handling middleware in Express.js?",
          options: [
            "To prevent errors from occurring",
            "To catch and handle errors that occur during request processing",
            "To log all requests",
            "To validate user input",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 28,
          question: "In Express.js, what is the purpose of `next()` function?",
          options: [
            "To move to the next route",
            "To pass control to the next middleware function in the stack",
            "To increment a counter",
            "To handle the next request",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 29,
          question: "What is the purpose of `express.static()` middleware?",
          options: [
            "To create static variables",
            "To serve static files like HTML, CSS, JavaScript, images",
            "To prevent file modifications",
            "To compress static content",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 30,
          question:
            "In Express.js, what is the difference between `app.locals` and `res.locals`?",
          options: [
            "app.locals available throughout application, res.locals only for current request",
            "app.locals is for development, res.locals for production",
            "app.locals is synchronous, res.locals is asynchronous",
            "They are identical in scope",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 31,
          question: "What is the purpose of template engines in Express.js?",
          options: [
            "To create database templates",
            "To generate HTML markup with dynamic content using templates",
            "To optimize performance",
            "To handle routing",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 32,
          question:
            "In Express.js, what is the difference between `app.set()` and `app.get()`?",
          options: [
            "app.set() assigns application settings, app.get() retrieves settings or defines GET routes",
            "app.set() is for POST data, app.get() for GET data",
            "app.set() is synchronous, app.get() is asynchronous",
            "They are used for the same purpose",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 33,
          question: "What is the purpose of session management in Express.js?",
          options: [
            "To manage database sessions",
            "To maintain user state across multiple HTTP requests",
            "To handle concurrent requests",
            "To optimize server performance",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 34,
          question: "In Express.js, what is the purpose of `cors` middleware?",
          options: [
            "To handle routing",
            "To enable Cross-Origin Resource Sharing for handling requests from different domains",
            "To compress responses",
            "To parse request bodies",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 35,
          question: "What is the purpose of `helmet` middleware in Express.js?",
          options: [
            "To style web pages",
            "To secure Express apps by setting various HTTP headers",
            "To handle authentication",
            "To parse request data",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 36,
          question:
            "In Express.js, what is the difference between `req.body` and `req.raw`?",
          options: [
            "req.body contains parsed request body, req.raw contains unparsed body",
            "req.body is for JSON, req.raw for XML",
            "req.body is synchronous, req.raw is asynchronous",
            "They contain the same data",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 37,
          question:
            "What is the purpose of rate limiting in Express.js applications?",
          options: [
            "To slow down the server",
            "To limit the number of requests from clients to prevent abuse",
            "To manage database connections",
            "To optimize memory usage",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 38,
          question:
            "In Express.js, what is the purpose of `compression` middleware?",
          options: [
            "To compress images",
            "To compress HTTP responses using gzip to reduce bandwidth",
            "To compress database queries",
            "To compress source code",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 39,
          question: "What is the purpose of logging middleware in Express.js?",
          options: [
            "To log user credentials",
            "To record HTTP requests and responses for monitoring and debugging",
            "To log database queries",
            "To log system errors only",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 40,
          question:
            "In Express.js, what is the difference between `res.redirect()` and `res.render()`?",
          options: [
            "res.redirect() sends HTTP redirect response, res.render() renders template and sends HTML",
            "res.redirect() is for GET requests, res.render() for POST requests",
            "res.redirect() is synchronous, res.render() is asynchronous",
            "They are used for the same purpose",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 41,
          question:
            "What is the purpose of validation middleware in Express.js?",
          options: [
            "To validate server configuration",
            "To validate and sanitize incoming request data",
            "To validate database schemas",
            "To validate user authentication",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 42,
          question:
            "In Node.js testing, what is the purpose of `mocha` framework?",
          options: [
            "To serve coffee",
            "JavaScript test framework that provides structure for writing and running tests",
            "To mock HTTP requests",
            "To generate test data",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 43,
          question:
            "What is the purpose of `chai` assertion library in Node.js testing?",
          options: [
            "To serve tea",
            "To provide expressive assertion styles for testing",
            "To mock database calls",
            "To generate test reports",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 44,
          question: "In Node.js, what is the purpose of `sinon` library?",
          options: [
            "To handle authentication",
            "To provide spies, stubs, and mocks for testing",
            "To manage databases",
            "To handle HTTP requests",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 45,
          question:
            "What is the purpose of `supertest` library in Node.js testing?",
          options: [
            "To test superhero applications",
            "To test HTTP endpoints by making actual HTTP requests",
            "To test database performance",
            "To test user interfaces",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 46,
          question:
            "In Node.js, what is the difference between `npm test` and `npm run test`?",
          options: [
            "npm test is shorthand for npm run test for the 'test' script",
            "npm test is for unit tests, npm run test for integration tests",
            "npm test is synchronous, npm run test is asynchronous",
            "They run different test suites",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 47,
          question:
            "What is the purpose of test coverage in Node.js applications?",
          options: [
            "To cover tests with documentation",
            "To measure how much of the code is executed during testing",
            "To test all possible scenarios",
            "To protect tests from errors",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 48,
          question: "In Node.js, what is the purpose of `nyc` (Istanbul) tool?",
          options: [
            "To handle New York City data",
            "Code coverage tool that measures test coverage",
            "To deploy applications",
            "To optimize performance",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 49,
          question: "What is the purpose of `nodemon` in Node.js development?",
          options: [
            "To monitor system resources",
            "To automatically restart the application when file changes are detected",
            "To debug Node.js applications",
            "To optimize Node.js performance",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 50,
          question:
            "In Node.js, what is the difference between `__dirname` and `process.cwd()`?",
          options: [
            "__dirname is directory of current script, process.cwd() is current working directory",
            "__dirname is for files, process.cwd() for directories",
            "__dirname is synchronous, process.cwd() is asynchronous",
            "They return the same path",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 51,
          question:
            "What is the purpose of `worker_threads` module in Node.js?",
          options: [
            "To manage HTTP workers",
            "To enable true parallel execution of JavaScript in separate threads",
            "To handle database connections",
            "To manage file system operations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 52,
          question:
            "In Node.js, what is the difference between `spawn()` and `exec()` in child_process?",
          options: [
            "spawn() streams data, exec() buffers output until completion",
            "spawn() is synchronous, exec() is asynchronous",
            "spawn() is for shell commands, exec() for Node.js scripts",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 53,
          question: "What is the purpose of `vm` module in Node.js?",
          options: [
            "To create virtual machines",
            "To execute JavaScript code in V8 virtual machine contexts",
            "To manage memory allocation",
            "To handle virtual reality applications",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 54,
          question:
            "In Node.js, what is the difference between `readable` and `writable` streams?",
          options: [
            "readable streams produce data, writable streams consume data",
            "readable streams are faster than writable streams",
            "readable streams are for files, writable streams for network",
            "They are the same type of stream",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 55,
          question: "What is the purpose of `transform` streams in Node.js?",
          options: [
            "To transform data format",
            "Duplex streams that can modify data as it passes through",
            "To transform file permissions",
            "To transform network protocols",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 56,
          question:
            "In Node.js, what is the difference between `pipe()` and `pipeline()`?",
          options: [
            "pipe() is for single stream, pipeline() handles multiple streams with better error handling",
            "pipe() is synchronous, pipeline() is asynchronous",
            "pipe() is deprecated, pipeline() is modern",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 57,
          question: "What is the purpose of `async_hooks` module in Node.js?",
          options: [
            "To handle async/await syntax",
            "To track asynchronous resources and their lifecycle",
            "To create async functions",
            "To manage async errors",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 58,
          question: "In Node.js, what is memory leak and how can it occur?",
          options: [
            "Memory that is allocated but never released, can occur with closures, global variables, or event listeners",
            "Memory that is too fast",
            "Memory that is encrypted",
            "Memory that is compressed",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 59,
          question: "What is the purpose of `perf_hooks` module in Node.js?",
          options: [
            "To hook fishing equipment",
            "To provide performance measurement APIs",
            "To handle network hooks",
            "To manage database hooks",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 60,
          question:
            "In Node.js, what is the difference between `setImmediate()` and `process.nextTick()`?",
          options: [
            "setImmediate() executes after I/O events, process.nextTick() executes before I/O events",
            "setImmediate() is faster than process.nextTick()",
            "setImmediate() is for production, process.nextTick() for development",
            "They execute in the same phase",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 61,
          question: "What is the purpose of `AbortController` in Node.js?",
          options: [
            "To control program termination",
            "To cancel asynchronous operations like fetch requests or streams",
            "To handle abortion procedures",
            "To manage controller hardware",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 62,
          question:
            "In Node.js, what is the difference between `fs.promises` and callback-based fs methods?",
          options: [
            "fs.promises returns promises, callback-based methods use callbacks",
            "fs.promises is faster than callbacks",
            "fs.promises is for production, callbacks for development",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 63,
          question:
            "What is the purpose of `WeakMap` and `WeakSet` in Node.js memory management?",
          options: [
            "To create weak references that don't prevent garbage collection",
            "To create maps with weak encryption",
            "To handle weak network connections",
            "To manage weak passwords",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 64,
          question:
            "In Node.js, what is clustering and how does it improve performance?",
          options: [
            "Grouping servers together",
            "Creating multiple worker processes to utilize multiple CPU cores",
            "Clustering data in databases",
            "Grouping functions together",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 65,
          question: "What is the purpose of `libuv` in Node.js architecture?",
          options: [
            "UV light processing",
            "C library that provides asynchronous I/O operations and event loop",
            "User interface library",
            "Ultraviolet data processing",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 66,
          question:
            "In Node.js, what is the difference between `JSON.parse()` and `JSON.stringify()`?",
          options: [
            "JSON.parse() converts string to object, JSON.stringify() converts object to string",
            "JSON.parse() is faster than JSON.stringify()",
            "JSON.parse() is for arrays, JSON.stringify() for objects",
            "They are used for the same purpose",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 67,
          question: "What is the purpose of `dns` module in Node.js?",
          options: [
            "To manage Domain Name System operations and DNS lookups",
            "To handle DNS servers",
            "To create DNS records",
            "To encrypt DNS queries",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 68,
          question:
            "In Node.js, what is the difference between `readdir()` and `readDirSync()`?",
          options: [
            "readdir() is asynchronous, readDirSync() is synchronous",
            "readdir() is for files, readDirSync() for directories",
            "readdir() is faster than readDirSync()",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 69,
          question: "What is the purpose of `tty` module in Node.js?",
          options: [
            "To handle teletype operations and terminal functionality",
            "To manage typewriter operations",
            "To handle text processing",
            "To manage terminal colors only",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 70,
          question:
            "In Node.js, what is the difference between `url.parse()` and `new URL()`?",
          options: [
            "url.parse() is legacy method, new URL() is modern WHATWG URL API",
            "url.parse() is faster than new URL()",
            "url.parse() is for HTTP, new URL() for HTTPS",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 71,
          question: "What is the purpose of `querystring` module in Node.js?",
          options: [
            "To create database queries",
            "To parse and stringify URL query strings",
            "To handle string operations",
            "To manage query performance",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 72,
          question:
            "In Node.js, what is the difference between `module.exports` and `exports`?",
          options: [
            "module.exports is the actual export object, exports is a reference to module.exports",
            "module.exports is for classes, exports for functions",
            "module.exports is synchronous, exports is asynchronous",
            "They are identical in all cases",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 73,
          question: "What is the purpose of `readline` module in Node.js?",
          options: [
            "To read lines from a file",
            "To provide interface for reading data from readable streams line by line",
            "To handle line breaks",
            "To read network lines",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 74,
          question: "In Node.js, what is the purpose of `assert` module?",
          options: [
            "To assert dominance",
            "To provide assertion functions for testing and debugging",
            "To handle error assertions",
            "To assert data types",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 75,
          question: "What is the purpose of `inspector` module in Node.js?",
          options: [
            "To inspect building structures",
            "To provide debugging and profiling capabilities",
            "To inspect file contents",
            "To handle code inspection",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 76,
          question:
            "In Node.js, what is the difference between `http` and `https` modules?",
          options: [
            "http is for insecure connections, https is for secure SSL/TLS connections",
            "http is faster than https",
            "http is for local, https for remote connections",
            "They are identical except for port numbers",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 77,
          question: "What is the purpose of `dgram` module in Node.js?",
          options: [
            "To handle diagrams",
            "To provide UDP datagram socket functionality",
            "To manage data grams",
            "To handle telegram messages",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 78,
          question:
            "In Node.js, what is the difference between `fs.watch()` and `fs.watchFile()`?",
          options: [
            "fs.watch() watches directories and files efficiently, fs.watchFile() polls files periodically",
            "fs.watch() is synchronous, fs.watchFile() is asynchronous",
            "fs.watch() is for production, fs.watchFile() for development",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 79,
          question: "What is the purpose of `repl` module in Node.js?",
          options: [
            "To replace text",
            "To provide Read-Eval-Print-Loop interactive shell",
            "To replicate data",
            "To handle repetitive operations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 80,
          question:
            "In Node.js, what is the difference between `Buffer` and `ArrayBuffer`?",
          options: [
            "Buffer is Node.js specific for binary data, ArrayBuffer is standard JavaScript for raw binary data",
            "Buffer is faster than ArrayBuffer",
            "Buffer is for strings, ArrayBuffer for numbers",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 81,
          question: "What is the purpose of `v8` module in Node.js?",
          options: [
            "To handle version 8 features",
            "To provide V8 JavaScript engine specific utilities",
            "To manage 8-bit operations",
            "To handle vehicle engines",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 82,
          question:
            "In Node.js microservices, what is the purpose of service discovery?",
          options: [
            "To discover new services",
            "To enable services to find and communicate with each other dynamically",
            "To discover service bugs",
            "To handle service documentation",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 83,
          question:
            "What is the purpose of circuit breaker pattern in Node.js applications?",
          options: [
            "To break electrical circuits",
            "To prevent cascading failures by monitoring and failing fast",
            "To break code loops",
            "To handle circuit boards",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 84,
          question:
            "In Node.js, what is the difference between `npm install` and `npm ci`?",
          options: [
            "npm install can modify package-lock.json, npm ci uses exact versions from package-lock.json",
            "npm install is for development, npm ci for production",
            "npm install is slower than npm ci",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 85,
          question:
            "What is the purpose of `package-lock.json` file in Node.js projects?",
          options: [
            "To lock the package from changes",
            "To ensure deterministic installs by locking exact dependency versions",
            "To prevent package theft",
            "To lock package permissions",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 86,
          question:
            "In Node.js, what is the difference between `dependencies` and `devDependencies`?",
          options: [
            "dependencies are needed in production, devDependencies only during development",
            "dependencies are faster than devDependencies",
            "dependencies are for libraries, devDependencies for frameworks",
            "They are installed in different directories",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 87,
          question:
            "What is the purpose of `npx` command in Node.js ecosystem?",
          options: [
            "Node.js package extractor",
            "To execute packages without installing them globally",
            "Node.js performance xtension",
            "To extract npm packages",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 88,
          question:
            "In Node.js, what is the purpose of `semver` (Semantic Versioning)?",
          options: [
            "To handle semesters",
            "To provide meaningful version numbers indicating compatibility",
            "To manage semantic analysis",
            "To handle version semantics",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 89,
          question:
            "What is the purpose of load balancing in Node.js applications?",
          options: [
            "To balance server loads physically",
            "To distribute incoming requests across multiple server instances",
            "To balance code complexity",
            "To handle loading animations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 90,
          question:
            "In Node.js, what is the difference between horizontal and vertical scaling?",
          options: [
            "Horizontal scaling adds more servers, vertical scaling increases server resources",
            "Horizontal scaling is faster than vertical scaling",
            "Horizontal scaling is for width, vertical for height",
            "They are identical approaches",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 91,
          question:
            "What is the purpose of caching strategies in Node.js applications?",
          options: [
            "To cache money",
            "To improve performance by storing frequently accessed data in memory",
            "To cache user passwords",
            "To handle cache hardware",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 92,
          question:
            "In Node.js, what is the difference between Redis and Memcached for caching?",
          options: [
            "Redis supports data structures and persistence, Memcached is simple key-value cache",
            "Redis is faster than Memcached",
            "Redis is for databases, Memcached for files",
            "They are identical caching solutions",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 93,
          question:
            "What is the purpose of containerization (Docker) in Node.js deployment?",
          options: [
            "To contain water",
            "To package applications with dependencies for consistent deployment",
            "To contain errors",
            "To handle shipping containers",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 94,
          question: "In Node.js, what is the purpose of environment variables?",
          options: [
            "To handle environmental issues",
            "To configure application behavior without changing code",
            "To manage environment temperature",
            "To handle environmental data",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 95,
          question:
            "What is the purpose of health checks in Node.js applications?",
          options: [
            "To check developer health",
            "To monitor application status and availability for load balancers",
            "To check system health",
            "To handle healthcare applications",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 96,
          question:
            "In Node.js, what is the difference between JWT and session-based authentication?",
          options: [
            "JWT is stateless and stored client-side, sessions are stateful and stored server-side",
            "JWT is faster than sessions",
            "JWT is for mobile, sessions for web",
            "They are identical authentication methods",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 97,
          question:
            "What is the purpose of graceful shutdown in Node.js applications?",
          options: [
            "To shutdown gracefully like a dancer",
            "To properly close connections and finish processing before terminating",
            "To shutdown with grace period",
            "To handle graceful errors",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 98,
          question:
            "In Node.js, what is the purpose of process managers like PM2?",
          options: [
            "To manage project managers",
            "To manage application processes, clustering, monitoring, and auto-restart",
            "To manage process documentation",
            "To handle process manufacturing",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 99,
          question:
            "What is the purpose of database connection pooling in Node.js?",
          options: [
            "To pool database water",
            "To reuse database connections efficiently and limit concurrent connections",
            "To pool database resources",
            "To handle swimming pool databases",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 100,
          question:
            "In advanced Node.js applications, what is the purpose of implementing idempotency?",
          options: [
            "To handle identity operations",
            "To ensure operations can be repeated safely without changing the result",
            "To manage identical processes",
            "To handleopotency calculations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
      ],
    },

    {
      id: "wlLNBXOd4lEZCiln5y2P",
      questions: [
        {
          id: 1,
          question: "What is the primary purpose of React?",
          options: [
            "Server-side rendering only",
            "Building user interfaces with reusable components",
            "Database management",
            "API development",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 2,
          question: "What is JSX in React?",
          options: [
            "A new programming language",
            "JavaScript XML - syntax extension for JavaScript",
            "A database query language",
            "A CSS preprocessor",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 3,
          question: "What is the Virtual DOM in React?",
          options: [
            "A real DOM element",
            "JavaScript representation of the real DOM for performance optimization",
            "A browser API",
            "A React component type",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 4,
          question: "What is the difference between state and props in React?",
          options: [
            "State is mutable component data, props are immutable data passed from parent",
            "State is for styling, props for functionality",
            "State is global, props are local",
            "They are identical concepts",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 5,
          question: "What is the purpose of useState hook in React?",
          options: [
            "To handle user authentication",
            "To add state to functional components",
            "To manage component styling",
            "To handle API requests",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 6,
          question: "What is the purpose of useEffect hook in React?",
          options: [
            "To create visual effects",
            "To perform side effects in functional components",
            "To handle user interactions",
            "To manage component state",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 7,
          question:
            "What is the difference between controlled and uncontrolled components?",
          options: [
            "Controlled components have React-managed form data, uncontrolled use DOM references",
            "Controlled components are faster",
            "Controlled components are for production, uncontrolled for development",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 8,
          question: "What is the purpose of keys in React lists?",
          options: [
            "To encrypt list data",
            "To help React identify which items have changed for efficient re-rendering",
            "To sort list items",
            "To style list elements",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 9,
          question: "What is React component lifecycle?",
          options: [
            "Component creation and destruction timeline",
            "Series of methods called during component mounting, updating, and unmounting",
            "Component performance metrics",
            "Component styling phases",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 10,
          question:
            "What is the purpose of componentDidMount in class components?",
          options: [
            "To mount component on DOM",
            "Lifecycle method called after component is mounted to DOM",
            "To handle component mounting events",
            "To mount component data",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 11,
          question: "What is prop drilling in React?",
          options: [
            "Drilling holes in components",
            "Passing props through multiple component layers unnecessarily",
            "Optimizing prop performance",
            "Creating prop animations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 12,
          question: "What is React Context API used for?",
          options: [
            "Creating component contexts",
            "Sharing state across component tree without prop drilling",
            "Managing component contexts",
            "Handling context menus",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 13,
          question:
            "What is the difference between React.createElement and JSX?",
          options: [
            "createElement is the underlying function, JSX is syntactic sugar that compiles to createElement",
            "createElement is faster than JSX",
            "createElement is for classes, JSX for functions",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 14,
          question: "What is the purpose of React.Fragment?",
          options: [
            "To fragment components",
            "To group multiple elements without adding extra DOM nodes",
            "To handle component fragments",
            "To create partial components",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 15,
          question:
            "What is the difference between function components and class components?",
          options: [
            "Function components are simpler and use hooks, class components use lifecycle methods",
            "Function components are faster",
            "Function components are for logic, class components for UI",
            "They are identical in capabilities",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 16,
          question: "What is the purpose of useCallback hook?",
          options: [
            "To call functions back",
            "To memoize callback functions to prevent unnecessary re-renders",
            "To handle component callbacks",
            "To manage callback queues",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 17,
          question: "What is the purpose of useMemo hook?",
          options: [
            "To create memos",
            "To memoize expensive calculations and prevent unnecessary recalculations",
            "To manage component memory",
            "To handle memory optimization",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 18,
          question: "What is the difference between useCallback and useMemo?",
          options: [
            "useCallback memoizes functions, useMemo memoizes values",
            "useCallback is faster than useMemo",
            "useCallback is for events, useMemo for state",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 19,
          question: "What is React.memo used for?",
          options: [
            "To create memory components",
            "Higher-order component that memoizes component rendering",
            "To manage component memory",
            "To handle memory leaks",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 20,
          question: "What is the purpose of useRef hook?",
          options: [
            "To reference other components",
            "To access DOM elements directly and persist mutable values",
            "To handle component references",
            "To create component refs",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 21,
          question: "What is React Router used for?",
          options: [
            "To route network traffic",
            "To handle client-side routing in single-page applications",
            "To manage component routing",
            "To route component data",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 22,
          question:
            "What is the difference between BrowserRouter and HashRouter?",
          options: [
            "BrowserRouter uses HTML5 history API, HashRouter uses URL hash",
            "BrowserRouter is faster than HashRouter",
            "BrowserRouter is for production, HashRouter for development",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 23,
          question: "What is the purpose of Switch component in React Router?",
          options: [
            "To switch between components",
            "To render only the first Route that matches the location",
            "To handle component switching",
            "To create toggle switches",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 24,
          question:
            "What is the difference between Link and NavLink in React Router?",
          options: [
            "Link creates navigation links, NavLink adds active styling capabilities",
            "Link is faster than NavLink",
            "Link is for internal, NavLink for external links",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 25,
          question: "What is Redux used for in React applications?",
          options: [
            "To reduce component size",
            "Predictable state container for managing application state",
            "To handle component reduction",
            "To optimize performance",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 26,
          question: "What are the three principles of Redux?",
          options: [
            "Single source of truth, state is read-only, changes made with pure functions",
            "Fast, reliable, scalable",
            "Simple, effective, efficient",
            "Create, read, update",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 27,
          question: "What is an action in Redux?",
          options: [
            "A user interaction",
            "Plain JavaScript object that describes what happened",
            "A component method",
            "A state change",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 28,
          question: "What is a reducer in Redux?",
          options: [
            "A function that reduces state size",
            "Pure function that takes state and action, returns new state",
            "A component that reduces complexity",
            "A performance optimization tool",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 29,
          question: "What is the purpose of Redux store?",
          options: [
            "To store components",
            "Holds the complete state tree of the application",
            "To store user data",
            "To handle data storage",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 30,
          question: "What is the difference between Redux and Context API?",
          options: [
            "Redux is external library with dev tools, Context API is built-in React feature",
            "Redux is faster than Context API",
            "Redux is for large apps, Context API for small apps",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 31,
          question: "What is React Hook Form used for?",
          options: [
            "To create form hooks",
            "Performant, flexible forms with easy validation",
            "To handle form styling",
            "To manage form components",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 32,
          question: "What is the purpose of Formik in React?",
          options: [
            "To format components",
            "Build forms with validation, error handling, and field management",
            "To create form layouts",
            "To handle form animations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 33,
          question: "What is Yup validation library used for?",
          options: [
            "To say yes or no",
            "Schema validation for forms with descriptive error messages",
            "To handle user preferences",
            "To validate component props",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 34,
          question:
            "What is the difference between shallow rendering and full rendering in testing?",
          options: [
            "Shallow renders one level deep, full rendering renders entire component tree",
            "Shallow is faster than full rendering",
            "Shallow is for unit tests, full for integration tests",
            "They are identical testing approaches",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 35,
          question: "What is React Testing Library philosophy?",
          options: [
            "Test everything",
            "Test components the way users interact with them",
            "Test component internals",
            "Test for maximum coverage",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 36,
          question: "What is the purpose of Jest in React testing?",
          options: [
            "To make jokes",
            "JavaScript testing framework for running tests and assertions",
            "To test component styling",
            "To handle test data",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 37,
          question: "What is enzyme used for in React testing?",
          options: [
            "Biological testing",
            "JavaScript testing utility for React components (legacy approach)",
            "To test component enzymes",
            "To handle test environments",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 38,
          question: "What is the purpose of act() function in React testing?",
          options: [
            "To perform actions",
            "To wrap code that triggers React updates for proper testing",
            "To handle test actions",
            "To create test scenarios",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 39,
          question: "What is React Suspense used for?",
          options: [
            "To create suspenseful components",
            "To handle loading states for lazy-loaded components",
            "To suspend component rendering",
            "To manage component suspension",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 40,
          question: "What is React.lazy() used for?",
          options: [
            "To make components lazy",
            "To dynamically import components for code splitting",
            "To handle lazy loading",
            "To optimize component performance",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 41,
          question: "What is code splitting in React?",
          options: [
            "Splitting code into files",
            "Technique to split bundle into smaller chunks loaded on demand",
            "Dividing component code",
            "Separating logic from UI",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 42,
          question: "What is the purpose of Error Boundaries in React?",
          options: [
            "To create error components",
            "React components that catch JavaScript errors in child component tree",
            "To handle boundary errors",
            "To manage error states",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 43,
          question: "What lifecycle methods can Error Boundaries use?",
          options: [
            "componentDidCatch and getDerivedStateFromError",
            "componentDidMount and componentWillUnmount",
            "useState and useEffect",
            "render and constructor",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 44,
          question: "What is Higher-Order Component (HOC) in React?",
          options: [
            "A component at higher position",
            "Function that takes component and returns enhanced component",
            "A superior component type",
            "A component with higher priority",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 45,
          question: "What is Render Props pattern in React?",
          options: [
            "Props for rendering",
            "Technique for sharing code using prop whose value is a function",
            "Props that render components",
            "Rendering component properties",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 46,
          question: "What is the difference between HOC and Render Props?",
          options: [
            "HOC wraps components, Render Props uses function as children pattern",
            "HOC is faster than Render Props",
            "HOC is for classes, Render Props for functions",
            "They are identical patterns",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 47,
          question: "What is React Compound Components pattern?",
          options: [
            "Components with compounds",
            "Pattern where components work together as cohesive unit",
            "Complex component structures",
            "Components with multiple elements",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 48,
          question: "What is the purpose of useReducer hook?",
          options: [
            "To reduce component size",
            "Alternative to useState for managing complex state logic",
            "To handle component reduction",
            "To optimize performance",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 49,
          question: "When should you use useReducer instead of useState?",
          options: [
            "When state logic is complex or involves multiple sub-values",
            "When component is large",
            "When using class components",
            "When performance is critical",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 50,
          question: "What is the purpose of useContext hook?",
          options: [
            "To create contexts",
            "To consume Context values in functional components",
            "To handle component contexts",
            "To manage context state",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 51,
          question: "What is custom hook in React?",
          options: [
            "A customized component",
            "JavaScript function that starts with 'use' and may call other hooks",
            "A hook with custom styling",
            "A personalized React feature",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 52,
          question: "What are the rules of hooks in React?",
          options: [
            "Only call hooks at top level and only from React functions",
            "Hooks can be called anywhere",
            "Hooks must be imported first",
            "Hooks should be called in useEffect",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 53,
          question: "What is useImperativeHandle hook used for?",
          options: [
            "To handle imperatives",
            "To customize instance value exposed to parent components when using ref",
            "To manage imperative code",
            "To handle component imperatives",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 54,
          question: "What is useLayoutEffect hook used for?",
          options: [
            "To handle layout effects",
            "Similar to useEffect but fires synchronously after all DOM mutations",
            "To manage component layouts",
            "To create layout animations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 55,
          question:
            "What is the difference between useEffect and useLayoutEffect?",
          options: [
            "useEffect runs asynchronously, useLayoutEffect runs synchronously after DOM mutations",
            "useEffect is faster than useLayoutEffect",
            "useEffect is for logic, useLayoutEffect for styling",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 56,
          question: "What is React DevTools used for?",
          options: [
            "Developing React tools",
            "Browser extension for debugging React component hierarchy and state",
            "Creating development tools",
            "Managing development workflow",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 57,
          question: "What is React Profiler used for?",
          options: [
            "Creating user profiles",
            "Measuring performance of React applications",
            "Profiling user behavior",
            "Managing component profiles",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 58,
          question: "What is React.StrictMode used for?",
          options: [
            "To enforce strict coding",
            "Development mode helper that highlights potential problems",
            "To create strict components",
            "To enforce strict typing",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 59,
          question: "What is reconciliation in React?",
          options: [
            "Reconciling differences",
            "Algorithm React uses to diff one tree with another to determine changes",
            "Resolving component conflicts",
            "Synchronizing component states",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 60,
          question: "What is React Fiber?",
          options: [
            "Fiber optic connections",
            "New reconciliation algorithm that enables incremental rendering",
            "Component fiber structure",
            "Network fiber for React",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 61,
          question:
            "What is the purpose of shouldComponentUpdate in class components?",
          options: [
            "To update components",
            "Lifecycle method to optimize rendering by preventing unnecessary updates",
            "To check component updates",
            "To handle component updating",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 62,
          question: "What is PureComponent in React?",
          options: [
            "A pure component without side effects",
            "Component that implements shallow comparison in shouldComponentUpdate",
            "A component with pure functions",
            "A clean component implementation",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 63,
          question:
            "What is the difference between React.Component and React.PureComponent?",
          options: [
            "PureComponent implements shallow comparison for props and state automatically",
            "PureComponent is faster than Component",
            "PureComponent is for functional style, Component for classes",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 64,
          question: "What is forwardRef in React used for?",
          options: [
            "To forward components",
            "To pass refs through component to child DOM element",
            "To handle ref forwarding",
            "To create forward references",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 65,
          question: "What is React Portal used for?",
          options: [
            "Creating portals to other apps",
            "Rendering children into DOM node outside parent component hierarchy",
            "Managing component portals",
            "Handling portal navigation",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 66,
          question: "What is the purpose of createPortal in React?",
          options: [
            "To create portal components",
            "Method to render component subtree in different DOM node",
            "To handle portal creation",
            "To manage portal states",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 67,
          question: "What is React.createRef() used for?",
          options: [
            "Creating component references",
            "Creating ref objects to access DOM elements in class components",
            "To reference other components",
            "To create reference data",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 68,
          question: "What is the difference between createRef and useRef?",
          options: [
            "createRef for class components, useRef for functional components",
            "createRef is faster than useRef",
            "createRef is for DOM refs, useRef for component refs",
            "They are identical in functionality",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 69,
          question: "What is React.cloneElement() used for?",
          options: [
            "To clone components",
            "To clone and return new React element using element as starting point",
            "To duplicate component elements",
            "To create element copies",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 70,
          question: "What is React.Children utility used for?",
          options: [
            "Managing child components",
            "Utilities for dealing with props.children opaque data structure",
            "Creating child elements",
            "Handling children events",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 71,
          question: "What is the purpose of React.isValidElement()?",
          options: [
            "To validate component elements",
            "To verify if object is valid React element",
            "To check element validity",
            "To handle element validation",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 72,
          question: "What is Server-Side Rendering (SSR) in React?",
          options: [
            "Rendering on server hardware",
            "Rendering React components on server and sending HTML to client",
            "Server-side component management",
            "Handling server-side logic",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 73,
          question: "What is Next.js used for with React?",
          options: [
            "Next generation React",
            "React framework with SSR, routing, and performance optimizations",
            "Advanced React features",
            "Next level React development",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 74,
          question: "What is Gatsby used for with React?",
          options: [
            "Great party hosting",
            "Static site generator for React with GraphQL and performance optimizations",
            "Advanced React styling",
            "React component library",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 75,
          question:
            "What is the difference between SSR and Static Site Generation (SSG)?",
          options: [
            "SSR renders at request time, SSG renders at build time",
            "SSR is faster than SSG",
            "SSR is for dynamic content, SSG for static content",
            "They are identical approaches",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 76,
          question: "What is hydration in React SSR?",
          options: [
            "Adding water to components",
            "Process of attaching event listeners to server-rendered HTML",
            "Hydrating component state",
            "Managing component hydration",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 77,
          question: "What is React Native used for?",
          options: [
            "Native American React development",
            "Building mobile applications using React concepts",
            "React for native environments",
            "Advanced React features",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 78,
          question: "What is the difference between React and React Native?",
          options: [
            "React for web applications, React Native for mobile applications",
            "React is faster than React Native",
            "React is for desktop, React Native for web",
            "They are identical frameworks",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 79,
          question: "What is Electron used for with React?",
          options: [
            "Electronic React components",
            "Building desktop applications using web technologies including React",
            "React for electronics",
            "Advanced React features",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 80,
          question: "What is React Three Fiber used for?",
          options: [
            "Three-dimensional React components",
            "React renderer for Three.js to build 3D scenes declaratively",
            "Fiber optic React connections",
            "Advanced React rendering",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 81,
          question: "What is Styled Components used for in React?",
          options: [
            "Styling component behavior",
            "CSS-in-JS library for styling React components with tagged template literals",
            "Creating styled interfaces",
            "Component style management",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 82,
          question: "What is Emotion used for in React?",
          options: [
            "Adding emotions to components",
            "CSS-in-JS library for styling with performance and flexibility",
            "Handling user emotions",
            "Emotional component design",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 83,
          question: "What is the difference between CSS Modules and CSS-in-JS?",
          options: [
            "CSS Modules scope CSS locally, CSS-in-JS writes CSS in JavaScript",
            "CSS Modules are faster than CSS-in-JS",
            "CSS Modules are for production, CSS-in-JS for development",
            "They are identical approaches",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 84,
          question: "What is Tailwind CSS used for with React?",
          options: [
            "Tailoring CSS for components",
            "Utility-first CSS framework for rapid UI development",
            "CSS for tail components",
            "Advanced CSS features",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 85,
          question: "What is Material-UI (MUI) used for in React?",
          options: [
            "Creating material components",
            "React component library implementing Google's Material Design",
            "Material design for interfaces",
            "Advanced UI components",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 86,
          question: "What is Ant Design used for in React?",
          options: [
            "Designing ant colonies",
            "Enterprise-class UI design language and React components",
            "Ant-themed UI components",
            "Advanced design patterns",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 87,
          question: "What is Chakra UI used for in React?",
          options: [
            "Spiritual UI design",
            "Simple, modular and accessible component library",
            "Chakra-themed components",
            "Advanced UI framework",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 88,
          question: "What is React Spring used for?",
          options: [
            "Spring-themed components",
            "Spring-physics based animation library for React",
            "Seasonal UI components",
            "Spring framework integration",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 89,
          question: "What is Framer Motion used for in React?",
          options: [
            "Creating photo frames",
            "Production-ready motion library for React with declarative animations",
            "Motion detection components",
            "Frame-based animations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 90,
          question: "What is React Transition Group used for?",
          options: [
            "Group transitions management",
            "Components for managing component states over time",
            "Transitioning between groups",
            "Group-based animations",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 91,
          question: "What is React DnD (Drag and Drop) used for?",
          options: [
            "Dungeons and Dragons games",
            "Building complex drag and drop interfaces",
            "DNA sequencing components",
            "Advanced interaction patterns",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 92,
          question: "What is React Virtualized used for?",
          options: [
            "Virtual reality components",
            "Efficiently rendering large lists and tabular data",
            "Virtualizing component behavior",
            "Virtual component management",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 93,
          question: "What is React Window used for?",
          options: [
            "Creating window components",
            "Efficiently rendering large lists by only rendering visible items",
            "Window management in React",
            "Advanced windowing features",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 94,
          question:
            "What is the difference between React Virtualized and React Window?",
          options: [
            "React Window is lighter and faster rewrite of React Virtualized",
            "React Virtualized is newer than React Window",
            "React Virtualized is for lists, React Window for tables",
            "They are identical libraries",
          ],
          correctAnswer: 0,
          type: "multiple-choice",
        },
        {
          id: 95,
          question: "What is React Helmet used for?",
          options: [
            "Safety helmet components",
            "Managing document head tags like title and meta tags",
            "Helmet-themed UI components",
            "Advanced head management",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 96,
          question: "What is React Intl used for?",
          options: [
            "Internal React features",
            "Internationalization (i18n) library for React applications",
            "Intelligence components",
            "Advanced React features",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 97,
          question: "What is Redux Toolkit (RTK) used for?",
          options: [
            "Redux development tools",
            "Official, opinionated, batteries-included toolset for efficient Redux development",
            "Redux component toolkit",
            "Advanced Redux features",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 98,
          question: "What is RTK Query used for?",
          options: [
            "Querying Redux toolkit",
            "Data fetching and caching layer built on top of Redux Toolkit",
            "Query components for Redux",
            "Advanced query management",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 99,
          question: "What is Zustand used for in React?",
          options: [
            "German state management",
            "Small, fast and scalable state management solution",
            "Advanced state features",
            "Component state management",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
        {
          id: 100,
          question: "What is the future of React with Concurrent Features?",
          options: [
            "Concurrent programming support",
            "Features like Suspense, concurrent rendering, and automatic batching for better UX",
            "Multi-threaded React components",
            "Advanced concurrency patterns",
          ],
          correctAnswer: 1,
          type: "multiple-choice",
        },
      ],
    },
  ];
};
