const MIN_STOP_PX = 14;
const PX_PER_SHARE_POINT = 0.35;
const PERCENT = 100;

/** A stop's diameter in px, growing with the share of code it stands for. */
export function stopDiameter(share: number): number {
  return Math.round(MIN_STOP_PX + share * PX_PER_SHARE_POINT);
}

/** The centre of stop `index` among `count` equal-width stops, as a percent of the line's width. */
export function stopCenter(index: number, count: number): number {
  if (!Number.isInteger(index) || index < 0 || index >= count) {
    throw new RangeError(`Stop ${index} is not one of ${count}`);
  }
  return ((index + 0.5) / count) * PERCENT;
}
