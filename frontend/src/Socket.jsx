// socketContext.js
import { createContext, useContext, useMemo } from 'react';
import io from 'socket.io-client';

// 1. Create context
const SocketContext = createContext(null);

// 2. Provider component
const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    const socketInstance = io('http://localhost:8000', {
      withCredentials: true,
    });
    return socketInstance;

  
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// 3. Custom hook to use socket
const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketProvider, useSocket };

/*
const socket = io("http://localhost:5000", {
  withCredentials: true,
  auth: {
    token: localStorage.getItem("token"), // if using auth
  },
});

export default function useSocketEvents() {
  const chats = useSelector(selectUserChats); // array of user's chat objects

  useEffect(() => {
    // When connected, emit JOIN_CHATS with all chatIds
    socket.on("connect", () => {
      const chatIds = chats.map(chat => chat._id);
      socket.emit("JOIN_CHATS", chatIds);
    });

    return () => {
      socket.disconnect();
    };
  }, [chats]); // whenever chats change (like after login), re-emit
}
💬 2. Send a Message
ts
Copy
Edit
function sendMessage(chatId, message) {
  socket.emit("NEW_MESSAGE", {
    chatId,
    message,
  });
}
⌨️ 3. Typing Indicators
ts
Copy
Edit
function startTyping(chatId) {
  socket.emit("START_TYPING", { chatId });
}

function stopTyping(chatId) {
  socket.emit("STOP_TYPING", { chatId });
}
📩 4. Listen for Incoming Events
ts
Copy
Edit
useEffect(() => {
  socket.on("NEW_MESSAGE", ({ chatId, message }) => {
    // dispatch to Redux, update UI, show notification, etc.
    console.log("New message", chatId, message);
  });

  socket.on("NEW_MESSAGE_ALERT", ({ chatId }) => {
    // Maybe show a red dot or update unread count
    console.log("Alert for chat:", chatId);
  });

  socket.on("START_TYPING", ({ chatId }) => {
    // Show typing indicator
  });

  socket.on("STOP_TYPING", ({ chatId }) => {
    // Hide typing indicator
  });

  socket.on("ONLINE_USERS", (onlineUserIds) => {
    // Update online status of users in Redux/UI
    console.log("Online users:", onlineUserIds);
  });

  return () => {
    socket.off("NEW_MESSAGE");
    socket.off("NEW_MESSAGE_ALERT");
    socket.off("START_TYPING");
    socket.off("STOP_TYPING");
    socket.off("ONLINE_USERS");
  };
}, []);
🧠 Optional (but good): Use Custom Hook
ts
Copy
Edit
// hooks/useSocket.js
export const socket = io("http://localhost:5000", { withCredentials: true });

export default function useChatSocket(chats) {
  useEffect(() => {
    if (chats.length) {
      const chatIds = chats.map(c => c._id);
      socket.emit("JOIN_CHATS", chatIds);
    }

    return () => {
      socket.disconnect();
    };
  }, [chats]);
}
✅ Final Flow Recap

Step	Frontend Action
After login	Fetch chats → store in Redux
On socket connect	Emit JOIN_CHATS with those chat IDs
To send message	Emit NEW_MESSAGE
To detect typing	Emit START_TYPING and STOP_TYPING
To listen updates	Use socket.on(...) events for messages, typing, alerts, online users
Wanna see a full working React component that uses all this together (like ChatBox)? I can drop that too.









Done
*/
/*// socketContext.js
import { createContext, useContext, useMemo, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    return io('http://localhost:8000', {
      withCredentials: true,
    });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected ✅", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected ❌");
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);

export { SocketProvider, useSocket };
*/
/*import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/socketContext';
import useChatSocket from '../hooks/useChatSocket';

const ChatBox = ({ selectedChatId, userId }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useChatSocket(); // join rooms when connected

  // Listen to events
  useEffect(() => {
    if (!socket) return;

    socket.on("NEW_MESSAGE", ({ chatId, message }) => {
      if (chatId === selectedChatId) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on("START_TYPING", ({ chatId }) => {
      if (chatId === selectedChatId) {
        setIsTyping(true);
      }
    });

    socket.on("STOP_TYPING", ({ chatId }) => {
      if (chatId === selectedChatId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("NEW_MESSAGE");
      socket.off("START_TYPING");
      socket.off("STOP_TYPING");
    };
  }, [socket, selectedChatId]);

  // Send message
  const handleSend = () => {
    if (messageInput.trim() === '') return;
    socket.emit("NEW_MESSAGE", {
      chatId: selectedChatId,
      message: messageInput,
    });
    setMessageInput('');
    socket.emit("STOP_TYPING", { chatId: selectedChatId });
  };

  // Typing indicators
  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("START_TYPING", { chatId: selectedChatId });
    }

    setTimeout(() => {
      setTyping(false);
      socket.emit("STOP_TYPING", { chatId: selectedChatId });
    }, 1500);
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg.sender.name}: {msg.content}</div>
        ))}
        {isTyping && <p className="typing">Someone is typing...</p>}
      </div>

      <input
        value={messageInput}
        onChange={handleTyping}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatBox;

*/

