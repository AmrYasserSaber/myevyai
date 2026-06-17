import {errorText, setBusy, setStatus} from "./utils";
import {aboutEl, draftEl, genBtn, hintEl, includeEl, insertBtn, regenBtn, saveLink} from "./elements";
import {GenerateRequest, GenerateResponse, GetPostResponse, InsertResponse} from "../types";


export async function run(): Promise<void> {
  const tabId = await activeTabId();
  if (tabId == null) return setStatus("No active tab.");

  let post: GetPostResponse;
  try {
    post = await chrome.tabs.sendMessage(tabId, { type: "getPost" });
  } catch {
    return setStatus("Open a LinkedIn feed tab and click into a comment box first.");
  }
  if (!post) return setStatus("Click into a post's comment box on LinkedIn first.");

  setBusy(true);
  setStatus("Generating…");

  const request: GenerateRequest = {
    type: "generate",
    postText: post.postText,
    author: post.author,
    hint: hintEl.value.trim() || undefined,
    aboutMe: includeEl.checked && aboutEl.value.trim() ? aboutEl.value.trim() : undefined,
  };

  let res: GenerateResponse | undefined;
  try {
    res = await chrome.runtime.sendMessage(request);
  } catch {
    setBusy(false);
    return setStatus("Couldn't reach the generator — reload the extension and try again.");
  } finally {
    setBusy(false);
  }

  if (!res) {
    return setStatus("No response from the generator — reload the extension and try again.");
  }

  if (res.ok) {
    draftEl.value = res.value;
    setStatus(`Drafted${post.author ? ` for ${post.author}` : ""}.`);
  } else {
    setStatus(errorText(res.error.kind));
  }
}

async function activeTabId(): Promise<number | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
}

export async function insert(): Promise<void> {
  const text = draftEl.value.trim();
  if (!text) return setStatus("Nothing to insert.");

  const tabId = await activeTabId();
  if (tabId == null) return;

  try {
    const r: InsertResponse = await chrome.tabs.sendMessage(tabId, { type: "insert", text });
    setStatus(r?.ok ? "Inserted — edit & post on LinkedIn." : "Click into the comment box again, then Insert.");
  } catch {
    setStatus("Couldn't reach the page — reload LinkedIn.");
  }
}
void chrome.storage.local.get(["aboutMe", "includeAbout"]).then((s) => {
  aboutEl.value = s["aboutMe"] ?? "";
  includeEl.checked = s["includeAbout"] ?? false;
});

saveLink.addEventListener("click", (e) => {
  e.preventDefault();
  void chrome.storage.local.set({ ["aboutMe"]: aboutEl.value });
  setStatus("Saved as default.");
});

includeEl.addEventListener("change", () => {
  void chrome.storage.local.set({ ["includeAbout"]: includeEl.checked });
});

genBtn.addEventListener("click", () => void run());
regenBtn.addEventListener("click", () => void run());
insertBtn.addEventListener("click", () => void insert());
