import {COMMENT_BOX_SELECTOR} from "./selectors";
import {ContentRequest, InsertResponse} from "../types";
import {handleGetPost, insertComment} from "./utils";


let lastBox =  (document.activeElement as HTMLElement | null)?.closest<HTMLElement>(COMMENT_BOX_SELECTOR) ?? null;

document.addEventListener("focusin", (event) => {
  const target = event.target as HTMLElement | null;
  const box = target?.closest(COMMENT_BOX_SELECTOR) as HTMLElement | null;
  if (box) {
    lastBox = box;
  }
});


chrome.runtime.onMessage.addListener(
  (msg: ContentRequest, _sender, sendResponse) => {
    if (msg?.type === "getPost") {
      void handleGetPost(sendResponse,lastBox);
      return true;
    }
    if (msg?.type === "insert") {
      let ok = false;
      if (lastBox && lastBox.isConnected) {
        insertComment(lastBox, msg.text);
        ok = true;
      }
      sendResponse({ ok } satisfies InsertResponse);
      return;
    }
  },
);
