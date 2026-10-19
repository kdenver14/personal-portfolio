// Builds src/data/gesture-samples.json from the recorded training data in
// github.com/kdenver14/Hand-Gesture-Control-Keras-Project (data/<gesture>.csv).
// Each CSV row is 21 MediaPipe landmarks as wrist-relative (x, y, z) triples.
//
// Usage: node scripts/extract-gesture-samples.mjs <dir-with-csvs>

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const GESTURES = ["open_hand", "peace", "fist", "point", "pinch"];
const LANDMARK_COUNT = 21;
const VALUES_PER_LANDMARK = 3;
const SAMPLE_STRIDE = 5;
const DECIMALS = 3;
const OUTPUT_PATH = "src/data/gesture-samples.json";

const round = (value) => Number(value.toFixed(DECIMALS));

function parseRow(line) {
  const values = line.split(",").map(Number);
  if (values.length !== LANDMARK_COUNT * VALUES_PER_LANDMARK || values.some(Number.isNaN)) {
    throw new Error(`Malformed landmark row: ${line.slice(0, 60)}…`);
  }
  return Array.from({ length: LANDMARK_COUNT }, (_, i) => [
    round(values[i * VALUES_PER_LANDMARK]),
    round(values[i * VALUES_PER_LANDMARK + 1]),
  ]);
}

async function readGesture(dir, gesture) {
  const text = await readFile(join(dir, `${gesture}.csv`), "utf8");
  const rows = text.trim().split("\n");
  return {
    gesture,
    recorded: rows.length,
    samples: rows.filter((_, i) => i % SAMPLE_STRIDE === 0).map(parseRow),
  };
}

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node scripts/extract-gesture-samples.mjs <dir-with-csvs>");
  process.exit(1);
}

const gestures = await Promise.all(GESTURES.map((g) => readGesture(dir, g)));
await writeFile(OUTPUT_PATH, `${JSON.stringify({ source: "kdenver14/Hand-Gesture-Control-Keras-Project/data", gestures })}\n`);
console.log(`Wrote ${OUTPUT_PATH}: ${gestures.map((g) => `${g.gesture} ${g.samples.length}/${g.recorded}`).join(", ")}`);
