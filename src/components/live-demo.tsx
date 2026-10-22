"use client";

import type { CSSProperties } from "react";
import type { Demo, DemoRequest, GestureBeat, GestureMode, SortRun } from "@/domain/datasheet";
import { type OperatorFrame, demoDuration, gestureAt, modeBefore, operatorsAt, refusedAt, requestsAt } from "@/lib/demo";
import { HAND_CONNECTIONS, type HandPoses, lerpPose, project, type Point } from "@/lib/landmarks";
import { sortAt } from "@/lib/sort";
import { useProjectOpen } from "./project-dialog";
import { CONTROL_LABEL, usePlayback } from "./use-playback";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const STATUS_TEXT: Readonly<Record<number, string>> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
};
const FIRST_ERROR_STATUS = 400;
const PULSE_DECIMALS = 3;

const HAND_WIDTH = 120;
const JOINT_RADIUS = 2.2;
const LANDMARKS = "21 landmarks";
const FRAME = "frame";

function poseOf(hand: HandPoses, gesture: string): readonly Point[] {
  const pose = hand.poses[gesture];
  if (!pose) {
    throw new Error(`No recorded samples for gesture "${gesture}"`);
  }
  return pose;
}

interface StopLineProps {
  stops: readonly string[];
  pulse: number | null;
  lit: (stop: number) => boolean;
  refused?: number | null;
  /** A reading under each stop; stale ones are from the previous beat. */
  values?: readonly { text: string; stale: boolean }[];
  /** Lays the stops across on wider screens; otherwise they run down. */
  across?: boolean;
}

/** The project's layers as stops on a line, with a pulse travelling between them. */
function StopLine({ stops, pulse, lit, refused = null, values, across = false }: StopLineProps) {
  return (
    <div className={across ? "demo-line is-across" : "demo-line"} style={{ "--stops": String(stops.length) } as CSSVars}>
      <ol className="demo-stops">
        {stops.map((stop, i) => (
          <li key={stop} className={`demo-stop${lit(i) ? " is-lit" : ""}${refused === i ? " is-refused" : ""}`}>
            <span className="demo-dot" />
            <span className="demo-stop-name">{stop}</span>
            {values ? <span className={values[i]?.stale ? "demo-stop-value is-stale" : "demo-stop-value"}>{values[i]?.text}</span> : null}
          </li>
        ))}
      </ol>
      {pulse === null ? null : <span className="demo-pulse" style={{ "--at": pulse.toFixed(PULSE_DECIMALS) } as CSSVars} />}
    </div>
  );
}

function RequestLines({ request }: { request: DemoRequest }) {
  return (
    <div className="demo-head">
      <p className="demo-head-line">
        <span className="demo-method">{request.method}</span>
        <code>{request.path}</code>
      </p>
      {[...(request.headers ?? []), ...(request.body ? [request.body] : [])].map((line) => (
        <code key={line} className="demo-detail">
          {line}
        </code>
      ))}
    </div>
  );
}

function RequestsScreen({ stops, requests, ms }: { stops: readonly string[]; requests: readonly DemoRequest[]; ms: number }) {
  const frame = requestsAt(requests, ms);
  const request = requests[frame.index];
  if (!request) {
    return null;
  }
  const ok = request.status < FIRST_ERROR_STATUS;
  return (
    <div className="demo-screen">
      <RequestLines request={request} />
      <StopLine
        stops={stops}
        pulse={frame.pulse}
        lit={(stop) => frame.lit.includes(stop)}
        refused={frame.answered ? refusedAt(request) : null}
        across
      />
      <p className="demo-foot">
        {frame.answered ? (
          <>
            <span className={ok ? "demo-status is-ok" : "demo-status"}>
              {request.status} {STATUS_TEXT[request.status]}
            </span>
            {request.response ? <code className="demo-detail">{request.response}</code> : null}
          </>
        ) : null}
      </p>
    </div>
  );
}

