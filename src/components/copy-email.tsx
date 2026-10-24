"use client";

import { useEffect, useState } from "react";
import { EMAIL } from "@/content/profile";

const CONFIRM_MS = 1600;

type CopyState = "idle" | "copied" | "failed";

const LABEL: Record<CopyState, string> = { idle: "Copy", copied: "Copied", failed: "Couldn't copy" };
const ANNOUNCEMENT: Record<CopyState, string> = {
  idle: "",
  copied: "Email address copied",
  failed: "Couldn't copy the email address",
};

/** Copies the email address and says so for a moment, for visitors with no mail app set up for mailto links. */
export function CopyEmail() {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), CONFIRM_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  // Started inside a promise so a missing Clipboard API (an insecure context) lands in the failure branch too.
  const copy = () => {
    Promise.resolve()
      .then(() => navigator.clipboard.writeText(EMAIL))
      .then(
        () => setState("copied"),
        () => setState("failed"),
      );
  };

  return (
    <>
      <button type="button" className={`copy-email${state === "copied" ? " is-done" : ""}`} onClick={copy}>
        {LABEL[state]}
      </button>
      <span className="sr-only" role="status">
        {ANNOUNCEMENT[state]}
      </span>
    </>
  );
}
