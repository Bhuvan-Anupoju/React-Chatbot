import { useState, useEffect, useRef } from "react";
import { chatbot } from "supersimpledev";
import "./App.css";
import RobotProfileImage from "./assets/robot.png";
import UserProfileImage from "./assets/user.png";
import LoadingSpinner from "./assets/loading-spinner.gif";

function ChatInput({ chatMessages, setChatMessages }) {
  const [inputText, setInputText] = useState("");
  function saveInputText(event) {
    setInputText(event.target.value);
  }
  async function sendMessage() {
    setInputText("");
    const newChatMessages = [
      ...chatMessages,
      {
        message: inputText,
        sender: "user",
        id: crypto.randomUUID(),
      },
    ];
    setChatMessages([
      ...newChatMessages,
      {
        message: <img src={LoadingSpinner} className="loading-spinner" />,
        sender: "robot",
        id: crypto.randomUUID(),
      },
    ]);
    const response = await chatbot.getResponseAsync(inputText);
    setChatMessages([
      ...newChatMessages,
      {
        message: response,
        sender: "robot",
        id: crypto.randomUUID(),
      },
    ]);
  }
  return (
    <div className="chat-input-container">
      <input
        placeholder="Ask ChatBot"
        size="30"
        onChange={saveInputText}
        value={inputText}
        className="chat-input"
      />
      <button onClick={sendMessage} className="send-button">
        Send
      </button>
    </div>
  );
}
function ChatMessage({ message, sender }) {
  return (
    <div
      className={sender === "user" ? "chat-message-user" : "chat-message-robot"}
    >
      {sender === "robot" && (
        <img src={RobotProfileImage} className="chat-message-profile" />
      )}
      <div className="chat-message-text"> {message}</div>

      {sender === "user" && (
        <img src={UserProfileImage} className="chat-message-profile" />
      )}
    </div>
  );
}
function ChatMessages({ chatMessages }) {
  const chatMessagesRef = useRef(null);
  useEffect(() => {
    const containerElem = chatMessagesRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [chatMessages]);
  return (
    <div className="Chat-messages-container" ref={chatMessagesRef}>
      {chatMessages.map((chatMessage) => {
        return (
          <ChatMessage
            message={chatMessage.message}
            sender={chatMessage.sender}
            key={chatMessage.id}
          />
        );
      })}
    </div>
  );
}

function App() {
  const [chatMessages, setChatMessages] = useState([]);

  return (
    <div className="app-container">
      {chatMessages.length === 0 && (
        <p>
          Welcome to the chatbot project! Send a message using the textbox below
        </p>
      )}
      <ChatMessages chatMessages={chatMessages} />
      <ChatInput
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />
    </div>
  );
}

export default App;
