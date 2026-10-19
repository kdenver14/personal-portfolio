import type { Listing } from "@/domain/datasheet";
import { splitComment } from "@/lib/highlight";

export function CodeListing({ listing }: { listing: Listing }) {
  const lines = listing.source.split("\n");
  return (
    <figure className="panel listing">
      <figcaption className="listing-head">
        <code>{listing.caption}</code>
        <a href={listing.href} target="_blank" rel="noopener noreferrer">
          View file
        </a>
      </figcaption>
      <pre className="listing-body">
        <code>
          {lines.map((line, i) => {
            const { code, comment } = splitComment(line, listing.language);
            return (
              <span key={i} className="listing-line">
                {code}
                {comment ? <span className="listing-comment">{comment}</span> : null}
                {"\n"}
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
