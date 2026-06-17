import { Message, PromptInput, Result} from "../types";

const DEFAULT_SYSTEM_PROMPT = [
  "You are writing a LinkedIn comment as the user.",
  "Read the post and respond to one specific point in it.",
  "Keep it to 1-2 sentences in a conversational, peer-to-peer tone.",
  "Add a genuine perspective, question, or small addition.",
  'Never use generic praise like "great post", "so true", or "insightful".',
  'Never open with "As a". No hashtags. No emoji unless the post itself is casual.',
  "Sound like a real person who actually read it.",
].join(" ");

export function buildMessages(input: PromptInput):Message[]{
    const parts: string[] = [];
    if (input.author) parts.push(`Post author: ${input.author}`);
    parts.push(`Post:\n${input.postText}`);
    if (input.hint) parts.push(`Specific steer for this comment: ${input.hint}`);
    const system = input.aboutMe ? `${DEFAULT_SYSTEM_PROMPT}\n\nWrite in this person's voice and from their perspective: ${input.aboutMe}` : DEFAULT_SYSTEM_PROMPT;

    return [
        { role: "system", content: system },
        { role: "user", content: parts.join("\n\n") },
    ];
}


export async function generate(messages: Message[]): Promise<Result> {

  let response: Response;
  try {
    response = await fetch(__ENDPOINT__, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${__OPENROUTER_KEY__}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: __MODEL__, messages }),
    });
  } catch {
    return { ok: false, error: { kind: "network", message: "Network error, check your connection." } };
  }

  if (response.status === 401) {
    return { ok: false, error: { kind: "auth", message: "Invalid API key." } };
  }
  if (response.status === 429) {
    return { ok: false, error: { kind: "rate_limit", message: "Rate limited, try again." } };
  }
  if (!response.ok) {
    return { ok: false, error: { kind: "server", message: "OpenRouter request failed." } };
  }

  let data: { choices?: { message?: { content?: string } }[] };
  try {
    data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
  } catch {
    return { ok: false, error: { kind: "server", message: "Malformed response from OpenRouter." } };
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return { ok: false, error: { kind: "empty", message: "No comment was generated." } };
  }

  return { ok: true, value: content };
}

