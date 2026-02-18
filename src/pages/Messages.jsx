// frontend/src/pages/Messages.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, getConversation, sendMessage } from '../store/slices/messageSlice';
import './Messages.css';

function Messages() {
  const dispatch = useDispatch();
  const { conversations, messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  const handleSelectConversation = (conversation) => {
    setSelectedUser(conversation.participant);
    dispatch(getConversation(conversation.participant._id));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    dispatch(sendMessage({
      receiverId: selectedUser._id,
      message: messageText
    })).then(() => {
      setMessageText('');
      dispatch(getConversation(selectedUser._id));
    });
  };

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <h2>Conversations</h2>
        {loading && conversations.length === 0 ? (
          <div className="loading">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="empty-conversations">
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`conversation-item ${selectedUser?._id === conv.participant._id ? 'active' : ''}`}
                onClick={() => handleSelectConversation(conv)}
              >
                <img
                  src={conv.participant.avatar}
                  alt={conv.participant.name}
                  className="conversation-avatar"
                />
                <div className="conversation-info">
                  <h4>{conv.participant.name}</h4>
                  {conv.lastMessage && (
                    <p className="last-message">
                      {conv.lastMessage.message.substring(0, 30)}...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="messages-main">
        {selectedUser ? (
          <>
            <div className="messages-header">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="header-avatar"
              />
              <div>
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>
              </div>
            </div>

            <div className="messages-body">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message ${msg.sender._id === user.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.message}</p>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="messages-input">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                required
              />
              <button type="submit" disabled={!messageText.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <h3>Select a conversation to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;