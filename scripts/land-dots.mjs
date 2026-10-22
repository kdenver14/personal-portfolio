// Builds src/data/land-dots.json: evenly spaced points on the globe (a Fibonacci sphere) that fall on land,
// as [longitude, latitude] pairs, for the dot globe in the intro. Land comes from Natural Earth's 1:110m
// outlines (public domain) via the world-atlas package. Antarctica is left out for a cleaner globe.
//
// Usage: node scripts/land-dots.mjs   (run by hand; the output is committed)

import { writeFile } from "node:fs/promises";

const SOURCE = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json";
const OUTPUT_PATH = "src/data/land-dots.json";
const SPHERE_POINTS = 9000;
const SOUTHERNMOST = -60;
const DECIMALS = 1;

/** TopoJSON arcs are delta-encoded and quantized; this turns them back into [lon, lat] lines. */
function decodeArcs(topo) {
  const [sx, sy] = topo.transform.scale;
  const [tx, ty] = topo.transform.translate;
  return topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * sx + tx, y * sy + ty];
    });
  });
}

function polygons(topo) {
  const arcs = decodeArcs(topo);
  const ring = (indexes) =>
    indexes.flatMap((i, n) => {
      const line = i >= 0 ? arcs[i] : arcs[~i].toReversed();
      return n === 0 ? line : line.slice(1);
    });
  return topo.objects.land.geometries.flatMap((g) =>
    g.type === "Polygon" ? [g.arcs.map(ring)] : g.arcs.map((p) => p.map(ring)),
  );
}

function inside(ring, x, y) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[j];
    if (y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
      hit = !hit;
    }
  }
  return hit;
}

const onLand = (polys) => (lon, lat) =>
  polys.some(([outer, ...holes]) => inside(outer, lon, lat) && !holes.some((hole) => inside(hole, lon, lat)));

/** Evenly spread points on a sphere, as [lon, lat] in degrees. */
function fibonacciSphere(count) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / count;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return [(Math.atan2(Math.sin(theta) * r, Math.cos(theta) * r) * 180) / Math.PI, (Math.asin(y) * 180) / Math.PI];
  });
}

const response = await fetch(SOURCE);
if (!response.ok) {
  throw new Error(`world-atlas answered ${response.status}`);
}
const isLand = onLand(polygons(await response.json()));
const round = (n) => Number(n.toFixed(DECIMALS));
const dots = fibonacciSphere(SPHERE_POINTS)
  .filter(([lon, lat]) => lat >= SOUTHERNMOST && isLand(lon, lat))
  .map(([lon, lat]) => [round(lon), round(lat)]);
await writeFile(OUTPUT_PATH, `${JSON.stringify(dots)}\n`);
console.log(`land-dots: wrote ${dots.length} dots to ${OUTPUT_PATH}`);
