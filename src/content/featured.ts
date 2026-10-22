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
    flow: ["Route", "Controller", "Service", "Repository", "PostgreSQL 16"],
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
    flow: ["Webcam", "MediaPipe Hands", "Keras classifier", "Mode machine", "Draw / Volume / Click"],
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
    id: "express-full",
    repo: "Express-Full",
    name: "Express-Full",
    status: "active",
    summary: "A movie watchlist REST API with JWT auth and hand-written validators, written without AI.",
    overview: [
      "My backend foundation: a movie watchlist REST API, written without AI.",
      "Users register and log in through hand-written validators, receive a JWT, and keep a watchlist with a status, a rating and notes for each movie.",
    ],
    facts: [
      { label: "Stack", value: "Express 5.2, TypeScript 5.9, Zod 4" },
      { label: "Auth", value: "JWT middleware, bcryptjs" },
      { label: "Data", value: "Prisma 7, PostgreSQL" },
      { label: "One entry per movie", value: "@@unique([userId, movieId])", code: true },
      { label: "AI assistance", value: "None" },
    ],
    tags: ["TypeScript", "Express 5", "Prisma", "PostgreSQL", "Zod"],
    flow: ["Client", "Express router", "Auth + validation", "Controllers", "Services", "Prisma", "PostgreSQL"],
  },
];
