const CORNERS = ["tl", "tr", "bl", "br"] as const;

/** A dot grid fading out of all four page corners, with a ring of lit dots rippling outward. Decorative only. */
export function CornerDots() {
  return (
    <div aria-hidden="true">
      {CORNERS.map((corner) => (
        <div key={corner} className={`corner corner-${corner}`}>
          <div className="dots" />
          <div className="dots dots-lit" />
        </div>
      ))}
    </div>
  );
}
