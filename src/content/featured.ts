import type { FeaturedProject } from "@/domain/datasheet";
import { GITHUB_URL } from "./profile";

/** The repositories pinned on github.com/kdenver14, in pinned order. Star counts as of October 2026. */
export const FEATURED: readonly FeaturedProject[] = [
  {
    id: "uptime-monitor",
    repo: "uptime-monitor",
    name: "uptime-monitor",
    status: "preview",
    summary: "A website uptime monitor that tracks status and response time, layered and written without AI.",
    overview: [
      "A website uptime monitor that tracks status and response time. It is still in development and written without AI.",
      "It is layered the way I want to work from now on: controllers translate HTTP, services hold the rules, repositories own the database, and the domain is plain types. PostgreSQL runs in Docker Compose; this is the project where I am learning Docker.",
    ],
    facts: [
      { label: "Stack", value: "Express 5.2, TypeScript 7" },
      { label: "Database", value: "PostgreSQL 16 in Docker Compose" },
      { label: "ORM", value: "Prisma 8 RC" },
      { label: "AI assistance", value: "None" },
    ],
    tags: ["TypeScript", "Express 5", "Prisma", "PostgreSQL", "Docker"],
    demo: {
      kind: "requests",
      description:
        "Four requests travel the API's layers. A new monitor is created (201). One with a bad URL is refused by the controller's schema (400). Monitor 7 is looked up and not found (404). Monitor 1 is deleted (204).",
      stops: ["Route", "Controller", "Service", "Repository", "PostgreSQL"],
      requests: [
        {
          method: "POST",
          path: "/api/v1/monitors",
          body: '{"name":"Portfolio","url":"https://kdenver.vercel.app","isActive":true}',
          visits: [0, 1, 2, 3, 4],
          answeredAt: 1,
          status: 201,
          response: '{"message":"Successfully created monitor","data":{"id":1,"interval":60,…}}',
        },
        {
          method: "POST",
          path: "/api/v1/monitors",
          body: '{"name":"Typo","url":"kdenver.vercel.app","isActive":true}',
          visits: [0, 1],
          answeredAt: 1,
          status: 400,
          response: '{"message":"Invalid monitor data","errors":[…]}',
        },
        {
          method: "GET",
          path: "/api/v1/monitors/7",
          visits: [0, 1, 2, 3, 4],
          answeredAt: 1,
          status: 404,
          response: '{"message":"Monitor 7 not found"}',
        },
        { method: "DELETE", path: "/api/v1/monitors/1", visits: [0, 1, 2, 3, 4], answeredAt: 1, status: 204 },
      ],
    },
  },
  {
    id: "hand-gesture-control",
    repo: "Hand-Gesture-Control-Keras-Project",
    name: "Hand Gesture Control",
    status: "active",
    summary: "Turn your hand into a mouse and a paintbrush with MediaPipe tracking and a small Keras classifier.",
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
    summary: "Data structures and algorithms written by hand in C++, from linked lists to heaps, as my interview reviewer.",
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
    summary: "A custom Int that behaves like the primitive int, with every operator overloaded and division by zero throwing.",
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