function SortScreen({ runs, ms }: { runs: readonly SortRun[]; ms: number }) {
  const frame = sortAt(runs, ms);
  const run = runs[frame.run];
  if (!run) {
    return null;
  }
  const tallest = Math.max(...run.values);
  const state = (bar: number) =>
    frame.comparing.includes(bar) ? " is-comparing" : frame.marked === bar ? " is-marked" : frame.settled.includes(bar) ? " is-settled" : "";
  return (
    <div className="demo-screen">
      <p className="demo-head-line">
        <code>{run.file}</code>
        <code className="demo-detail">{`{${run.values.join(", ")}}`}</code>
      </p>
      <div className="demo-bars" style={{ "--bars": String(run.values.length) } as CSSVars}>
        {run.values.map((value, bar) => (
          <span
            key={bar}
            className={`demo-bar${state(bar)}`}
            style={{ "--slot": String(frame.slots[bar] ?? bar), "--height": String(value / tallest) } as CSSVars}
          >
            <span className="demo-bar-fill" />
            <span className="demo-bar-value tabular">{value}</span>
          </span>
        ))}
      </div>
      <p className="demo-foot">
        {frame.done ? <span className="demo-muted">prints</span> : null}
        <code className={frame.done ? "" : "demo-detail"}>{frame.caption}</code>
      </p>
    </div>
  );
}

type OperatorsDemo = Extract<Demo, { kind: "operators" }>;

/** The heap pointers as main names them: ptr1, ptr2, … */
const pointerNames = (count: number) => Array.from({ length: count }, (_, i) => `ptr${i + 1}`);

/** The call on screen, its declaration, and the value it prints once it has run. */
function currentLine(demo: OperatorsDemo, frame: OperatorFrame): { call: string; signature: string; result: string | null } {
  const { step } = frame;
  if (step.kind === "operator") {
    const beat = demo.beats[step.index];
    return { call: beat?.expression ?? "", signature: beat?.signature ?? "", result: frame.showResult ? (beat?.result ?? null) : null };
  }
  const pointers = pointerNames(demo.heap.values.length);
  const last = step.call >= pointers.length - 1;
  return { call: `ptr_deleter(${pointers.slice(step.call).join(", ")})`, signature: last ? demo.heap.single : demo.heap.variadic, result: null };
}

function IntCell({ name, value, changed = false }: { name: string; value: number; changed?: boolean }) {
  return (
    <span className="demo-int">
      <code className="demo-int-name">Int {name}</code>
      <code className={changed ? "demo-int-value is-changed" : "demo-int-value"}>{value}</code>
    </span>
  );
}

function OperatorsScreen({ demo, ms }: { demo: OperatorsDemo; ms: number }) {
  const frame = operatorsAt(demo.a, demo.beats, demo.heap.values.length, ms);
  const line = currentLine(demo, frame);
  const values = demo.heap.values.map((value, i) => ({
    text: !frame.allocated ? "" : i < frame.freed ? "deleted" : `new Int(${value})`,
    stale: i < frame.freed,
  }));
  return (
    <div className="demo-screen">
      <div className="demo-ints">
        <IntCell name="a" value={frame.a} changed={frame.changed} />
        <IntCell name="b" value={demo.b} />
      </div>
      <div className="demo-head">
        <p className="demo-head-line">
          <code>{line.call}</code>
          {line.result === null ? null : <code className="demo-result">{line.result}</code>}
        </p>
        <code className="demo-detail">{line.signature}</code>
      </div>
      <StopLine
        stops={pointerNames(demo.heap.values.length)}
        pulse={frame.pulse}
        lit={(stop) => stop < frame.freed}
        values={values}
      />
    </div>
  );
}

