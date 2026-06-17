export type Message = { role: "system" | "user"; content: string };

export interface PromptInput {
  postText: string;
  author?: string;
  hint?: string;
  aboutMe?: string;
}


export interface ExtractedPost {
  postText: string;
  author?: string;
}


export type ApiErrorKind = "auth" | "rate_limit" | "server" | "empty" | "network";

export interface ApiError {
  kind: ApiErrorKind;
  message: string;
}

export type Result = | { ok: true; value: string } | { ok: false; error: ApiError };

export interface GenerateRequest {
  type: "generate";
  postText: string;
  author?: string;
  hint?: string;
  aboutMe?: string;
}
export type GenerateResponse = Result;


export interface GetPostRequest {
  type: "getPost";
}
export type GetPostResponse = ExtractedPost | null;

export interface InsertRequest {
  type: "insert";
  text: string;
}
export type InsertResponse = { ok: boolean };

export type ContentRequest = GetPostRequest | InsertRequest;
