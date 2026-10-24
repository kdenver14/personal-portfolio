/**
 * The up-right arrow after a link that opens in a new tab, drawn as SVG: the ↗ character renders as a blue emoji
 * tile on iOS. It takes the link's colour and nudges up and right when the link is hovered.
 */
export function LinkArrow() {
  return (
    <svg className="link-arrow" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 9 9 3M4.5 3H9v4.5" />
    </svg>
  );
}