/** What each stop reads for one beat: the frame, its landmarks, the gesture, the mode and the action. */
function readings(beat: GestureBeat | undefined, before: GestureMode): string[] {
  if (!beat) {
    return [];
  }
  const mode = beat.mode === before ? beat.mode : `${before} → ${beat.mode}`;
  return [FRAME, LANDMARKS, beat.gesture, mode, beat.action];
}

function Hand({ pose, hand }: { pose: readonly Point[]; hand: HandPoses }) {
  const { domain } = hand;
  const height = Math.round((HAND_WIDTH * (domain.yMax - domain.yMin)) / (domain.xMax - domain.xMin));
  const view = pose.map((point) => project(point, domain, HAND_WIDTH, height));
  return (
    <svg className="demo-hand" viewBox={`0 0 ${HAND_WIDTH} ${height}`}>
      {HAND_CONNECTIONS.map(([a, b]) => {
        const [p, q] = [view[a], view[b]];
        return p && q ? <line key={`${a}-${b}`} className="g-bone" x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} /> : null;
      })}
      {view.map(([x, y], i) => <circle key={i} className="g-joint" cx={x} cy={y} r={JOINT_RADIUS} />)}
    </svg>
  );
}

function GestureScreen({ demo, hand, ms }: { demo: Extract<Demo, { kind: "gesture" }>; hand: HandPoses; ms: number }) {
  const { stops, beats, initialMode } = demo;
  const frame = gestureAt(beats, stops.length, ms);
  const beat = beats[frame.index];
  if (!beat) {
    return null;
  }
  const previous = beats[frame.index - 1];
  const now = readings(beat, modeBefore(beats, frame.index, initialMode));
  const then = readings(previous, modeBefore(beats, frame.index - 1, initialMode));
  const values = stops.map((_, i) => (i < frame.reached ? { text: now[i] ?? "", stale: false } : { text: then[i] ?? "", stale: true }));
  return (
    <div className="demo-screen demo-gesture">
      <Hand hand={hand} pose={lerpPose(poseOf(hand, previous?.gesture ?? beat.gesture), poseOf(hand, beat.gesture), frame.blend)} />
      <StopLine stops={stops} pulse={frame.pulse} lit={(stop) => stop < frame.reached} values={values} />
    </div>
  );
}

interface DemoProps {
  demo: Demo;
  /** The recorded hand poses a gesture demo animates between; null for the others. */
  hand: HandPoses | null;
}

function DemoScreen({ demo, hand, ms }: DemoProps & { ms: number }) {
  switch (demo.kind) {
    case "requests":
      return <RequestsScreen stops={demo.stops} requests={demo.requests} ms={ms} />;
    case "sort":
      return <SortScreen runs={demo.runs} ms={ms} />;
    case "operators":
      return <OperatorsScreen demo={demo} ms={ms} />;
    case "gesture":
      if (!hand) {
        throw new Error("A gesture demo needs the recorded hand poses");
      }
      return <GestureScreen demo={demo} hand={hand} ms={ms} />;
  }
}

function DemoPlayer({ demo, hand, autoplay }: DemoProps & { autoplay: boolean }) {
  const { ms, status, toggle } = usePlayback(demoDuration(demo), autoplay);
  return (
    <figure className="replay demo">
      <div aria-hidden="true">
        <DemoScreen demo={demo} hand={hand} ms={ms} />
      </div>
      <figcaption className="replay-caption">
        <span>
          {demo.description} <span className="replay-note">Animated from the repo&apos;s code.</span>
        </span>
        <button type="button" className="replay-control" onClick={toggle}>
          {CONTROL_LABEL[status]}
        </button>
      </figcaption>
    </figure>
  );
}

/** A featured project's live diagram: plays from the top each time its pop-up opens, still on the last frame otherwise. */
export function DemoFigure({ id, demo, hand }: DemoProps & { id: string }) {
  const open = useProjectOpen(id);
  return <DemoPlayer key={open ? "open" : "closed"} demo={demo} hand={hand} autoplay={open} />;
}
