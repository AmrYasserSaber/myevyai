import {GenerateRequest, GenerateResponse} from "../types";
import {buildMessages, generate} from "./utils";


chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch(console.error);

chrome.runtime.onMessage.addListener((msg : GenerateRequest, _sender ,sendResponse:(r : GenerateResponse) => void ) => {
    const messages = buildMessages({
        postText: msg.postText,
        author: msg.author,
        hint: msg.hint,
        aboutMe: msg.aboutMe,
    });

    generate(messages)
        .then(sendResponse)
        .catch(() => sendResponse({ ok: false, error: { kind: "server", message: "Unexpected error." } }));
    return true;
})
