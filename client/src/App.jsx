"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Send } from "lucide-react";

export default function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("Message-key")
        : null;
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleOnChange = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem("Message-key", JSON.stringify(message));
  }, [message]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, loading]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const userMessage = text;
    setMessage((prev) => [...prev, { role: "user", content: userMessage }]);
    setText("");

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/chat", {
        message: userMessage,
      });
      setLoading(false);

      setMessage((prev) => [
        ...prev,
        { role: "assistant", content: response.data.message },
      ]);
    } catch (error) {
      setLoading(false);
      console.log(
        "Error",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-glow"></div>
                <div className="relative px-4 py-2 bg-black rounded-lg">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent font-mono animate-pulse">
                    IntraMind AI
                  </h1>
                </div>
              </div>
            </div>
            <div className="text-xs text-neutral-500">
              {/* {message.length} messages */}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
          {message.length === 0 && !loading && (
            <div className="flex items-center justify-center h-full py-20">
              <div className="text-center space-y-4 animate-fadeInUp">
                <div className="w-16 h-16 mx-auto relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-full blur opacity-50 animate-pulse"></div>
                  <div className="relative w-full h-full bg-neutral-900 rounded-full flex items-center justify-center border border-red-600/50">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-neutral-100">
                  Start a conversation
                </h2>
                <p className="text-neutral-400 max-w-sm">
                  Ask me anything. I'm here to help with your questions and
                  ideas.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          {message.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full animate-fadeInUp ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`max-w-2xl px-5 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white rounded-br-none shadow-lg shadow-red-600/20"
                    : "bg-neutral-800/50 text-neutral-100 border border-neutral-700/50 rounded-bl-none"
                }`}
              >
                <p className="text-base leading-relaxed break-words">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-start animate-slideInLeft">
              <div className="max-w-2xl px-5 py-4 rounded-2xl rounded-bl-none bg-neutral-800/50 border border-neutral-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-typing"></div>
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-typing"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-typing"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-md py-4">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="relative group">
            {/* Glow effect background */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>

            {/* Input wrapper */}
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-3xl shadow-xl transition-all duration-300 group-focus-within:border-red-600/50 group-focus-within:shadow-red-600/20 group-focus-within:shadow-lg ">
              <textarea
                className="w-full bg-transparent text-neutral-100 placeholder-neutral-500 resize-none outline-none p-4 pr-16 rounded-3xl text-base leading-relaxed max-h-32 font-medium overflow-hidden"
                value={text}
                onChange={handleOnChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
              />

              {/* Send Button */}
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || loading}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 ${
                  text.trim() && !loading
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/50 hover:shadow-red-600/75 hover:scale-105 active:scale-95"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          {/* Helper text */}
          <div className="text-xs text-neutral-500 mt-3 text-center">
            {text.trim() ? (
              <span>Press Enter to send • Shift + Enter for new line</span>
            ) : (
              <span>Type a message to begin</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
