import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(true);
  const [chatId] = useState('room1');
  const [isTyping, setIsTyping] = useState(false);
  
  const wsRef = useRef(null);
  const chatBoxRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const connectWebSocket = (username) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${chatId}/${username}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('Connected to chat');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'typing') {
        setIsTyping(data.isTyping && data.user !== username);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      } else {
        setMessages(prev => [...prev, {
          user: data.user,
          message: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from chat');
    };

    wsRef.current = ws;
  };

  const handleJoinChat = (e) => {
    e.preventDefault();
    if (user.trim()) {
      setShowNamePrompt(false);
      connectWebSocket(user.trim());
    }
  };

  const sendMessage = () => {
    if (message.trim() && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (showNamePrompt) {
    return (
      <div className="name-prompt-overlay">
        <div className="name-prompt-card">
          <div className="name-prompt-header">
            <div className="whatsapp-logo">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <h2>Welcome to Chat</h2>
            <p>Enter your name to join the conversation</p>
          </div>
          <form onSubmit={handleJoinChat}>
            <input
              type="text"
              placeholder="Your name"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoFocus
              maxLength={20}
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">{user.charAt(0).toUpperCase()}</div>
          <div className="sidebar-icons">
            <button className="icon-btn" title="Status">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 20.664a9.163 9.163 0 0 1-6.521-2.702.977.977 0 0 1 1.381-1.381 7.269 7.269 0 0 0 10.024.244.977.977 0 0 1 1.313 1.445A9.192 9.192 0 0 1 12 20.664zm7.965-6.112a.977.977 0 0 1-.944-1.229 7.26 7.26 0 0 0-4.8-8.804.977.977 0 0 1 .594-1.86 9.212 9.212 0 0 1 6.092 11.169.976.976 0 0 1-.942.724zm-16.025-.39a.977.977 0 0 1-.953-.769 9.21 9.21 0 0 1 6.626-10.86.975.975 0 1 1 .52 1.882l-.015.004a7.259 7.259 0 0 0-5.223 8.558.978.978 0 0 1-.955 1.185z"/>
              </svg>
            </button>
            <button className="icon-btn" title="New chat">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"/>
              </svg>
            </button>
            <button className="icon-btn" title="Menu">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="search-bar">
          <div className="search-input-wrapper">
            <svg viewBox="0 0 24 24" width="24" height="24" className="search-icon">
              <path fill="currentColor" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"/>
            </svg>
            <input type="text" placeholder="Search or start new chat" />
          </div>
        </div>

        <div className="chat-list">
          <div className="chat-item active">
            <div className="chat-avatar">R</div>
            <div className="chat-info">
              <div className="chat-header-row">
                <h3>{chatId}</h3>
                <span className="chat-time">now</span>
              </div>
              <div className="chat-preview">
                <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">R</div>
            <div>
              <h2>{chatId}</h2>
              <p className="online-status">
                {isTyping ? 'typing...' : isConnected ? 'online' : 'offline'}
              </p>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="icon-btn" title="Search">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"/>
              </svg>
            </button>
            <button className="icon-btn" title="More">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="chat-background">
          <div className="chat-messages" ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.user === user ? 'sent' : 'received'}`}>
                {msg.user !== user && <div className="message-sender">{msg.user}</div>}
                <div className="message-content">
                  <span>{msg.message}</span>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-footer">
          <button className="icon-btn" title="Emoji">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"/>
            </svg>
          </button>
          <button className="icon-btn" title="Attach">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"/>
            </svg>
          </button>
          <div className="message-input-wrapper">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button className="send-btn" onClick={sendMessage} disabled={!message.trim()}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;