import { STACK } from "@/content/stack";
import { StackFocus } from "./stack-focus";

/** Every technology I use, one row per group. Each tile carries its note, for the caption and for screen readers. */
export function Stack() {
  return (
    <StackFocus>
      {STACK.map((group) => (
        <div key={group.name} className="stack-group">
          <h3 className="stack-group-name">{group.name}</h3>
          <ul className="stack-tiles">
            {group.items.map((item) => (
              <li key={item.name}>
                <button type="button" className="stack-tile" data-name={item.name} data-note={item.note}>
                  {item.name}
                  <span className="sr-only">. {item.note}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </StackFocus>
  );
}
