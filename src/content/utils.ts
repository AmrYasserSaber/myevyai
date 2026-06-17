import {
  AUTHOR_SELECTOR,
  EXPAND_BUTTON_SELECTOR,
  POST_CONTAINER_SELECTOR,
  POST_CONTAINER_SELECTORS,
  POST_TEXT_SELECTOR
} from "./selectors";
import {ExtractedPost, GetPostResponse} from "../types";


function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}


async function expandPost(box: HTMLElement): Promise<void> {
  const container = box.closest(POST_CONTAINER_SELECTOR);
  const btn = container?.querySelector<HTMLButtonElement>(
    '[data-testid="expandable-text-button"]',
  );
  if (btn) {
    btn.click();
    await new Promise((r) => setTimeout(r, 80));
    box.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}


export async function handleGetPost(
  sendResponse: (r: GetPostResponse) => void,
  lastBox : HTMLElement | null
): Promise<void> {
  if (!lastBox || !lastBox.isConnected) {
    console.log("[evyAi] getPost: no remembered comment box");
    sendResponse(null);
    return;
  }
  await expandPost(lastBox);
  const post = extractPost(lastBox);
  sendResponse(post);
}

export function extractPost(boxEl: HTMLElement): ExtractedPost | null {
  const container = boxEl.closest<HTMLElement>(POST_CONTAINER_SELECTORS);
  if (!container) return null;

  const postText = readText(container.querySelector<HTMLElement>(POST_TEXT_SELECTOR));
  if (!postText) return null;

  const author =
    normalize(
      container.querySelector<HTMLElement>(AUTHOR_SELECTOR)?.textContent ?? "",
    ) || undefined;

  return { postText, author };
}

function readText(el: HTMLElement | null): string {
  if (!el) return "";
  const clone = el.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll(EXPAND_BUTTON_SELECTOR)
    .forEach((b) => b.remove());
  return normalize(clone.textContent ?? "");
}


export function insertComment(box: HTMLElement, text: string): void {
  box.focus();
  document.execCommand("selectAll", false);   // select
  document.execCommand("insertText", false, text); // replaces
}
