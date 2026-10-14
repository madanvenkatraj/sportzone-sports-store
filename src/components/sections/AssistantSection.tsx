import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User, Zap, Clock, Workflow, Languages } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, Button, SectionHeading } from "../ui/shared";
import {
  CHAT_WELCOME,
  CHAT_SUGGESTIONS,
  ASSISTANT_CAPABILITIES,
  ASSISTANT_FEATURES,
} from "../../data/content";
import { useReveal } from "../../hooks/useReveal";
import { findReply } from "../../lib/chatReply.ts";
import type { ChatReply } from "../../lib/chatReply.ts";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
}

type Connection = "unknown" | "online" | "offline";

const CAP_ICONS: LucideIcon[] = [Zap, Clock, Workflow, Languages];
const MIN_TYPING_MS = 600;
const MAX_MESSAGE_LENGTH = 500;

/** Narrows the API's { data: {...} } payload to a ChatReply, or null if malformed. */
function parseChatResponse(json: unknown): ChatReply | null {
  if (typeof json !== "object" || json === null || !("data" in json)) return null;
  const data: unknown = json.data;
  if (typeof data !== "object" || data === null) return null;
  if (!("reply" in data) || typeof data.reply !== "string") return null;
  const topic = "topic" in data && typeof data.topic === "string" ? data.topic : "unknown";
  const matched = "matched" in data && data.matched === true;
  const section = "section" in data && typeof data.section === "string" ? data.section : undefined;
  return section ? { reply: data.reply, topic, matched, section } : { reply: data.reply, topic, matched };
}

/** Asks the Nexora API for a reply; throws on network errors, non-2xx (incl. 429) or a bad payload. */
async function fetchReply(text: string, signal: AbortSignal): Promise<ChatReply> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text }),
    signal,
  });
  if (!res.ok) throw new Error(`Chat API responded ${res.status}`);
  const parsed = parseChatResponse(await res.json());
  if (!parsed) throw new Error("Chat API returned an unexpected payload");
  return parsed;
}

function wait(ms: number, timers: number[]): Promise<void> {
  return new Promise((resolve) => {
    timers.push(window.setTimeout(resolve, ms));
  });
}

function ReplyBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-grad"
        aria-hidden="true"
      >
        <Bot className="h-4 w-4 text-white" />
      </span>
      <div
        data-testid="chat-message"
        className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-700 shadow-card">
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5" aria-label="Assistant is typing">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-grad"
        aria-hidden="true"
      >
        <Bot className="h-4 w-4 text-white" />
      </span>
      <div className="flex gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3.5 shadow-card">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot h-2 w-2 rounded-full bg-violet"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AssistantSection() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.05);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: CHAT_WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [connection, setConnection] = useState<Connection>("unknown");
  const listRef = useRef<HTMLDivElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Auto-scroll to the newest message
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Clear pending typing timers and abort any in-flight request on unmount (risk area 1)
  useEffect(() => {
    mountedRef.current = true;
    const timers = timersRef.current;
    return () => {
      mountedRef.current = false;
      timers.forEach((t) => window.clearTimeout(t));
      abortRef.current?.abort();
    };
  }, []);

  const send = useCallback(
    async (raw: string, href?: string) => {
      const text = raw.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!text || typing) return;
      setInput("");
      setMessages((m) => [...m, { id: Date.now(), from: "user", text }]);
      setTyping(true);

      const controller = new AbortController();
      abortRef.current = controller;
      const minDelay = wait(MIN_TYPING_MS, timersRef.current);
      let result: ChatReply;
      let online: boolean;
      try {
        result = await fetchReply(text, controller.signal);
        online = true;
      } catch {
        if (controller.signal.aborted) return; // unmounted
        result = findReply(text); // never break the chat: use built-in answers
        online = false;
      }
      await minDelay;
      if (!mountedRef.current) return;

      setTyping(false);
      setConnection(online ? "online" : "offline");
      setMessages((m) => [...m, { id: Date.now() + 1, from: "bot", text: result.reply }]);
      // Chips smooth-scroll to their section after the reply lands; typed messages stay put.
      if (href) {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [typing]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onChipClick = (e: React.MouseEvent<HTMLButtonElement>, href: string, trigger: string) => {
    e.preventDefault();
    void send(trigger, href);
  };

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="AI Assistant"
          title="Meet Your AI Assistant"
          description="Ask it anything about Nexora — it answers instantly and takes you exactly where you need to go."
        />

        <div ref={ref} className={`grid gap-10 lg:grid-cols-5 ${visible ? "reveal-visible" : "reveal-hidden"}`}>
          {/* Chat panel — glowing gradient border */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-brand-grad p-[2px] shadow-lift">
              <div className="flex h-[540px] flex-col rounded-[calc(1.5rem-2px)] bg-white">
                {/* chat header */}
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-4 rounded-t-[calc(1.5rem-2px)]">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-grad">
                    <Bot className="h-5 w-5 text-white" aria-hidden="true" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-900">Nexora Assistant</p>
                    <p className="text-xs text-emerald-600 font-medium">Online — replies instantly</p>
                  </div>
                </div>

                {/* messages */}
                <div
                  ref={listRef}
                  className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
                  role="log"
                  aria-live="polite"
                  aria-label="Chat messages"
                >
                  {messages.map((m) =>
                    m.from === "bot" ? (
                      <ReplyBubble key={m.id} text={m.text} />
                    ) : (
                      <div key={m.id} className="flex items-start justify-end gap-2.5">
                        <div
                          data-testid="chat-message"
                          className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-grad px-4 py-2.5 text-sm leading-relaxed text-white shadow-lift">
                          {m.text}
                        </div>
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800"
                          aria-hidden="true"
                        >
                          <User className="h-4 w-4 text-white" />
                        </span>
                      </div>
                    )
                  )}
                  {typing && <TypingBubble />}
                </div>

                {/* suggestion chips */}
                <div className="flex flex-wrap gap-2 px-5 pb-3">
                  {CHAT_SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      disabled={typing}
                      onClick={(e) => onChipClick(e, s.href, s.trigger)}
                      className="rounded-full border border-violet/30 bg-violet/5 px-3.5 py-1.5 text-xs font-semibold text-violet transition-all duration-200 hover:bg-brand-grad hover:text-white hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* input */}
                <form onSubmit={onSubmit} className="flex gap-2 border-t border-slate-100 p-4">
                  <label htmlFor="chat-input" className="sr-only">
                    Type your message
                  </label>
                  <input
                    id="chat-input"
                    data-testid="chat-input"
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about services, pricing…"
                    className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:border-violet focus:outline-none focus:ring-2 focus:ring-violet/20"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    data-testid="chat-send"
                    aria-label="Send message"
                    disabled={!input.trim() || typing}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-grad text-white shadow-lift transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Live preview card */}
          <aside className="lg:col-span-2" aria-label="Assistant capabilities preview">
            <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-7 shadow-card">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Live Preview
              </span>
              <h3 className="mt-4 text-xl font-bold text-navy-900">What the assistant can do</h3>
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {ASSISTANT_CAPABILITIES.map((c, i) => {
                  const Icon = CAP_ICONS[i % CAP_ICONS.length];
                  return (
                    <div
                      key={c.label}
                      className="rounded-2xl bg-slate-50 p-4 text-center transition-transform duration-200 hover:-translate-y-1"
                    >
                      <Icon className="mx-auto h-5 w-5 text-violet" aria-hidden="true" />
                      <dt className="mt-2 text-lg font-extrabold text-navy-900">{c.value}</dt>
                      <dd className="text-xs font-medium text-slate-500">{c.label}</dd>
                    </div>
                  );
                })}
              </dl>
              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                {ASSISTANT_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-grad" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <p
                data-testid="chat-status"
                role="status"
                className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    connection === "online" ? "bg-emerald-500" : connection === "offline" ? "bg-amber-500" : "bg-slate-300"
                  }`}
                  aria-hidden="true"
                />
                {connection === "online"
                  ? "Connected to Nexora API"
                  : connection === "offline"
                    ? "Offline mode: showing built-in answers"
                    : "Answers come from the Nexora API, with built-in answers as a backup."}
              </p>
            </div>
          </aside>
        </div>

        {/* CTA below the section */}
        <div className="mt-14 text-center">
          <Button href="#contact" variant="primary" className="text-base">
            Experience the Future of AI
          </Button>
        </div>
      </Container>
    </section>
  );
}
