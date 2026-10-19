import { LAST_REVISED, NAME } from "@/content/profile";
import { formatMonth, formatYear } from "@/lib/format";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>
        © {formatYear(LAST_REVISED)} {NAME}
      </span>
      <span>Updated {formatMonth(LAST_REVISED)}</span>
    </footer>
  );
}
