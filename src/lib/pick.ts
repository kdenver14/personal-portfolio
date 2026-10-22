/** The chip's picked pin, shared by the pins and the logic analyzer lanes. */

/** Clears the pick only if it is still `pin`, so leaving one pin can't undo entering the next. */
export const release =
  (pin: number) =>
  (current: number | null): number | null =>
    current === pin ? null : current;
