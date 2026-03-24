"use client";

import { ThreadChat } from "@/components/chat/ThreadChat";

interface DashboardChatProps {
  userId: string;
}

export function DashboardChat({ userId }: DashboardChatProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ThreadChat
        threadUserId={userId}
        perspective="user"
        title="Чат с EVFA"
        subtitle="Сообщения в реальном времени. Ответит специалист."
        userRequisitesDelayNote="Реквизиты оплаты в этом чате могут прийти с задержкой до 15 минут."
      />
    </div>
  );
}
