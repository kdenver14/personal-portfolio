import type { GestureSet } from "@/domain/datasheet";
import samples from "@/data/gesture-samples.json";
import { HAND_CONNECTIONS, meanPose, parseGestureFile, project, sharedDomain, type Point } from "@/lib/landmarks";

const PANEL_WIDTH = 150;
const DOMAIN_PADDING = 0.04;
const COORD_DECIMALS = 1;
const JOINT_RADIUS = 2;

const GESTURES = parseGestureFile(samples);
const DOMAIN = sharedDomain(GESTURES, DOMAIN_PADDING);
const PANEL_HEIGHT = Math.round(
  (PANEL_WIDTH * (DOMAIN.yMax - DOMAIN.yMin)) / (DOMAIN.xMax - DOMAIN.xMin),
);

const fmt = (n: number) => n.toFixed(COORD_DECIMALS);
const toView = (point: Point) => project(point, DOMAIN, PANEL_WIDTH, PANEL_HEIGHT);

/** All sample landmarks as one path of zero-length round-capped segments: one element per panel. */
function dotsPath(set: GestureSet): string {
  return set.samples
    .flat()
    .map((point) => {
      const [x, y] = toView(point);
      return `M${fmt(x)} ${fmt(y)}h0`;
    })
    .join("");
}

function Panel({ set }: { set: GestureSet }) {
  const mean = meanPose(set.samples).map(toView);
  return (
    <div className="g-panel">
      <svg viewBox={`0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}`} role="img" aria-label={`${set.gesture}: ${set.samples.length} recorded hand poses`}>
        <path className="g-dots" d={dotsPath(set)} />
        {HAND_CONNECTIONS.map(([a, b]) => {
          const [p, q] = [mean[a], mean[b]];
          return p && q ? <line key={`${a}-${b}`} className="g-bone" x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} /> : null;
        })}
        {mean.map(([x, y], i) => <circle key={i} className="g-joint" cx={x} cy={y} r={JOINT_RADIUS} />)}
      </svg>
      <p className="g-label">
        <code>{set.gesture}</code>
        <span className="tabular">
          {set.samples.length} of {set.recorded}
        </span>
      </p>
    </div>
  );
}

export function GestureFigure() {
  return (
    <figure className="panel g-figure">
      <div className="g-panels">
        {GESTURES.map((set) => <Panel key={set.gesture} set={set} />)}
      </div>
      <figcaption className="panel-caption">
        Real training data from <code>data/*.csv</code>. Gray: recorded landmarks. Blue: mean pose.
      </figcaption>
    </figure>
  );
}
