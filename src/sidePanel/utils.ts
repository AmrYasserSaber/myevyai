import {ApiErrorKind} from "../types";
import {genBtn, regenBtn, statusEl} from "./elements";



export function setBusy(busy: boolean): void {
  genBtn.disabled = busy;
  regenBtn.disabled = busy;
}

export function errorText(kind: ApiErrorKind): string {
  switch (kind) {
    case "auth":
      return "Invalid API key — check your .env and rebuild.";
    case "rate_limit":
      return "Rate limited — try again shortly.";
    case "empty":
      return "No comment generated — try again.";
    case "network":
      return "Network error — check your connection.";
    default:
      return "Something went wrong.";
  }
}


export function setStatus(text: string): void {
  statusEl.textContent = text;
}



