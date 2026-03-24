"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { ThreadMessage } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MAX_LEN = 4000;

export type ChatPerspective = "user" | "admin";

function mapDoc(id: string, data: Record<string, unknown>): ThreadMessage {
  const createdAt = data.createdAt;
  let date: Date | null = null;
  if (
    createdAt &&
    typeof createdAt === "object" &&
    "toDate" in createdAt &&
    typeof (createdAt as { toDate: () => Date }).toDate === "function"
  ) {
    date = (createdAt as { toDate: () => Date }).toDate();
  }
  const sender = data.sender === "admin" ? "admin" : "user";
  return {
    id,
    text: typeof data.text === "string" ? data.text : "",
    sender,
    createdAt: date,
  };
}

function isOutgoing(perspective: ChatPerspective, sender: ThreadMessage["sender"]) {
  return (
    (perspective === "user" && sender === "user") ||
    (perspective === "admin" && sender === "admin")
  );
}

interface ThreadChatProps {
  threadUserId: string;
  perspective: ChatPerspective;
  title: string;
  subtitle?: string;
}

export function ThreadChat({
  threadUserId,
  perspective,
  title,
  subtitle,
}: ThreadChatProps) {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatError, setChatError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(getDb(), "users", threadUserId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setChatError(null);
        const next: ThreadMessage[] = [];
        snap.forEach((d) => {
          next.push(mapDoc(d.id, d.data() as Record<string, unknown>));
        });
        setMessages(next);
        setChatLoading(false);
      },
      () => {
        setChatError(
          "Не удалось загрузить чат. Убедитесь, что в Firestore разрешён доступ для администратора (см. firestore.rules в репозитории)."
        );
        setChatLoading(false);
      }
    );
    return () => unsub();
  }, [threadUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    if (text.length > MAX_LEN) {
      setSendError(`Максимум ${MAX_LEN} символов.`);
      return;
    }
    setSendError(null);
    setSending(true);
    try {
      await addDoc(collection(getDb(), "users", threadUserId, "messages"), {
        text,
        sender: perspective === "admin" ? "admin" : "user",
        createdAt: serverTimestamp(),
      });
      setInput("");
    } catch {
      setSendError("Не удалось отправить сообщение.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[rgba(248,249,252,0.6)]">
      <div className="shrink-0 border-b border-[color:var(--border)] bg-white px-4 py-3">
        <h2 className="font-serif text-lg font-semibold text-[color:var(--foreground)]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-[color:var(--muted)]">{subtitle}</p>
        )}
      </div>

      <div
        ref={listRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {chatError ? (
          <p className="text-sm text-red-600" role="alert">
            {chatError}
          </p>
        ) : chatLoading ? (
          <p className="text-sm text-[color:var(--muted)]">Загрузка сообщений…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">
            Сообщений пока нет.
          </p>
        ) : (
          messages.map((m) => {
            const outgoing = isOutgoing(perspective, m.sender);
            return (
              <div
                key={m.id}
                className={cn("flex", outgoing ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg border px-3 py-2 text-sm leading-relaxed shadow-sm",
                    outgoing
                      ? "border-[color:rgba(27,58,107,0.2)] bg-[color:var(--primary)] text-white"
                      : "border-[color:var(--border)] bg-white text-[color:var(--foreground)]"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  {m.createdAt && (
                    <p
                      className={cn(
                        "mt-1 text-[10px] tabular-nums",
                        outgoing ? "text-white/70" : "text-[color:var(--muted)]"
                      )}
                    >
                      {m.createdAt.toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="shrink-0 border-t border-[color:var(--border)] bg-white p-3 md:p-4"
      >
        {sendError && (
          <p className="mb-2 text-xs text-red-600" role="alert">
            {sendError}
          </p>
        )}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите сообщение…"
            maxLength={MAX_LEN}
            className="flex-1"
            disabled={sending || !!chatError}
            aria-label="Текст сообщения"
          />
          <Button type="submit" disabled={sending || !input.trim() || !!chatError}>
            {sending ? "…" : "Отправить"}
          </Button>
        </div>
        <p className="mt-1 text-[10px] text-[color:var(--muted)]">
          Только текст, до {MAX_LEN} символов.
        </p>
      </form>
    </div>
  );
}
