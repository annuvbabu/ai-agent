import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userMessage
      }
    ]);

    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: data.reply
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "Server Error"
        }
      ]);
    }
  };

  return (
    <div className="app">

      <div className="header">
        AI Agent
      </div>

      <div className="chat-container">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`message ${msg.sender}`}
          >
            {msg.text}
          </div>

        ))}

        <div ref={bottomRef}></div>

      </div>

      <div className="input-container">

        <textarea
          value={message}
          placeholder="Message AI Agent..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>
  );
}

export default App;