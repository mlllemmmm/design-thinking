import React, { useMemo, useState } from "react";
import "../styles/health-chat.css";
import { API } from "../config";

function formatReply(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .trim();
}

export default function HealthChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Namaste! I am your Aarogya AI wellness assistant. Ask me about stress, digestion, sleep, daily routines, and gentle herbal support inspired by Ayurveda and acupressure.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setLoading(true);

    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();
      const baseReply =
        data.reply || "I am here to help with your wellness questions.";

      const botMessage = { sender: "bot", text: formatReply(baseReply) };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I am currently unable to connect to the assistant service. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-chat">
      <div className="health-chat-header">
        <h3>Aarogya AI Herbal Wellness Assistant</h3>
        <p>
          Ayurveda and acupressure inspired guidance for daily wellness support
        </p>
      </div>

      <div className="health-chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`health-chat-row ${msg.sender}`}>
            <div className={`health-chat-bubble ${msg.sender}`}>
              <span className="health-chat-label">
                {msg.sender === "user" ? "You" : "Aarogya AI"}
              </span>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="health-chat-row bot">
            <div className="health-chat-bubble bot">
              <span className="health-chat-label">Aarogya AI</span>
              <p>Thinking of the best herbal guidance for you...</p>
            </div>
          </div>
        )}
      </div>

      <div className="health-chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Ask about stress, sleep, digestion, herbs, or acupressure points..."
        />
        <button onClick={sendMessage} disabled={!canSend}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
