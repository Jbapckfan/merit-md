"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Message {
  id?: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface CaseData {
  id: string;
  client_name: string | null;
  case_summary: string;
  status: string;
  score: number | null;
  report_json: string | null;
}

const SUGGESTED_QUESTIONS = [
  "What would a strong expert witness say about the key findings?",
  "How would defense argue this was within standard of care?",
  "What are the strongest deposition questions for the treating physician?",
  "What additional records should I request?",
  "What are the weakest points in this case?",
  "How does the standard of care apply to the specific deviations found?",
];

export default function CaseChatPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load case data and chat history
  useEffect(() => {
    async function loadData() {
      try {
        // Load case data
        const caseRes = await fetch(`/api/analyze?id=${caseId}`);
        if (caseRes.status === 401) {
          router.push("/login");
          return;
        }
        if (!caseRes.ok) throw new Error("Failed to load case");
        const caseJson = await caseRes.json();
        setCaseData(caseJson.caseData);

        // Load chat history
        const chatRes = await fetch(`/api/chat?caseId=${caseId}`);
        if (chatRes.ok) {
          const chatJson = await chatRes.json();
          setMessages(chatJson.messages || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load case");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [caseId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || sending) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, message: text.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(errData.error || "Request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              // Stream complete — finalize the message
              if (accumulated) {
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: accumulated },
                ]);
                setStreamingText("");
              }
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setStreamingText(accumulated);
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              if (e instanceof Error && e.message !== "Request failed") {
                // Ignore JSON parse errors on partial chunks
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      // Remove optimistic user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }, [caseId, sending]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleExportConversation = () => {
    const allMessages = [...messages];
    let exportText = `# Merit-MD Case Q&A Export\n`;
    exportText += `# Case: ${caseData?.client_name || caseId}\n`;
    exportText += `# Exported: ${new Date().toLocaleString()}\n\n`;

    for (const msg of allMessages) {
      const label = msg.role === "user" ? "ATTORNEY" : "CONSULTANT";
      exportText += `## ${label}\n${msg.content}\n\n---\n\n`;
    }

    const blob = new Blob([exportText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `merit-md-qa-${caseId.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <>
        <Header isLoggedIn />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="text-merit-text-muted">Loading...</div>
        </main>
      </>
    );
  }

  if (error && !caseData) {
    return (
      <>
        <Header isLoggedIn />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="text-merit-danger">{error}</div>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-merit-accent hover:text-merit-accent-hover transition text-sm"
          >
            Back to Dashboard
          </button>
        </main>
      </>
    );
  }

  if (caseData?.status !== "complete") {
    return (
      <>
        <Header isLoggedIn />
        <main className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="text-merit-text-muted">Case analysis must be complete before using Q&A.</div>
          <button
            onClick={() => router.push(`/case/${caseId}`)}
            className="mt-4 text-merit-accent hover:text-merit-accent-hover transition text-sm"
          >
            Back to Report
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Header isLoggedIn />
      <main className="max-w-4xl mx-auto px-6 py-6 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={() => router.push(`/case/${caseId}`)}
                className="text-merit-text-muted hover:text-merit-text transition text-sm"
              >
                Report
              </button>
              <span className="text-merit-text-muted/40">/</span>
              <span className="text-merit-text text-sm">Case Q&A</span>
            </div>
            <h1 className="text-xl font-bold">
              {caseData?.client_name
                ? `${caseData.client_name} — Q&A`
                : "Case Q&A"}
            </h1>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleExportConversation}
              className="bg-merit-card border border-merit-border hover:border-merit-border-hover text-merit-text px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export
            </button>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
          {messages.length === 0 && !streamingText && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-merit-accent/10 border border-merit-accent/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-merit-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">Ask About This Case</h2>
              <p className="text-merit-text-muted text-sm mb-8 max-w-md mx-auto">
                Get expert-level analysis on any aspect of this case. Ask about expert witnesses,
                deposition strategy, standard of care, or anything else.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-left bg-merit-card border border-merit-border hover:border-merit-accent/40 rounded-xl px-4 py-3 text-sm text-merit-text-muted hover:text-merit-text transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={msg.id || i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.role === "user"
                    ? "bg-merit-accent/15 border border-merit-accent/30 text-merit-text"
                    : "bg-merit-card border border-merit-border text-merit-text"
                }`}
              >
                <div className="text-xs font-medium uppercase tracking-wider mb-1.5 text-merit-text-muted">
                  {msg.role === "user" ? "You" : "Consultant"}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Streaming message */}
          {streamingText && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-5 py-3 bg-merit-card border border-merit-border text-merit-text">
                <div className="text-xs font-medium uppercase tracking-wider mb-1.5 text-merit-text-muted">
                  Consultant
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {streamingText}
                  <span className="inline-block w-1.5 h-4 bg-merit-accent/60 ml-0.5 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {sending && !streamingText && (
            <div className="flex justify-start">
              <div className="bg-merit-card border border-merit-border rounded-2xl px-5 py-3">
                <div className="text-xs font-medium uppercase tracking-wider mb-1.5 text-merit-text-muted">
                  Consultant
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-merit-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-merit-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-merit-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-center">
              <div className="inline-block bg-merit-danger/10 border border-merit-danger/30 text-merit-danger text-sm px-4 py-2 rounded-xl">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-merit-border pt-4 pb-2">
          <div className="flex gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about this case..."
              className="flex-1 bg-merit-card border border-merit-border rounded-xl px-4 py-3 text-sm text-merit-text placeholder-merit-text-muted/50 resize-none focus:border-merit-accent/50 transition"
              rows={2}
              disabled={sending}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || sending}
              className="self-end bg-merit-accent hover:bg-merit-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-medium transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Send
            </button>
          </div>
          <p className="text-xs text-merit-text-muted/50 mt-2 text-center">
            AI-assisted analysis for legal research purposes. Not a substitute for formal expert opinion.
          </p>
        </div>
      </main>
    </>
  );
}
