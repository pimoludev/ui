import { permanentRedirect } from "next/navigation";

// Preserve existing bookmarks; appearance now lives in the header.
export default function Themes() {
  permanentRedirect("/docs/theming");
}
