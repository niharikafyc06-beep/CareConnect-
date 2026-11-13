
import { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User
} from "lucide-react";

import "./Chatbot.css";

const API_URL = "http://127.0.0.1:8000";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! Welcome to CareConnect. I'm your healthcare assistant. How can I help you today?"
    }
  ]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const question = message.trim();

    if (!question || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question }
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: question
          })
        }
      );

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const result = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          role: "bot",
          text: result.data.reply
        }
      ]);

    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "bot",
          text: "Unable to connect. Please check whether the CareConnect backend is running."
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="chat-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open chatbot"
        >
          <MessageCircle size={25} />
        </button>
      )}

      {isOpen && (
        <div className="chat-window">

          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-bot-icon">
                <Bot size={22} />
              </div>

              <div>
                <h3>CareConnect AI</h3>
                <span>Healthcare Assistant</span>
              </div>
            </div>

            <button
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={21} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`chat-message ${item.role}`}
              >
                <div className="message-avatar">
                  {item.role === "bot" ? (
                    <Bot size={17} />
                  ) : (
                    <User size={17} />
                  )}
                </div>

                <div className="message-text">
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-loading">
                CareConnect AI is typing...
              </div>
            )}
          </div>

          <form
            className="chat-input-area"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Ask your healthcare question..."
              maxLength={1500}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </form>

          <p className="chat-disclaimer">
            General information only. Not a medical diagnosis.
            For emergencies in India, call 112.
          </p>

        </div>
      )}
    </>
  );
}
