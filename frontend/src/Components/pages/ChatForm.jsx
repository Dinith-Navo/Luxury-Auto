import React from 'react'

const ChatForm = ({chatHistory,setChatHistory,generateBotResponse}) => {
  const inputRef = React.useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if(!userMessage) return;
    inputRef.current.value = '';

    // Update chat history
    setChatHistory((history) => [...history,{role:"user",text:userMessage}]);
    //add a "Thinking ..."placeholder for the bot's response'
    setTimeout(() => {
      
      setChatHistory((history) => [...history,{role:"model",text:"Thinking..."}]);
    }, 600);
    //call the function to generate the bot's response
    generateBotResponse([...chatHistory,{role:"user",text:'Using the details provided above,please addrss this query :${userMessage}'}]);
  };
  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input type="text"placeholder="Message..."className="message-input"required/>
            <button type="submit" className="material-symbols-rounded">arrow_upward</button>
          </form>
  )
}

export default ChatForm;
