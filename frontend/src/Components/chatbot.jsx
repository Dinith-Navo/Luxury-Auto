import React, { useEffect, useRef, useState } from 'react';
import ChatbotIcon from './ChatbotIcon';
import ChatForm from './pages/ChatForm';
import ChatMessage from './ChatMessage';

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    // Helper function to update chat history
    const updateHistory = (text,isError=false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.role !== "thinking"), { role: 'model', text,isError }]);
    };

    // Ensure history is properly formatted
    history = history.map((item) => ({ role: item.role, parts: [{ text: item.text }] }));

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history }),
    };

    try {
      // Make the API call to get the bot's response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      const apiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1")?.trim() || "Sorry, I didn't understand that.";
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message,true);
    }
  };

  useEffect(() => {
    // Auto-scroll whenever chat history changes
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
      <button onClick={() => setShowChatbot(prev => !prev)} id='chatbot-toggler'>
        <span className='material-symbols-rounded'>mode_comment</span>
        <span className='material-symbols-rounded'>close</span>
      </button>
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)} className="meterial-symbols-rounded">keyboard_arrow_down

          </button>
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
            generateBotResponse={generateBotResponse} 
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
