import type { ReactNode } from "react";

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="section" aria-labelledby={id}>
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {children}
    </section>
  );
}
