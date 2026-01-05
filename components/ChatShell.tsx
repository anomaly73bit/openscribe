"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import ChatView from "./ChatView";
import TopBar from "./TopBar";

type ModelItem = { id: string; label: string; tier: "FREE" | "PRO"; locked: boolean };

export default function ChatShell() {
  const [models, setModels] = useState<ModelItem[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("FREE");
  const [selectedModel, setSelectedModel] = useState<string>("openai/gpt-4o-mini");

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/models");
      const json = await res.json();
      setModels(json.models);
      setSubscriptionStatus(json.subscriptionStatus);

      const firstUnlocked = json.models.find((m: ModelItem) => !m.locked)?.id;
      if (firstUnlocked) setSelectedModel(firstUnlocked);
    })();
  }, []);

  const lockedSelected = useMemo(() => {
    const m = models.find(x => x.id === selectedModel);
    return m?.locked ?? false;
  }, [models, selectedModel]);

  return (
    <div className="min-h-screen flex">
      <Sidebar
        subscriptionStatus={subscriptionStatus}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        onNewChat={() => {
          setChatId(null);
          setMessages([]);
        }}
      />

      <div className="flex-1 flex flex-col">
        <TopBar subscriptionStatus={subscriptionStatus} />
        <ChatView
          chatId={chatId}
          setChatId={setChatId}
          model={selectedModel}
          modelLocked={lockedSelected}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}
