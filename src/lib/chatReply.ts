/**
 * Pure keyword matcher for the "Meet Your AI Assistant" chat.
 * Shared by the browser (offline fallback) and the Node API (POST /api/chat),
 * so it must stay free of React, DOM and browser-only APIs.
 */
import { CHAT_FALLBACK, CHAT_RESPONSES } from "../data/content.ts";

export interface ChatReply {
  /** Text the assistant shows. */
  reply: string;
  /** Stable topic id, e.g. "pricing"; "fallback" when nothing matched. */
  topic: string;
  /** Whether a predefined response group matched the message. */
  matched: boolean;
  /** Page section anchor (e.g. "#pricing") related to the topic, when there is one. */
  section?: string;
}

/** Topic ids keyed by each response group's first keyword. */
const TOPIC_BY_FIRST_KEYWORD: Readonly<Record<string, string>> = {
  service: "services",
  pricing: "pricing",
  "how it works": "how-it-works",
  support: "support",
  integration: "integrations",
  automation: "automation",
};

/** Section anchors for the topics that have a matching landing-page section. */
const SECTION_BY_TOPIC: Readonly<Record<string, string>> = {
  services: "#services",
  pricing: "#pricing",
  "how-it-works": "#about",
  support: "#contact",
};

function topicFor(keywords: readonly string[]): string {
  const first = keywords[0] ?? "";
  return TOPIC_BY_FIRST_KEYWORD[first] ?? first.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Finds the predefined reply for a user message; falls back gracefully. */
export function findReply(text: string): ChatReply {
  const lower = text.toLowerCase();
  if (lower.trim()) {
    for (const group of CHAT_RESPONSES) {
      if (group.keywords.some((k) => lower.includes(k.toLowerCase()))) {
        const topic = topicFor(group.keywords);
        const section = SECTION_BY_TOPIC[topic];
        return section
          ? { reply: group.reply, topic, matched: true, section }
          : { reply: group.reply, topic, matched: true };
      }
    }
  }
  return { reply: CHAT_FALLBACK, topic: "fallback", matched: false };
}
