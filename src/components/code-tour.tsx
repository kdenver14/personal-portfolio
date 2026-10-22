"use client";

import { type KeyboardEvent, useId, useState } from "react";
import type { CodeNote, CodeSample } from "@/domain/datasheet";
import { CODE_SAMPLES } from "@/content/code-samples";
import { GITHUB_URL } from "@/content/profile";
import { splitComment } from "@/lib/highlight";

/** Keys that move between tabs, and where each one goes from tab `i` of `count`. */
const TAB_KEYS: Readonly<Record<string, (i: number, count: number) => number>> = {
  ArrowRight: (i, count) => (i + 1) % count,
  ArrowLeft: (i, count) => (i - 1 + count) % count,
  Home: () => 0,
  End: (_, count) => count - 1,
};

const fileUrl = (sample: CodeSample) => {
  const last = sample.firstLine + sample.source.split("\n").length - 1;
  return `${GITHUB_URL}/${sample.repo}/blob/HEAD/${sample.path}#L${sample.firstLine}-L${last}`;
};

/** The note that starts on `line`, numbered from 1, if any. */
const noteStartingAt = (notes: readonly CodeNote[], line: number) => {
  const index = notes.findIndex((note) => note.from === line);
  return index < 0 ? null : index + 1;
};

function Code({ sample, lit }: { sample: CodeSample; lit: CodeNote | null }) {
  return (
    <pre className="tour-code">
      <code>
        {sample.source.split("\n").map((line, i) => {
          const n = i + 1;
          const pin = noteStartingAt(sample.notes, n);
          const { code, comment } = splitComment(line, sample.language);
          const isLit = lit !== null && n >= lit.from && n <= lit.to;
          return (
            <span key={n} className={isLit ? "tour-line is-lit" : "tour-line"}>
              {/* Margin numbers repeat what the notes list says, so assistive tech skips them. */}
              <span className="tour-gutter" aria-hidden="true">
                {pin === null ? sample.firstLine + i : <span className="tour-pin">{pin}</span>}
              </span>
              {code}
              {comment ? <span className="tour-comment">{comment}</span> : null}
              {"\n"}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

function Notes({ notes, setLit }: { notes: readonly CodeNote[]; setLit: (note: CodeNote | null) => void }) {
  return (
    <ol className="tour-notes">
      {notes.map((note, i) => (
        <li key={note.from} onPointerEnter={() => setLit(note)} onPointerLeave={() => setLit(null)}>
          <span className="tour-pin" aria-hidden="true">
            {i + 1}
          </span>
          {note.text}
        </li>
      ))}
    </ol>
  );
}

/**
 * "How I write code": a real excerpt per language from the repos on this page, with numbered notes on the
 * decisions in it. The numbers sit in the code's margin; hovering a note highlights its lines.
 */
export function CodeTour() {
  const id = useId();
  const [current, setCurrent] = useState(0);
  const [lit, setLit] = useState<CodeNote | null>(null);
  const sample = CODE_SAMPLES[current];
  if (!sample) {
    return null;
  }
  const select = (index: number) => {
    setCurrent(index);
    setLit(null);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = TAB_KEYS[event.key];
    if (!move) {
      return;
    }
    event.preventDefault();
    const next = move(current, CODE_SAMPLES.length);
    select(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };
  return (
    <figure className="panel tour" aria-labelledby={`${id}-title`}>
      <div className="tour-head">
        <h2 id={`${id}-title`} className="tour-title">
          How I write code
        </h2>
        <div className="tour-tabs" role="tablist" aria-label="Language" onKeyDown={onKeyDown}>
          {CODE_SAMPLES.map((s, i) => (
            <button
              key={s.label}
              id={`${id}-tab-${i}`}
              type="button"
              role="tab"
              className="tour-tab"
              aria-selected={i === current}
              aria-controls={`${id}-panel`}
              tabIndex={i === current ? 0 : -1}
              onClick={() => select(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${current}`} className="tour-body">
        <Code sample={sample} lit={lit} />
        <Notes notes={sample.notes} setLit={setLit} />
      </div>
      <figcaption className="tour-foot">
        <code>
          {sample.repo}/{sample.path}
        </code>
        <a href={fileUrl(sample)} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </figcaption>
    </figure>
  );
}
