"use client";

import { type PointerEvent, type ReactNode, useState } from "react";
import { LANGUAGES } from "@/content/languages";
import { LOCATION, LOCATION_SHORT, TIME_ZONE_LABEL } from "@/content/profile";
import { stopCenter, stopDiameter } from "@/lib/transit";
import { HomeTime } from "./home-time";

const HOME = "home";
const STOP_IDS: readonly string[] = [HOME, ...LANGUAGES.map((language) => language.id)];
const IDLE_CAPTION = "Stops sized by each language's share of my code on GitHub. Point at one, or tap it.";
const EDGE = `${stopCenter(0, STOP_IDS.length)}%`;

function Caption({ active }: { active: string | null }) {
  if (active === HOME) {
    return (
      <>
        <b>{LOCATION}.</b> Home, east of Manila.
        <HomeTime prefix=" " suffix={` there now, ${TIME_ZONE_LABEL}.`} />
      </>
    );
  }
  const language = LANGUAGES.find((entry) => entry.id === active);
  if (!language) {
    return IDLE_CAPTION;
  }
  return (
    <>
      <b>{language.name}</b>
      <span className="route-share">{language.share}%</span> of my code on GitHub. {language.note}
    </>
  );
}

interface StopProps {
  id: string;
  name: string;
  sub: ReactNode;
  diameter?: number;
  isOn: boolean;
  onPick: (id: string) => void;
  onRelease: (id: string) => void;
}

/** A tap or keyboard focus picks a stop as surely as a mouse does; only a mouse picks on hover. */
function Stop({ id, name, sub, diameter, isOn, onPick, onRelease }: StopProps) {
  const ifMouse = (act: (id: string) => void) => (event: PointerEvent) => {
    if (event.pointerType === "mouse") act(id);
  };
  return (
    <button
      type="button"
      className={`route-stop${id === HOME ? " is-home" : ""}${isOn ? " is-on" : ""}`}
      onPointerEnter={ifMouse(onPick)}
      onPointerLeave={ifMouse(onRelease)}
      onFocus={() => onPick(id)}
      onBlur={() => onRelease(id)}
      onClick={() => onPick(id)}
    >
      <span className="route-track" aria-hidden="true">
        <span className="route-dot" style={diameter ? { width: diameter, height: diameter } : undefined} />
      </span>
      <span className="route-name">{name}</span>
      <span className="route-sub">{sub}</span>
    </button>
  );
}

/**
 * Home and the languages I write as stops on one blue line, each language sized by its share of my code. Every label
 * is in the HTML at load; pointing at, focusing or tapping a stop glides the train there and fills the caption.
 */
export function LanguageLine() {
  const [active, setActive] = useState<string | null>(null);
  const [train, setTrain] = useState(0);
  const pick = (id: string) => {
    setActive(id);
    setTrain(STOP_IDS.indexOf(id));
  };
  const release = (id: string) => setActive((current) => (current === id ? null : current));
  const stop = { onPick: pick, onRelease: release };
  return (
    <figure className="panel route" aria-label="Home and the languages I write, each sized by its share of my code">
      <div className="route-line">
        <span className="route-rail" style={{ left: EDGE, right: EDGE }} aria-hidden="true" />
        <Stop id={HOME} name={LOCATION_SHORT} sub={<HomeTime />} isOn={active === HOME} {...stop} />
        {LANGUAGES.map((language) => (
          <Stop
            key={language.id}
            id={language.id}
            name={language.name}
            sub={`${language.share}%`}
            diameter={stopDiameter(language.share)}
            isOn={active === language.id}
            {...stop}
          />
        ))}
        <span className="route-train" style={{ left: `${stopCenter(train, STOP_IDS.length)}%` }} aria-hidden="true" />
      </div>
      <figcaption className="route-caption" aria-live="polite">
        <Caption active={active} />
      </figcaption>
    </figure>
  );
}
