import type { FeaturedProject } from "@/domain/datasheet";
import { GITHUB_URL } from "./profile";

/** The repositories pinned on github.com/kdenver14, in pinned order. Star counts as of October 2026. */
export const FEATURED: readonly FeaturedProject[] = [
  {
    id: "uptime-monitor",
    repo: "uptime-monitor",
    name: "uptime-monitor",
    status: "preview",
    summary: "A backend that checks whether websites are up.",
    overview: [
      "A backend that watches websites and reports whether they're up, like UptimeRobot, built from scratch without AI to practise junior backend work.",
      "Monitor CRUD runs through routes, controllers, services and repositories, with Zod validation and PostgreSQL in Docker. A checker that records status codes and response times is written but not pushed yet; a BullMQ worker, scheduling and alerts come next.",
    ],
    facts: [
      { label: "Stack", value: "Express 5.2, TypeScript 7 (strict, ESM)" },
      { label: "Database", value: "PostgreSQL 16 in Docker Compose" },
      { label: "ORM", value: "Prisma 8 RC" },
      { label: "Validation", value: "Zod 4: http(s) URLs, interval of at least 30 s" },
      { label: "Check result", value: "isUp, statusCode, responseTime, errorMessage", code: true },
      { label: "Next", value: "Redis + BullMQ worker, scheduling, alerts" },
      { label: "AI assistance", value: "None" },
    ],
    tags: ["TypeScript", "Express 5", "Prisma", "PostgreSQL", "Docker"],
    demo: {
      kind: "pipeline",
      description:
        "A monitor for this site is created through the API (201) and saved in PostgreSQL. Then the planned pipeline runs: a scheduler queues a check every 60 s, a worker hands it to the checker, and a site that's down triggers an alert. Dashed stops aren't built yet, the checker isn't pushed yet, and the check values are samples.",
      stops: [
        { name: "API", planned: false },
        { name: "PostgreSQL", planned: false },
        { name: "Scheduler", planned: true },
        { name: "Queue", planned: true },
        { name: "Worker", planned: true },
        { name: "Checker", planned: false },
        { name: "Alerts", planned: true },
      ],
      create: {
        method: "POST",
        path: "/api/v1/monitors",
        body: '{"name":"Portfolio","url":"https://kdenver.vercel.app","isActive":true}',
        visits: [0, 1],
        answeredAt: 0,
        status: 201,
        response: '{"message":"Successfully created monitor","data":{"id":1,"name":"Portfolio",…}}',
      },
      monitor: { url: "https://kdenver.vercel.app", interval: 60 },
      checks: [
        { visits: [1, 2, 3, 4, 5], resultAt: 5, isUp: true, statusCode: 200, responseTime: 143 },
        { visits: [1, 2, 3, 4, 5, 6], resultAt: 5, isUp: false, statusCode: null, failure: "timed out after 10 s" },
      ],
    },
  },
  {
    id: "hand-gesture-control",
    repo: "Hand-Gesture-Control-Keras-Project",
    name: "Hand Gesture Control",
    status: "active",
    summary: "Your hand as a mouse and a paintbrush.",
    overview: [
      "Turn your hand into a mouse and a paintbrush. MediaPipe finds 21 landmarks per frame, a small Keras network sorts the pose into one of five gestures, and a mode state machine decides whether that means draw, volume or click.",
      "Built with three collaborators. With no trained model on disk it falls back to rule-based detection, so it runs without training. macOS only for now: volume goes through osascript.",
    ],
    facts: [
      { label: "Gestures", value: "5, with 200 training samples each" },
      { label: "Classifier", value: "Dense 128 → 64 → 5" },
      { label: "Mode switch", value: "10-frame hold, 2 s cooldown" },
      { label: "Cursor smoothing", value: "7-frame moving average" },
      { label: "GitHub stars", value: "17" },
    ],
    tags: ["Python", "MediaPipe", "Keras", "OpenCV"],
    demo: {
      kind: "gesture",
      description:
        "The mean pose of each recorded gesture, read the way the app reads a webcam frame. An open hand lifts the pen in DRAW mode and a pointed finger draws. A peace sign held 10 frames switches to VOLUME, and a fist switches to CLICK, where pointing moves the cursor and a pinch clicks.",
      stops: ["Webcam", "MediaPipe Hands", "Keras classifier", "Mode machine", "Action"],
      initialMode: "DRAW",
      beats: [
        { gesture: "open_hand", mode: "DRAW", action: "lift pen" },
        { gesture: "point", mode: "DRAW", action: "draw" },
        { gesture: "peace", mode: "VOLUME", action: "set volume" },
        { gesture: "fist", mode: "CLICK", action: "move cursor" },
        { gesture: "point", mode: "CLICK", action: "move cursor" },
        { gesture: "pinch", mode: "CLICK", action: "click" },
      ],
    },
  },
  {
    id: "dsa",
    repo: "Data-Structure-and-Algorithms-implementation-",
    name: "DSA implementations",
    status: "complete",
    summary: "Linked lists to heaps, written by hand in C++.",
    overview: [
      "My reviewer for data structures and algorithms: each one written by hand in C++, most with a diagram alongside.",
      "Eight topics, from singly and doubly linked lists, stacks, queues and hash tables to heaps, graphs and binary-tree traversals, plus five sorts and 11 interview problems such as two-sum and reversing a linked list.",
    ],
    facts: [
      { label: "Topics", value: "8, from linked lists to graphs" },
      { label: "Sorts", value: "Bubble, selection, insertion, merge, quick" },
      { label: "Interview problems", value: "11" },
      { label: "Source files", value: "31 .cpp" },
    ],
    tags: ["C++", "Data structures", "Algorithms"],
    demo: {
      kind: "sort",
      description:
        "Bubble sort, then selection sort, on the array in each file's main: {6, 4, 2, 5, 1, 3}. Compared bars turn blue, swaps slide into place, and settled bars fade. Each ends on the line its program prints.",
      runs: [
        { algorithm: "bubble", file: "bubbleSort.cpp", values: [6, 4, 2, 5, 1, 3] },
        { algorithm: "selection", file: "selectionSort.cpp", values: [6, 4, 2, 5, 1, 3] },
      ],
    },
    listing: {
      caption: "reverseLinkedList.cpp",
      language: "cpp",
      href: `${GITHUB_URL}/Data-Structure-and-Algorithms-implementation-/blob/HEAD/LinkedList/singly_linkedList/interviews/reverseLinkedList.cpp`,
      source: `void reverseLinkedList(){
    Node* previous = nullptr;
    Node* current = head;
    Node* next = nullptr;
    tail = head;

    while(current){
        next = current->next;
        current->next = previous;
        previous = current;
        current = next;
    }
    head = previous;
}`,
    },
  },
  {
    id: "int-wrapper",
    repo: "Int-as-integer-data_type",
    name: "Int wrapper",
    status: "complete",
    summary: "A C++ Int that acts like the built-in int.",
    overview: [
      "One of my first C++ repos: a custom Int that behaves like the primitive int.",
      "Every arithmetic, comparison, compound-assignment and stream operator is overloaded, division by zero throws, and a variadic template frees several heap Ints in one call.",
    ],
    facts: [
      { label: "Operators", value: "18 overloaded" },
      { label: "Division by zero", value: "throws std::runtime_error", code: true },
      { label: "GitHub stars", value: "2" },
    ],
    tags: ["C++", "Operator overloading", "Variadic templates"],
    demo: {
      kind: "operators",
      description:
        "main.cpp line by line, with 42 typed at the prompt. Ints a = 10 and b = 5 go through each overloaded arithmetic, comparison and compound-assignment operator, showing the value it prints (comparisons print 0 or 1). Then one ptr_deleter call frees three heap Ints, peeling off one pointer per recursive call until the one-pointer overload ends it.",
      a: 10,
      b: 5,
      beats: [
        { expression: "a + b", signature: "friend Int operator+(const Int& number1, const Int& number2);", result: "15" },
        { expression: "a - b", signature: "friend Int operator-(const Int& number1, const Int& number2);", result: "5" },
        { expression: "a * b", signature: "friend Int operator*(const Int& number1, const Int& number2);", result: "50" },
        { expression: "a / b", signature: "friend Int operator/(const Int& number1, const Int& number2);", result: "2" },
        { expression: "a % b", signature: "friend Int operator%(const Int& number1, const Int& number2);", result: "0" },
        { expression: "a == b", signature: "friend bool operator==(const Int& number1, const Int& number2);", result: "0" },
        { expression: "a != b", signature: "friend bool operator!=(const Int& number1, const Int& number2);", result: "1" },
        { expression: "a < b", signature: "friend bool operator<(const Int& number1, const Int& number2);", result: "0" },
        { expression: "a > b", signature: "friend bool operator>(const Int& number1, const Int& number2);", result: "1" },
        { expression: "a <= b", signature: "friend bool operator<=(const Int& number1, const Int& number2);", result: "0" },
        { expression: "a >= b", signature: "friend bool operator>=(const Int& number1, const Int& number2);", result: "1" },
        { expression: "a += b", signature: "friend Int& operator+=(Int& left, const Int& right);", result: "15", a: 15 },
        { expression: "a -= b", signature: "friend Int& operator-=(Int& left, const Int& right);", result: "10", a: 10 },
        { expression: "a *= b", signature: "friend Int& operator*=(Int& left, const Int& right);", result: "50", a: 50 },
        { expression: "a /= b", signature: "friend Int& operator/=(Int& left, const Int& right);", result: "10", a: 10 },
        { expression: "a %= b", signature: "friend Int& operator%=(Int& left, const Int& right);", result: "0", a: 0 },
        { expression: "std::cin >> inputInt", signature: "friend std::istream& operator>>(std::istream& is, Int& in);", result: "42" },
      ],
      heap: {
        values: [15, 25, 35],
        variadic: "template<typename... Args> friend void ptr_deleter(Int* first, Args... args);",
        single: "friend void ptr_deleter(Int*& ptr);",
      },
    },
    listing: {
      caption: "Int.h",
      language: "cpp",
      href: `${GITHUB_URL}/Int-as-integer-data_type/blob/HEAD/Int/Int.h`,
      source: `template<typename... Args>
void ptr_deleter(Int* first, Args... args) {
    delete first;
    ptr_deleter(args...);  // Recursively call for the remaining pointers
}`,
    },
  },
];
