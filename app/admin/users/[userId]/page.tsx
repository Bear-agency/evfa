"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { ThreadChat } from "@/components/chat/ThreadChat";
import { Button } from "@/components/ui/button";

export default function AdminUserChatPage() {
  const params = useParams();
  const userId = typeof params.userId === "string" ? params.userId : "";
  const [titleName, setTitleName] = useState<string>("");

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const snap = await getDoc(doc(getDb(), "users", userId));
      if (cancelled || !snap.exists()) return;
      const data = snap.data() as {
        registration?: {
          surname?: string;
          name?: string;
          patronymic?: string;
        };
        role?: string;
      };
      if (data.role === "admin") {
        setTitleName("Администратор");
        return;
      }
      const r = data.registration;
      const name =
        [r?.surname, r?.name, r?.patronymic].filter(Boolean).join(" ").trim() ||
        "Заявитель";
      setTitleName(name);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!userId) {
    return (
      <p className="text-sm text-red-400">Некорректная ссылка.</p>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="adminPanel" size="sm">
          <Link href="/admin">← К списку</Link>
        </Button>
        <div>
          <h1 className="font-serif text-lg font-semibold text-[#F5F0E8] md:text-xl">
            Чат: {titleName || "…"}
          </h1>
          <p className="text-xs text-[rgba(245,240,232,0.45)]">{userId}</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-[rgba(184,137,26,0.25)] bg-white">
        <ThreadChat
          threadUserId={userId}
          perspective="admin"
          title={titleName ? `Переписка с ${titleName}` : "Переписка"}
          subtitle="Сообщения заявителя слева, ваши ответы справа."
        />
      </div>
    </div>
  );
}
