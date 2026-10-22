import type { CodeSample } from "@/domain/datasheet";

/** "How I write code": one excerpt per main language, each from a repo on this page, with the reasoning behind it. */
export const CODE_SAMPLES: readonly CodeSample[] = [
  {
    label: "TypeScript",
    language: "typescript",
    repo: "uptime-monitor",
    path: "src/controllers/monitorController.ts",
    firstLine: 33,
    source: `export const createMonitor = async (req: Request, res: Response) => {
  const result = createMonitorSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Invalid monitor data",
      errors: result.error.issues,
    });
  }

  const monitor = await monitorService.createMonitor(result.data);

  res.status(HTTP_STATUS.CREATED).json({
    message: "Successfully created monitor",
    data: monitor,
  });
};`,
    notes: [
      { from: 2, to: 2, text: "Zod checks the body at the edge, so the service only ever sees valid input." },
      { from: 4, to: 9, text: "Bad input stops here with a 400 and Zod's issues, before anything touches the database." },
      { from: 11, to: 11, text: "The service gets plain data and knows nothing about HTTP, so the background worker can reuse it." },
    ],
  },
  {
    label: "Python",
    language: "python",
    repo: "Hand-Gesture-Control-Keras-Project",
    path: "gesture_control.py",
    firstLine: 269,
    source: `# Stability buffer: only switch mode after N consecutive
# frames of the same gesture
if gesture == last_raw_gesture:
    gesture_counter[gesture] = gesture_counter.get(gesture, 0) + 1
else:
    gesture_counter = {gesture: 1}
    gesture_start_time = curr_time
last_raw_gesture = gesture

stable_count = gesture_counter.get(gesture, 0)

# Mode switching with cooldown + stability
if (curr_time - last_mode_switch > MODE_SWITCH_COOLDOWN
        and stable_count >= GESTURE_STABLE_FRAMES):
    new_mode = gesture_to_mode(gesture, mode)`,
    notes: [
      { from: 3, to: 7, text: "One frame of a different gesture resets the count, so a twitch never registers." },
      { from: 13, to: 14, text: "A mode only changes after 10 identical frames and 2 s since the last change, so it can't flap." },
    ],
  },
  {
    label: "C++",
    language: "cpp",
    repo: "Data-Structure-and-Algorithms-implementation-",
    path: "LinkedList/singly_linkedList/interviews/reverseLinkedList.cpp",
    firstLine: 55,
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
    notes: [
      { from: 2, to: 4, text: "Three pointers and no second list: O(1) extra space." },
      { from: 5, to: 5, text: "The old head will be the tail, so it is kept before the walk." },
      { from: 8, to: 9, text: "Save next before rewiring, or the rest of the list is lost." },
    ],
  },
];
