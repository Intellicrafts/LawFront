import React, { useState, useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";

const API_BASE = "https://bakilchatapp-27296519338.asia-southeast1.run.app";
const USER_ID = "aman";
const SESSION_ID = "hashstring48";

const VirtualBakil = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseAPIResponse = (rawText) => {
    try {
      const lines = rawText.trim().split("\n");
      for (let line of lines) {
        if (line.startsWith("data: ")) {
          const jsonString = line.replace("data: ", "").trim();
          const json = JSON.parse(jsonString);
          return json?.content?.parts?.[0]?.text || "No response content.";
        }
      }
      return "No valid response found.";
    } catch (error) {
      return "Error parsing response.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Step 1: Create or update session
      await fetch(
        `${API_BASE}/apps/agents/users/${USER_ID}/sessions/${SESSION_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state: {
              preferred_language: "English",
              visit_count: 5,
            },
          }),
        }
      );

      // Step 2: Send message
      const response = await fetch(`${API_BASE}/run_sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          app_name: "agents",
          user_id: USER_ID,
          session_id: SESSION_ID,
          new_message: {
            role: "user",
            parts: [{ text: userMessage.text }],
          },
          streaming: false,
        }),
      });

      const rawText = await response.text();
      const parsedText = parseAPIResponse(rawText);

      const botMessage = { role: "bot", text: parsedText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pt-28 pb-10 px-4 w-full max-w-4xl mx-auto">
      <div className="bg-white shadow-2xl rounded-2xl border border-gray-200 p-6 h-[75vh] flex flex-col">
        {/* Message List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-3 rounded-xl text-sm md:text-base max-w-[80%] whitespace-pre-wrap break-words ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900 border border-gray-300"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-xl text-gray-800 text-sm animate-pulse">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4 flex items-center gap-3">
          <textarea
            className="flex-1 resize-none border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            rows={2}
            placeholder="Ask your legal question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition duration-200 disabled:opacity-50"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Typing Animation Component
const TypingDots = () => {
  return (
    <span className="flex space-x-1">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
    </span>
  );
};

export default VirtualBakil;
